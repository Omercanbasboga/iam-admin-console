import { useState, useEffect, useCallback } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

import api from "../../../api/client";

/**
 * Shared shape for "assign these scopes/roles to this client" tabs — fetches the full
 * catalog plus the client's current assignment, renders a checkbox list, PUTs the
 * updated set back. Scopes and Roles tabs both reduce to this same pattern.
 */
export default function AssignmentTab({ clientId, kind }) {
  const [catalog, setCatalog] = useState([]);
  const [assigned, setAssigned] = useState(new Set());
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [catalogRes, assignedRes] = await Promise.all([
        api.get(`/v1/${kind}`),
        api.get(`/v1/clients/${clientId}/${kind}`),
      ]);
      setCatalog(catalogRes.data || []);
      setAssigned(new Set((assignedRes.data || []).map((item) => item.id)));
    } finally {
      setLoading(false);
    }
  }, [clientId, kind]);

  useEffect(() => {
    load();
  }, [load]);

  const toggle = async (id, checked) => {
    const next = new Set(assigned);
    checked ? next.add(id) : next.delete(id);
    setAssigned(next);
    await api.put(`/v1/clients/${clientId}/${kind}`, { ids: Array.from(next) });
  };

  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  return (
    <Card>
      <CardContent>
        <Stack>
          {catalog.map((item) => (
            <FormControlLabel
              key={item.id}
              control={
                <Checkbox
                  checked={assigned.has(item.id)}
                  onChange={(e) => toggle(item.id, e.target.checked)}
                />
              }
              label={item.name}
            />
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
