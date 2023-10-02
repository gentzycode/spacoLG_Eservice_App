import React, { useContext, useEffect, useMemo, useState } from 'react'
import { HiUser } from 'react-icons/hi'
import ButtonLoader from '../../../common/ButtonLoader';
import { AuthContext } from '../../../context/AuthContext';
import { getCities, getLGAs, updateProfile } from '../../../apis/noAuthActions';
import { Combobox } from '@headlessui/react';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../../apis/functions';

const ProfileUpdate = () => {

    const { token, user } = useContext(AuthContext);

    const navigate = useNavigate();

    const [first_name, setFirst_name] = useState();
    const [last_name, setLast_name] = useState();
    const [gender, setGender] = useState();
    const [date_of_birth, setDate_of_birth] = useState();
    const [address, setAddress] = useState();
    const [city_id, setCity_id] = useState();
    const [localgovernments_id, setLocalgovernments_id] = useState();

    const [updating, setUpdating] = useState(false);
    const[error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [lgas, setLgas] = useState(null);
    const [lgaselected, setLgaselected] = useState('');
    const [cityselected, setCityselected] = useState('');
    const [cities, setCities] = useState(null);

    const [lgasquery, setLgasquery] = useState('')
    const [citiesquery, setCitiesquery] = useState('')

    //const [query, setQuery] = useState('')

    const filteredLgas =
        lgasquery === ''
        ? lgas
        : lgas.filter((lga) => {
            return lga?.name.toLowerCase().includes(lgasquery.toLowerCase())
            })

    const filteredCities =
        citiesquery === ''
        ? cities
        : cities.filter((cty) => {
            return cty?.name.toLowerCase().includes(citiesquery.toLowerCase())
            })

    
    const handleLgasChange = (event) => {
        setLocalgovernments_id(event)   
        let selected;
        selected = lgas.filter(lga => lga.id === event);
        setLgaselected(selected[0].name)    
    };


    const handleCitiesChange = (event) => {
        setCity_id(event)   
        let selected;
        selected = cities.filter(city => city.id === event);
        setCityselected(selected[0].name)    
    };

    const handleUpdate = (e) => {
        e.preventDefault();

        const data = {
            user_id: user?.id,
            first_name,
            last_name,
            gender,
            date_of_birth : formatDate(date_of_birth),
            address,
            city_id,
            localgovernments_id
        }

        console.log(data)

        updateProfile(token, data, setSuccess, setError, setUpdating);
    }

    if(success !== null){
        navigate('/dashboard')
    }

    useEffect(() => {
        getLGAs(setLgas , setError)
    }, [])

    useEffect(() => {
        getCities(setCities, setError)
    }, [])

    return (
        <div className="w-full">
            <div className="w-full flex justify-start items-center space-x-2 text-gray-700 font-extralight py-6 border-gray-300">
                <HiUser size={25} />
                <h1 className='text-2xl md:text-2xl'>Update your profile</h1>
            </div>
            <div className='w-full grid grid-cols-2'>
                <div className='col-span-1 p-1 bg-green-500'></div>
                <div className='col-span-1 p-1 bg-gray-300'></div>
            </div>

            { error !== null && <span className='text-red-500 my-2'>{error?.message}</span>}

            <form onSubmit={handleUpdate} className='w-full my-6 space-y-8'>
                <div className='w-full grid md:flex md:justify-between space-y-6 md:space-y-0'>
                    <input 
                        type='text' 
                        className='w-full md:w-[47%] p-3 border-b border-gray-400 bg-transparent'
                        placeholder='First name'
                        onChange={(e) => setFirst_name(e.target.value)}
                        required
                    />
                    <input 
                        type='text' 
                        className='w-full md:w-[47%] p-3 border-b border-gray-400 bg-transparent'
                        placeholder='Last name'
                        onChange={(e) => setLast_name(e.target.value)}
                        required
                    />
                </div>

                <div className='w-full grid md:flex md:justify-between space-y-6 md:space-y-0'>
                    <select 
                        className='w-full md:w-[47%] p-3 border-b border-gray-400 bg-transparent'
                        onChange={(e) => setGender(e.target.value)}
                        required
                    >
                        <option value="">Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                    <input 
                        type='date' 
                        className='w-full md:w-[47%] p-3 border-b border-gray-400 bg-transparent'
                        placeholder='Date of birth'
                        onChange={(e) => setDate_of_birth(e.target.value)}
                        required
                    />
                </div>

                <input 
                    type='text' 
                    className='w-full p-3 border-b border-gray-400 bg-transparent'
                    placeholder='Address'
                    onChange={(e) => setAddress(e.target.value)}
                    required
                />
                
                <div className='w-full grid md:flex md:justify-between space-y-6 md:space-y-0'>
                    {/**<div className='w-full md:w-[47%]'>
                        <input 
                            type='text' 
                            className='w-full p-3 border-b border-gray-400 bg-transparent'
                            placeholder='Search and select cities'
                            onChange={(e) => setCitiesquery(e.target.value)}
                            required
                        />
                        {
                            citiesquery !== "" && <div className='w-[93%] md:w-[16%] mt-[-60%] md:mt-0 fixed z-10 border border-x border-b border-gray-200 rounded-b-md px-3 bg-white'>
                            {
                                    (citieData !== null && citieData !== undefined) && citieData.map((filtered) => {
                                        return <div key={filtered?.id} className='w-full py-2 border-b border-gray-100'>
                                            {filtered?.name}
                                        </div>
                                    })
                                }
                            </div>
                        }
                        
                    </div>*/}
                    <div className='w-full md:w-[47%]'>
                        <Combobox value={lgas} onChange={(event) => handleLgasChange(event)}>
                            <Combobox.Input 
                                onChange={(event) => setLgasquery(event.target.value)}
                                className='w-full p-3 bg-transparent border-b border-gray-400 text-gray-600' 
                                placeholder={lgaselected !== '' ? lgaselected : 'Local Government Area'}
                            />
                            <Combobox.Options className='w-full md:w-[16%] md:fixed z-10 bg-white border border-gray-200 px-4 rounded-b-md'>
                                {lgas !== null && filteredLgas.map((lga) => (
                                    <Combobox.Option key={lga.id} value={lga.id} className='cursor-pointer text-gray-700 py-3 border-b border-gray-100'>
                                        {lga.name}
                                    </Combobox.Option>
                                ))}
                            </Combobox.Options>
                        </Combobox>
                    </div>
                    
                    <div className='w-full md:w-[47%]'>
                        <Combobox value={cities} onChange={(event) => handleCitiesChange(event)}>
                            <Combobox.Input 
                                onChange={(event) => setCitiesquery(event.target.value)}
                                className='w-full p-3 bg-transparent border-b border-gray-400 text-gray-600' 
                                placeholder={cityselected !== '' ? cityselected : 'City'}
                            />
                            <Combobox.Options className='w-full md:w-[16%] md:fixed z-10 bg-white border border-gray-200 px-4 rounded-b-md'>
                                {cities !== null && filteredCities.map((cty) => (
                                    <Combobox.Option key={cty.id} value={cty.id} className='cursor-pointer text-gray-700 py-3 border-b border-gray-100'>
                                        {cty.name}
                                    </Combobox.Option>
                                ))}
                            </Combobox.Options>
                        </Combobox>
                    </div>
                </div>

                <div className=''>
                    {updating ? 
                        <button className='w-full flex justify-center p-3 mt-16 rounded-2xl bg-[#0d544c] hover:bg-green-700 text-white'>
                            <ButtonLoader />
                        </button> : 
                        <button className='w-full p-3 mt-8 rounded-2xl bg-[#0d544c] hover:bg-green-700 text-white'>
                            Update
                        </button>
                    }
                </div>
                
            </form>
        </div>
    )
}

export default ProfileUpdate
