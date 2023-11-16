import React, { useContext, useEffect, useState } from 'react'
import { RiWalletLine } from 'react-icons/ri'
import InitLoader from '../../common/InitLoader'
import { AuthContext } from '../../context/AuthContext'
import { AiOutlineSearch } from 'react-icons/ai'
import { getUserPayments } from '../../apis/authActions'
import PaymentsTable from '../components/payments/PaymentsTable'
import { formatDate } from '../../apis/functions'

const Payments = () => {

    const { token, logout } = useContext(AuthContext);

    const [payments, setPayments] = useState(null)
    const [error, setError] = useState(null);
    const [fetching, setFetching] = useState(false);
    const [showmodal, setShowmodal] = useState(false);

    const columns = [
        {
          name: "Ref. No",
          selector: (row) => row?.ref_no,
          filterable: true,
          sortable: true,
          cell: (row) => (
            <div className="hover:break-normal">{row?.ref_no}</div>
          )
        },
        {
          name: "E-Service",
          selector: (row) => row?.purpose_id,
          sortable: true,
          cell: (row) => (
            <div className="hover:break-normal">{row?.purpose_id}</div>
          )
        },
        {
          name: "Payment for",
          selector: (row) => row?.eservices_step_id,
          sortable: true,
          cell: (row) => (
            <div className="hover:break-normal">{row?.eservices_step_id}</div>
          )
        },
        {
          name: "Amount",
          selector: (row) => row?.amount,
          sortable: true,
          cell: (row) => (
            <div className="hover:break-normal"><span>&#8358;</span> {row?.amount}</div>
          )
        },
        {
            name: "Gateway",
            selector: (row) => row?.payment_gateway?.gateway_name,
            sortable: true,
            cell: (row) => (
              <div className="hover:break-normal">{row?.payment_gateway?.gateway_name}</div>
            )
        },
        {
            name: "Status",
            selector: (row) => row?.status,
            sortable: true,
            cell: (row) => (
              <div 
                className={`
                    ${row?.status === 'Completed' && 'text-green-600'}
                    ${(row?.status === 'Failed' || row?.status === 'Rejected') && 'text-red-600'}
                    ${row?.status === 'Initialized' && 'text-orange-500'}
                `}
                
              >
                {row?.status}
              </div>
            )
        },
        {
            name: "Date",
            selector: (row) => row?.updated_at,
            sortable: true,
            cell: (row) => (
              <div className="hover:break-normal">{formatDate(row?.updated_at)}</div>
            )
        },
        //{
          /**name: "Action",
          button: true,
          cell: (row) => (
            <button 
                className="p-2 border-none font-medium"
            >
                <AiOutlineSearch size={20} className='text-gray-700' />
            </button>
            
          ),*/
        //},
      ];

    if(error !== null && error?.message === 'Token has expired'){
        //alert(error?.message);
        logout();
    }

    useEffect(() => {
        getUserPayments(token, setPayments, setError, setFetching)
    }, [])

    return (
        <div className='w-full'>
            <div className='w-full flex justify-end my-2'>
            </div>

            <h1 className='mt-4 flex space-x-2 items-center text-xl md:text-3xl font-extralight'>
                <RiWalletLine size={30} className='text-gray-600' />
                <span className='text-gray-600'>Payment History</span>
            </h1>

            <div className='w-full my-12'>
                { fetching ? <InitLoader /> 
                    : 
                    payments !== null && (
                        payments === undefined ? logout() : (
                            payments.length > 0 ? 
                                <PaymentsTable columns={columns} paymentsdata={payments} /> :
                                <div className='text-red-600'>No record found!</div>
                            
                        )
                )}
            </div>
        </div>
    )
}

export default Payments
