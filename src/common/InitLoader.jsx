import React from 'react'

const InitLoader = () => {
    return (
        <div className="w-full flex justify-center bg-transparent">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-green-950 border-t-transparent mt-24"></div>
        </div>
    )
}

export default InitLoader
