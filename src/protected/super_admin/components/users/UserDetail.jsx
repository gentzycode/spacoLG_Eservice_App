import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../../../context/AuthContext';
import { getUserById } from '../../../../apis/adminActions';
import { HiUser } from 'react-icons/hi';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import InitLoader from '../../../../common/InitLoader';

const UserDetail = ({ userid, setUserid, setUserdetail}) => {

    const { token } = useContext(AuthContext);

    const [userinfo, setUserinfo] = useState(null);
    const [error, setError] = useState(null);
    const [fetching, setFetching] = useState(null);

    const closeUserinfo = () => {
        setUserid(null);
        setUserdetail(false);
    }

    useEffect(() => {
        getUserById(token, userid, setUserinfo, setError, setFetching);
    }, [])


    return (
        <div className='w-full bg-white rounded-lg p-4'>
            <div className='w-full flex justify-between items-center my-2'>
                <div className='flex space-x-2 items-center'>
                    <HiUser size={30} />
                    <span className='text-2xl capitalize'>{userinfo !== null && userinfo?.username}</span>
                </div>
                <AiOutlineCloseCircle size={30} className='text-red-600 cursor-pointer' onClick={() => closeUserinfo()} />
            </div>
            {
                userinfo === null ? <InitLoader /> :
                <div className='grid md:grid-cols-2 text-gray-700 md:px-6'>
                    <div className='w-full my-6 space-y-4 col-span-1 md:px-4'>
                        <h1 className="p-3 bg-green-100 text-lg font-semibold">Bio-data</h1>
                        <div className='grid grid-cols-4 border-b border-gray-100 py-1'>
                            <div className='col-span-1'>Email</div>
                            <div className='col-span-3'>{userinfo?.email}</div>
                        </div>
                        <div className='grid grid-cols-4 border-b border-gray-100 py-1'>
                            <div className='col-span-1'>Mobile</div>
                            <div className='col-span-3'>{userinfo?.mobile}</div>
                        </div>
                        <div className='grid grid-cols-4 border-b border-gray-100 py-1'>
                            <div className='col-span-1'>Role</div>
                            <div className='col-span-3'>{userinfo?.role?.name}</div>
                        </div>
                        {
                        userinfo?.personal_information?.user_id ? 
                            <div className='w-full my-6 space-y-4 col-span-1'>
                                <div className='grid grid-cols-4 border-b border-gray-100 py-1'>
                                    <div className='col-span-1'>Name</div>
                                    <div className='col-span-3'>{userinfo?.personal_information?.first_name} {userinfo?.personal_information?.last_name}</div>
                                </div>
                                <div className='grid grid-cols-4 border-b border-gray-100 py-1'>
                                    <div className='col-span-1'>Gender</div>
                                    <div className='col-span-3'>{userinfo?.personal_information?.gender}</div>
                                </div>
                                <div className='grid grid-cols-4 border-b border-gray-100 py-1'>
                                    <div className='col-span-1'>Date of Birth</div>
                                    <div className='col-span-3'>{userinfo?.personal_information?.date_of_birth}</div>
                                </div>
                                <div className='grid grid-cols-4 border-b border-gray-100 py-1'>
                                    <div className='col-span-1'>Address</div>
                                    <div className='col-span-3'>{userinfo?.personal_information?.address}</div>
                                </div>
                            </div> :
                            <div className='p-2 w-full bg-orange-100 rounded-md text-orange-600'>
                                Profile information not provided yet!
                            </div>
                        }
                    </div>
                    <div className='col-span-1 md:px-4 my-6 space-y-4'>
                        <h1 className="p-3 bg-green-100 text-lg font-semibold">Permissions</h1>
                        {
                            userinfo?.permissions.length > 0 ? 
                            <div className='space-y-4'>
                                {
                                    userinfo?.permissions.map(perm => {
                                        return <div className='p-1 capitalize' key={perm?.id}>
                                            {perm?.name.replace('_', ' ').replace('_', ' ')}
                                        </div>
                                    })
                                }
                            </div> : 
                            <div className='p-2 w-full bg-orange-100 rounded-md text-orange-600'>
                                No permission assigned to this user!
                            </div>
                        }
                    </div>
                </div>
            }
            
        </div>
    )
}

export default UserDetail
