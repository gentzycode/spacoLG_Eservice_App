import React, { useEffect, useState } from 'react'
import ProgressBar from '@ramonak/react-progress-bar';

const ProgressBarComponent = () => {

    const [counter, setCounter] = useState(0);
    //let progress = `${counter}%`;

    const updateCounter = () => {
        setCounter(counter => counter + 5);
    }

    useEffect(() => {
        counter < 100 && setTimeout(() => updateCounter(), 100);
    }, [counter])

    return (
        <div className='w-full px-4 mt-20'>
            <ProgressBar completed={counter} bgColor='green' animateOnRender={true} />
        </div>
    )
}

export default ProgressBarComponent
