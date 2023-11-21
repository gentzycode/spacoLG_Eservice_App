import React, { useEffect, useState } from 'react'
import { fetchDropdownOptions } from '../apis/authActions';

const OptionsList = ({ source }) => {

    const [options, setOptions] = useState(null);

    useEffect(() => {
        fetchDropdownOptions(source, setOptions)
    }, [])

    return (
        options !== null && options.map(opt => {
            return <option key={opt?.id} value={opt?.name}>{opt?.name}</option>
        })
    )
}

export default OptionsList
