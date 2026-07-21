import * as React from "react";
import PropTypes from "prop-types";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableSortLabel from "@mui/material/TableSortLabel";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import { visuallyHidden } from "@mui/utils";

function descendingComparator(a, b, orderBy) {
  const aValue = a?.[orderBy] ?? "";
  const bValue = b?.[orderBy] ?? "";

  if (bValue < aValue) return -1;
  if (bValue > aValue) return 1;
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function EnhancedTableHead({ order, orderBy, onRequestSort, headCells }) {
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 2,
            width: 72,
            bgcolor: "#f8fafc",
            borderBottom: "1px solid #e5e7eb",
            color: "#64748b",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 0.4,
            textTransform: "uppercase",
          }}
        >
          No
        </TableCell>

        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : headCell.align || "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{
              position: "sticky",
              top: 0,
              zIndex: 2,
              width: headCell.width,
              bgcolor: "#f8fafc",
              borderBottom: "1px solid #e5e7eb",
              color: "#64748b",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 0.4,
              textTransform: "uppercase",
              whiteSpace: "nowrap",
            }}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
              sx={{
                color: "#64748b !important",
                fontWeight: 700,
                "& .MuiTableSortLabel-icon": {
                  color: "#2563eb !important",
                },
              }}
            >
              {headCell.label}

              {orderBy === headCell.id && (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              )}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  headCells: PropTypes.array.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
};

function LoadingState() {
  return (
    <Box
      sx={{
        minHeight: 220,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
      }}
    >
      <CircularProgress size={28} />
      <Typography sx={{ color: "#6b7280", fontSize: 14 }}>
        Loading data...
      </Typography>
    </Box>
  );
}

function EmptyState({ colSpan }) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} align="center" sx={{ py: 8 }}>
        <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#374151" }}>
          Data belum tersedia
        </Typography>
        <Typography sx={{ mt: 0.5, fontSize: 13, color: "#6b7280" }}>
          Tidak ada data yang bisa ditampilkan saat ini.
        </Typography>
      </TableCell>
    </TableRow>
  );
}

EmptyState.propTypes = {
  colSpan: PropTypes.number.isRequired,
};

export default function EnhancedTable({ data = [], headCells = [], loading }) {
  const rows = Array.isArray(data) ? data : [];

  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  // 💡 AUTO-RESET HALAMAN KE 0 SAAT DATA ATAU PANJANG DATA BERUBAH (FILTER/SEARCH)
  React.useEffect(() => {
    setPage(0);
  }, [data?.length, data]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";

    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const visibleRows = React.useMemo(() => {
    const orderedRows = orderBy
      ? [...rows].sort(getComparator(order, orderBy))
      : rows;

    return orderedRows.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [order, orderBy, page, rows, rowsPerPage]);

  return (
    <Box sx={{ width: "100%" }}>
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          overflow: "visible",
          borderRadius: "20px",
          border: "1px solid #e5e7eb",
          boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <TableContainer
          sx={{
            maxHeight: 620,
            overflow: "auto",
            borderRadius: "20px 20px 0 0",
          }}
        >
          {loading ? (
            <LoadingState />
          ) : (
            <Table stickyHeader sx={{ minWidth: 750 }} aria-label="data table">
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                headCells={headCells}
              />

              <TableBody>
                {!visibleRows.length ? (
                  <EmptyState colSpan={headCells.length + 1} />
                ) : (
                  visibleRows.map((row, index) => (
                    <TableRow
                      key={row.id || index}
                      hover
                      sx={{
                        bgcolor: index % 2 === 0 ? "#ffffff" : "#f9fafb",
                        transition: "background-color 160ms ease",
                        "&:hover": {
                          bgcolor: "#eff6ff !important",
                        },
                      }}
                    >
                      <TableCell
                        sx={{
                          width: 72,
                          color: "#6b7280",
                          fontSize: 14,
                          fontWeight: 600,
                          borderBottom: "1px solid #eef2f7",
                        }}
                      >
                        {index + 1 + page * rowsPerPage}
                      </TableCell>

                      {headCells.map((headCell) => {
                        const cellValue = row?.[headCell.id];
                        return (
                          <TableCell
                            key={headCell.id}
                            align={headCell.align || "left"}
                            sx={{
                              width: headCell.width,
                              color: "#374151",
                              fontSize: 14,
                              borderBottom: "1px solid #eef2f7",
                              whiteSpace: headCell.noWrap ? "nowrap" : "normal",
                            }}
                          >
                            {/* 💡 Perbaikan Pengecekan Nilai Cell agar JSX (Action Button) / angka 0 tidak hilang */}
                            {cellValue !== undefined && cellValue !== null && cellValue !== ""
                              ? cellValue
                              : "-"}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            borderTop: "1px solid #e5e7eb",
            bgcolor: "#ffffff",
            color: "#4b5563",
            ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows":
              {
                fontSize: 13,
              },
          }}
        />
      </Paper>
    </Box>
  );
}

EnhancedTable.propTypes = {
  data: PropTypes.array,
  headCells: PropTypes.array.isRequired,
  loading: PropTypes.bool,
};