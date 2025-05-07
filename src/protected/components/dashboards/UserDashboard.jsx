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

const UserDashboard = ({ username, goToApplications, primaryColor, accentColor, secondaryColor }) => {
    const { user } = useContext(AuthContext);

    return (
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8 font-poppins">
            {/* Application Request Button */}
            <div className="w-full flex justify-end mb-6">
                <button
                    className="flex items-center space-x-2 px-6 py-3 bg-[#F0B652] text-gray-900 font-medium rounded-lg shadow-md hover:bg-[#3B78BD] hover:text-white transition-all duration-300"
                    onClick={goToApplications}
                >
                    <HiOutlinePlus size={20} />
                    <span>Application Request</span>
                </button>
            </div>

            {/* Welcome Section */}
            <div className="w-full md:w-[40%] mb-8 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all animate-fadeIn">
                <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-[#3B78BD] dark:text-[#F0B652]">Hello, {username}</span>
                    <img src={Wavinghand} alt="waving hand" className="h-12" />
                </div>
                <div>
                    <span className="text-gray-600 dark:text-gray-300">
                        Welcome to the Yenagoa Local Government E-Services Portal.
                    </span>
                </div>
            </div>

            {/* Pending Applications Notice */}
            {(user?.role === 'PublicUser' || user?.role === 'Agent') && (
                <div className="w-full bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-8 border-l-4 border-[#f06752] animate-slideIn">
                    <div className="flex items-center space-x-4">
                        <div className="bg-[#f06752]/10 p-3 rounded-full">
                            <RiErrorWarningLine size={28} className="text-[#f06752]" />
                        </div>
                        <span className="text-gray-800 dark:text-gray-200 font-medium">
                            You have pending applications or tasks to complete.
                        </span>
                    </div>
                    <button
                        className="mt-4 px-6 py-2 bg-[#f06752] text-white rounded-lg shadow-md hover:bg-[#F0B652] hover:text-gray-900 transition-all duration-300"
                        onClick={goToApplications}
                    >
                        View Applications
                    </button>
                </div>
            )}

            {/* Application Status Metrics */}
            <div className="w-full mb-8">
                <div className="text-2xl font-bold text-[#3B78BD] dark:text-[#F0B652] mb-6">Application Status</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { title: 'Processed', value: 10, color: 'green-500', icon: BsFillCheckCircleFill },
                        { title: 'Pending', value: 2, color: 'orange-500', icon: MdOutlineHourglassTop },
                        { title: 'Incomplete', value: 10, color: 'blue-500', icon: MdIncompleteCircle },
                        { title: 'Rejected', value: 10, color: 'red-500', icon: AiFillCloseCircle },
                    ].map((status, index) => (
                        <div
                            key={index}
                            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all animate-fadeIn"
                            style={{ animationDelay: `${index * 0.2}s` }}
                        >
                            <div className={`w-12 h-12 bg-${status.color}/10 rounded-full flex items-center justify-center text-${status.color} mb-4`}>
                                <status.icon size={28} />
                            </div>
                            <h1 className={`text-lg font-semibold text-${status.color} mb-2`}>{status.title}</h1>
                            <h1 className={`text-2xl font-bold text-${status.color}`}>{status.value}</h1>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Links Section */}
            <div className="w-full mb-8">
                <div className="text-2xl font-bold text-[#3B78BD] dark:text-[#F0B652] mb-6">Quick Links</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer hover:bg-green-50 dark:hover:bg-green-900/50">
                        <div className="flex items-center space-x-4">
                            <BsFillCheckCircleFill className="text-green-600 dark:text-green-400" size={28} />
                            <span className="text-lg font-medium text-gray-800 dark:text-gray-200">Complete Pending Tasks</span>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/50">
                        <div className="flex items-center space-x-4">
                            <RiErrorWarningLine className="text-blue-600 dark:text-blue-400" size={28} />
                            <span className="text-lg font-medium text-gray-800 dark:text-gray-200">Submit New Application</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Call to Action Section */}
            <div className="w-full mb-8 bg-gradient-to-r from-[#3B78BD]/10 to-[#F0B652]/10 dark:from-gray-800 dark:to-gray-900 p-8 rounded-xl shadow-lg text-center animate-slideIn">
                <h2 className="text-2xl font-bold text-[#3B78BD] dark:text-[#F0B652] mb-4">Quick Tip: Manage Your Pending Applications</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Keep track of your pending applications and ensure timely completion to avoid delays.
                </p>
                <button
                    className="px-8 py-3 bg-[#3B78BD] text-white rounded-lg shadow-md hover:bg-[#F0B652] hover:text-gray-900 transition-all duration-300"
                    onClick={goToApplications}
                >
                    View Pending Applications
                </button>
            </div>

            {/* Combined Metrics and Recent Activities Section */}
            <div className="w-full mb-8">
                <div className="text-2xl font-bold text-[#3B78BD] dark:text-[#F0B652] mb-6">Dashboard Insights</div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Chart Section */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Applications Over Time</h3>
                        <LineChart />
                    </div>

                    {/* Recent Activities */}
                    <div className="grid grid-cols-1 gap-6">
                        {[
                            {
                                title: 'New Applications',
                                value: 5,
                                description: 'These are the latest applications submitted in the last 24 hours.',
                                bgColor: 'bg-gray-100 dark:bg-gray-700',
                                textColor: 'text-gray-700 dark:text-gray-200',
                                icon: RiErrorWarningLine,
                            },
                            {
                                title: 'Payments Completed',
                                value: 8,
                                description: 'These represent the completed payment transactions this month.',
                                bgColor: 'bg-blue-100 dark:bg-blue-900/50',
                                textColor: 'text-blue-700 dark:text-blue-400',
                                icon: BsFillCheckCircleFill,
                            },
                        ].map((item, index) => (
                            <div
                                key={index}
                                className={`${item.bgColor} rounded-xl p-6 shadow-lg hover:shadow-xl transition-all animate-fadeIn`}
                                style={{ animationDelay: `${index * 0.2}s` }}
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="p-3 rounded-full bg-white dark:bg-gray-600 shadow-sm">
                                        <item.icon size={28} className={`${item.textColor}`} />
                                    </div>
                                    <div className="flex flex-col">
                                        <h1 className="text-lg font-semibold">{item.title}</h1>
                                        <h1 className="text-2xl font-bold">{item.value}</h1>
                                    </div>
                                </div>
                                <p className="mt-4 text-gray-600 dark:text-gray-300">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Two Additional Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                    {[
                        {
                            title: 'Pending Reviews',
                            value: 3,
                            bgColor: 'bg-yellow-100 dark:bg-yellow-900/50',
                            textColor: 'text-yellow-700 dark:text-yellow-400',
                            icon: MdOutlineHourglassTop,
                        },
                        {
                            title: 'Documents Uploaded',
                            value: 12,
                            bgColor: 'bg-green-100 dark:bg-green-900/50',
                            textColor: 'text-green-700 dark:text-green-400',
                            icon: AiFillCloseCircle,
                        },
                    ].map((item, index) => (
                        <div
                            key={index}
                            className={`${item.bgColor} rounded-xl p-6 shadow-lg hover:shadow-xl transition-all animate-fadeIn`}
                            style={{ animationDelay: `${index * 0.2}s` }}
                        >
                            <div className="flex items-center space-x-4">
                                <div className="p-3 rounded-full bg-white dark:bg-gray-600 shadow-sm">
                                    <item.icon size={28} className={`${item.textColor}`} />
                                </div>
                                <div className="flex flex-col">
                                    <h1 className="text-lg font-semibold">{item.title}</h1>
                                    <h1 className="text-2xl font-bold">{item.value}</h1>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* SuperAdmin Dashboard Visualizations */}
            {user?.role === 'SuperAdmin' && (
                <div className="w-full">
                    <div className="text-2xl font-bold text-[#3B78BD] dark:text-[#F0B652] mb-6">Admin Insights</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                            <div className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Applications Over Time</div>
                            <LineChart />
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                            <div className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Applications Breakdown</div>
                            <PieChart />
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg col-span-1 md:col-span-2">
                            <div className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Revenue Overview</div>
                            <BarChart />
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                            <div className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Usage Analytics</div>
                            <StackedBarChart />
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slideIn {
                    from { opacity: 0; transform: translateX(20px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.6s ease-out forwards;
                }
                .animate-slideIn {
                    animation: slideIn 0.6s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default UserDashboard;