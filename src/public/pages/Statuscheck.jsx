import React from 'react'
import AuthBanner from '../../common/AuthBanner'
import PublicLinks from '../../common/PublicLinks'
import StatusCheckComponent from '../components/status-check/StatusCheckComponent'

const Statuscheck = () => {

    return (
        <div>
            <PublicLinks />
            <div className="w-full md:h-screen grid md:grid-cols-2 px-0 m-0">
                <AuthBanner />
                <StatusCheckComponent />
            </div>
        </div>
        
    )
}

export default Statuscheck