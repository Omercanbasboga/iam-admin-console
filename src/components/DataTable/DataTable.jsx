import { useMemo } from "react";
import PropTypes from "prop-types";
import { useTable, usePagination, useGlobalFilter, useSortBy } from "react-table";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

/**
 * A thin react-table + MUI wrapper. Supports both client-side paging (the default —
 * pass all rows, react-table slices them) and server-side paging (pass `onPageChange`
 * plus `totalRows`, and this component stops doing its own slicing/sorting and just
 * reports what the user asked for).
 */
export default function DataTable({
  columns,
  data,
  loading = false,
  canSearch = false,
  onSearch,
  searchQuery = "",
  // server-side pagination (all optional — omit to get normal client-side paging)
  totalRows,
  page,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
}) {
  const tableColumns = useMemo(() => columns, [columns]);
  const tableData = useMemo(() => data, [data]);
  const isServerSide = Boolean(onPageChange);

  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows, setGlobalFilter } =
    useTable(
      {
        columns: tableColumns,
        data: tableData,
        manualPagination: isServerSide,
        manualGlobalFilter: isServerSide,
      },
      useGlobalFilter,
      useSortBy,
      usePagination
    );

  return (
    <Box>
      {canSearch && (
        <Box sx={{ p: 2 }}>
          <TextField
            size="small"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => (onSearch ? onSearch(e.target.value) : setGlobalFilter(e.target.value))}
          />
        </Box>
      )}
      <TableContainer>
        <Table {...getTableProps()}>
          <TableHead>
            {headerGroups.map((headerGroup) => (
              <TableRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <TableCell
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    sx={{ fontWeight: 700, cursor: column.canSort ? "pointer" : "default" }}
                  >
                    {column.render("Header")}
                    {column.isSorted ? (column.isSortedDesc ? " ▼" : " ▲") : ""}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody {...getTableBodyProps()}>
            {loading ? (
              <TableRow>
                <TableCell colSpan={tableColumns.length} align="center" sx={{ py: 4 }}>
                  <CircularProgress size={24} />
                </TableCell>
              </TableRow>
            ) : (
              (isServerSide ? rows : rows).map((row) => {
                prepareRow(row);
                return (
                  <TableRow {...row.getRowProps()} hover>
                    {row.cells.map((cell) => (
                      <TableCell {...cell.getCellProps()}>{cell.render("Cell")}</TableCell>
                    ))}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {isServerSide && (
        <TablePagination
          component="div"
          count={totalRows || 0}
          page={page || 0}
          onPageChange={(_, newPage) => onPageChange(newPage)}
          rowsPerPage={pageSize}
          onRowsPerPageChange={(e) => onPageSizeChange && onPageSizeChange(Number(e.target.value))}
        />
      )}
    </Box>
  );
}

DataTable.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  canSearch: PropTypes.bool,
  onSearch: PropTypes.func,
  searchQuery: PropTypes.string,
  totalRows: PropTypes.number,
  page: PropTypes.number,
  pageSize: PropTypes.number,
  onPageChange: PropTypes.func,
  onPageSizeChange: PropTypes.func,
};
