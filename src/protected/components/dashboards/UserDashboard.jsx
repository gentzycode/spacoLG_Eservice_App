import React, { useContext } from 'react'
import { BsFillCheckCircleFill } from 'react-icons/bs';
import { HiOutlinePlus } from 'react-icons/hi';
import { RiErrorWarningLine } from 'react-icons/ri';
import { AiFillCloseCircle, AiOutlineClose } from 'react-icons/ai';
import { MdIncompleteCircle, MdOutlineHourglassTop } from 'react-icons/md';
import BarChart from '../../../charts/BarChart';
import PieChart from '../../../charts/PieChart';
import { AuthContext } from '../../../context/AuthContext';
import StackedBarChart from '../../../charts/StackedBarChart';
import { useNavigate } from 'react-router-dom';
import { FaList } from 'react-icons/fa';
import PublicUserPieChart from '../../../charts/PublicUserPieChart';
import PublicUserBarChart from '../../../charts/PublicUserBarChart';


const UserDashboard = ({ username, goToApplications}) => {

    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    return (
        <div className='w-full'>
            <div className='w-full flex justify-between items-center my-4'>
                <div className='mb-4'>
                    <span className='text-gray-500 text-xl font-bold'>Anambra State Government E-services Platforms</span>
                </div>
            </div>
            
            {(user && user?.role === 'PublicUser') && <div className='w-full md:flex justify-between rounded md border border-orange-300 bg-[#fff8eb] p-3 space-y-3 md:space-y-0'>
                <div className='md:flex md:space-x-3 space-y-3 md:space-y-0 items-center'>
                    <div className="bg-orange-100 p-2 rounded-full w-max"><RiErrorWarningLine size={25} className='text-orange-300' /></div>
                    <span className='text-gray-800'>You have pending applications</span>
                </div>
                <div className='flex space-x-5 items-center'>
                    <div 
                        className='border border-gray-300 bg-white rounded-full px-3 py-1 text-sm cursor-pointer'
                        onClick={() => goToApplications()}
                    >
                        View applications
                    </div>
                    {/**<AiOutlineClose size={15} className='hidden md:block cursor-pointer' />*/}
                </div>
            </div>}
            <div className='w-full mt-8'>
                <div className='text-lg text-gray-700 font-semibold'>Application status</div>
                <div className='w-full my-4 md:flex md:flex-wrap md:justify-between'>
                    <div className='w-full md:w-[48%] lg:w-[24%] mb-4 bg-white border border-gray-300 rounded-md p-3'>
                        <div className='w-max bg-green-100 rounded-sm p-2 text-green-500'><BsFillCheckCircleFill size={30} /></div>
                        <h1 className='text-md text-green-700 font-semibold my-2'>Processed</h1>
                        <h1 className='text-2xl text-green-700 font-bold'>10</h1>
                    </div>
                    <div className='w-full md:w-[48%] lg:w-[24%] mb-4 bg-white border border-gray-300 rounded-md p-3'>
                        <div className='w-max bg-orange-100 rounded-sm p-2 text-orange-500'><MdOutlineHourglassTop size={30} /></div>
                        <h1 className='text-md text-orange-500 font-semibold my-2'>Pending</h1>
                        <h1 className='text-2xl text-orange-500 font-bold'>2</h1>
                    </div>
                    <div className='w-full md:w-[48%] lg:w-[24%] mb-4 bg-white border border-gray-300 rounded-md p-3'>
                        <div className='w-max bg-blue-100 rounded-sm p-2 text-blue-500'><MdIncompleteCircle size={30} /></div>
                        <h1 className='text-md text-blue-500 font-semibold my-2'>Incomplete</h1>
                        <h1 className='text-2xl text-blue-500 font-bold'>10</h1>
                    </div>
                    <div className='w-full md:w-[48%] lg:w-[24%] mb-4 bg-white border border-gray-300 rounded-md p-3'>
                        <div className='w-max bg-red-100 rounded-sm p-2 text-red-500'><AiFillCloseCircle size={30} /></div>
                        <h1 className='text-md text-red-500 font-semibold my-2'>Rejected</h1>
                        <h1 className='text-2xl text-red-500 font-bold'>10</h1>
                    </div>
                </div>
            </div>
            <div className='w-full mt-8 hidden md:block'>
                {
                    (user && user?.role === 'PublicUser') && 
                        <div className='grid grid-cols-2'>
                            <div className='col-span-1'>
                                <StackedBarChart />
                                <PublicUserBarChart />
                            </div>
                            <div className='col-span-1'>
                                <PublicUserPieChart />
                            </div>
                        </div>
                }
                {
                    (user && user?.role !== 'PublicUser') &&
                        <div className='grid grid-cols-2'>
                        <div className='col-span-1'>
                            <BarChart />
                            <StackedBarChart />
                        </div>
                        <div className='col-span-1'>
                            <PieChart />
                        </div>
                </div>}
            </div>
        </div>
    )
}

export default UserDashboard
