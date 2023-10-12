import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { BsExclamationTriangleFill } from 'react-icons/bs';
import Wallet from '../../assets/wallet.png'
import Folder from '../../assets/folder.png'
import icon1 from '../../assets/icon-1.png'
import icon2 from '../../assets/icon-2.png'
import icon3 from '../../assets/icon-3.png'
import icon4 from '../../assets/icon-4.png'
import level from '../../assets/level.png'

const Dashboard = () => {

    const { user } = useContext(AuthContext);

    const [username, setUsername] = useState(null);

    useEffect(() => {
        setUsername(user?.username);
    }, [])

    return (
        <div className='space-y-8'>
            <div className='w-full rounded-xl p-12 bg-[#0d544c] mt-12 text-gray-200 space-y-2'>
                <p className='text-2xl font-bold'>Hello, {username !==  null && username}</p>
                <p className='text-2xl'>Welcome to Anambra State Government e-services</p>
            </div>
            <div className='w-full md:flex justify-between rounded-md bg-[#feebb3] p-2 space-y-6 md:space-y-0'>
                <div className='flex space-x-3 items-center'>
                    <BsExclamationTriangleFill size={30} className='text-yellow-500 md:ml-5' />
                    <span className='text-yellow-900'>You have a pending application</span>
                </div>
                <div className='flex space-x-3 items-center'>
                    <button className='py-2 px-4 bg-white text-[#0d544c] rounded-md font-bold shadow'>Cancel</button>
                    <button className='py-2 px-4 bg-[#0d544c] text-white rounded-md font-medium shadow'>Return to Application</button>
                </div>
            </div>
            <div className='w-full md:flex justify-between space-y-8 md:space-y-0'>
                <div className='w-full md:w-[49%] space-y-4 bg-white rounded-md drop-shadow-lg p-6'>
                    <div className='w-full flex justify-between items-center'>
                        <div className='flex space-x-4 items-center'>
                            <img src={Wallet} alt='wallet-icon' />
                            <div className='space-y-1'>
                                <p className='text-gray-600 text-sm font-bold'>Wallet Ballance</p>
                                <p className='font-bold'><span>&#8358;</span>0.00</p>
                            </div>
                        </div>
                        <button className='py-1 px-6 bg-[#0d544c] text-white rounded-md font-medium shadow'>Fund Wallet</button>
                    </div>
                    <div className='w-full md:flex bg-green-100 rounded-md p-4'>
                        <div className='w-full md:w-1/5 md:flex md:justify-center items-center'>
                            <div>
                                <img src={level} alt='level' width='70px' />
                                <div className='md:text-center px-2'>LVL1</div>
                            </div>
                        </div>
                        <div className='w-full md:w-4/5'>
                            <p className='text text-green-600 my-3'>Current KYC Level</p>
                            <p className='mb-1 text-gray-800'>Your current benefits include: Daily Cummulative</p>
                            <p className='text-gray-800'>Transaction Limit of <span className='font-bold'><span>&#8358;</span>50,000</span></p>
                            <div className='md:flex md:justify-between items-center space-y-4 md:space-y-0'>
                                <div className='text-gray-800'>Maximum Balance of <span className='font-bold'><span>&#8358;</span>300,000</span></div>
                                <button className='py-1.5 px-4 bg-white text-green-700 rounded-md font-bold shadow'>Upgrade KYC</button>
                            </div>
                        </div>
                    </div>
                </div>
                 
                <div className='w-full md:w-[49%] bg-white rounded-md drop-shadow-lg p-8'>
                    <div className='flex justify-center mt-4'>
                        <img src={Folder} alt='folder' width='60px' />
                    </div>
                    <div className='flex justify-center'>
                        <span className='text-gray-600 font-semibold'>Application status</span>
                    </div>
                    <div className='flex flex-wrap justify-between my-8'>
                        <div className='justify-center items-center'>
                            <p className='flex justify-center'><img src={icon1} alt='icon-1' /></p>
                            <p className='text-green-700 font-semibold text-sm mt-2'>Processed: 10</p>
                        </div>
                        <div className='items-center'>
                            <p className='flex justify-center'><img src={icon2} alt='icon-2' /></p>
                            <p className='text-yellow-500 font-semibold text-sm mt-2'>Pending: 2</p>
                        </div>
                        <div className='items-center'>
                            <p className='flex justify-center'><img src={icon3} alt='icon-3' /></p>
                            <p className='text-blue-800 font-semibold text-sm mt-2'>Incomplete: 1</p>
                        </div>
                        <div className='items-center'>
                            <p className='flex justify-center'><img src={icon4} alt='icon-4' /></p>
                            <p className='text-red-700 font-semibold text-sm mt-2'>Declined: 3</p>
                        </div>
                    </div>
                </div> 
            </div>
        </div>
    )
}

export default Dashboard
