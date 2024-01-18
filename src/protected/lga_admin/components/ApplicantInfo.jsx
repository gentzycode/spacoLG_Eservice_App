import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../../context/AuthContext';
import { getUserById } from '../../../apis/adminActions';

const ApplicantInfo = ({ appinfo, user }) => {

    console.log(appinfo);

    return (
        <div className='w-full grid p-4 bg-white rounded-md mb-2'>
            <div className='space-y-2 text-gray-700'>
                    <div className='flex'>
                        <div className='w-1/3 md:w-[15%] text-gray-500'>Username</div>
                        <div className='w-2/3 md:w-[85%]'>{user?.username}</div>
                    </div>
                    <div className='flex'>
                        <div className='w-1/3 md:w-[15%] text-gray-500'>Email</div>
                        <div className='w-2/3 md:w-[85%]'>{user?.email}</div>
                    </div>
                    <div className='flex'>
                        <div className='w-1/3 md:w-[15%] text-gray-500'>Mobile</div>
                        <div className='w-2/3 md:w-[85%]'>{user?.mobile}</div>
                    </div>
                    {<div className='flex'>
                        <div className='w-1/3 md:w-[15%] text-gray-500'>Fullname</div>
                        <div className='w-2/3 md:w-[85%]'>{
                            user?.personal_information ? user?.personal_information?.first_name+' '+user?.personal_information?.last_name
                            : <i className='text-orange-600'>No Profile information</i>
                        }</div>
                    </div>}
                    <div className='flex'>
                        <div className='w-1/3 md:w-[15%] text-gray-500'>E-Service</div>
                        <div className='w-2/3 md:w-[85%]'>{appinfo?.data?.eservice?.name}</div>
                    </div>
                    <div className='flex'>
                        <div className='w-1/3 md:w-[15%] text-gray-500'>L G A</div>
                        <div className='w-2/3 md:w-[85%]'>{appinfo?.data?.local_government?.name}</div>
                    </div>
                    <div className='flex'>
                        <div className='w-1/3 md:w-[15%] text-gray-500'>Application ID</div>
                        <div className='w-2/3 md:w-[85%]'>{appinfo?.data?.ref_no}</div>
                    </div>
                </div>
        </div>
    )
}

export default ApplicantInfo
