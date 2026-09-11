import { useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Swal from "sweetalert2";

import api from "../../../api/client";
import DynamicInputList from "../../../components/DynamicInputList/DynamicInputList";

export default function GeneralInfoTab({ clientData, refresh }) {
  const [showSecret, setShowSecret] = useState(false);
  const [redirectUris, setRedirectUris] = useState(clientData.redirectUris || []);
  const [saving, setSaving] = useState(false);

  const copySecret = () => {
    navigator.clipboard.writeText(clientData.clientSecret || "");
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put(`/v1/clients/${clientData.clientId}`, { redirectUris });
      refresh();
      Swal.fire({ icon: "success", title: "Saved", timer: 1200, showConfirmButton: false });
    } catch {
      Swal.fire("Error", "Could not save changes.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField label="Client ID" value={clientData.clientId || ""} fullWidth disabled />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Client secret"
              value={clientData.clientSecret || ""}
              fullWidth
              disabled
              type={showSecret ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowSecret((v) => !v)} edge="end">
                      {showSecret ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                    <IconButton onClick={copySecret} edge="end">
                      <ContentCopyIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle2" gutterBottom>
              Redirect URIs
            </Typography>
            <DynamicInputList values={redirectUris} onChange={setRedirectUris} />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" onClick={handleSave} disabled={saving}>
              Save
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
