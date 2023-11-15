import React, { useContext, useEffect, useState } from 'react'
import { AiOutlineEdit, AiOutlinePlus, AiOutlineSearch, AiOutlineUnorderedList } from 'react-icons/ai'
import { AuthContext } from '../../../context/AuthContext'
import { getAllUsers } from '../../../apis/adminActions';
import InitLoader from '../../../common/InitLoader';
import UsersTable from '../components/users/UsersTable';
import { HiUserGroup } from 'react-icons/hi';
import UserDetail from '../components/users/UserDetail';
import CreateUser from '../components/users/CreateUser';

const Users = () => {

    const { token, logout, record } = useContext(AuthContext);

    const [users, setUsers] = useState(null);
    const [error, setError] = useState(null);
    const [fetching, setFetching] = useState(false);
    const [userdetail, setUserdetail] = useState(false);
    const [userid, setUserid] = useState(null);
    const [useredit, setUseredit] = useState(null);
    const [userform, setUserform] = useState(false);

    const showUserDetail = (id) => {
        setUserid(id);
        setUserdetail(true);
    }

    const editUser = (userdata) => {
        setUseredit(userdata);
        setUserform(true);
    }

    const closeUserform = () => {
        setUseredit(null);
        setUserform(false);
    }

    const columns = [
        {
          name: "Username",
          selector: (row) => row?.username,
          sortable: true,
          cell: (row) => (
            <div className="hover:break-normal">{row?.username}</div>
          )
        },,
        {
          name: "Email",
          selector: (row) => row?.email,
          sortable: true,
          cell: (row) => (
            <div className="hover:break-normal">{row?.email}</div>
          )
        },
        {
          name: "Mobile",
          selector: (row) => row?.mobile,
          sortable: true,
          cell: (row) => (
            <div className="hover:break-normal">{row?.mobile}</div>
          )
        },
        {
            name: "Role",
            selector: (row) => row?.created_at,
            sortable: true,
            cell: (row) => (
              <div className="hover:break-normal">{row?.role?.name}</div>
            )
        },
        {
            name: "Fullname",
            selector: (row) => row?.personal_information?.first_name,
            sortable: true,
            cell: (row) => (
              <div className="hover:break-normal">{row?.personal_information?.first_name} {row?.personal_information?.last_name}</div>
            )
        },
        {
          name: "Action",
          button: true,
          cell: (row) => (
            <div className='flex items-center space-x-1'>
                <button 
                    className="p-2 border-none font-medium"
                    onClick={() => showUserDetail(row?.id)}
                >
                    <AiOutlineSearch size={20} />
                </button>
                <button 
                    className="p-2 border-none font-medium"
                    onClick={() => editUser(row)}
                >
                    <AiOutlineEdit size={20} className='text-blue-700' />
                </button>
            </div>
            
          ),
        },
      ];

    if(error !== null && error?.message === 'Token has expired'){
        //alert(error?.message);
        logout();
    }

    useEffect(() => {
        getAllUsers(token, setUsers, setError, setFetching);
    }, [record])

    return (
        <div className='w-full'>
            <div className='w-full flex justify-end my-2'>
                {
                    userdetail ? 
                        <button 
                            className='flex justify-center items-center space-x-2 py-3 px-6 rounded-md bg-[#0d544c] text-white'
                            onClick={() => setUserdetail(false)}
                        >
                            <AiOutlineUnorderedList size={20} />
                            <span> All Users</span>
                        </button>
                        :
                        <button 
                            className='flex justify-center items-center space-x-2 py-3 px-6 rounded-md bg-[#0d544c] text-white'
                            onClick={() => setUserform(true)}
                        >
                            <AiOutlinePlus size={20} />
                            <span>User</span>
                        </button>
                }
            </div>

            <h1 className='mt-4 flex space-x-2 items-center text-xl md:text-3xl font-extralight'>
                <HiUserGroup size={30} className='text-gray-600' />
                <span>Users</span>
            </h1>
            <div className='w-full my-12'>
                { fetching ? <InitLoader /> 
                    : 
                    users !== null && (
                        users === undefined ? logout() : (
                            users.length > 0 && (
                                userdetail ? <UserDetail userid={userid} setUserid={setUserid} setUserdetail={setUserdetail} /> :
                                    <UsersTable columns={columns} usersdata={users} /> 
                            )
                            
                        )
                )}
            </div>
            {userform && <CreateUser useredit={useredit} closeUserform={closeUserform} />}
        </div>
    )
}

export default Users
