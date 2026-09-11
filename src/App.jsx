import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import SignIn from "./pages/sign-in/SignIn";
import SignOut from "./pages/sign-out/SignOut";
import ClientList from "./features/clients/ClientList";
import ClientDetail from "./features/clients/ClientDetail";
import UserList from "./features/users/UserList";

const theme = createTheme({
  palette: {
    primary: { main: "#1a237e" },
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-out" element={<SignOut />} />
        <Route path="/clients" element={<ClientList />} />
        <Route path="/clients/:clientId" element={<ClientDetail />} />
        <Route path="/users" element={<UserList />} />
        <Route path="*" element={<Navigate to="/clients" replace />} />
      </Routes>
    </ThemeProvider>
  );
}
