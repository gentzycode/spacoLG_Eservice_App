import React, { Fragment, useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../../context/AuthContext'
import { Link, useLocation } from 'react-router-dom';
import { getAdminApplicationByID, getUserById } from '../../../apis/adminActions';
import { MdKeyboardBackspace } from 'react-icons/md';
import InitLoader from '../../../common/InitLoader';
import AppStepsTab from '../../../common/AppStepsTab';
import ApplicantInfo from '../components/ApplicantInfo';

const AdminApplicationDetail = () => {

    const { token, logout, record } = useContext(AuthContext);
    const loctn = useLocation();

    const [appdetail, setAppdetail] = useState(null);
    const [steps, setSteps] = useState(null);
    const [error, setError] = useState(null);
    const [fetching, setFetching] = useState(false);
    const [loading, setLoading] = useState(false);
    const id = loctn?.state?.appid;
    const currentStep = appdetail !== null && appdetail?.data?.current_step;
    const serviceName = appdetail !== null && appdetail?.data?.eservice?.name;

    console.log(appdetail?.data?.user);

    if(error !== null && error?.message === 'Token has expired'){
        logout();
    }

    useEffect(() => {
        getAdminApplicationByID(token, id, setAppdetail, setSteps, setError, setFetching)
    }, [record])
    
    return (
        <div className='w-full'>
            <div className='w-full flex justify-end my-2'>
                <Link
                    to='/applications' 
                    className='flex justify-center items-center space-x-2 py-3 px-6 rounded-md bg-[#0d544c] hover:bg-green-950 text-white'
                >
                    <MdKeyboardBackspace size={22} />
                    <span>Back to Applications</span>
                </Link>
            </div>
            <div className='w-full my-12 py-4'>
                {
                    (steps !== null && steps.length > 0) ? 
                        <Fragment>
                            <ApplicantInfo user={appdetail?.data?.user} />
                            <AppStepsTab 
                                steps={steps} 
                                fetching={fetching} 
                                current_step={appdetail?.data?.current_step} 
                                serviceName={serviceName} 
                                currentStep={currentStep} 
                                steps_completed={appdetail?.steps_completed} 
                                purpose_id={id}
                            />
                        </Fragment>
                        : <InitLoader />
                }
            </div>
        </div>
    )
}

export default AdminApplicationDetail
