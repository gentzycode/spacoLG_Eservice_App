import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import RequestForm from '../components/application/RequestForm'
import Applications from '../components/application/Applications'
import ProfileUpdate from '../../public/components/service/ProfileUpdate'
import { useLocation } from 'react-router-dom'

const Application = () => {

    const { user, serviceObject } = useContext(AuthContext);
    const location = useLocation();

    const [userObj, setUserObj] = useState(null);
    //const currServiceObject = location?.state ? location?.state?.serveObj : serviceObject;

    //console.log(user, currServiceObject);
    useEffect(() => {
        setUserObj(user)
    }, [])

    return (
        <div className="w-full">
            {userObj !== null && userObj?.has_personal_info ? 
                (serviceObject !== null ? <RequestForm serviceObject={serviceObject} /> : <Applications />)
                :
                <ProfileUpdate />
            }
        </div>
    )
}

export default Application
