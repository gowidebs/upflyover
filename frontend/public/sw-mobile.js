// PWA Service Worker for offline functionality
const CACHE_NAME = 'upflyover-v2';
const STATIC_CACHE = 'upflyover-static-v2';
const DYNAMIC_CACHE = 'upflyover-dynamic-v2';

const staticAssets = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/logo192.png',
  '/logo512.png',
  '/offline.html'
];

const apiEndpoints = [
  '/api/companies',
  '/api/requirements',
  '/api/auth/profile',
  '/api/notifications'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Caching static assets');
        return cache.addAll(staticAssets);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => 
              cacheName !== STATIC_CACHE && 
              cacheName !== DYNAMIC_CACHE
            )
            .map((cacheName) => caches.delete(cacheName))
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      caches.open(DYNAMIC_CACHE)
        .then((cache) => {
          return fetch(request)
            .then((response) => {
              // Cache successful API responses
              if (response.status === 200) {
                cache.put(request, response.clone());
              }
              return response;
            })
            .catch(() => {
              // Return cached version if network fails
              return cache.match(request)
                .then((cachedResponse) => {
                  if (cachedResponse) {
                    return cachedResponse;
                  }
                  // Return offline data for critical endpoints
                  if (apiEndpoints.some(endpoint => url.pathname.includes(endpoint))) {
                    return new Response(
                      JSON.stringify({ 
                        offline: true, 
                        message: 'Data cached offline',
                        data: [] 
                      }),
                      { 
                        headers: { 'Content-Type': 'application/json' },
                        status: 200
                      }
                    );
                  }
                  throw new Error('No cached data available');
                });
            });
        })
    );
    return;
  }

  // Handle static assets and pages
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Cache dynamic content
            const responseToCache = response.clone();
            caches.open(DYNAMIC_CACHE)
              .then((cache) => {
                cache.put(request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // Return offline page for navigation requests
            if (request.destination === 'document') {
              return caches.match('/offline.html');
            }
            
            // Return placeholder for images
            if (request.destination === 'image') {
              return new Response(
                '<svg width="200" height="150" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f0f0f0"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#999">Image Offline</text></svg>',
                { headers: { 'Content-Type': 'image/svg+xml' } }
              );
            }
          });
      })
  );
});

// Push notification handling
self.addEventListener('push', (event) => {
  let data = {};
  
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: 'Upflyover', body: event.data.text() };
    }
  }

  const options = {
    body: data.body || 'New notification from Upflyover',
    icon: '/logo192.png',
    badge: '/logo192.png',
    vibrate: [100, 50, 100],
    data: data.data || {},
    actions: [
      {
        action: 'view',
        title: 'View',
        icon: '/logo192.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ],
    requireInteraction: data.priority === 'high',
    silent: data.priority === 'low'
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Upflyover', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'view' || !event.action) {
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then((clientList) => {
          // Focus existing window if available
          for (const client of clientList) {
            if (client.url.includes(self.location.origin) && 'focus' in client) {
              return client.focus();
            }
          }
          
          // Open new window
          if (clients.openWindow) {
            const targetUrl = event.notification.data?.url || '/dashboard';
            return clients.openWindow(targetUrl);
          }
        })
    );
  }
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Sync offline actions when connection is restored
      syncOfflineActions()
    );
  }
});

// Sync offline actions
async function syncOfflineActions() {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    const requests = await cache.keys();
    
    // Process any pending offline actions
    for (const request of requests) {
      if (request.url.includes('/api/') && request.method === 'POST') {
        try {
          await fetch(request);
          await cache.delete(request);
        } catch (error) {
          console.log('Sync failed for:', request.url);
        }
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Handle app updates
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Periodic background sync for data updates
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'content-sync') {
    event.waitUntil(
      updateCachedContent()
    );
  }
});

// Update cached content in background
async function updateCachedContent() {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    
    // Update critical data
    const criticalEndpoints = [
      '/api/notifications/unread-count',
      '/api/auth/profile'
    ];
    
    for (const endpoint of criticalEndpoints) {
      try {
        const response = await fetch(endpoint);
        if (response.ok) {
          await cache.put(endpoint, response);
        }
      } catch (error) {
        console.log('Failed to update:', endpoint);
      }
    }
  } catch (error) {
    console.error('Content sync failed:', error);
  }
}