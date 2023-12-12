import React, { useState } from 'react'
import AuthBanner from '../../common/AuthBanner'
import { Link } from 'react-router-dom'
import { GrFormPreviousLink } from 'react-icons/gr'
import { getPublicApplicationStatus } from '../../apis/noAuthActions'
import InitLoader from '../../common/InitLoader'
import ButtonLoader from '../../common/ButtonLoader'
import PublicLinks from '../../common/PublicLinks'

const Statuscheck = () => {

    const [refno, setRefno] = useState();
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showinfo, setShowinfo] = useState(false);

    const toggleInfo = () => {
        setShowinfo(!showinfo);
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        getPublicApplicationStatus(refno, setSuccess, setError, setLoading);
    }

    return (
        <div>
            <PublicLinks />
            <div className="w-full md:h-screen grid md:grid-cols-2 px-0 m-0">
                <AuthBanner />
                <div className="w-full col-span-1 my-0 md:my-8 flex justify-center px-4 md:px-0">
                    <div className='w-full md:w-2/3'>
                        <div className='my-6 md:mt-0'>
                            <Link to='/' className='mt-4'>
                                <div className='bg-gray-100 rounded-full p-1 w-max'><GrFormPreviousLink size={30} /></div>
                            </Link>
                        </div>
                        <div className='w-full'>
                            <h1 className='mt-10 text-xl md:text-2xl font-semibold'>
                                Check Application Status
                            </h1>
                            {error !== null && <p className='text-red-600'>{error}</p>}
                            <form onSubmit={handleSubmit}>
                                <div className='w-full my-8 flex'>
                                    <input 
                                        type='text'
                                        placeholder='Enter application reference'
                                        className='w-full p-4 rounded-l-md border border-gray-400'
                                        required
                                        onChange={(e) => setRefno(e.target.value)}
                                    />
                                    {
                                        loading ? 
                                            <button 
                                                className='flex justify-center rounded-r-md w-[150px] py-4 text-white bg-[#0d544c] hover:bg-green-950'
                                            >
                                                <ButtonLoader />
                                            </button>
                                            :
                                            <button 
                                                className='rounded-r-md w-[150px] py-4 text-white bg-[#0d544c] hover:bg-green-950'
                                            >
                                                Check
                                            </button>
                                    }
                                    
                                </div>
                            </form>

                            <div className='w-full'>
                                {
                                    success !== null && 
                                        <div className='my-4 space-y-4'>
                                            <div className='w-full flex space-x-3'>
                                                <span>Status:</span>
                                                <span className={`uppercase ${success?.status?.step?.flag === 'D_CERT' ? 'text-green-600' : 'text-orange-600'} font-semibold`}>
                                                    {success?.status?.step?.step_name}
                                                </span>
                                            </div>

                                            <div className='w-full flex h-3 rounded-full border border-gray-400'>
                                                {
                                                    success?.status?.step?.flag === 'D_CERT' ?
                                                        <div className='w-full bg-green-600 p-1 rounded-full'></div>
                                                        :
                                                        <div className={`${success?.status?.order_no < 5 ? 'w-[30%]' : 'w-[70%]'} bg-orange-600 p-1 rounded-full`}>
                                                        </div>
                                                }
                                            </div>

                                            <div className='w-full rounded-md bg-[#d7e88f] p-4'>
                                                <div className='my-2 flex space-x-2'>
                                                    <span className='font-bold'>LGA :</span>
                                                    <span>{success?.local_government?.name}</span>
                                                </div>
                                                <div className='my-2 flex space-x-2'>
                                                    <span className='font-bold'>Application :</span>
                                                    <span>{success?.eservice?.name}</span>
                                                </div>
                                            </div>

                                            <div className='w-full'>
                                                <span 
                                                    className='text-orange-500 cursor-pointer'
                                                    onClick={() => toggleInfo()}
                                                >
                                                    Click to preview the application detail
                                                </span>
                                            </div>

                                            {
                                                showinfo && <div className='w-full border border-gray-100 rounded-md bg-gray-50 p-4 text-gray-600'>
                                                    <h1 className='flex justify-between uppercase font-bold mb-2 pb-4 border-b border-gray-200'>
                                                        <span>Application request preview</span>
                                                        <span className='cursor-pointer text-red-600' onClick={() => toggleInfo()}>X</span>
                                                    </h1>
                                                {
                                                    Object.keys(JSON.parse(success?.form_submission?.data)).map((key, i) => {
                                                        {
                                                            return key !== 'user_id' && 
                                                            <div key={i} className="flex space-x-3 py-2">
                                                                <span className='font-semibold capitalize'>{key.replace('_', ' ').replace('_', ' ')} :</span>
                                                                <span>{JSON.parse(success?.form_submission?.data)[key] === 'on' ? 'Yes' : JSON.parse(success?.form_submission?.data)[key]}</span>
                                                            </div>
                                                        }
                                                        
                                                    })
                                                }
                                            </div>}
                                        </div>
                                }
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
    )
}

export default Statuscheck
