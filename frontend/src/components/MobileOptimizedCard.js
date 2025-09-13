import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Chip,
  Avatar,
  useMediaQuery,
  useTheme,
  Skeleton
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  Share,
  MoreVert,
  LocationOn,
  AttachMoney
} from '@mui/icons-material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const MobileOptimizedCard = ({ 
  item, 
  type = 'company', 
  onFavorite, 
  onShare, 
  onClick,
  loading = false 
}) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleFavorite = (e) => {
    e.stopPropagation();
    setIsFavorited(!isFavorited);
    onFavorite?.(item.id, !isFavorited);
  };

  const handleShare = (e) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: item.name || item.title,
        text: item.description,
        url: window.location.href
      });
    } else {
      onShare?.(item);
    }
  };

  if (loading) {
    return (
      <Card sx={{ mb: 2, borderRadius: 2 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <Skeleton variant="circular" width={40} height={40} />
            <Box ml={2} flex={1}>
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" width="40%" />
            </Box>
          </Box>
          <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 1 }} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      sx={{ 
        mb: 2, 
        borderRadius: 2,
        cursor: 'pointer',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:active': {
          transform: isMobile ? 'scale(0.98)' : 'none',
          boxShadow: theme.shadows[8]
        },
        '&:hover': {
          transform: !isMobile ? 'translateY(-2px)' : 'none',
          boxShadow: theme.shadows[4]
        }
      }}
      onClick={() => onClick?.(item)}
    >
      <CardContent sx={{ p: 2 }}>
        {/* Header */}
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Box display="flex" alignItems="center" flex={1} minWidth={0}>
            <Avatar 
              sx={{ 
                width: 40, 
                height: 40, 
                bgcolor: theme.palette.primary.main,
                fontSize: '1rem'
              }}
            >
              {(item.name || item.title || 'U').charAt(0).toUpperCase()}
            </Avatar>
            
            <Box ml={2} flex={1} minWidth={0}>
              <Typography 
                variant="subtitle1" 
                fontWeight="bold" 
                noWrap
                sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}
              >
                {item.name || item.title}
              </Typography>
              <Typography 
                variant="caption" 
                color="text.secondary"
                noWrap
              >
                {type === 'company' ? item.industry : item.category}
              </Typography>
            </Box>
          </Box>
          
          <Box display="flex" alignItems="center">
            <IconButton 
              size="small" 
              onClick={handleFavorite}
              sx={{ 
                color: isFavorited ? 'error.main' : 'text.secondary',
                p: 1
              }}
            >
              {isFavorited ? <Favorite /> : <FavoriteBorder />}
            </IconButton>
            
            <IconButton 
              size="small" 
              onClick={handleShare}
              sx={{ p: 1 }}
            >
              <Share />
            </IconButton>
          </Box>
        </Box>

        {/* Content */}
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.4
          }}
        >
          {item.description}
        </Typography>

        {/* Tags/Chips */}
        <Box display="flex" flexWrap="wrap" gap={0.5} mb={2}>
          {type === 'company' && item.verified && (
            <Chip 
              label="Verified" 
              size="small" 
              color="success" 
              sx={{ fontSize: '0.7rem', height: 20 }}
            />
          )}
          
          {item.location && (
            <Chip 
              icon={<LocationOn sx={{ fontSize: '0.8rem' }} />}
              label={item.location}
              size="small"
              variant="outlined"
              sx={{ fontSize: '0.7rem', height: 20 }}
            />
          )}
          
          {item.budget && (
            <Chip 
              icon={<AttachMoney sx={{ fontSize: '0.8rem' }} />}
              label={item.budget}
              size="small"
              variant="outlined"
              sx={{ fontSize: '0.7rem', height: 20 }}
            />
          )}
        </Box>

        {/* Portfolio/Images Swiper */}
        {item.portfolio && item.portfolio.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Swiper
              modules={[Pagination, Navigation]}
              spaceBetween={10}
              slidesPerView={1.2}
              pagination={{ clickable: true }}
              style={{ 
                borderRadius: '8px',
                '--swiper-pagination-color': theme.palette.primary.main,
                '--swiper-pagination-bullet-size': '6px'
              }}
            >
              {item.portfolio.slice(0, 5).map((image, index) => (
                <SwiperSlide key={index}>
                  <Box
                    sx={{
                      height: 120,
                      borderRadius: 1,
                      bgcolor: 'grey.100',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden'
                    }}
                  >
                    {!imageLoaded && (
                      <Skeleton 
                        variant="rectangular" 
                        width="100%" 
                        height="100%" 
                      />
                    )}
                    <img
                      src={image}
                      alt={`Portfolio ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: imageLoaded ? 'block' : 'none'
                      }}
                      onLoad={() => setImageLoaded(true)}
                      onError={() => setImageLoaded(true)}
                    />
                  </Box>
                </SwiperSlide>
              ))}
            </Swiper>
          </Box>
        )}

        {/* Footer */}
        <Box 
          display="flex" 
          justifyContent="space-between" 
          alignItems="center" 
          mt={2}
          pt={1}
          borderTop={1}
          borderColor="divider"
        >
          <Typography variant="caption" color="text.secondary">
            {type === 'company' ? 
              `${item.employees || 'Unknown'} employees` : 
              `Posted ${new Date(item.createdAt).toLocaleDateString()}`
            }
          </Typography>
          
          {item.rating && (
            <Box display="flex" alignItems="center">
              <Typography variant="caption" color="text.secondary">
                ⭐ {item.rating.toFixed(1)}
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default MobileOptimizedCard;