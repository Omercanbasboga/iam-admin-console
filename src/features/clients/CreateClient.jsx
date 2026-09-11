import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Swal from "sweetalert2";

import api from "../../api/client";

export default function CreateClient({ open, onClose, onCreated }) {
  const [clientName, setClientName] = useState("");
  const [saving, setSaving] = useState(false);

  const handleCreate = async () => {
    if (!clientName.trim()) return;
    setSaving(true);
    try {
      await api.post("/v1/clients", { clientName: clientName.trim() });
      setClientName("");
      onCreated();
    } catch {
      Swal.fire("Error", "Could not create the client.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>New OAuth2 client</DialogTitle>
      <DialogContent>
        <Stack sx={{ mt: 1 }}>
          <TextField
            label="Client name"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            autoFocus
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleCreate} disabled={saving}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
