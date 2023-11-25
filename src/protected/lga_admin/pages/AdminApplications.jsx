import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../../context/AuthContext'
import { lgaApplications } from '../../../apis/adminActions';
import InitLoader from '../../../common/InitLoader';
import ApplicationsTable from '../../components/application/ApplicationsTable';
import { formatDate } from '../../../apis/functions';
import { AiOutlineSearch } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

const AdminApplications = () => {

    const { token, user, logout } = useContext(AuthContext);

    const navigate = useNavigate();
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);
    const [fetching, setFetching] = useState(false);

    //console.log(success);
    const columns = [
        {
          name: "Reference No.",
          selector: (row) => row?.ref_no,
          sortable: true,
          cell: (row) => (
            <div className="hover:break-normal">{row?.ref_no}</div>
          )
        },
        {
          name: "E-service",
          selector: (row) => row?.eservice?.name,
          sortable: true,
          cell: (row) => (
            <div className="hover:break-normal">{row?.eservice?.name}</div>
          )
        },
        {
          name: "Status",
          selector: (row) => row?.current_step?.step?.step_name,
          sortable: true,
          cell: (row) => (
            <div className="hover:break-normal">{row?.current_step?.step?.step_name}</div>
          )
        },
        {
            name: "Request from",
            selector: (row) => row?.user?.email,
            sortable: true,
            cell: (row) => (
              <div className="hover:break-normal">{row?.user?.email}</div>
            )
          },
        {
          name: "Date applied",
          selector: (row) => row?.created_at,
          sortable: true,
          cell: (row) => (
            <div className="hover:break-normal">{formatDate(row?.created_at)}</div>
          )
        },
        {
          name: "Action",
          button: true,
          cell: (row) => (
            <button 
                className="p-2 border-none font-medium"
                onClick={(e) => getApplicationDetail(row?.id)}
            >
                <AiOutlineSearch size={20} />
            </button>
          ),
        },
      ];

    const getApplicationDetail = (appid) => {
        navigate(
            '/admin-applications-detail',
            {
                state : { appid }
            }
        )
    }

    useEffect(() => {
        lgaApplications(token, setSuccess, setError, setFetching);
    }, [])

    return (
        <div className='w-full'>
            <div className='grid md:flex md:justify-between md:items-center my-4 space-y-2 md:space-y-0'>
                <span className='text-2xl'>Applications</span>
                <span className='text-gray-500'>Welcome { user?.username }</span>
            </div>
            <div className='w-full rounded-xl bg-white mt-8 p-4'>
                {error !== null && <div className='text-red-600'>No application found!</div>}
                { fetching && <InitLoader />}
                { success !== null && (
                    success === undefined ? logout() : (
                        success.length > 0 ? 
                        <ApplicationsTable columns={columns} appdata={success} /> :
                        <div className='text-red-600'>No application found!</div>
                    )
                )}
            </div>
        </div>
    )
}

export default AdminApplications
