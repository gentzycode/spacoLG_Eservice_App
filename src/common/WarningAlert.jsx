import React from 'react'
import { Link } from 'react-router-dom'

const WarningAlert = ({error, handleChildUpdate}) => {
    return (
        <div>
            <span id="badge-dismiss-yellow" className="inline-flex items-center p-2 me-2 text-sm font-medium text-yellow-800 bg-yellow-100 rounded dark:bg-yellow-900 dark:text-yellow-300 my-2 space-x-2">
                <span className='cursor-pointer' onClick={() => handleChildUpdate('login')}>{error}! If you signed up with the email, please click here to login</span>
                <button type="button" className="inline-flex items-center p-1 ms-2 text-yellow-600 bg-transparent rounded-sm hover:bg-yellow-200 hover:text-yellow-900 dark:hover:bg-yellow-800 dark:hover:text-yellow-300" data-dismiss-target="#badge-dismiss-yellow" aria-label="Remove">
                <svg className="w-2 h-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                </svg>
                <span className="sr-only">Remove badge</span>
                </button>
            </span>
        </div>
    )
}

export default WarningAlert
