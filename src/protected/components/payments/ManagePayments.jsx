import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { getEnabledPaymentGateways2, getPaymentGatewayByID, initiatePayment, paymentConfirm } from '../../../apis/authActions';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import InitializePayment from './InitializePayment';

const ManagePayments = ({ purpose, purpose_id, order_no, setPaymodal }) => {
    const { token, refreshRecord } = useContext(AuthContext);

    const [gateways, setGateways] = useState([]);
    const [pgateway, setPgateway] = useState(null);
    const [error, setError] = useState(null);
    const [fetching, setFetching] = useState(false);
    const [loading, setLoading] = useState(false);
    const [initpay, setInitpay] = useState(null);
    const [initializing, setInitializing] = useState(false);
    const [confirm, setConfirm] = useState(null);
    const [confirming, setConfirming] = useState(false);
    const [selected, setSelected] = useState(null);

    const selectPaymentGateway = (e) => {
        getPaymentGatewayByID(token, e, setPgateway, setError, setLoading);
    }

    const initializePayment = (payment_gateway_id) => {
        setSelected(payment_gateway_id);
        const data = {
            payment_gateway_id,
            purpose: "CERT_APP",
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

    if (confirm !== null) {
        setTimeout(() => afterPaymentConfirmation(), 2000);
    }

    if (error !== null) {
        alert(error?.message);
        setError(null);
    }

    useEffect(() => {
        getEnabledPaymentGateways2(token, (response) => {
            console.log('API Response:', response); // Log the response
            if (response.status === 'success' && response.data) {
                setGateways(response.data);
                console.log('Gateways Set:', response.data); // Log the gateways set
            } else {
                setError('Failed to fetch payment gateways');
            }
        }, setError, setFetching);
    }, [token]);

    useEffect(() => {
        console.log('Gateways State:', gateways); // Log the gateways state
    }, [gateways]);

    return (
        <div>
            <div className='fixed inset-0 z-50 bg-black bg-opacity-50 transition-opacity'></div>
            <div className="fixed inset-0 z-50 overflow-y-auto">
                <div className="flex mt-16 md:mt-0 md:min-h-full items-end justify-center p-4 sm:items-center sm:p-0">
                    <div className='w-full md:w-[500px] bg-white border border-gray-400 dark:text-gray-700 rounded-md px-6 py-1'>
                        <div className='flex justify-between items-center border-b border-gray-200 py-3'>
                            <span className='text-lg text-gray-700 font-semibold'>
                                Choose payment method
                            </span>
                            <span
                                className='cursor-pointer text-red-600'
                                onClick={() => setPaymodal(false)}
                            >
                                <AiOutlineCloseCircle size={20} />
                            </span>
                        </div>
                        <div className='py-4'>
                            <div className='w-full flex justify-between flex-wrap'>
                                {gateways.length > 0 ? gateways.map(gtway => (
                                    <div
                                        key={gtway?.id}
                                        className={`w-[48%] flex justify-center items-center rounded-md bg-gray-100 p-4 cursor-pointer ${(selected !== null && selected === gtway?.id) && 'border border-[#0d544c]'}`}
                                        onClick={() => initializePayment(gtway?.id)}
                                    >
                                        <img src={gtway.logo_url} alt={gtway.gateway_name} />
                                    </div>
                                )) : <i className='text-gray-500'>Loading payment gateways...</i>}
                            </div>
                            <div className='my-6'>
                                {initializing ? <i className='text-gray-500'>Initializing...</i>
                                    : initpay !== null && (
                                        confirm !== null ? <div className='p-3 bg-green-200 text-[#0d544c] font-bold'>{confirm?.message}</div>
                                            : <InitializePayment
                                                initpay={initpay}
                                                confirming={confirming}
                                                confirmPayment={confirmPayment}
                                                order_no={order_no}
                                                appID={purpose_id}
                                            />
                                    )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ManagePayments;
