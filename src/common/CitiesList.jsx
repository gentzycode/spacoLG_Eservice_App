import React, { useEffect, useMemo, useState } from 'react'
import { getCities } from '../apis/noAuthActions';
import { Autocomplete, TextField } from '@mui/material';

const CitiesList = ({ setCity_id }) => {

    const [cities, setCities] = useState(null);
    const [error, setError] = useState(null);

    const optionsData = useMemo(() => {
        let computedOptions = [];

        if(cities !== null){
            cities.map(city => {
                computedOptions.push({
                    id: city?.id,
                    label: city?.name
                })
            } )
        }

        return computedOptions
    }, [Date.now()])

    const alertSelected = (e, v) => {
        setCity_id(v?.id);
    }

    useEffect(() => {
        getCities(setCities, setError);
    }, [])

    return (
        cities !== null &&
        <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={optionsData}
            onChange={(e,v) => alertSelected(e, v)}
            className='w-full text-gray-500'
            renderInput={(params) => <TextField {...params} label="Select City" className='rounded-md' />}
        />
    )
}

export default CitiesList
