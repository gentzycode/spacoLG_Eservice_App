import React from 'react'
import { formatDate } from '../../../apis/functions'

const Authorizations = ({ authorizations, flag, authorizers }) => {

    const getAuthorizerName = (id, authorizersArr) => {
        console.log(id);
        console.log(authorizersArr);

        let authname = '';
        authorizersArr.map(autharr => {
            if(autharr?.id === id){
                authname = autharr?.user?.username
            }
            //authname = parseInt(autharr?.id) === id ? autharr?.user?.username : 'No name'
        })

        return authname;
    }

    return (
        <div className='w-full my-4 space-y-2'>
        {
            authorizations.length > 0 ? (authorizations.map(auth => {
                return <div key={auth?.id} className='text-green-600'>
                    {auth?.status} by <span className='font-bold'>{getAuthorizerName(auth?.authorizer_id, authorizers)}</span> on {formatDate(auth?.updated_at)}
                </div>
            })) : <div className='text-orange-600'>No authorization action yet</div>
        }
        {  (authorizations.length > 0 && flag === 'P_CERT') && <span className='italic text-gray-400 text-sm'>Awaiting other authorizers...</span>}
        </div>
    )
}

export default Authorizations
