import React, { useState } from 'react'
import ButtonLoader from '../../../common/ButtonLoader'

const InitializePayment = ({ initpay, confirming, confirmPayment }) => {

    function paymentCallback(response) {
        console.log(response);
    }
    
    //payment request
    const paymentRequest = {
        merchant_code: "LGESERV001",          
        pay_item_id: (initpay?.paymentInfo?.id).toString(),
        txn_ref: initpay?.paymentInfo?.ref_no,
        amount: initpay?.tariff?.amount, 
        currency: 566, // ISO 4217 numeric code of the currency used
        onComplete: paymentCallback,
        mode: 'TEST'
    };

    const confirmPay = (app_id, gateway) => {
        gateway === 'Interswitch' && window.webpayCheckout(paymentRequest);
    }

    return (
        <div className='w-full my-3 md:ml-6 md:border-l border-gray-200 px-4'>
            <div className='w-full flex py-2'>
                <div className='w-1/2 md:w-1/3 text-gray-600'>Ref. No.</div>
                <div className='w-1/2 md:w-2/3'>{initpay?.paymentInfo?.ref_no}</div>
            </div>
            <div className='w-full flex py-2'>
                <div className='w-1/2 md:w-1/3 text-gray-600'>Status</div>
                <div className='w-1/2 md:w-2/3'>{initpay?.paymentInfo?.status}</div>
            </div>
            <div className='w-full flex py-2'>
                <div className='w-1/2 md:w-1/3 text-gray-600'>Purpose</div>
                <div className='w-1/2 md:w-2/3'>{initpay?.paymentInfo?.purpose}</div>
            </div>
            <div className='w-full flex py-2'>
                <div className='w-1/2 md:w-1/3 text-gray-600'>Payment Gateway</div>
                <div className='w-1/2 md:w-2/3'>{initpay?.paymentGateway?.gateway_name}</div>
            </div>
            <div className='w-full flex py-2'>
                <div className='w-1/2 md:w-1/3 text-gray-600'>Category</div>
                <div className='w-1/2 md:w-2/3'>{initpay?.tariff?.category}</div>
            </div>
            <div className='w-full flex py-2'>
                <div className='w-1/2 md:w-1/3 text-gray-600'>Amount</div>
                <div className='w-1/2 md:w-2/3'>&#8358; {initpay?.tariff?.amount}</div>
            </div>
            <div className='w-full flex py-2 mt-4'>
                <div className='w-full text-gray-600'>
                    {
                        confirming ? 
                            <button className='w-[170px] flex justify-center py-3 rounded-lg bg-[#0d544c] hover:bg-green-950 text-white'>
                                <ButtonLoader />
                            </button>
                            :
                            <button 
                                className='w-[170px] py-3 rounded-lg bg-[#0d544c] hover:bg-green-950 text-white'
                                onClick={() => confirmPay(initpay?.paymentInfo?.id, initpay?.paymentGateway?.gateway_name)}
                            >
                                Confirm Payment
                            </button>
                    }
                </div>
            </div>
        </div>
    )
}

export default InitializePayment
