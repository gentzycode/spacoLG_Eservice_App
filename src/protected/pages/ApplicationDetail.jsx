import React, { useContext, useEffect, useState } from 'react'
import { MdKeyboardBackspace } from 'react-icons/md';
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext';
import { getApplicationByID, getLagById } from '../../apis/authActions';
import AppStepsTab from '../../common/AppStepsTab';
import InitLoader from '../../common/InitLoader';
import { GrFormPreviousLink } from 'react-icons/gr';

const ApplicationDetail = () => {

    const { token, logout, record } = useContext(AuthContext);
    const loctn = useLocation();
    const navigate = useNavigate();

    const [appdetail, setAppdetail] = useState(null);
    const [steps, setSteps] = useState(null);
    const [error, setError] = useState(null);
    const [fetching, setFetching] = useState(false);
    const [loading, setLoading] = useState(false);
    const [lga, setLga] = useState(null);
    const id = loctn?.state?.appid;
    const currentStep = loctn?.state?.currentStep;
    const serviceName = appdetail !== null && appdetail?.data?.eservice?.name;

    console.log(steps);
    console.log(appdetail);
    console.log(lga);

    if(error !== null && error?.message === 'Token has expired'){
        logout();
    }

    useEffect(() => {
        getApplicationByID( token, id, setAppdetail, setSteps, setError, setFetching )
    }, [])

    useEffect(() => {
        appdetail !== null && getLagById(token, appdetail?.data?.local_government_id, setLga)
    }, [appdetail])

    useEffect(() => {
        setTimeout(() => setLoading(false), 1000);
      }, [record])

    return (
        <div className='w-full'>
            <div className='w-full my-2'>
                <div 
                    className='bg-[#cce2d6] mt-4 rounded-full p-1 w-max cursor-pointer'
                    onClick={() => navigate('/application')}
                >
                    <GrFormPreviousLink size={30} />
                </div>
            </div>
            {steps !== null && <div className='w-full rounded-md bg-[#d7e88f] px-6 py-4 mt-6 mb-2 md:max-w-max text-gray-700'>
                <div className='my-1 flex space-x-2'>
                    <span className='font-bold'>LGA :</span>
                    <span>{lga !== null && lga?.name}</span>
                </div>
                <div className='my-1 flex space-x-2'>
                    <span className='font-bold'>Application :</span>
                    <span>{serviceName}</span>
                </div>
            </div>}
            <div className='w-full py-4'>
                {
                    (steps !== null && steps.length > 0) ? 
                        <AppStepsTab 
                            steps={steps} 
                            fetching={fetching} 
                            current_step={appdetail?.data?.current_step} 
                            serviceName={serviceName} 
                            currentStep={currentStep} 
                            steps_completed={appdetail?.steps_completed} 
                            purpose_id={id}
                            admin_notes={appdetail?.data?.admin_notes}
                            authorizations={appdetail?.data?.authorizations}
                            app_lga_id={appdetail?.data?.local_government_id}
                        />
                        : <InitLoader />
                }
            </div>
        </div>
    )
}

export default ApplicationDetail
