import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../../context/AuthContext'
import { getEnabledPaymentGateways, getPaymentGatewayByID, initiatePayment, paymentConfirm } from '../../../apis/authActions';
import { GrFormNextLink } from 'react-icons/gr';
import InitializePayment from './InitializePayment';

const ManagePayments = ({ purpose, purpose_id, order_no }) => {

    const { token, refreshRecord } = useContext(AuthContext);

    const [gateways, setGateways] = useState(null);
    const [pgateway, setPgateway] = useState(null);
    const [error, setError] = useState(null);
    const [fetching, setFetching] = useState(false);
    const [loading, setLoading] = useState(false);
    const [initpay, setInitpay] = useState(null);
    const [initializing, setInitializing] = useState(false);
    const [confirm, setConfirm] = useState(null);
    const [confirming, setConfirming] = useState(false);


    const selectPaymentGateway = (e) => {
        getPaymentGatewayByID(token, e, setPgateway, setError, setLoading);
    }


    const initializePayment = (payment_gateway_id) => {
        const data = {
            payment_gateway_id,
            purpose : "CERT_APP",
            purpose_id
        }
        initiatePayment(token, data, setInitpay, setError, setInitializing);
    }


    const confirmPayment = (id) => {
        paymentConfirm(token, id, setConfirm, setError, setConfirming);
    }

    const afterPaymentConfirmation = () => {
        setConfirm(null);
        refreshRecord(Date.now());
    }

    if(confirm !== null){
        setTimeout(() => afterPaymentConfirmation(), 2000);
    }

    if(error !== null){
        alert(error?.message);
        setError(null);
    }


    useEffect(() => {
        getEnabledPaymentGateways(token, setGateways, setError, setFetching);
    }, [])

    return (
        <div className='w-full grid md:grid-cols-2'>
            <div className='col-span-1'>
                {/** PAYMENT GATEWAY SELECTION */}
                <div className='w-full my-3 py-4 border-b border-gray-200'>
                    <select
                        className='w-full bg-transparent border border-gray-600 p-4 rounded-md'
                        onChange={(e) => selectPaymentGateway(e.target.value)}
                    >
                        <option value="">{fetching ? 'fetching gateways...' : 'Select Payment Gateway'}</option>
                        {
                            gateways !== null && gateways.map(gtway => {
                                return <option key={gtway?.id} value={gtway?.id}>{gtway?.gateway_name}</option>
                            })   
                        }
                    </select>
                </div>
                
                {/**    SELECTED PAYMENT GATEWAY DISPLAY SECTION */}
                <div className='w-full py-2'>
                    {
                        pgateway !== null && 
                            <div className='w-full flex justify-between items-center p-4'>
                                <span>{loading ? <i className='text-gray-400'>loading...</i> : pgateway?.gateway_name}</span>
                                <div 
                                    className='flex items-center space-x-1 text-[#0d544c] hover:text-gray-900 cursor-pointer'
                                    onClick={() => initializePayment(pgateway?.id)}
                                >
                                    <GrFormNextLink size={20} className='mt-1' />
                                    <span>Continue</span>
                                </div>
                            </div>
                    }
                </div>

            </div>
            <div className='col-span-1'>
                {
                    initializing ? <i className='m-12 text-gray-500'>initializing...</i>
                        :
                        initpay !== null && 
                        (
                            confirm !==  null ? <div className='p-3 m-12 bg-green-200 text-[#0d544c] font-bold'>{confirm?.message}</div> : 
                                <InitializePayment 
                                    initpay={initpay} 
                                    confirming={confirming} 
                                    confirmPayment={confirmPayment} 
                                    order_no={order_no}
                                    appID={purpose_id}
                                />
                        )
                }
            </div>
        </div>
    )
}

export default ManagePayments
