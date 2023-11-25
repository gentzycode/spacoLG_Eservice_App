import React, { useContext, useState } from 'react'
import { AiOutlineCheckCircle, AiOutlineQuestionCircle } from 'react-icons/ai'
import { AuthContext } from '../context/AuthContext'
import ButtonLoader from './ButtonLoader';
import { updateAuthorization } from '../apis/adminActions';
import CertDownload from '../protected/components/certificates/CertDownload';

const Approvals = ({ id, flag }) => {

    const { token, user, refreshRecord } = useContext(AuthContext);

    const [notification, setNotification] = useState('');
    const [showRemarkDiv, setShowRemarkDiv] = useState(false);
    const [approving, setApproving] = useState(false);
    const [disapproving, setDisapproving] = useState(false);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);
    const [downloadModal, setDownloadModal] = useState(false);

    const authorize = () => {

        if(window.confirm('Are you sure you want to approve this certificate?')){
            const data = {
                action : 'Authorized',
                notification
            }
            updateAuthorization(token, id, data, setSuccess, setError, setApproving, setDisapproving);
        } 
    }

    const addRemark = () => {
        setShowRemarkDiv(true);
    }

    const decline = () => {
        if(notification === ''){
            alert('Sorry! You must enter the reason for cancellation.')
        }
        else if(window.confirm('Are you sure you want to disapprove this certificate?')){
            const data = {
                action : 'Declined',
                notification
            }
            updateAuthorization(token, id, data, setSuccess, setError, setApproving, setDisapproving);
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
        <div className='flex justify-center my-6'>
            {
                user?.role === 'PublicUser' && 
                    (
                        flag === 'P_CERT' ? 
                            <div className='w-full flex justify-between items-center rounded-lg bg-orange-50 text-orange-700 p-4'>
                                <span className='text-lg'>
                                    Your application is undergoing final review. Please check back later
                                </span>
                                <AiOutlineQuestionCircle size={25} />
                            </div>
                            :
                            <div className='w-full flex items-center py-4'>
                                <button 
                                    className='py-4 px-6 rounded-md bg-[#0d544c] text-white hover:bg-green-950'
                                    onClick={() => setDownloadModal(true)}
                                >
                                    Preview Certificate
                                </button>
                            </div>
                            
                    )
            }
            {
                (flag === 'D_CERT' && user?.role !== 'PublicUser') && 
                    <div className='w-full'>
                        <div className='w-full flex justify-between items-center rounded-lg bg-green-50 text-[#0d544c] p-4'>
                            <span className='text-lg'>Application processing completed and Certificate available for download</span>
                            <AiOutlineCheckCircle size={25} />
                        </div>
                    </div>
            }
            {
                (flag === 'P_CERT' && user?.role !== 'PublicUser') && 
                    <div className='w-full grid md:grid-cols-2'>
                        <div className='col-span-1 py-3 md:pr-3 md:border-r border-gray-200'>
                            {
                                approving ? 
                                    <button 
                                        className='w-full flex justify-center bg-green-700 hover:bg-green-900 text-white rounded-lg p-3'
                                    >
                                        <ButtonLoader />
                                    </button>
                                    :
                                    <button 
                                        className='w-full bg-green-700 hover:bg-green-900 text-white rounded-lg p-3'
                                        onClick={() => authorize()}
                                    >
                                        Authorize
                                    </button>
                            }
                        </div>
                        <div className='col-span-1 py-3 md:pl-3'>
                            <button 
                                className='w-full bg-red-700 hover:bg-red-900 text-white rounded-lg p-3'
                                onClick={() => addRemark()}
                            >
                                Decline
                            </button>
                            <div className={`w-full my-4 ${showRemarkDiv ? 'block' : 'hidden'}`}>
                                <textarea
                                    className='w-full rounded-md border border-gray-400 my-2 p-2 text-gray-700'
                                    rows="3"
                                    placeholder='Reason for declining please'
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
                                                onClick={() => decline()}
                                            >
                                                Submit
                                            </button>
                                    }
                                    
                                </div>
                            </div>
                        </div>
                    </div>
            }

            {downloadModal && <CertDownload setDownloadModal={setDownloadModal} appid={id} />}
        </div>
    )
}

export default Approvals
