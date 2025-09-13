import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Badge,
  useMediaQuery,
  useTheme,
  SwipeableDrawer,
  Fab
} from '@mui/material';
import {
  Menu,
  Home,
  Business,
  Assignment,
  Message,
  Person,
  Notifications,
  Add,
  Search
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const MobileNavigation = ({ user, unreadCount = 0 }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showFab, setShowFab] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: 'Dashboard', icon: <Home />, path: '/dashboard' },
    { text: 'Companies', icon: <Business />, path: '/companies' },
    { text: 'Requirements', icon: <Assignment />, path: '/requirements' },
    { text: 'Messages', icon: <Message />, path: '/messages', badge: unreadCount },
    { text: 'Profile', icon: <Person />, path: '/profile' }
  ];

  // Hide FAB when scrolling down
  useEffect(() => {
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setShowFab(currentScrollY < lastScrollY || currentScrollY < 100);
      lastScrollY = currentScrollY;
    };

    if (isMobile) {
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [isMobile]);

  const handleNavigation = (path) => {
    navigate(path);
    setDrawerOpen(false);
  };

  if (!isMobile) return null;

  return (
    <>
      {/* Mobile App Bar */}
      <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => setDrawerOpen(true)}
            sx={{ mr: 2 }}
          >
            <Menu />
          </IconButton>
          
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Upflyover
          </Typography>
          
          <IconButton color="inherit" onClick={() => navigate('/notifications')}>
            <Badge badgeContent={unreadCount} color="error">
              <Notifications />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Navigation Drawer */}
      <SwipeableDrawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onOpen={() => setDrawerOpen(true)}
        disableBackdropTransition
        disableDiscovery
        sx={{
          '& .MuiDrawer-paper': {
            width: 280,
            pt: 8
          }
        }}
      >
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="subtitle1" fontWeight="bold">
            {user?.name || user?.fullName || 'User'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {user?.userType === 'company' ? 'Company Account' : 'Individual Account'}
          </Typography>
        </Box>
        
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              onClick={() => handleNavigation(item.path)}
              selected={location.pathname === item.path}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: theme.palette.primary.light + '20',
                  '& .MuiListItemIcon-root': {
                    color: theme.palette.primary.main
                  }
                }
              }}
            >
              <ListItemIcon>
                {item.badge ? (
                  <Badge badgeContent={item.badge} color="error">
                    {item.icon}
                  </Badge>
                ) : (
                  item.icon
                )}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </SwipeableDrawer>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          transform: showFab ? 'translateY(0)' : 'translateY(100px)',
          transition: 'transform 0.3s ease-in-out',
          zIndex: theme.zIndex.fab
        }}
        onClick={() => {
          if (user?.userType === 'individual') {
            navigate('/requirements/new');
          } else {
            navigate('/search');
          }
        }}
      >
        {user?.userType === 'individual' ? <Add /> : <Search />}
      </Fab>

      {/* Spacer for fixed AppBar */}
      <Toolbar />
    </>
  );
};

export default MobileNavigation;