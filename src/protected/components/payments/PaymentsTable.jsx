import React, { useMemo, useState } from 'react'
import DataTable from 'react-data-table-component'
import { tableCustomStyles } from '../../../apis/functions'
import FilterComponent from '../../../common/FilterComponent'

const PaymentsTable = ({ columns, paymentsdata}) => {

    const [filteredData, setFilteredData] = useState(null);

    return (
        <div>
            <div className='overflow-auto w-[100%] mt-0 mb-12 bg-white p-4 rounded-md'>
                <FilterComponent data={paymentsdata} setFilteredData={setFilteredData} />
                {filteredData !== null &&
                <DataTable 
                    columns={columns} data={filteredData}
                    paginationTotalRows={filteredData.totalCount}
                    className='w-[100%] table table-responsive'
                    striped={true}
                    responsive={true}
                    overflowX
                    pagination
                    customStyles={tableCustomStyles}
                ></DataTable>}
            </div>
        </div>
    )
}

export default PaymentsTable
