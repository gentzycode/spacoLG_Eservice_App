import React, { useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { updateApproval } from '../apis/adminActions';
import ButtonLoader from './ButtonLoader';
//import { AiOutlineQuestionCircle } from 'react-icons/ai';
import { IoHandRightOutline } from 'react-icons/io5'

const Reviews = ({ id, flag }) => {

    const { token, user, refreshRecord } = useContext(AuthContext);

    const [notification, setNotification] = useState('');
    const [showRemarkDiv, setSshowRemarkDiv] = useState(false);
    const [approving, setApproving] = useState(false);
    const [disapproving, setDisapproving] = useState(false);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);

    const approveStep = () => {

        if(window.confirm('Are you sure you want to confirm / approve?')){
            const data = {
                action : 'Approved',
                notification
            }
            updateApproval(token, id, data, setSuccess, setError, setApproving, setDisapproving);
        } 
    }

    const addRemark = () => {
        setSshowRemarkDiv(true);
    }

    const disapproveStep = () => {
        if(notification === ''){
            alert('Sorry! You must enter the reason for cancellation.')
        }
        else if(window.confirm('Are you sure you want to cancel?')){
            const data = {
                action : 'Disapproved',
                notification
            }
            updateApproval(token, id, data, setSuccess, setError, setApproving, setDisapproving);
        } 
    }

    if(success !== null){
        refreshRecord(Date.now());
    }

    if(error !== null){
        alert(error);
        setError(null);
    }

    return (
        <div className='flex justify-center my-4'>
            {
                user?.role === 'PublicUser' && <div className='w-full flex justify-between items-center rounded-lg bg-orange-50 text-orange-700 p-4'>
                    <span className='text-lg'>
                        {
                            flag === 'AWAITING_PAYMENT_CONFIRMATION' ? 'Payment yet to be Confirmed...' : 'Reveiw in progress. Check back please.'
                        }
                    </span>
                    <IoHandRightOutline size={30} />
                </div>
            }
            {
                user?.role === 'Staff' && 
                    <div className='w-full grid md:grid-cols-2'>
                        <div className='col-span-1 py-3 md:pr-3 md:border-r border-gray-200'>
                            {
                                approving ? 
                                    <button 
                                        className='w-full flex justify-center bg-green-700 hover:bg-green-900 text-white rounded-lg p-3'
                                        onClick={() => approveStep()}
                                    >
                                        <ButtonLoader />
                                    </button>
                                    :
                                    <button 
                                        className='w-full bg-green-700 hover:bg-green-900 text-white rounded-lg p-3'
                                        onClick={() => approveStep()}
                                    >
                                        {
                                            flag === 'AWAITING_PAYMENT_CONFIRMATION' ? 'Confirm' : 'Reviewed'
                                        }
                                    </button>
                            }
                        </div>
                        <div className='col-span-1 py-3 md:pl-3'>
                            <button 
                                className='w-full bg-red-700 hover:bg-red-900 text-white rounded-lg p-3'
                                onClick={() => addRemark()}
                            >
                                Cancel
                            </button>
                            <div className={`w-full my-4 ${showRemarkDiv ? 'block' : 'hidden'}`}>
                                <textarea
                                    className='w-full rounded-md border border-gray-400 my-2 p-2 text-gray-700'
                                    rows="3"
                                    placeholder='Add reason for cancelling'
                                    onChange={(e) => setNotification(e.target.value)}
                                >

                                </textarea>
                                <div className='w-full flex justify-end my-2'>
                                    {
                                        disapproving ? 
                                            <button 
                                                className='w-[150px] flex justify-center bg-red-700 hover:bg-red-900 text-white rounded-lg py-3'
                                            >
                                                <ButtonLoader />
                                            </button>
                                            :
                                            <button 
                                                className='w-[150px] bg-red-700 hover:bg-red-900 text-white rounded-lg py-3'
                                                onClick={() => disapproveStep()}
                                            >
                                                Submit
                                            </button>
                                    }
                                    
                                </div>
                            </div>
                        </div>
                    </div>
            }
        </div>
    )
}

export default Reviews
