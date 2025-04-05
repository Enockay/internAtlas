// src/components/Header.tsx
import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Box,
  Badge,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import logo from "../assets/internlogo.jpeg";
import { useGlobalContext } from "../context/Globalcontext";

const Header: React.FC = () => {
  const { toggleSidebar, user } = useGlobalContext();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken");
    window.location.href = "/login";
  };

  return (
    <AppBar
      position="static"
      color="inherit"
      elevation={2}
      sx={{ zIndex: theme.zIndex.drawer + 1 }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Left: Logo and Sidebar toggle */}
        <Box display="flex" alignItems="center">
          {isMobile && (
            <IconButton edge="start" color="inherit" onClick={toggleSidebar}>
              <MenuIcon />
            </IconButton>
          )}
          <Box component="img" src={logo} alt="InternAtlas Logo" sx={{ height: 40, width: 40, ml: isMobile ? 1 : 0 }} />
        </Box>

        {/* Right: Notifications and User */}
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton color="inherit">
            <Badge variant="dot" color="error" overlap="circular">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          {user ? (
            <>
              <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
                <Avatar
                  alt={user.name}
                  src="https://via.placeholder.com/40"
                  sx={{ width: 40, height: 40 }}
                />
              </IconButton>
              <Typography
                variant="subtitle1"
                sx={{ ml: 1, display: { xs: "none", md: "block" }, color: "text.primary" }}
              >
                {user.name}
              </Typography>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <MenuItem onClick={() => (window.location.href = "/profile")}>Profile</MenuItem>
                <MenuItem onClick={() => (window.location.href = "/settings")}>Settings</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Guest
            </Typography>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
