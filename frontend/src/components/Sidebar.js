import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Home,
  Whatshot,
  Subscriptions,
  VideoLibrary,
  History,
  OndemandVideo,
  WatchLater,
  ThumbUp,
  Settings,
  Help,
  Feedback,
} from '@mui/icons-material';

const drawerWidth = 240;

const mainListItems = [
  { text: 'Home', icon: <Home />, path: '/' },
  { text: 'Trending', icon: <Whatshot />, path: '/trending' },
  { text: 'Subscriptions', icon: <Subscriptions />, path: '/subscriptions' },
];

const libraryListItems = [
  { text: 'Library', icon: <VideoLibrary />, path: '/library' },
  { text: 'History', icon: <History />, path: '/history' },
  { text: 'Your Videos', icon: <OndemandVideo />, path: '/your-videos' },
  { text: 'Watch Later', icon: <WatchLater />, path: '/playlist/watch-later' },
  { text: 'Liked Videos', icon: <ThumbUp />, path: '/playlist/liked' },
];

const helpListItems = [
  { text: 'Settings', icon: <Settings />, path: '/settings' },
  { text: 'Help', icon: <Help />, path: '/help' },
  { text: 'Send Feedback', icon: <Feedback />, path: '/feedback' },
];

function Sidebar({ open }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const isSelected = (path) => location.pathname === path;

  const renderListItems = (items) => (
    <List>
      {items.map((item) => (
        <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
          <ListItemButton
            selected={isSelected(item.path)}
            onClick={() => handleNavigation(item.path)}
            sx={{
              minHeight: 48,
              justifyContent: open ? 'initial' : 'center',
              px: 2.5,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : 'auto',
                justifyContent: 'center',
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text} 
              sx={{ opacity: open ? 1 : 0 }}
            />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? drawerWidth : 72,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? drawerWidth : 72,
          boxSizing: 'border-box',
          transition: 'width 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
          overflowX: 'hidden',
        },
      }}
    >
      <div style={{ marginTop: 64 }}>
        {renderListItems(mainListItems)}
        <Divider />
        {renderListItems(libraryListItems)}
        <Divider />
        {renderListItems(helpListItems)}
      </div>
    </Drawer>
  );
}

export default Sidebar;
