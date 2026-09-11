import { useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

// RP-initiated logout: the gateway clears the local session and, in a real deployment,
// also redirects to the identity provider's own end-session endpoint so the SSO session
// dies too, not just this app's cookie.
export default function SignOut() {
  useEffect(() => {
    window.location.href = "/logout";
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
      }}
    >
      <CircularProgress size={28} />
      <Typography variant="body2" color="text.secondary">
        Signing out...
      </Typography>
    </Box>
  );
}
