import React, { useContext } from 'react'
import AuthBanner from '../../common/AuthBanner'
import { GrFormPreviousLink } from 'react-icons/gr'
import DashboardButton from '../../common/DashboardButton'
import { AuthContext } from '../../context/AuthContext'
import { Link } from 'react-router-dom'

const RequestForm = () => {

    const { serviceObject } = useContext(AuthContext)

    return (
        <div className="w-full md:h-screen grid md:grid-cols-2 px-0 m-0">
            <AuthBanner />
            <div className="w-full col-span-1 my-0 md:my-8 flex justify-center px-4 md:px-0">
                <div className='w-full md:w-2/3'>
                    <div className='mt-2'>
                        <Link to='/services' className='mt-4'>
                            <GrFormPreviousLink size={30} />
                        </Link>
                    </div>
                    {localStorage.getItem('isLoggedIn') && 
                        <DashboardButton />
                    }
                    <div className='mt-0 md:mt-8 pb-3 border-b border-gray-100'>
                        <p className='text-md my-2 text-gray-500'>{serviceObject?.localgovernments?.name}</p>
                        <h1 className='text-xl md:text-2xl font-extralight'>   
                            {serviceObject?.eservice?.name}
                        </h1>
                    </div>
                    <div className='mt-5'>
                        <h1 className='text-2xl font-extralight'>E-Service form appears here!</h1>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RequestForm
