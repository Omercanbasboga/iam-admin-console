import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import Swal from "sweetalert2";

import api from "../../api/client";
import DashboardLayout from "../../layout/DashboardLayout";
import DataTable from "../../components/DataTable/DataTable";
import CreateClient from "./CreateClient";

function ActionsCell({ clientId, clientName, onDeleted }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDelete = async () => {
    setAnchorEl(null);
    const result = await Swal.fire({
      title: `Delete "${clientName}"?`,
      text: "This cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#d32f2f",
    });
    if (!result.isConfirmed) return;

    try {
      await api.delete(`/v1/clients/${clientId}`);
      onDeleted();
    } catch {
      Swal.fire("Error", "Could not delete the client.", "error");
    }
  };

  return (
    <>
      <IconButton size="small" onClick={(e) => setAnchorEl(e.currentTarget)}>
        <MoreVertIcon fontSize="small" />
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
          Delete
        </MenuItem>
      </Menu>
    </>
  );
}

export default function ClientList() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  const fetchClients = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/v1/clients");
      const data = response.data?.content || response.data || [];
      setRows(Array.isArray(data) ? data : []);
    } catch {
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const columns = [
    {
      Header: "Client",
      accessor: "clientName",
      Cell: ({ row }) => (
        <Box>
          <Typography
            variant="body2"
            color="primary"
            sx={{ cursor: "pointer", fontWeight: 600, "&:hover": { textDecoration: "underline" } }}
            onClick={() => navigate(`/clients/${row.original.clientId}`)}
          >
            {row.original.clientName || "Unnamed client"}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.original.clientId}
          </Typography>
        </Box>
      ),
    },
    {
      Header: "Tags",
      accessor: "tags",
      Cell: ({ value }) =>
        Array.isArray(value) && value.length > 0 ? (
          <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
            {value.map((tag) => (
              <Chip key={tag} label={tag} size="small" />
            ))}
          </Box>
        ) : (
          "-"
        ),
    },
    {
      Header: "Status",
      accessor: "enabled",
      Cell: ({ value }) => (
        <Chip label={value ? "Enabled" : "Disabled"} color={value ? "success" : "default"} size="small" />
      ),
    },
    {
      Header: "",
      accessor: "clientId",
      id: "actions",
      disableSortBy: true,
      Cell: ({ row }) => (
        <ActionsCell
          clientId={row.original.clientId}
          clientName={row.original.clientName}
          onDeleted={fetchClients}
        />
      ),
    },
  ];

  return (
    <DashboardLayout title="Clients">
      <Card>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2 }}>
          <Typography variant="h6">OAuth2 Clients</Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateOpen(true)}>
            New client
          </Button>
        </Box>
        <DataTable columns={columns} data={rows} loading={loading} canSearch />
      </Card>
      <CreateClient
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={() => {
          setCreateOpen(false);
          fetchClients();
        }}
      />
    </DashboardLayout>
  );
}
