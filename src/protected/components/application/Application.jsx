import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../../context/AuthContext'
import { userApplications } from '../../../apis/authActions';
import InitLoader from '../../../common/InitLoader';
import ApplicationsTable from './ApplicationsTable';
import { formatDate } from '../../../apis/functions';
import { AiOutlineSearch } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

const Application = () => {
    
    const { token, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const [applications, setApplications] = useState(null);
    const [error, setError] = useState(null);
    const [fetching, setFetching] = useState(false);

    const columns = [
        {
          name: "E-service",
          selector: (row) => row?.eservice?.name,
          sortable: true,
          cell: (row) => (
            <div className="hover:break-normal">{row?.eservice?.name}</div>
          )
        },,
        {
          name: "Status",
          selector: (row) => row?.eservice?.step?.step_name,
          sortable: true,
          cell: (row) => (
            <div className="hover:break-normal">{row?.eservice?.step?.step_name}</div>
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
                onClick={(e) => getApplicationDetail(row?.id, row?.eservice?.step?.flag)}
            >
                <AiOutlineSearch size={20} />
            </button>
          ),
        },
      ];

    const getApplicationDetail = (appid, currentStep) => {
        navigate(
            '/application-detail',
            {
                state : { appid, currentStep }
            }
        )
    }

    if(error !== null && error?.message === 'Token has expired'){
        //alert(error?.message);
        logout();
    }

    useEffect(() => {
        userApplications(token, setApplications, setError, setFetching);
    }, [])

    return (
        <div className='w-full'>
            <h1 className='mt-4 text-xl md:text-3xl font-extralight'>
                Your Applications
            </h1>
            <div className='w-full my-12'>
                { fetching && <InitLoader />}
                { applications !== null && (
                    applications === undefined ? logout() : (
                        applications.length > 0 ? 
                        <ApplicationsTable columns={columns} appdata={applications} /> :
                        <div className='text-red-600'>You have not applied for any service yet</div>
                    )
                )}
            </div>
        </div>
    )
}

export default Application
