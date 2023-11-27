import React, { useContext, useEffect, useState } from 'react'
import { AiOutlineEdit, AiOutlinePlus } from 'react-icons/ai'
import { FaFileCircleCheck } from 'react-icons/fa6'
import { AuthContext } from '../../../context/AuthContext'
import { getAllAuthorizers, removeAuthorizer } from '../../../apis/adminActions'
import InitLoader from '../../../common/InitLoader'
import RecordsTable from '../../../common/RecordsTable'
import AddModal from '../components/authorizers/AddModal'
import { HiOutlineTrash } from 'react-icons/hi'
import ButtonLoader from '../../../common/ButtonLoader'
import DeleteModal from '../../../common/DeleteModal'

const Authorizers = () => {

    const { token, user, logout, record, refreshRecord } = useContext(AuthContext);

    const [authorizers, setAuthorizers] = useState(null);
    const [error, setError] = useState(null);
    const [fetching, setFetching] = useState(false);
    const [showmodal, setShowmodal] = useState(false);
    const [success, setSuccess] = useState(null);
    const [deleting, setDeleting] = useState(false);


    const columns = [
        {
          name: "LGA",
          selector: (row) => row?.local_government?.name,
          sortable: true,
          cell: (row) => (
            <div className="hover:break-normal">{row?.local_government?.name}</div>
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
          name: "Email",
          selector: (row) => row?.user?.email,
          sortable: true,
          cell: (row) => (
            <div className="hover:break-normal">{row?.user?.email}</div>
          )
        },
        {
            name: "Username",
            selector: (row) => row?.user?.username,
            sortable: true,
            cell: (row) => (
              <div className="hover:break-normal">{row?.user?.username}</div>
            )
          },
        {
          name: "Action",
          button: true,
          cell: (row) => (
            <div className='flex items-center space-x-1'>
              <button 
                  className="p-2 border-none font-medium"
              >
                  <AiOutlineEdit size={20} className='text-blue-700' />
              </button>
              {   (user?.role === 'SuperAdmin' || user?.role === 'LocalAdmin') &&
                    <button 
                    className="p-2 border-none text-red-600"
                    onClick={() => deleteAuthorizer(row?.id)}
                >
                    <HiOutlineTrash size={20} className='text-red-600' />
                </button>}
            </div>            
          ),
        },
      ];

    const deleteAuthorizer = (id) => {

        if(window.confirm('Are you sure you want to remove this authorizer')){
          removeAuthorizer(token, id, setSuccess, setError, setDeleting);
        }
    }


    if(success !== null){
        alert('Authorizer removed successfully!');
        setSuccess(null);
        refreshRecord(Date.now());
    }


    useEffect(() => {
        getAllAuthorizers(token, setAuthorizers, setError, setFetching);
    }, [record])

    return (
        <div className='w-full'>
            <div className='w-full flex justify-end my-2'>
                <button 
                    className='flex justify-center items-center space-x-2 py-3 px-6 rounded-md bg-[#0d544c] hover:bg-green-950 text-white'
                    onClick={() => setShowmodal(true)}
                >
                    <AiOutlinePlus size={20} />
                    <span>Authorizer</span>
                </button>
            </div>

            <h1 className='mt-4 flex space-x-2 items-baseline text-xl md:text-3xl font-extralight'>
                <FaFileCircleCheck size={30} className='text-gray-600' />
                <span>Certificate Authorizers</span>
            </h1>

            <div className='w-full my-12'>
                { error !== null && <span className='text-red-699'>{error?.message}</span>}
                { fetching ? <InitLoader /> 
                    : 
                    authorizers !== null && (
                        authorizers === undefined ? logout() : (
                            authorizers.length > 0 ? 
                                <RecordsTable columns={columns} data={authorizers} /> :
                                <div className='text-red-600'>No record found!</div>
                            
                        )
                )}
            </div>
            
            {showmodal && <AddModal setShowmodal={setShowmodal} />}
            {deleting && <DeleteModal />}
        </div>
    )
}

export default Authorizers
