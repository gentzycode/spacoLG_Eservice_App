import React, { useContext } from 'react';
import { BsFillCheckCircleFill } from 'react-icons/bs';
import { HiOutlinePlus } from 'react-icons/hi';
import { RiErrorWarningLine } from 'react-icons/ri';
import { AiFillCloseCircle } from 'react-icons/ai';
import { MdIncompleteCircle, MdOutlineHourglassTop } from 'react-icons/md';
import BarChart from '../../../charts/BarChart';
import PieChart from '../../../charts/PieChart';
import StackedBarChart from '../../../charts/StackedBarChart';
import LineChart from '../../../charts/LineChart';
import { AuthContext } from '../../../context/AuthContext';
import Wavinghand from '../../../assets/waving_hand.png';

const UserDashboard = ({ username, goToApplications }) => {
    const { user } = useContext(AuthContext);

    return (
        <div className="w-full px-4">
            {/* Application Request Button */}
            <div className="w-full flex justify-end my-4">
                <div
                    className="w-[230px] flex justify-center items-center space-x-2 rounded-md p-4 bg-[#0d544c] hover:bg-green-950 text-white cursor-pointer"
                    onClick={() => goToApplications()}
                >
                    <HiOutlinePlus size={20} />
                    <span>Application request</span>
                </div>
            </div>

            {/* Welcome Section */}
            <div className="w-full md:w-[40%] my-4 bg-white px-6 py-8 rounded-md shadow-md">
                <div className="flex justify-between items-center">
                    <span className="text-xl font-bold">Hello, {username}</span>
                    <img src={Wavinghand} alt="waving hand" />
                </div>
                <div>
                    <span className="text-gray-500">Welcome to the Local Government E-Services Portal.</span>
                </div>
            </div>

            {/* Pending Applications Notice */}
            {(user?.role === 'PublicUser' || user?.role === 'Agent') && (
                <div className="w-full md:flex justify-between rounded-md border border-orange-300 bg-[#fff8eb] p-3 space-y-3 md:space-y-0 shadow-sm">
                    <div className="md:flex md:space-x-3 space-y-3 md:space-y-0 items-center">
                        <div className="bg-orange-100 p-2 rounded-full w-max">
                            <RiErrorWarningLine size={25} className="text-orange-300" />
                        </div>
                        <span className="text-gray-800">You have pending applications or tasks to complete.</span>
                    </div>
                    <div className="flex space-x-5 items-center">
                        <div
                            className="border border-gray-300 bg-white rounded-full px-3 py-1 text-sm cursor-pointer"
                            onClick={() => goToApplications()}
                        >
                            View applications
                        </div>
                    </div>
                </div>
            )}

            {/* Application Status Metrics */}
            <div className="w-full mt-8">
                <div className="text-lg text-gray-700 font-semibold">Application status</div>
                <div className="w-full my-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { title: 'Processed', value: 10, color: 'green', icon: BsFillCheckCircleFill },
                        { title: 'Pending', value: 2, color: 'orange', icon: MdOutlineHourglassTop },
                        { title: 'Incomplete', value: 10, color: 'blue', icon: MdIncompleteCircle },
                        { title: 'Rejected', value: 10, color: 'red', icon: AiFillCloseCircle },
                    ].map((status, index) => (
                        <div
                            key={index}
                            className={`bg-white border border-gray-300 rounded-md p-3 shadow-md`}
                        >
                            <div className={`w-max bg-${status.color}-100 rounded-full p-2 text-${status.color}-500`}>
                                <status.icon size={30} />
                            </div>
                            <h1 className={`text-md text-${status.color}-700 font-semibold my-2`}>
                                {status.title}
                            </h1>
                            <h1 className={`text-2xl text-${status.color}-700 font-bold`}>{status.value}</h1>
                        </div>
                    ))}
                </div>
            </div>

{/* Quick Links Section */}
<div className="w-full mt-8">
    <div className="text-lg font-semibold text-gray-700">Quick Links</div>
    <div className="grid grid-cols-2 gap-6 mt-4">
        <div className="bg-green-50 p-4 rounded-md shadow-md flex items-center space-x-4 cursor-pointer hover:bg-green-100 transition">
            <BsFillCheckCircleFill className="text-green-700" size={24} />
            <span className="text-sm text-gray-700 font-medium">Complete Pending Tasks</span>
        </div>
        <div className="bg-blue-50 p-4 rounded-md shadow-md flex items-center space-x-4 cursor-pointer hover:bg-blue-100 transition">
            <RiErrorWarningLine className="text-blue-700" size={24} />
            <span className="text-sm text-gray-700 font-medium">Submit New Application</span>
        </div>
    </div>
