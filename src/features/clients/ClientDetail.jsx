import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

import api from "../../api/client";
import DashboardLayout from "../../layout/DashboardLayout";
import GeneralInfoTab from "./tabs/GeneralInfoTab";
import AssignmentTab from "./tabs/AssignmentTab";

const TABS = ["General", "Scopes", "Roles"];

export default function ClientDetail() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [clientData, setClientData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchClient = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(`/v1/clients/${clientId}`);
      setClientData(response.data);
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    fetchClient();
  }, [fetchClient]);

  if (loading || !clientData) {
    return (
      <DashboardLayout title="Client">
        <Box sx={{ p: 4, textAlign: "center" }}>
          <CircularProgress size={28} />
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={clientData.clientName}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="h5" fontWeight="bold">
            {clientData.clientName}
          </Typography>
          <Chip
            label={clientData.enabled ? "Enabled" : "Disabled"}
            color={clientData.enabled ? "success" : "default"}
            size="small"
          />
        </Box>
        <Button variant="outlined" onClick={() => navigate("/clients")}>
          Back to list
        </Button>
      </Box>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
        {TABS.map((label) => (
          <Tab key={label} label={label} />
        ))}
      </Tabs>

      {tab === 0 && <GeneralInfoTab clientData={clientData} refresh={fetchClient} />}
      {tab === 1 && <AssignmentTab clientId={clientId} kind="scopes" />}
      {tab === 2 && <AssignmentTab clientId={clientId} kind="roles" />}
    </DashboardLayout>
  );
}
