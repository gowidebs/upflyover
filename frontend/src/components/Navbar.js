import React, { useState, useMemo } from 'react';
import {
  AppBar, Toolbar, Typography, Button, Box, Avatar,
  Menu, MenuItem, IconButton, Badge, InputBase,
  Drawer, List, ListItem, ListItemIcon, ListItemText,
  Divider, useTheme, useMediaQuery, Tooltip, Stack
} from '@mui/material';
import {
  AccountCircle, Notifications, Search,
  Menu as MenuIcon, Dashboard, Assignment, People,
  Person, ExitToApp, Message, Settings, Help
} from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import UpflyoverLogo from './UpflyoverLogo';
import NotificationCenter from './NotificationCenter';

const SearchBox = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '20ch',
      '&:focus': {
        width: '30ch',
      },
    },
  },
}));

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, logout, isAuthenticated } = useAuth();
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };



  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/');
  };

  const handleDrawerToggle = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  const navigationItems = useMemo(() => [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { text: 'Requirements', icon: <Assignment />, path: '/requirements' },
    { text: 'Companies', icon: <People />, path: '/companies' },
    { text: 'Messages', icon: <Message />, path: '/messages' },
  ], []);



  const drawer = (
    <Box sx={{ width: 250 }} role="presentation">
      <Box sx={{ p: 2, bgcolor: 'rgb(30, 86, 86)', color: 'white' }}>
        <UpflyoverLogo size={24} color="white" showText={true} />
        {isAuthenticated && user && (
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            {user.name || 'User'}
          </Typography>
        )}
      </Box>
      <Divider />
      <List>
        {isAuthenticated ? (
          <>
            {navigationItems.map((item) => (
              <ListItem 
                button 
                key={item.text}
                onClick={() => {
                  navigate(item.path);
                  setMobileDrawerOpen(false);
                }}
                selected={location.pathname === item.path}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
            <ListItem button onClick={() => { navigate('/search'); setMobileDrawerOpen(false); }}>
              <ListItemIcon><Search /></ListItemIcon>
              <ListItemText primary="Search" />
            </ListItem>
            <Divider sx={{ my: 1 }} />
            <ListItem button onClick={() => { navigate('/profile'); setMobileDrawerOpen(false); }}>
              <ListItemIcon><Person /></ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItem>
            <ListItem button onClick={() => { navigate('/settings'); setMobileDrawerOpen(false); }}>
              <ListItemIcon><Settings /></ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItem>
            <ListItem button onClick={handleLogout}>
              <ListItemIcon><ExitToApp /></ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </>
        ) : (
          <>
            <ListItem button onClick={() => { navigate('/explore'); setMobileDrawerOpen(false); }}>
              <ListItemIcon><Search /></ListItemIcon>
              <ListItemText primary="Explore" />
            </ListItem>
            <ListItem button onClick={() => { navigate('/about'); setMobileDrawerOpen(false); }}>
              <ListItemIcon><Person /></ListItemIcon>
              <ListItemText primary="About" />
            </ListItem>
            <ListItem button onClick={() => { navigate('/pricing'); setMobileDrawerOpen(false); }}>
              <ListItemIcon><Person /></ListItemIcon>
              <ListItemText primary="Pricing" />
            </ListItem>
            <ListItem button onClick={() => { navigate('/contact'); setMobileDrawerOpen(false); }}>
              <ListItemIcon><Message /></ListItemIcon>
              <ListItemText primary="Contact" />
            </ListItem>
            <ListItem button onClick={() => { navigate('/companies'); setMobileDrawerOpen(false); }}>
              <ListItemIcon><People /></ListItemIcon>
              <ListItemText primary="Explore Companies" />
            </ListItem>
            <ListItem button onClick={() => { navigate('/search'); setMobileDrawerOpen(false); }}>
              <ListItemIcon><Search /></ListItemIcon>
              <ListItemText primary="Search" />
            </ListItem>
            <ListItem button onClick={() => { navigate('/login'); setMobileDrawerOpen(false); }}>
              <ListItemIcon><Person /></ListItemIcon>
              <ListItemText primary="Login" />
            </ListItem>
            <ListItem button onClick={() => { navigate('/signup'); setMobileDrawerOpen(false); }}>
              <ListItemIcon><Person /></ListItemIcon>
              <ListItemText primary="Sign Up" />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static" elevation={2}>
        <Toolbar>
          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Logo */}
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              flexGrow: isMobile ? 1 : 0,
              cursor: 'pointer',
              mr: isMobile ? 0 : 4
            }}
            onClick={() => navigate('/')}
          >
            <UpflyoverLogo size={32} color="white" showText={true} />
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, justifyContent: 'center' }}>
              {isAuthenticated ? (
                navigationItems.map((item) => (
                  <Button 
                    key={item.text}
                    color="inherit" 
                    onClick={() => navigate(item.path)}
                    sx={{
                      borderBottom: location.pathname === item.path ? '2px solid white' : 'none',
                      borderRadius: 0,
                      pb: 1,
                      mx: 1
                    }}
                  >
                    {item.text}
                  </Button>
                ))
              ) : (
                ['About', 'Pricing', 'Explore'].map((item) => (
                  <Button 
                    key={item}
                    color="inherit" 
                    onClick={() => navigate(`/${item.toLowerCase()}`)}
                    sx={{
                      borderBottom: location.pathname === `/${item.toLowerCase()}` ? '2px solid white' : 'none',
                      borderRadius: 0,
                      pb: 1,
                      mx: 1
                    }}
                  >
                    {item}
                  </Button>
                ))
              )}
            </Box>
          )}

          {/* Search Bar */}
          {!isMobile && isAuthenticated && (
            <Box
              component="form"
              onSubmit={(e) => {
                e.preventDefault();
                if (searchValue.trim()) {
                  navigate(`/search?q=${encodeURIComponent(searchValue.trim())}`);
                }
              }}
            >
              <SearchBox>
                <SearchIconWrapper>
                  <Search />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search companies, requirements..."
                  inputProps={{ 'aria-label': 'search' }}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </SearchBox>
            </Box>
          )}

          {/* Right Side Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto' }}>
            {!isMobile && !isAuthenticated && (
              <Stack direction="row" spacing={1}>
                <Button color="inherit" onClick={() => navigate('/login')}>
                  Login
                </Button>
                <Button
                  variant="outlined"
                  sx={{ 
                    color: 'white', 
                    borderColor: 'white',
                    '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' }
                  }}
                  onClick={() => navigate('/signup')}
                >
                  Sign Up
                </Button>
              </Stack>
            )}

            {isAuthenticated && (
              <>
                {/* Mobile Search Button */}
                {isMobile && (
                  <IconButton
                    color="inherit"
                    onClick={() => navigate('/search')}
                    sx={{ mr: 1 }}
                  >
                    <Search />
                  </IconButton>
                )}
                
                {/* Notifications */}
                <NotificationCenter />

                {/* Profile Menu */}
                <Tooltip title="Account">
                  <IconButton
                    size="large"
                    onClick={handleMenu}
                    color="inherit"
                  >
                    <Avatar 
                      sx={{ 
                        width: 32, 
                        height: 32, 
                        bgcolor: 'secondary.main',
                        fontSize: '0.9rem'
                      }}
                    >
                      {user?.name?.charAt(0) || 'U'}
                    </Avatar>
                  </IconButton>
                </Tooltip>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileDrawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
      >
        {drawer}
      </Drawer>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => { navigate('/profile'); handleClose(); }}>
          <Person sx={{ mr: 1 }} /> Profile
        </MenuItem>
        <MenuItem onClick={() => { navigate('/settings'); handleClose(); }}>
          <Settings sx={{ mr: 1 }} /> Settings
        </MenuItem>
        <MenuItem onClick={() => { navigate('/help'); handleClose(); }}>
          <Help sx={{ mr: 1 }} /> Help
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ExitToApp sx={{ mr: 1 }} /> Logout
        </MenuItem>
      </Menu>


    </>
  );
};

export default Navbar;