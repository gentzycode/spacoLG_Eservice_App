import React, { Fragment, useContext, useState } from 'react'
import { FcApproval } from 'react-icons/fc'
import InitLoader from './InitLoader'
import RequestForm from '../protected/components/application/RequestForm';
import ManagePayments from '../protected/components/payments/ManagePayments';
import { AiOutlineCheckCircle, AiOutlineQuestionCircle } from 'react-icons/ai';
import { formatDate } from '../apis/functions';
import Reviews from './Reviews';
import { AuthContext } from '../context/AuthContext';
import Approvals from './Approvals';
import Authorizations from '../protected/lga_admin/components/Authorizations';

const AppStepsTab = ({ steps, fetching, current_step, serviceName, currentStep, steps_completed, purpose_id, admin_notes, authorizations, authorizers, app_lga_id }) => {

    const { user } =  useContext(AuthContext);
    console.log(user);

    const [flag, setFlag] = useState(currentStep);
    const [order, setOrder] = useState(current_step);
    const [paymodal, setPaymodal] = useState(false);
    console.log(serviceName);

    const stepActions = (stepObj) => {

        current_step >= stepObj?.order_no && setFlag(stepObj?.step?.flag);
        setOrder(stepObj?.order_no);
    }

    return (
        <div className='grid grid-cols-6 md:grid-cols-4'>
            <div className='col-span-1 pr-2 py-2 bg-white rounded-l-lg'>
                {
                    fetching ? <InitLoader /> :
                    steps.map(step => {
                        return <div 
                            key={step?.id} 
                            className={`
                                w-full flex justify-between pl-4 py-4 
                                ${steps.length !== step?.order_no && 'border-b'} border-gray-100 ${ step?.order_no === current_step ? 'text-[#0d544c] hover:text-green-600 font-bold' : 'hover:font-medium text-gray-600 hover:text-gray-900' } ${current_step >= step?.order_no && 'cursor-pointer'} items-center`}
                            onClick={current_step >= step?.order_no ? (e) => stepActions(step) : '#'}
                        >
                            <span className={`md:hidden rounded-full ${ step?.order_no === current_step ? 'bg-[#0d544c] text-white' : 'text-[#0d544c] border-[#0d544c]'} px-2`}>
                                {step?.order_no}
                            </span>
                            {current_step >= step?.order_no ? <span className='hidden md:block text-sm uppercase'>{step?.step?.step_name}</span> : <span className='hidden md:block text-sm uppercase'><i className='text-gray-300'>{step?.step?.step_name}</i></span> }
                            <span>{current_step > step?.order_no && <FcApproval size={18} />}</span>
                        </div>
                    })
                }
            </div>
            <div className='col-span-5 md:col-span-3 pl-2'>
                <div className='w-full bg-white rounded-r-lg p-4'>
                    <div className='w-full'>
                        {
                            order === current_step ? 
                                steps.length > 0 && steps.map(activestep => {
                                return activestep?.order_no === order &&
                                    <div className='w-full' key={activestep?.id}>
                                        <h1 className='text-lg my-2'>{activestep?.step?.step_name}</h1>
                                        <div className='w-full my-4'>
                                            {
                                            (activestep?.step?.flag !== 'P_CERT' && activestep?.step?.flag !== 'D_CERT') && 
                                                admin_notes && admin_notes.length > 0 && admin_notes.map(note => {
                                                    return <span key={note?.id} className='text-orange-600 py-2'>
                                                            {note?.notification?.message}
                                                        </span>
                                                })
                                            }
                                        </div>
                                        {
                                            activestep?.step?.flag === 'ADD_INFO' && (
                                                user?.role === 'PublicUser' ? 
                                                    <RequestForm action_id={activestep?.action_id} eservice_id={activestep?.eservices_id} lg_id={app_lga_id} />
                                                    :
                                                    <div className='w-full my-4 text-gray-700'>
                                                        Applicant yet to provide required information...
                                                    </div>
                                            )
                                                
                                        }
                                        {
                                            activestep?.step?.flag === 'PAYMENT_REQUIRED' && (
                                                user?.role === 'PublicUser' ? 
                                                    <Fragment>
                                                        <div 
                                                            className='max-w-max px-8 py-4 rounded-md text-white bg-[#0d544c] hover:bg-green-950 cursor-pointer shadow-xl my-8'
                                                            onClick={() => setPaymodal(true)}
                                                        >
                                                            Click to make your payment
                                                        </div>
                                                        {paymodal && <ManagePayments purpose={activestep?.step?.id} purpose_id={purpose_id} order_no={order} setPaymodal={setPaymodal} />}
                                                    </Fragment>
                                                    :
                                                    <div className='w-full my-4 text-gray-700'>
                                                        Yet to receive notification on Applicant's payment...
                                                    </div>
                                            )
                                                
                                        }
                                        {
                                            (activestep?.step?.flag === 'AWAITING_PAYMENT_CONFIRMATION' ||
                                            activestep?.step?.flag === 'INFO_REQ_ADMIN_REVIEW' ||
                                            activestep?.step?.flag === 'REQ_ADMIN_REVIEW') && 
                                            <Reviews 
                                                id={purpose_id}  
                                                flag={activestep?.step?.flag}
                                            />
                                        }
                                        {
                                            (activestep?.step?.flag === 'P_CERT' || activestep?.step?.flag === 'D_CERT') && 
                                                <Fragment>
                                                    {user?.role !== 'PublicUser' && 
                                                        <Authorizations 
                                                            authorizations={authorizations} 
                                                            flag={activestep?.step?.flag}
                                                            authorizers={authorizers}
                                                        />
                                                    }
                                                    <Approvals 
                                                        id={purpose_id}  
                                                        flag={activestep?.step?.flag}
                                                    />
                                                </Fragment>
                                            
                                        }
                                    </div>
                                })
                                :
                                steps_completed.length > 0 && steps_completed.map(stp => {
                                return stp?.order_no === order &&
                                    <div className='w-full' key={stp?.id}>
                                        <h1 className='text-lg my-2'>{stp?.step_name}</h1>
                                        <div>
                                        {
                                            stp?.submission && stp?.submission.length > 0 && stp?.submission.map(sub => {
                                                return <div key={sub?.id} className='grid md:grid-cols-2'>
                                                {Object.keys(JSON.parse(sub?.data)).map((key, i) => (
                                                    key !== 'user_id'&& <div key={i} className="col-span-1 py-2 border-b border-gray-100 text-gray-500">
                                                        <p className='w-full text-xs capitalize py-1'>{key.replace('_', ' ').replace('_', ' ')}</p>
                                                        <p className='w-full text-gray-700'>{JSON.parse(sub?.data)[key] === 'on' ? 'Yes' : JSON.parse(sub?.data)[key]}</p>
                                                    </div>
                                                ))}
                                                </div>
                                            })
                                        }
                                        {
                                            stp?.payment_info && stp?.payment_info.length > 0 && stp?.payment_info.map(pinfo => {
                                                return pinfo?.status === 'Completed' && <div key={key?.id} className='grid border-gray-100 pb-8'>
                                                    <h1 
                                                        className={
                                                            `text-lg 
                                                            ${(pinfo?.status === 'Failed' || pinfo?.status === 'Rejected') && 'bg-red-100 text-red-800'} 
                                                            ${pinfo?.status === 'Completed' && 'bg-green-100 text-green-800'}
                                                            ${pinfo?.status === 'Initialized' && 'bg-orange-100 text-orange-600'} 
                                                            px-2 py-1`}
                                                    >
                                                        {pinfo?.status}
                                                    </h1>
                                                    <div className='grid my-2'>
                                                        <div className='flex items-center my-1'>
                                                            <span className='w-1/2 md:w-1/3 text-gray-600'>Reference ID</span>
                                                            <span>{pinfo?.ref_no}</span>
                                                        </div>
                                                        <div className='flex items-center my-1'>
                                                            <span className='w-1/2 md:w-1/3 text-gray-600'>Payment Channel</span>
                                                            <span>{pinfo?.payment_gateway?.gateway_name}</span>
                                                        </div>
                                                        <div className='flex items-center my-1'>
                                                            <span className='w-1/2 md:w-1/3 text-gray-600'>Category</span>
                                                            <span>{pinfo?.tariff?.category}</span>
                                                        </div>
                                                        <div className='flex items-center my-1'>
                                                            <span className='w-1/2 md:w-1/3 text-gray-600'>Amount</span>
                                                            <span>&#8358; {pinfo?.tariff?.amount}</span>
                                                        </div>
                                                        <div className='flex items-center my-1'>
                                                            <span className='w-1/2 md:w-1/3 text-gray-600'>Date</span>
                                                            <span>{formatDate(pinfo?.updated_at)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            })
                                        }
                                        {
                                            stp?.flag === 'AWAITING_PAYMENT_CONFIRMATION' && 
                                                <div className='flex justify-center my-6'>
                                                    <div className='w-full flex justify-between items-center rounded-lg bg-green-50 text-[#0d544c] p-4'>
                                                        <span className='text-lg'>Payment Confirmed</span>
                                                        <AiOutlineCheckCircle size={25} />
                                                    </div>
                                                </div>
                                        }
                                        {
                                            (stp?.flag === 'REQ_ADMIN_REVIEW' || stp?.flag === 'INFO_REQ_ADMIN_REVIEW') && 
                                                <div className='flex justify-center my-6'>
                                                    <div className='w-full flex justify-between items-center rounded-lg bg-green-50 text-[#0d544c] p-4'>
                                                        <span className='text-lg'>Application Reviewed and Approved</span>
                                                        <AiOutlineCheckCircle size={25} />
                                                    </div>
                                                </div>
                                        }
                                        {
                                            stp?.flag === 'P_CERT' && 
                                                <div className='flex justify-center my-6'>
                                                    <div className='w-full flex justify-between items-center rounded-lg bg-green-50 text-[#0d544c] p-4'>
                                                        <span className='text-lg'>Application final reveiw and certificate processing completed</span>
                                                        <AiOutlineCheckCircle size={25} />
                                                    </div>
                                                </div>
                                        }
                                        
                                        </div>
                                    </div>
                                }) 
                        }
                    </div>
                </div>
            </div>
        </div>
        
    )
}

export default AppStepsTab
