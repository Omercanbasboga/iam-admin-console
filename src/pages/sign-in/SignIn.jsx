import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";

// Authentication itself never happens in this app — the BFF gateway (sso-gateway-bff)
// owns the OAuth2 authorization_code flow. This page's only job is to send the browser
// to the gateway's login endpoint; the gateway redirects to the identity provider, then
// back here once a session cookie is set.
export default function SignIn() {
  const handleSignIn = () => {
    window.location.href = "/oauth2/authorization/oidc";
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "grey.100",
      }}
    >
      <Card sx={{ p: 4, width: 360, textAlign: "center" }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          IAM Admin Console
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Sign in through your organization's identity provider.
        </Typography>
        <Button variant="contained" fullWidth onClick={handleSignIn}>
          Sign in
        </Button>
      </Card>
    </Box>
  );
}
