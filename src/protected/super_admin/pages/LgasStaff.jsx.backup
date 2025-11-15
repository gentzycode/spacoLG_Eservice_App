import React, { useContext, useEffect, useState } from 'react'
import { AiOutlineEdit, AiOutlinePlus } from 'react-icons/ai'
import { ImOffice } from 'react-icons/im'
import { AuthContext } from '../../../context/AuthContext'
import { getAllUsers, getLGAsStaff } from '../../../apis/adminActions'
import InitLoader from '../../../common/InitLoader'
import LgasStaffTable from '../components/lgas-staff/LgasStaffTable'
import { getLGAs } from '../../../apis/noAuthActions'
import LgasStaffModal from '../components/lgas-staff/LgasStaffModal'

const LgasStaff = () => {

    const { token, logout, record } = useContext(AuthContext);

    const [lgasstaff, setLgasstaff] = useState(null);
    const [error, setError] = useState(null);
    const [fetching, setFetching] = useState(false);
    const [showmodal, setShowmodal] = useState(false);
    const [users, setUsers] = useState(null);
    const [lgas, setLgas] = useState(null);
    const [lgastaff, setLgastaff] = useState(null);

    const editLGAStaff = (lgstf) => {
        setLgastaff(lgstf);
        setShowmodal(true);
    }

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
          name: "Staff username",
          selector: (row) => row?.user?.username,
          sortable: true,
          cell: (row) => (
            <div className="hover:break-normal">{row?.user?.username}</div>
          )
        },
        {
          name: "Staff email",
          selector: (row) => row?.user?.email,
          sortable: true,
          cell: (row) => (
            <div className="hover:break-normal">{row?.user?.email}</div>
          )
        },
        {
          name: "Staff mobile",
          selector: (row) => row?.user?.mobile,
          sortable: true,
          cell: (row) => (
            <div className="hover:break-normal">{row?.user?.mobile}</div>
          )
        },
        {
            name: "Staff role",
            selector: (row) => row?.user?.role?.name,
            sortable: true,
            cell: (row) => (
              <div className="hover:break-normal">{row?.user?.role?.name}</div>
            )
        },
        {
          name: "Action",
          button: true,
          cell: (row) => (
            <button 
                className="p-2 border-none font-medium"
                onClick={() => editLGAStaff(row)}
            >
                <AiOutlineEdit size={20} className='text-blue-700' />
            </button>
            
          ),
        },
      ];

    if(error !== null && error?.message === 'Token has expired'){
        //alert(error?.message);
        logout();
    }

    useEffect(() => {
        getLGAsStaff(token, setLgasstaff, setError, setFetching);
    }, [record])

    useEffect(() => {
        getAllUsers(token, setUsers, setError, setFetching);
    }, [])

    useEffect(() => {
        getLGAs(setLgas, setError);
    }, [])

    return (
        <div className='w-full'>
            <div className='w-full flex justify-end my-2'>
                <button 
                    className='flex justify-center items-center space-x-2 py-3 px-6 rounded-md bg-[#0d544c] hover:bg-green-950 text-white'
                    onClick={() => setShowmodal(true)}
                >
                    <AiOutlinePlus size={20} />
                    <span>LGA Staff</span>
                </button>
            </div>

            <h1 className='mt-4 flex space-x-2 items-baseline text-xl md:text-3xl font-extralight'>
                <ImOffice size={30} className='text-gray-600' />
                <span>LGAs Staff</span>
            </h1>

            <div className='w-full my-12'>
                { fetching ? <InitLoader /> 
                    : 
                    lgasstaff !== null && (
                        lgasstaff === undefined ? logout() : (
                            lgasstaff.length > 0 ? 
                                <LgasStaffTable columns={columns} lgasstaffdata={lgasstaff} /> :
                                <div className='text-red-600'>No record found!</div>
                            
                        )
                )}
            </div>
            {showmodal && <LgasStaffModal users={users} lgas={lgas} setShowmodal={setShowmodal} lgastaff={lgastaff} setLagstaff={setLgastaff} />}
        </div>
    )
}

export default LgasStaff
