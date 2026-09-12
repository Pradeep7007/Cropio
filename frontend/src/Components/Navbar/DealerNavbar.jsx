import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StorefrontIcon from "@mui/icons-material/Storefront";
import PeopleIcon from "@mui/icons-material/People";
import AgricultureIcon from "@mui/icons-material/Agriculture";
import TimelineIcon from "@mui/icons-material/Timeline";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import InventoryIcon from "@mui/icons-material/Inventory";
import BarChartIcon from "@mui/icons-material/BarChart";
import SettingsIcon from "@mui/icons-material/Settings";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Link } from "react-router-dom";

// Icons map
export const menuIcons = {
  Dashboard: <DashboardIcon />,
  Orders: <ShoppingCartIcon />,
  Products: <StorefrontIcon />,
  Customers: <PeopleIcon />,
  "Farmer Connect": <AgricultureIcon />,
  "Price Forecast": <TimelineIcon />,
  "Smart Purchase": <ShoppingBagIcon />,
  "Logistics Integration": <LocalShippingIcon />,
  "Inventory Manager": <InventoryIcon />,
  "Demand Supply Dashboard": <BarChartIcon />,
  Settings: <SettingsIcon />,
};

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open, isMobile }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  backgroundColor: "#ffffff",
  color: "#1a1a1a",
  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  ...(!isMobile && open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DesktopDrawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open
    ? {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
      }
    : {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
      }),
}));

// Menu items
const menuItems = [
  { label: "Dashboard", path: "/" },
  { label: "Customers", path: "/customers" },
  { label: "Farmer Connect", path: "/farmer-connect" },
  { label: "Price Forecast", path: "/price-forecast" },
  { label: "Smart Purchase", path: "/smart-purchase" },
  { label: "Logistics Integration", path: "/logistics-integration" },
  { label: "Inventory Manager", path: "/inventory-management" },
  { label: "Demand Supply Dashboard", path: "/demand-supply-dashboard" },
];

export default function MiniDrawer() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [open, setOpen] = React.useState(false);

  const [userRole, setUserRole] = React.useState(localStorage.getItem("user") || "Farmer");

  const handleDrawerToggle = () => setOpen(!open);
  const handleDrawerClose = () => setOpen(false);

  React.useEffect(() => {
    const syncUser = () => {
      const role = localStorage.getItem("user") || "Farmer";
      setUserRole(role);
    };
    window.addEventListener("userChanged", syncUser);
    return () => window.removeEventListener("userChanged", syncUser);
  }, []);


  const drawerContent = (
    <>
      <DrawerHeader>
        {!isMobile && (
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        )}
        {isMobile && (
          <Box sx={{ p: 2, fontWeight: 'bold', color: '#2e7d32', width: '100%', textAlign: 'left' }}>
            Cropio Dealer
          </Box>
        )}
      </DrawerHeader>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.label} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              component={Link}
              to={item.path}
              onClick={isMobile ? handleDrawerClose : undefined}
              sx={[
                { minHeight: 48, px: 2.5 },
                (!isMobile && open) ? { justifyContent: "initial" } : { justifyContent: "center" },
              ]}
            >
              <ListItemIcon
                sx={[
                  { minWidth: 0, justifyContent: "center" },
                  (!isMobile && open) ? { mr: 3 } : { mr: "auto" },
                ]}
              >
                {menuIcons[item.label] || <InboxIcon />}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                sx={(!isMobile && !open) ? { opacity: 0 } : { opacity: 1 }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box sx={{ textAlign: "center", py: 2 }}>
        <Box
          sx={{
            display: "inline-block",
            bgcolor: "#e8f5e9",
            color: "#2e7d32",
            borderRadius: "16px",
            px: 2,
            py: 0.5,
            fontSize: "0.8rem",
            fontWeight: "bold",
            border: "1px solid #c8e6c9"
          }}
        >
          Dealer Account
        </Box>
      </Box>
    </>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open} isMobile={isMobile}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={[{ marginRight: 5 }, !isMobile && open && { display: "none" }]}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1, fontWeight: 'bold', fontSize: '1.2rem', color: '#2e7d32' }}>
            Cropio <span style={{ fontSize: '0.85rem', color: '#666', fontWeight: 'normal' }}>| Dealer Portal</span>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#333' }}>
              {(() => {
                try {
                  const obj = JSON.parse(localStorage.getItem("userObj"));
                  return obj?.name || "Dealer";
                } catch {
                  return "Dealer";
                }
              })()}
            </span>
            <Box sx={{ width: 32, height: 32, bgcolor: '#c8e6c9', color: '#1b5e20', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.85rem' }}>
              {(() => {
                try {
                  const obj = JSON.parse(localStorage.getItem("userObj"));
                  return obj?.name ? obj.name.charAt(0).toUpperCase() : "D";
                } catch {
                  return "D";
                }
              })()}
            </Box>
            <button
              onClick={() => {
                localStorage.removeItem("loggedIn");
                localStorage.removeItem("token");
                localStorage.removeItem("userObj");
                window.dispatchEvent(new Event("loggedInChanged"));
                window.dispatchEvent(new Event("userChanged"));
              }}
              style={{
                marginLeft: '8px',
                padding: '4px 10px',
                fontSize: '0.75rem',
                color: '#d32f2f',
                border: '1px solid #ffcdd2',
                backgroundColor: '#ffebee',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              Logout
            </button>
          </Box>
        </Toolbar>
      </AppBar>

      {isMobile ? (
        <MuiDrawer
          variant="temporary"
          open={open}
          onClose={handleDrawerClose}
          ModalProps={{ keepMounted: true }}
          sx={{
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
          }}
        >
          {drawerContent}
        </MuiDrawer>
      ) : (
        <DesktopDrawer variant="permanent" open={open}>
          {drawerContent}
        </DesktopDrawer>
      )}

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
      </Box>
    </Box>
  );
}

