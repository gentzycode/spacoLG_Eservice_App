import React, { useContext, useState } from 'react'
import ButtonLoader from '../../../common/ButtonLoader'
import { AuthContext } from '../../../context/AuthContext';
import { paymentConfirm } from '../../../apis/authActions';

const InitializePayment = ({ initpay, confirming, confirmPayment }) => {

    const { token, user, refreshRecord } = useContext(AuthContext);

    const [confirm, setConfirm] = useState(null);
    const [error, setError] = useState(null);
    const [res, setRes] = useState(null);

    function paymentCallback(response) {
        console.log(response);
    }
    
    //payment request with interswitch
    const paymentRequest = {
        merchant_code: "LGESERV001",          
        pay_item_id: (initpay?.paymentInfo?.id).toString(),
        txn_ref: initpay?.paymentInfo?.ref_no,
        amount: parseInt(initpay?.tariff?.amount), 
        currency: 566, // ISO 4217 numeric code of the currency used
        onComplete: paymentCallback,
        mode: 'TEST',
        site_redirect_url: 'http://localhost:5173/application-detail'
    };

    // payment request with paystack
    const payWithPaystack = () => {

        var handler = PaystackPop.setup({
          key: initpay?.paymentGateway?.public_key, // Replace with your public key
          email: user?.email,
          amount: parseInt(initpay?.tariff?.amount) * 100, // the amount value is multiplied by 100 to convert to the lowest currency unit
          currency: 'NGN', // Use GHS for Ghana Cedis or USD for US Dollars
          ref: initpay?.paymentInfo?.ref_no, // Replace with a reference you generated
          callback: function(response) {
            //paymentConfirm(token, initpay?.paymentInfo?.id, setConfirm, setError)
            //this happens after the payment is completed successfully
            setRes(response.reference);
            //alert('Payment complete! Reference: ' + reference);
            // Make an AJAX call to your server with the reference to verify the transaction
          },
        onClose: function() {
            alert('Transaction was not completed, window closed.');
          },
        });
        handler.openIframe();
    }

    const confirmPay = (app_id, gateway) => {
        gateway === 'Interswitch' && window.webpayCheckout(paymentRequest);
        gateway === 'Paystack' && payWithPaystack();
    }

    if(res !== null){
        alert(res);
        setRes(null);
        paymentConfirm(token, initpay?.paymentInfo?.id, setConfirm, setError)
    }

    if(confirm !==  null){
        alert(confirm?.message);
        setConfirm(null);
        refreshRecord(Date.now());
    }

    return (
        <div className='w-full my-3 md:ml-6 md:border-l border-gray-200 px-4'>
            {error !== null && <div className='w-full my-2 text-red-600'>{error?.message}</div>}
            <div className='w-full flex py-2'>
                <div className='w-1/2 text-gray-600'>Ref. No.</div>
                <div className='w-1/2'>{initpay?.paymentInfo?.ref_no}</div>
            </div>
            <div className='w-full flex py-2'>
                <div className='w-1/2 text-gray-600'>Status</div>
                <div className='w-1/2'>{initpay?.paymentInfo?.status}</div>
            </div>
            <div className='w-full flex py-2'>
                <div className='w-1/2 text-gray-600'>Purpose</div>
                <div className='w-1/2'>{initpay?.paymentInfo?.purpose}</div>
            </div>
            <div className='w-full flex py-2'>
                <div className='w-1/2 text-gray-600'>Payment Gateway</div>
                <div className='w-1/2'>{initpay?.paymentGateway?.gateway_name}</div>
            </div>
            <div className='w-full flex py-2'>
                <div className='w-1/2 text-gray-600'>Category</div>
                <div className='w-1/2'>{initpay?.tariff?.category}</div>
            </div>
            <div className='w-full flex py-2'>
                <div className='w-1/2 text-gray-600'>Amount</div>
                <div className='w-1/2'>&#8358; {initpay?.tariff?.amount}</div>
            </div>
            <div className='w-full flex py-2 mt-4'>
                <div className='w-full text-gray-600'>
                    {
                        confirming ? 
                            <button className='w-full flex justify-center py-3 rounded-lg bg-[#0d544c] hover:bg-green-950 text-white'>
                                <ButtonLoader />
                            </button>
                            :
                            <button 
                                className='w-full py-3 rounded-lg bg-[#0d544c] hover:bg-green-950 text-white'
                                onClick={() => confirmPay(initpay?.paymentInfo?.id, initpay?.paymentGateway?.gateway_name)}
                            >
                                Checkout
                            </button>
                    }
                </div>
            </div>
        </div>
    )
}

export default InitializePayment
