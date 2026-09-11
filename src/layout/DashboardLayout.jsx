import Box from "@mui/material/Box";
import Sidenav from "./Sidenav";
import Navbar from "./Navbar";

export default function DashboardLayout({ title, children }) {
  return (
    <Box sx={{ display: "flex" }}>
      <Sidenav />
      <Box sx={{ flexGrow: 1, minHeight: "100vh", bgcolor: "grey.50" }}>
        <Navbar title={title} />
        <Box sx={{ p: 3 }}>{children}</Box>
      </Box>
    </Box>
  );
}
