import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { formatDate } from "../../../apis/functions";

const TokenTransactionsTable = ({ data, loading, error }) => {
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(0);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [filteredData, setFilteredData] = useState(data);

    useEffect(() => {
        if (startDate || endDate) {
            const filtered = data.filter((item) => {
                const itemDate = new Date(item.updated_at);
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
            name: "Token",
            selector: (row) => row.token || "N/A",
            sortable: true,
        },
        {
            name: "Amount Used",
            selector: (row) => `₦${Number(row.amount_used || 0).toLocaleString()}`,
            sortable: true,
        },
        {
            name: "Identifier",
            selector: (row) => row.identifier || "N/A",
            sortable: true,
        },
        {
            name: "Identifier Value",
            selector: (row) => row.identifier_value || "N/A",
            sortable: true,
        },
        {
            name: "E-Service Name",
            selector: (row) => row.eservice_name || "N/A",
            sortable: true,
        },
        {
            name: "E-Service Value",
            selector: (row) => `₦${Number(row.eservice_value || 0).toLocaleString()}`,
            sortable: true,
        },
        {
            name: "E-Service Category",
            selector: (row) => row.eservice_category || "N/A",
            sortable: true,
        },
        {
            name: "Updated At",
            selector: (row) => formatDate(row.updated_at) || "N/A",
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

    const exportToCSV = () => {
        const csvContent = `data:text/csv;charset=utf-8,${filteredData
            .map((item) => [
                item.token,
                item.amount_used,
                item.identifier,
                item.identifier_value,
                item.eservice_name,
                item.eservice_value,
                item.eservice_category,
                formatDate(item.updated_at),
            ].join(","))
            .join("\n")}`;
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "token_transactions.csv");
        document.body.appendChild(link);
        link.click();
    };

    return (
        <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold mb-3">Token Transactions</h3>

            <div className="flex justify-between mb-4">
                <div className="flex space-x-4">
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
                <button
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    onClick={exportToCSV}
                >
                    Export to CSV
                </button>
            </div>

            {loading ? (
                <p className="text-center text-gray-500">Loading...</p>
            ) : error ? (
                <p className="text-center text-red-500">{error}</p>
            ) : (
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
            )}

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

export default TokenTransactionsTable;
