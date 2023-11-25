import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../../context/AuthContext';
import { getUserById } from '../../../apis/adminActions';

const ApplicantInfo = ({ user }) => {


    return (
        <div className='w-full grid p-4 bg-white rounded-md mb-2'>
            <div className='space-y-2 text-gray-700'>
                    <div className='flex py-1 border-b border-gray-50'>
                        <div className='w-1/3 md:w-[15%] uppercase'>Username</div>
                        <div className='w-2/3 md:w-[85%]'>{user?.username}</div>
                    </div>
                    <div className='flex py-1 border-b border-gray-50'>
                        <div className='w-1/3 md:w-[15%] uppercase'>Email</div>
                        <div className='w-2/3 md:w-[85%]'>{user?.email}</div>
                    </div>
                    <div className='flex py-1 border-b border-gray-50'>
                        <div className='w-1/3 md:w-[15%] uppercase'>Mobile</div>
                        <div className='w-2/3 md:w-[85%]'>{user?.mobile}</div>
                    </div>
                    {/**<div className='flex py-1 border-b border-gray-50'>
                        <div className='w-1/3 md:w-[15%]'>Fullname</div>
                        <div className='w-2/3 md:w-[85%]'>{
                            user?.personal_information ? user?.personal_information?.first_name+' '+user?.personal_information?.last_name
                            : <i className='text-orange-600'>Profile information not provided yet</i>
                        }</div>
                    </div>*/}
                </div>
        </div>
    )
}

export default ApplicantInfo
