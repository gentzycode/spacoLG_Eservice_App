import React, { useState } from 'react'
import DataTable from 'react-data-table-component'
import FilterComponent from './FilterComponent';
import { tableCustomStyles } from '../apis/functions';

const RecordsTable = ({ columns, data }) => {

    const [filteredData, setFilteredData] = useState(null);

    return (
        <div>
            <div className='overflow-auto w-[100%] mt-0 mb-12 bg-white p-4 rounded-md'>
                <FilterComponent data={data} setFilteredData={setFilteredData} />
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

export default RecordsTable