</div>

{/* Call to Action Section */}
<div className="w-full mt-8 bg-blue-50 p-6 rounded-md shadow-md text-center">
    <h2 className="text-lg font-semibold text-blue-700">Quick Tip: Manage Your Pending Applications</h2>
    <p className="text-sm text-gray-600 my-2">
        Keep track of your pending applications and ensure timely completion to avoid delays.
    </p>
    <button
        className="mt-4 px-6 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition duration-200"
        onClick={() => goToApplications()}
    >
        View Pending Applications
    </button>
</div>
{/* Combined Metrics and Recent Activities Section */}
<div className="w-full mt-8">
    <div className="text-lg text-gray-700 font-semibold">Dashboard Insights</div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
        {/* Chart Section */}
        <div className="bg-white p-4 rounded-md shadow-md">
            <h3 className="text-md font-medium text-gray-600">Applications Over Time</h3>
            <LineChart />
        </div>
        
        {/* Recent Activities */}
        <div className="grid grid-cols-2 gap-6">
            {[
                {
                    title: 'New Applications',
                    value: 5,
                    description: 'These are the latest applications submitted in the last 24 hours.',
                    bgColor: 'bg-gray-100',
                    textColor: 'text-gray-700',
                    icon: RiErrorWarningLine,
                },
                {
                    title: 'Payments Completed',
                    value: 8,
                    description: 'These represent the completed payment transactions this month.',
                    bgColor: 'bg-blue-100',
                    textColor: 'text-blue-700',
                    icon: BsFillCheckCircleFill,
                },
            ].map((item, index) => (
                <div
                    key={index}
                    className={`${item.bgColor} ${item.textColor} rounded-lg p-5 shadow-md hover:shadow-lg transition-shadow duration-150`}
                >
                    <div className="flex items-center space-x-4">
                        <div className="p-3 rounded-full bg-white shadow-sm">
                            <item.icon size={24} className={`${item.textColor}`} />
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-sm font-semibold">{item.title}</h1>
                            <h1 className="text-2xl font-bold">{item.value}</h1>
                        </div>
                    </div>
                    <p className="mt-4 text-sm text-gray-600">{item.description}</p>
                </div>
            ))}
        </div>
    </div>

    {/* Two Additional Cards */}
    <div className="grid grid-cols-2 gap-6 mt-6">
        {[
            {
                title: 'Pending Reviews',
                value: 3,
                bgColor: 'bg-yellow-100',
                textColor: 'text-yellow-700',
                icon: MdOutlineHourglassTop,
            },
            {
                title: 'Documents Uploaded',
                value: 12,
                bgColor: 'bg-green-100',
                textColor: 'text-green-700',
                icon: AiFillCloseCircle,
            },
        ].map((item, index) => (
            <div
                key={index}
                className={`${item.bgColor} ${item.textColor} rounded-lg p-5 shadow-md hover:shadow-lg transition-shadow duration-150`}
            >
                <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-full bg-white shadow-sm">
                        <item.icon size={24} className={`${item.textColor}`} />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-sm font-semibold">{item.title}</h1>
                        <h1 className="text-2xl font-bold">{item.value}</h1>
                    </div>
                </div>
            </div>
        ))}
    </div>
</div>


            {/* SuperAdmin Dashboard Visualizations */}
            {user?.role === 'SuperAdmin' && (
                <div className="w-full mt-8">
                    <div className="text-lg text-gray-700 font-semibold">Admin Insights</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-white p-4 rounded-md shadow-md">
                            <div className="text-lg font-semibold mb-4">Applications Over Time</div>
                            <LineChart />
                        </div>
                        <div className="bg-white p-4 rounded-md shadow-md">
                            <div className="text-lg font-semibold mb-4">Applications Breakdown</div>
                            <PieChart />
                        </div>
                        <div className="bg-white p-4 rounded-md shadow-md col-span-1 md:col-span-2">
                            <div className="text-lg font-semibold mb-4">Revenue Overview</div>
                            <BarChart />
                        </div>
                        <div className="bg-white p-4 rounded-md shadow-md">
                            <div className="text-lg font-semibold mb-4">Usage Analytics</div>
                            <StackedBarChart />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserDashboard;
