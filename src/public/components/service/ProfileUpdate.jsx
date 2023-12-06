import React, { useContext, useEffect, useMemo, useState } from 'react'
import { HiUser } from 'react-icons/hi'
import ButtonLoader from '../../../common/ButtonLoader';
import { AuthContext } from '../../../context/AuthContext';
import { getCities, getLGAs, updateProfile } from '../../../apis/noAuthActions';
import { Combobox } from '@headlessui/react';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../../apis/functions';
import Loader from '../../../common/Loader';

const ProfileUpdate = () => {

    const { token, user, logout, updateUser } = useContext(AuthContext);
    console.log(token);
    //alert('I am in profile update');
    console.log(user);

    const navigate = useNavigate();

    const [first_name, setFirst_name] = useState();
    const [last_name, setLast_name] = useState();
    const [gender, setGender] = useState();
    const [date_of_birth, setDate_of_birth] = useState();
    const [address, setAddress] = useState();
    const [city_id, setCity_id] = useState(null);
    const [localgovernments_id, setLocalgovernments_id] = useState(null);

    const [updating, setUpdating] = useState(false);
    const[error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [lgas, setLgas] = useState(null);
    const [lgaselected, setLgaselected] = useState('');
    const [cityselected, setCityselected] = useState('');
    const [cities, setCities] = useState(null);

    const [lgasquery, setLgasquery] = useState('')
    const [citiesquery, setCitiesquery] = useState('')
    const [loading, setLoading] = useState(false);

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

        if(city_id === null || localgovernments_id === null){
            alert('Local Government Area and City must be selected!');
        }
        else{
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
        
    }

    if(success !== null){
        console.log(success?.user);
        updateUser(success?.user)
        alert('You have successfully updated your personal information');
        //navigate('/dashboard')
        location.reload();
    }

    useEffect(() => {
        getLGAs(setLgas , setError)
    }, [])

    useEffect(() => {
        getCities(setCities, setError)
    }, [])

    return (
        <div className="w-full md:px-8 md:mt-12">
            <div className="w-full flex justify-start items-center space-x-2 text-gray-700 font-semibold py-6 border-gray-300">
                <h1 className='text-2xl md:text-2xl'>Update your profile</h1>
            </div>
            {/**<div className='w-full grid grid-cols-2'>
                <div className='col-span-1 p-1 bg-green-500'></div>
                <div className='col-span-1 p-1 bg-gray-300'></div>
        	</div>*/}

            { error !== null && <span className='text-red-500 my-2'>{error?.message}</span>}

            <form onSubmit={handleUpdate} className='w-full md:flex md:flex-wrap md:justify-between my-4 bg-white rounded-md p-8'>
                <div className='w-full md:w-[31%] my-4'>
                    <div className='text-gray-500 font-semibold mb-1.5'>First name</div>
                    <input 
                        type='text' 
                        className='w-full p-3 rounded-md border border-gray-400 bg-transparent'
                        onChange={(e) => setFirst_name(e.target.value)}
                        required
                    />
                </div>
                
                <div className='w-full md:w-[31%] my-4'>
                    <div className='text-gray-500 font-semibold mb-1.5'>Last name</div>
                    <input 
                        type='text' 
                        className='w-full p-3 rounded-md border border-gray-400 bg-transparent'
                        onChange={(e) => setLast_name(e.target.value)}
                        required
                    />
                </div>
                
                <div className='w-full md:w-[31%] my-4'>
                    <div className='text-gray-500 font-semibold mb-1.5'>Gender</div>
                    <select 
                        className='w-full px-3 py-3.5 rounded-md border border-gray-400 bg-transparent'
                        onChange={(e) => setGender(e.target.value)}
                        required
                    >
                        <option value=""></option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </div>

                <div className='w-full md:w-[31%] my-4'>
                    <div className='text-gray-500 font-semibold mb-1.5'>Date of Birth</div>
                    <input 
                        type='date' 
                        className='w-full p-3 rounded-md border border-gray-400 bg-transparent'
                        placeholder='Date of birth'
                        onChange={(e) => setDate_of_birth(e.target.value)}
                        required
                    />
                </div>
                
                <div className='w-full md:w-[31%] my-4'>
                    <div className='text-gray-500 font-semibold mb-1.5'>Address</div>
                    <input 
                        type='text' 
                        className='w-full p-3 rounded-md border border-gray-400 bg-transparent'
                        onChange={(e) => setAddress(e.target.value)}
                        required
                    />
                </div>
                
                <div className='w-full md:w-[31%] my-4'>
                    <div className='w-full'>
                        <div className='text-gray-500 font-semibold mb-1.5'>Local Government Area</div>
                        <Combobox value={lgas} onChange={(event) => handleLgasChange(event)}>
                            <Combobox.Input 
                                onChange={(event) => setLgasquery(event.target.value)}
                                className='w-full p-3 bg-transparent rounded-md border border-gray-400 text-gray-600' 
                                placeholder={lgaselected !== '' && lgaselected}
                            />
                            <Combobox.Options className='w-full md:w-[22.5%] md:fixed z-10 bg-white border border-gray-200 px-4 rounded-b-md'>
                                {lgas !== null && filteredLgas.map((lga) => (
                                    <Combobox.Option key={lga.id} value={lga.id} className='cursor-pointer text-gray-700 py-3 rounded-md border border-gray-100'>
                                        {lga.name}
                                    </Combobox.Option>
                                ))}
                            </Combobox.Options>
                        </Combobox>
                    </div>
                </div>
                
                <div className='w-full md:w-[31%] my-4'>
                    <div className='w-full'>
                        <div className='text-gray-500 font-semibold mb-1.5'>City</div>
                        <Combobox value={cities} onChange={(event) => handleCitiesChange(event)}>
                            <Combobox.Input 
                                onChange={(event) => setCitiesquery(event.target.value)}
                                className='w-full p-3 bg-transparent rounded-md border border-gray-400 text-gray-600' 
                                placeholder={cityselected !== '' && cityselected}
                            />
                            <Combobox.Options className='w-full md:w-[22.5%] md:fixed z-10 bg-white border border-gray-200 px-4 rounded-b-md'>
                                {cities !== null && filteredCities.map((cty) => (
                                    <Combobox.Option key={cty.id} value={cty.id} className='cursor-pointer text-gray-700 py-3 border-b border-gray-100'>
                                        {cty.name}
                                    </Combobox.Option>
                                ))}
                            </Combobox.Options>
                        </Combobox>
                    </div>
                </div>
                

                <div className='w-full flex justify-end'>
                    {updating ? 
                        <button className='w-[200px] flex justify-center p-3 rounded-md bg-[#0d544c] hover:bg-green-700 text-white'>
                            <ButtonLoader />
                        </button> : 
                        <button className='w-[200px] p-4 rounded-md bg-[#0d544c] hover:bg-green-700 text-white'>
                            Submit
                        </button>
                    }
                </div>
                
            </form>
        </div>
    )
}

export default ProfileUpdate
