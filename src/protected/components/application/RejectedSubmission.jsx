import React from 'react'

const RejectedSubmission = ({ submission }) => {
    return (
        <div className='grid md:grid-cols-4'>
            {Object.keys(JSON.parse(submission)).map((key, i) => (
                key !== 'user_id'&& <div key={i} className="col-span-1 py-2 border-b border-gray-100 text-gray-500">
                    <p className='w-full text-xs capitalize py-1'>{key.replace('_', ' ').replace('_', ' ')}</p>
                    <p className='w-full text-gray-700'>{JSON.parse(submission)[key] === 'on' ? 'Yes' : JSON.parse(submission)[key]}</p>
                </div>
            ))}
        </div>
    )
}

export default RejectedSubmission
