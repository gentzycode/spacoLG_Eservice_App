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

    useEffect(() => {
        hasPersonalInfo(token, setHasInfo, setError, setChecking);
    }, [])

    return (
        <div className="w-full">
            {error !==  null && <span className='text text-red-600'></span>}
            {hasInfo === null && checking ? <InitLoader /> :
                hasInfo?.hasPersonalInformation ? 
                    (serviceObject !== null ? <NewServiceApplication serviceObject={serviceObject} /> : <Applications />)
                    :
                    <ProfileUpdate />
            }
        </div>
    )
}

export default Application
