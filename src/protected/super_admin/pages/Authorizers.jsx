import React, { useContext, useEffect, useState } from 'react'
import { AiOutlineEdit, AiOutlinePlus } from 'react-icons/ai'
import { FaFileCircleCheck } from 'react-icons/fa6'
import { AuthContext } from '../../../context/AuthContext'
import { getAllAuthorizers } from '../../../apis/adminActions'
import InitLoader from '../../../common/InitLoader'
import RecordsTable from '../../../common/RecordsTable'
import AddModal from '../components/authorizers/AddModal'

const Authorizers = () => {

    const { token, logout, record } = useContext(AuthContext);

    const [authorizers, setAuthorizers] = useState(null);
    const [error, setError] = useState(null);
    const [fetching, setFetching] = useState(false);
    const [showmodal, setShowmodal] = useState(false);

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
            <button 
                className="p-2 border-none font-medium"
            >
                <AiOutlineEdit size={20} className='text-blue-700' />
            </button>
            
          ),
        },
      ];

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
        </div>
    )
}

export default Authorizers
