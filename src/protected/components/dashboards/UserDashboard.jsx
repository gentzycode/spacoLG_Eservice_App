import React, { useContext } from 'react';
import { BsFillCheckCircleFill, BsCalendar3 } from 'react-icons/bs';
import { HiOutlinePlus } from 'react-icons/hi';
import { RiErrorWarningLine } from 'react-icons/ri';
import { AiFillCloseCircle } from 'react-icons/ai';
import { MdIncompleteCircle, MdOutlineHourglassTop, MdEventNote } from 'react-icons/md';
import BarChart from '../../../charts/BarChart';
import PieChart from '../../../charts/PieChart';
import StackedBarChart from '../../../charts/StackedBarChart';
import { AuthContext } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Wavinghand from '../../../assets/waving_hand.png';

const UserDashboard = ({ username, goToApplications }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className='w-full bg-[#f7f7f7] p-4'>
      {/* Application Request Button */}
      <div className='w-full flex justify-end my-4'>
        <div 
          className='w-[230px] flex justify-center items-center space-x-2 rounded-md p-4 bg-[#0d544c] hover:bg-green-950 text-white cursor-pointer'
          onClick={() => goToApplications()}
        >
          <HiOutlinePlus size={20} />
          <span>Application request</span>
        </div>
      </div>

      {/* Welcome Card */}
      <div className='w-full md:w-[40%] my-4 bg-white px-6 py-8 rounded-md space-y-2'>
        <div className='flex justify-between items-baseline'>
          <span className='text-xl font-bold'>Hello, {username}</span>
          <img src={Wavinghand} alt='waving hand' />
        </div>
        <div>
          <span className='text-gray-500'>Welcome to the Local Government E-Services Portal.</span>
        </div>
      </div>

      {/* Application Status Cards - 3 Columns per Row */}
      <div className='w-full mt-8'>
        <div className='text-lg text-gray-700 font-semibold'>Application status</div>
        <div className='w-full my-4 grid grid-cols-1 md:grid-cols-3 gap-6'>
          {/* Processed Applications */}
          <div className='bg-white border border-gray-300 rounded-md p-3'>
            <div className='w-max bg-green-100 rounded-sm p-2 text-green-500'>
              <BsFillCheckCircleFill size={30} />
            </div>
            <h1 className='text-md text-green-700 font-semibold my-2'>Processed</h1>
            <h1 className='text-2xl text-green-700 font-bold'>102</h1>
            <p className='text-gray-500'>Birth Cert, Marriage Cert, Waste Fees</p>
          </div>
          
          {/* Pending Applications */}
          <div className='bg-white border border-gray-300 rounded-md p-3'>
            <div className='w-max bg-orange-100 rounded-sm p-2 text-orange-500'>
              <MdOutlineHourglassTop size={30} />
            </div>
            <h1 className='text-md text-orange-500 font-semibold my-2'>Pending</h1>
            <h1 className='text-2xl text-orange-500 font-bold'>20</h1>
            <p className='text-gray-500'>LGA Identification, Tricycle Ticketing</p>
          </div>
          
          {/* Incomplete Applications */}
          <div className='bg-white border border-gray-300 rounded-md p-3'>
            <div className='w-max bg-blue-100 rounded-sm p-2 text-blue-500'>
              <MdIncompleteCircle size={30} />
            </div>
            <h1 className='text-md text-blue-500 font-semibold my-2'>Incomplete</h1>
            <h1 className='text-2xl text-blue-500 font-bold'>15</h1>
            <p className='text-gray-500'>Death Cert, Market Dues</p>
          </div>

          {/* Rejected Applications */}
          <div className='bg-white border border-gray-300 rounded-md p-3'>
            <div className='w-max bg-red-100 rounded-sm p-2 text-red-500'>
              <AiFillCloseCircle size={30} />
            </div>
            <h1 className='text-md text-red-500 font-semibold my-2'>Rejected</h1>
            <h1 className='text-2xl text-red-500 font-bold'>8</h1>
            <p className='text-gray-500'>Street Naming, Park Management</p>
          </div>

          {/* New Cards for Other Services */}
          <div className='bg-white border border-gray-300 rounded-md p-3'>
            <div className='w-max bg-yellow-100 rounded-sm p-2 text-yellow-500'>
              <MdEventNote size={30} />
            </div>
            <h1 className='text-md text-yellow-500 font-semibold my-2'>Upcoming Events</h1>
            <h1 className='text-2xl text-yellow-500 font-bold'>3</h1>
            <p className='text-gray-500'>Community Engagements</p>
          </div>

          <div className='bg-white border border-gray-300 rounded-md p-3'>
            <div className='w-max bg-purple-100 rounded-sm p-2 text-purple-500'>
              <BsCalendar3 size={30} />
            </div>
            <h1 className='text-md text-purple-500 font-semibold my-2'>Scheduled Payments</h1>
            <h1 className='text-2xl text-purple-500 font-bold'>12</h1>
            <p className='text-gray-500'>Market Dues, Waste Management</p>
          </div>

          {/* Financial Summary */}
          <div className='bg-white border border-gray-300 rounded-md p-3'>
            <div className='w-max bg-indigo-100 rounded-sm p-2 text-indigo-500'>
              <MdEventNote size={30} />
            </div>
            <h1 className='text-md text-indigo-500 font-semibold my-2'>Collected Revenue</h1>
            <h1 className='text-2xl text-indigo-500 font-bold'>₦1,500,000</h1>
            <p className='text-gray-500'>Waste Management, LGA Identification</p>
          </div>
        </div>
      </div>

      {/* Charts and Tables */}
      <div className='w-full mt-8'>
        <div className='text-lg text-gray-700 font-semibold'>Local Government Statistics</div>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4'>
          {/* Bar Chart */}
          <div className='bg-white p-6 rounded-md'>
            <h2 className='text-gray-600 font-bold mb-4'>Processed Applications by Category</h2>
            <BarChart 
              data={[
                { name: 'Birth Cert', value: 50 },
                { name: 'Death Cert', value: 40 },
                { name: 'Marriage Cert', value: 30 },
                { name: 'Market Dues', value: 20 },
                { name: 'Waste Fees', value: 60 }
              ]}
            />
          </div>

          {/* Pie Chart */}
          <div className='bg-white p-6 rounded-md'>
            <h2 className='text-gray-600 font-bold mb-4'>Pending Applications Breakdown</h2>
            <PieChart 
              data={[
                { name: 'LGA ID', value: 10 },
                { name: 'Tricycle Tickets', value: 6 },
                { name: 'Street Naming', value: 4 }
              ]}
            />
          </div>

          {/* Stacked Bar Chart */}
          <div className='bg-white p-6 rounded-md'>
            <h2 className='text-gray-600 font-bold mb-4'>Revenue Collected by Service</h2>
            <StackedBarChart 
              data={[
                { name: 'Birth Cert', processed: 50000, pending: 15000 },
                { name: 'Marriage Cert', processed: 70000, pending: 20000 },
                { name: 'Waste Fees', processed: 90000, pending: 25000 }
              ]}
            />
          </div>

          {/* To-Do List */}
          <div className='bg-white p-6 rounded-md'>
            <h2 className='text-gray-600 font-bold mb-4'>To-Do List</h2>
            <ul className='list-disc ml-6'>
              <li className='text-gray-600'>Review pending applications</li>
              <li className='text-gray-600'>Prepare revenue report</li>
              <li className='text-gray-600'>Update market dues data</li>
              <li className='text-gray-600'>Organize community engagement</li>
            </ul>
          </div>

          {/* Calendar */}
          <div className='bg-white p-6 rounded-md'>
            <h2 className='text-gray-600 font-bold mb-4'>Calendar</h2>
            <div className='text-center text-lg text-green-500 font-bold'>October 2024</div>
            <div className='grid grid-cols-7 gap-2 mt-4'>
              {[...Array(31)].map((_, i) => (
                <div key={i} className='p-2 bg-gray-100 rounded-md text-center'>
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
