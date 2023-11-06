import React, { useState } from 'react'
import { FcApproval } from 'react-icons/fc'
import InitLoader from './InitLoader'
import RequestForm from '../protected/components/application/RequestForm';
import ManagePayments from '../protected/components/payments/ManagePayments';
import { AiOutlineCheckCircle } from 'react-icons/ai';

const AppStepsTab = ({ steps, fetching, current_step, serviceName, currentStep, steps_completed, purpose_id }) => {

    const [flag, setFlag] = useState(currentStep);
    const [order, setOrder] = useState(current_step);
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
                            className={`w-full flex justify-between pl-4 py-4 ${steps.length !== step?.order_no && 'border-b'} border-gray-100 ${ step?.order_no === current_step ? 'text-[#0d544c] hover:text-green-600 font-bold' : 'hover:font-medium text-gray-600 hover:text-gray-900' } ${current_step >= step?.order_no && 'cursor-pointer'} items-center`}
                            onClick={(e) => stepActions(step)}
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
                    <h1 className='text-2xl py-2 border-b border-gray-200'>{serviceName}</h1>
                    <div className='w-full'>
                        {
                            order === current_step ? 
                                steps.length > 0 && steps.map(activestep => {
                                return activestep?.order_no === order &&
                                    <div className='w-full' key={activestep?.id}>
                                        <h1 className='text-lg my-2'>{activestep?.step?.step_name}</h1>
                                        {
                                            activestep?.step?.flag === 'ADD_INFO' && 
                                                <RequestForm action_id={activestep?.step?.action_id} eservice_id={activestep?.eservices_id} />
                                        }
                                        {
                                            activestep?.step?.flag === 'PAYMENT_REQUIRED' && 
                                                <ManagePayments purpose={activestep?.step?.flag} purpose_id={purpose_id} />
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
                                                    <div key={i} className="col-span-1 py-2 border-b border-gray-100 text-gray-500">
                                                        <p className='w-full text-xs capitalize py-1'>{key.replace('_', ' ')}</p>
                                                        <p className='w-full'>{JSON.parse(sub?.data)[key]}</p>
                                                    </div>
                                                ))}
                                                </div>
                                            })
                                        }
                                        {
                                            stp?.payment_info && stp?.payment_info.length > 0 && stp?.payment_info.map(pinfo => {
                                                return <div className='grid md:grid-cols-2 border-gray-100 pb-8'>
                                                {Object.keys(pinfo).map((key, i) => (
                                                    <div key={i} className="col-span-1 py-2 border-b border-gray-100 text-gray-500">
                                                        <p className='w-full text-xs capitalize py-1'>{key.replace('_', ' ')}</p>
                                                        <p className='w-full'>{pinfo[key]}</p>
                                                    </div>
                                                ))}
                                                </div>
                                            })
                                        }
                                        {
                                            stp?.flag === 'AWAITING_PAYMENT_CONFIRMATION' && 
                                                <div className='flex justify-center my-6'>
                                                    <div className='w-full flex justify-between items-center rounded-lg bg-green-100 text-[#0d544c] p-4'>
                                                        <span className='font-bold text-lg'>Payment Confirmed</span>
                                                        <AiOutlineCheckCircle size={30} />
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
