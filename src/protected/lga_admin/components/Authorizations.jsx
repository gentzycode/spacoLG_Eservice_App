import React from 'react'
import { formatDate } from '../../../apis/functions'

const Authorizations = ({ authorizations }) => {
    return (
        <div className='w-full my-4 space-y-2'>
        {
            authorizations.length > 0 ? (authorizations.map(auth => {
                return <div key={auth?.id} className='text-green-600'>
                    {auth?.status} by <span className='font-bold'>{auth?.authorizer_id}</span> on {formatDate(auth?.updated_at)}
                </div>
            })) : <div className='text-orange-600'>No authorization action yet</div>
        }
        {  authorizations.length > 0 && <span className='italic text-gray-400 text-sm'>Awaiting other authorizers...</span>}
        </div>
    )
}

export default Authorizations
