import { useState, useEffect, useCallback } from "react";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";

import api from "../../api/client";
import DashboardLayout from "../../layout/DashboardLayout";
import DataTable from "../../components/DataTable/DataTable";

export default function UserList() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/v1/users");
      const data = response.data?.content || response.data || [];
      setRows(Array.isArray(data) ? data : []);
    } catch {
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const columns = [
    { Header: "Username", accessor: "username" },
    { Header: "Email", accessor: "email" },
    {
      Header: "Status",
      accessor: "enabled",
      Cell: ({ value }) => (
        <Chip label={value ? "Active" : "Disabled"} color={value ? "success" : "default"} size="small" />
      ),
    },
  ];

  return (
    <DashboardLayout title="Users">
      <Card>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6">Users</Typography>
        </Box>
        <DataTable columns={columns} data={rows} loading={loading} canSearch />
      </Card>
    </DashboardLayout>
  );
}
