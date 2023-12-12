import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../../context/AuthContext'
import { userApplications } from '../../../apis/authActions';
import InitLoader from '../../../common/InitLoader';
import ApplicationsTable from './ApplicationsTable';
import { formatDate, statusColor } from '../../../apis/functions';
import { AiOutlineEdit, AiOutlineSearch } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { FiEdit } from 'react-icons/fi';
import { MdOutlineFileDownload } from 'react-icons/md';

const Application = () => {
    
    const { token, logout, updateServiceObject } = useContext(AuthContext);
    const navigate = useNavigate();

    const [applications, setApplications] = useState(null);
    const [error, setError] = useState(null);
    const [fetching, setFetching] = useState(false);

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
            <div 
              className={statusColor(row?.current_step?.step?.flag)}
            >
              {row?.current_step?.step?.step_name}
            </div>
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
            <div className='flex space-x-2 justify-end'>
                {
                  row?.current_step?.step?.flag === 'D_CERT' ?
                    <div 
                      className='flex items-center px-2 py-1 rounded-full bg-[#87b475] cursor-pointer'
                      onClick={(e) => getApplicationDetail(row?.id, row?.eservice?.step?.flag)}
                    >
                      <MdOutlineFileDownload size={15} />
                    </div>
                    :
                    <button 
                        className="p-2 border-none font-medium text-orange-600 cursor-pointer"
                        onClick={(e) => getApplicationDetail(row?.id, row?.eservice?.step?.flag)}
                    >
                        <FiEdit size={15} />
                    </button>
                }
                
            </div>
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

    useEffect(() => {
        localStorage.getItem('selectedService') && localStorage.removeItem('selectedService');
    }, [])

    return (
        <div className='w-full'>
            <h1 className='mt-4 text-lg md:text-2xl font-extralight'>
                My Applications
            </h1>
            <div className='w-full my-8'>
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
