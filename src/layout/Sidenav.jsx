import { useNavigate, useLocation } from "react-router-dom";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import PeopleIcon from "@mui/icons-material/People";
import AppsIcon from "@mui/icons-material/Apps";
import SecurityIcon from "@mui/icons-material/Security";
import AdjustIcon from "@mui/icons-material/Adjust";
import GroupsIcon from "@mui/icons-material/Groups";
import HistoryIcon from "@mui/icons-material/History";

const DRAWER_WIDTH = 260;

const NAV_ITEMS = [
  { label: "Clients", icon: <AppsIcon />, route: "/clients" },
  { label: "Users", icon: <PeopleIcon />, route: "/users" },
  { label: "Roles", icon: <SecurityIcon />, route: "/roles" },
  { label: "Scopes", icon: <AdjustIcon />, route: "/scopes" },
  { label: "Groups", icon: <GroupsIcon />, route: "/groups" },
  { label: "Sessions", icon: <HistoryIcon />, route: "/sessions" },
];

export default function Sidenav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        "& .MuiDrawer-paper": { width: DRAWER_WIDTH, boxSizing: "border-box" },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" fontWeight="bold">
          IAM Console
        </Typography>
      </Box>
      <Divider />
      <List>
        {NAV_ITEMS.map((item) => (
          <ListItemButton
            key={item.route}
            selected={pathname.startsWith(item.route)}
            onClick={() => navigate(item.route)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
}
