import React, { useState } from 'react'
import DataTable from 'react-data-table-component'
import { tableCustomStyles } from '../../../../apis/functions'
import FilterComponent from '../../../../common/FilterComponent';

const LgasStaffTable = ({ columns, lgasstaffdata }) => {

    const [filteredData, setFilteredData] = useState(null);

    return (
        <div>
            <div className='overflow-auto w-[100%] mt-0 mb-12 bg-white p-4 rounded-md'>
                <FilterComponent data={lgasstaffdata} setFilteredData={setFilteredData} />
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

export default LgasStaffTable
