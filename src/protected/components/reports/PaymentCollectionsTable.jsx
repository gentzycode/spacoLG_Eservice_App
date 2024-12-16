import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { formatDate } from "../../../apis/functions";

const PaymentCollectionsTable = ({ data, loading, error }) => {
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(0);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [filteredData, setFilteredData] = useState(data);

    useEffect(() => {
        if (startDate || endDate) {
            const filtered = data.filter((item) => {
                const itemDate = new Date(item.paid_at);
                const start = startDate ? new Date(startDate) : null;
                const end = endDate ? new Date(endDate) : null;
                return (!start || itemDate >= start) && (!end || itemDate <= end);
            });
            setFilteredData(filtered);
        } else {
            setFilteredData(data);
        }
    }, [startDate, endDate, data]);

    const columns = [
        {
            name: "Reference Number",
            selector: (row) => row.reference_number || "N/A",
            sortable: true,
        },
        {
            name: "Purpose",
            selector: (row) => row.purpose || "N/A",
            sortable: true,
        },
        {
            name: "Description",
            selector: (row) => row.description || "N/A",
            sortable: true,
        },
        {
            name: "Amount",
            selector: (row) => `₦${Number(row.amount || 0).toLocaleString()}`,
            sortable: true,
        },
        {
            name: "Payment Option Used",
            selector: (row) => row.payment_option_used || "N/A",
            sortable: true,
        },
        {
            name: "Paid At",
            selector: (row) => (row.paid_at ? formatDate(row.paid_at) : "N/A"),
            sortable: true,
        },
    ];

    const paginatedData = filteredData.slice(
        currentPage * rowsPerPage,
        currentPage * rowsPerPage + rowsPerPage
    );

    const handleRowsPerPageChange = (e) => {
        setRowsPerPage(Number(e.target.value));
        setCurrentPage(0);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page - 1);
    };

    return (
        <div className="bg-white p-4 rounded shadow mb-6">
            <h3 className="text-lg font-semibold mb-3">Payment Collections</h3>

            {/* Date Filters */}
            <div className="flex space-x-4 mb-4">
                <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-600">
                        Start Date
                    </label>
                    <input
                        type="date"
                        id="startDate"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-600">
                        End Date
                    </label>
                    <input
                        type="date"
                        id="endDate"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                </div>
            </div>

            <DataTable
                columns={columns}
                data={paginatedData}
                pagination
                paginationServer
                paginationTotalRows={filteredData.length}
                paginationDefaultPage={currentPage + 1}
                onChangeRowsPerPage={handleRowsPerPageChange}
                onChangePage={handlePageChange}
                paginationPerPage={rowsPerPage}
                paginationRowsPerPageOptions={[5, 10, 20, 50, 100]}
                customStyles={{
                    header: {
                        style: {
                            fontSize: "16px",
                            fontWeight: "bold",
                            backgroundColor: "#4a5568",
                            color: "#fff",
                        },
                    },
                    rows: {
                        style: {
                            fontSize: "14px",
                            backgroundColor: "#f8f9fa",
                            "&:nth-of-type(odd)": {
                                backgroundColor: "#ecf6ec",
                            },
                            "&:hover": {
                                backgroundColor: "#e2e8f0",
                                cursor: "pointer",
                            },
                            border: "1px solid #e2e8f0",
                        },
                    },
                    headCells: {
                        style: {
                            fontSize: "14px",
                            fontWeight: "bold",
                            backgroundColor: "#4a5568",
                            color: "#fff",
                            border: "1px solid #e2e8f0",
                        },
                    },
                    cells: {
                        style: {
                            padding: "10px",
                            fontSize: "14px",
                            border: "1px solid #e2e8f0",
                        },
                    },
                }}
            />

            {/* Rows per page selection */}
            <div className="flex justify-end mt-4">
                <label htmlFor="rowsPerPage" className="mr-2">
                    Rows per page:
                </label>
                <select
                    id="rowsPerPage"
                    value={rowsPerPage}
                    onChange={handleRowsPerPageChange}
                    className="p-2 border rounded"
                >
                    {[5, 10, 20, 50, 100].map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default PaymentCollectionsTable;
