import React, { useContext, useState } from 'react'
import ButtonLoader from '../../../common/ButtonLoader'
import { AuthContext } from '../../../context/AuthContext';
import { paymentConfirm, updateEserviceStep } from '../../../apis/authActions';
import { FaCheckCircle } from 'react-icons/fa';

const InitializePayment = ({ initpay, confirming, confirmPayment, order_no, appID }) => {

    const { token, user, refreshRecord } = useContext(AuthContext);

    const [confirm, setConfirm] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [updating, setUpdating] = useState(false);
    const [proceed, setProceed] = useState(false);

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
            //setRes(response.reference);
            console.log(response);
            paymentConfirm(token, initpay?.paymentInfo?.id, setConfirm, setError)
            //alert('Payment complete! Reference: ' + reference);
            // Make an AJAX call to your server with the reference to verify the transaction
          },
        onClose: function() {
            alert('Transaction was not completed, window closed.');
          },
        });
        handler.openIframe();
    }

    const checkout = (app_id, gateway) => {
        gateway === 'Interswitch' && window.webpayCheckout(paymentRequest);
        gateway === 'Paystack' && payWithPaystack();
    }

    const updateStep = () => {
        const data = {
            payment_id : initpay?.paymentInfo?.id,
            order_no
        }
        updateEserviceStep(token, appID, data, setSuccess, setError, setUpdating)
    }

    if(success !== null){
        //refreshRecord(Date.now());
        setSuccess(null);
        window.location.reload();
    }

    if(confirm !==  null){
        setProceed(true);
        setConfirm(null);
    }

    return (
        proceed ? 
            <div className='w-full my-3 md:ml-6 md:border-l border-gray-200 px-4'>
                <div className='w-full flex space-x-4 items-center bg-green-100 border border-green-400 rounded-md text-green-600 p-2 my-6'>
                    <FaCheckCircle size={30} />
                    <span>Payment successful! Please click the button below to continue</span>
                </div>
                {
                    updating ? 
                        <button className='w-full flex justify-center py-3 rounded-lg bg-[#0d544c] hover:bg-green-950 text-white'>
                            <ButtonLoader />
                        </button>
                        :
                        <button 
                            className='w-full py-3 rounded-lg bg-[#0d544c] hover:bg-green-950 text-white'
                            onClick={() => updateStep()}
                        >
                            Continue
                        </button>
                }
            </div>
            :
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
                    <div className='w-1/2 text-gray-600'>Payment Gateway</div>
                    <div className='w-1/2'>{initpay?.paymentGateway?.gateway_name}</div>
                </div>
                <div className='w-full flex py-2'>
                    <div className='w-1/2 text-gray-600'>Amount</div>
                    <div className='w-1/2'>&#8358; {initpay?.tariff?.amount}</div>
                </div>
                <div className='w-full flex py-2 mt-4'>
                    <div className='w-full text-gray-600'>
                        <button 
                            className='w-full py-3 rounded-lg bg-[#0d544c] hover:bg-green-950 text-white'
                            onClick={() => checkout(initpay?.paymentInfo?.id, initpay?.paymentGateway?.gateway_name)}
                        >
                            Checkout
                        </button>
                    </div>
                </div>
            </div>
    )
}

export default InitializePayment
