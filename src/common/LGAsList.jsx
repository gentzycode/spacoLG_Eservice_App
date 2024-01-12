import React, { useEffect, useMemo, useState } from 'react'
import { getLGAs } from '../apis/noAuthActions';
import { Autocomplete, TextField } from '@mui/material';

const LGAsList = ({ setLocalgovernments_id }) => {

    const [lgas, setLgas] = useState(null);
    const [error, setError] = useState(null);

    const optionsData = useMemo(() => {
        let computedOptions = [];

        if(lgas !== null){
            lgas.map(lga => {
                computedOptions.push({
                    id: lga?.id,
                    label: lga?.name
                })
            } )
        }

        return computedOptions
    }, [Date.now()])

    const alertSelected = (e, v) => {
        setLocalgovernments_id(v?.id);
    }

    useEffect(() => {
        getLGAs(setLgas , setError);
    }, [])
    return (
        
        lgas !== null &&
        <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={optionsData}
            onChange={(e,v) => alertSelected(e, v)}
            className='w-full text-gray-500'
            renderInput={(params) => <TextField {...params} label="Select LGA" className='rounded-md' />}
        />
        
    )
}

export default LGAsList
