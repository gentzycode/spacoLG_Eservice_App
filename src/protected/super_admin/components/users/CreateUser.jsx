import React, { Fragment, useContext, useEffect, useState } from 'react'
import { AiOutlineCloseCircle } from 'react-icons/ai'
import { AuthContext } from '../../../../context/AuthContext'
import { createUser, getAllRoles, getUserById, updateUser } from '../../../../apis/adminActions';
import ButtonLoader from '../../../../common/ButtonLoader';

const CreateUser = ({ useredit, closeUserform }) => {

    const { token, refreshRecord } = useContext(AuthContext);

    //const [userinfo, setUserinfo] = useState(null);
    const [username, setUsername] = useState(useredit !== null ? useredit?.username : '');
    const [email, setEmail] = useState(useredit !== null ? useredit?.email : '');
    const [mobile, setMobile] = useState(useredit !== null ? useredit?.mobile : '');
    const [role_id, setRole_id] = useState(useredit !== null ? useredit?.role_id : '');
    const [password_hash, setPassword_hash] = useState('');
    const [password_hash_confirmation, setPassword_hash_confirmation] = useState('');
    const [roles, setRoles] = useState(null);
    const [error, setError] = useState(null);
    const [fetching, setFetching] = useState(false);
    const [creating, setCreating] = useState(false);
    const [success, setSuccess] = useState(null);

    let roleName;


    const handleSubmit = (e) => {
        e.preventDefault();

        if(useredit === null){
            const data = {
                username,
                password_hash,
                password_hash_confirmation,
                role_id,
                email,
                mobile
            }
            createUser(token, data, setSuccess, setError, setCreating)
        }
        else{
            const data = {
                username,
                role_id,
                email,
                mobile
            }
            updateUser(token, useredit?.id, data, setSuccess, setError, setCreating)
        }

    }

    if(success !== null){
        alert('User record update Successful!');
        refreshRecord(Date.now());
        closeUserform()
    }

    useEffect(() => {
        getAllRoles(token, setRoles, setError);
    }, [])

    /**useEffect(() => {
        useredit !== null && getUserById(token, useredit, setUserinfo, setError, setFetching)
    }, [])*/

    useEffect(() => {
        roleName = useredit !== null && roles !== null && roles.filter(role => {
            if(role?.id === role_id){
                return role?.name
            }
        })
    }, [])

    /**useEffect(() => {
        if(userinfo !== null){
            setUsername(userinfo?.username);
            setEmail(userinfo?.email);
            setMobile(userinfo?.mobile);
            setRole_id(userinfo?.role_id);
        }
        refreshRecord(Date.now());
    }, [record])*/


    return (
        <div>
            <div className='fixed inset-0 z-50 bg-black bg-opacity-75 transition-opacity'></div>
            <div className="fixed inset-0 z-50 overflow-y-auto">
                <div className="flex mt-16 md:mt-0 md:min-h-full items-end justify-center p-4 sm:items-center sm:p-0">
                    <div className='w-full md:w-[600px] bg-white border border-gray-400 dark:text-gray-700 rounded-md px-6 py-1'>
                        <div className='flex justify-between items-center border-b border-gray-200 py-2 text-red-500'>
                            <span className='text-lg text-gray-700 uppercase font-bold'>
                                {useredit !== null ? 'Edit User' : 'New User'}
                            </span>
                            <span
                                className='cursor-pointer'
                                onClick={(e) => closeUserform()}
                            >    
                                <AiOutlineCloseCircle size={20} />
                            </span>
                        </div>
                        <div className='py-4'>
                            
                            {error !== null && <span className='text-red-500 py-2'>{error?.message}</span>}
                            <form onSubmit={handleSubmit} className='space-y-4 text-gray-700'>
                                <div className='w-full grid space-y-1'>
                                    <label>Username</label>
                                    <input 
                                        type='text'
                                        className='w-full border border-gray-400 rounded-md p-2'
                                        value={username}
                                        required
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </div>
                                <div className='w-full grid space-y-1'>
                                    <label>Email</label>
                                    <input 
                                        type='email'
                                        className='w-full border border-gray-400 rounded-md p-2'
                                        value={email}
                                        required
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className='w-full grid space-y-1'>
                                    <label>Mobile</label>
                                    <input 
                                        type='text'
                                        className='w-full border border-gray-400 rounded-md p-2'
                                        value={mobile}
                                        required
                                        onChange={(e) => setMobile(e.target.value)}
                                    />
                                </div>
                                <div className='w-full grid space-y-1'>
                                    <label>User role</label>
                                    <select 
                                        className='w-full border border-gray-400 rounded-md p-2 bg-transparent'
                                        value={role_id}
                                        required
                                        onChange={(e) => setRole_id(e.target.value)}
                                    >
                                        <option value=''>{roleName}</option>
                                        {
                                            roles !== null && roles.map(role => {
                                                return <option key={role?.id} value={role?.id}>{role?.name}</option>
                                            })
                                        }
                                    </select>
                                </div>
                                {
                                    useredit === null &&
                                    <Fragment>
                                        <div className='w-full grid space-y-1'>
                                            <label>Password</label>
                                            <input 
                                                type='password'
                                                className='w-full border border-gray-400 rounded-md p-2'
                                                required
                                                onChange={(e) => setPassword_hash(e.target.value)}
                                            />
                                        </div>
                                        <div className='w-full grid space-y-1'>
                                            <label>Confirm Password</label>
                                            <input 
                                                type='password'
                                                className='w-full border border-gray-400 rounded-md p-2'
                                                required
                                                onChange={(e) => setPassword_hash_confirmation(e.target.value)}
                                            />
                                        </div>
                                    </Fragment>
                                }
                                <div className='w-full flex justify-between md:justify-end items-center md:space-x-3 pt-2'>
                                    <button 
                                        className='w-[150px] p-3 hover:bg-gray-100 border border-[#0d544c] text-[#0d544c] rounded-md'
                                        onClick={() => closeUserform()}
                                    >
                                        Cancel
                                    </button>
                                    {
                                        creating ? 
                                        <button className='w-[150px] flex justify-center p-3 bg-[#0d544c] hover:bg-[#143531] text-white rounded-md'>
                                            <ButtonLoader />
                                        </button>
                                        :
                                        <button className='w-[150px] p-3 bg-[#0d544c] hover:bg-[#143531] text-white rounded-md'>
                                            {useredit !== null ? 'Update details' : 'Add details'}
                                        </button>
                                    }
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        
        </div>
    )
}

export default CreateUser
