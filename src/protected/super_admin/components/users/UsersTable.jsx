import React from 'react'
import DataTable from 'react-data-table-component'
import { tableCustomStyles } from '../../../../apis/functions'

const UsersTable = ({ columns, usersdata }) => {


    return (
        <div>
            <div className='overflow-auto w-[100%] mt-0 mb-12 bg-white p-4 rounded-md'>
                <DataTable 
                    columns={columns} data={usersdata}
                    paginationTotalRows={usersdata.totalCount}
                    className='w-[100%] table table-responsive'
                    striped={true}
                    responsive={true}
                    overflowX
                    pagination
                    customStyles={tableCustomStyles}
                ></DataTable>
            </div>
        </div>
    )
}

export default UsersTable
