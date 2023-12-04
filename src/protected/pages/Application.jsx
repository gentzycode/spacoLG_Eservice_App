import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import RequestForm from '../components/application/RequestForm'
import Applications from '../components/application/Applications'
import ProfileUpdate from '../../public/components/service/ProfileUpdate'
import { useLocation } from 'react-router-dom'
import NewServiceApplication from '../components/application/NewServiceApplication'
import { hasPersonalInfo } from '../../apis/authActions'
import InitLoader from '../../common/InitLoader'

const Application = () => {

    const { token, serviceObject } = useContext(AuthContext);

    const [hasInfo, setHasInfo] = useState(null);
    const [error, setError] = useState(null);
    const [checking, setChecking] = useState(false);

    console.log(hasInfo);

    const reloadPage = () => {
        window.location.reload();
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
                    <ProfileUpdate />) : <div className='flex items-center mt-16 p-4 rounded-md bg-orange-50 border border-orange-500 space-x-4'>
                        <span className='text-orange-600'>Personal Information not added yet</span>
                        <span className='border border-gray-300 bg-white rounded-full px-3 py-1 text-sm cursor-pointer' onClick={() => reloadPage()}>Click here to add</span>
                    </div>
            }
        </div>
    )
}

export default Application
