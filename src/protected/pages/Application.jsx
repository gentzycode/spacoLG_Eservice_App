import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import Applications from '../components/application/Applications'
import ProfileUpdate from '../../public/components/service/ProfileUpdate'
import NewServiceApplication from '../components/application/NewServiceApplication'
import { hasPersonalInfo } from '../../apis/authActions'
import ProgressBarComponent from '../../common/ProgressBarComponent'

const Application = () => {

    const { token, serviceObject } = useContext(AuthContext);

    const [hasInfo, setHasInfo] = useState(null);
    const [error, setError] = useState(null);
    const [checking, setChecking] = useState(false);
    const [showalert, setShowalert] = useState(false);

    const alertdiv = <div className='flex items-center mt-16 p-4 rounded-md bg-orange-50 border border-orange-500 space-x-4'>
                        <span className='text-orange-600'>You might be having issues with your internet connection</span>
                        <span className='border border-gray-300 bg-white rounded-full px-3 py-1 text-sm cursor-pointer' onClick={() => reloadPage()}>Click here to retry</span>
                    </div>;

    console.log(hasInfo);

    const reloadPage = () => {
        window.location.reload();
    }

    const displayAlert = () => {
        setTimeout(() => setShowalert(true), 2000);
        return showalert ? alertdiv : <ProgressBarComponent />;
    }

    useEffect(() => {
        hasPersonalInfo(token, setHasInfo, setError, setChecking);
    }, [])

    return (
        <div className="w-full">
            {error !==  null && <span className='text text-red-600'></span>}
            {hasInfo !== null ?
                (hasInfo?.hasPersonalInformation ? 
                    (serviceObject !== null ? <NewServiceApplication serviceObject={serviceObject} /> : <Applications />)
                    :
                    <ProfileUpdate />) : displayAlert()
            }
        </div>
    )
}

export default Application
