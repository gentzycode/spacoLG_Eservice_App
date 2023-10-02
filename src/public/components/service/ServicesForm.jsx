import React, { Fragment } from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { Combobox } from '@headlessui/react';
import { Link, useLocation } from 'react-router-dom';
import { MdOutlineNavigateNext } from 'react-icons/md';
import { getActiveservices, getLGAs } from '../../../apis/noAuthActions';
import ServiceLoader from '../../../common/ServiceLoader'
import { GrFormPreviousLink } from 'react-icons/gr';
import { useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';

const ServicesForm = () => {

    const lcn = useLocation();
    const { updateServiceObject } = useContext(AuthContext);

    const [lgas, setLgas] = useState(null);
    const[activeservices, setActiveservices] = useState(null);
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);
    //const [lgaeservices, setLgaeservices] = useState(null);

    const [query, setQuery] = useState('')

    const filteredLgas =
        query === ''
        ? lgas
        : lgas.filter((lga) => {
            return lga?.name.toLowerCase().includes(query.toLowerCase())
            })

    const handleChange = (event) => {
        if(event === "0"){
            setActiveservices(null);
            setError('You must select a Local Government Area!')
        }
        else{
            setError(null);
            getActiveservices(event, setActiveservices, setLoading);
        }        
    };

    const goToAuthServicePage = (sObj) => {
        localStorage.setItem('selectedService', JSON.stringify(sObj));
        location.reload();
    }

    useEffect(() => {
        getLGAs(setLgas, setError);
    }, [])

    return (
        <div className={`${lcn.pathname === '/application' ? 'w-full' : 'w-4/5'}`}>
            {lcn.pathname === '/services' &&
                <div className='mt-2'>
                    <Link to='/' className='mt-4'>
                        <GrFormPreviousLink size={30} />
                    </Link>
                </div>
            }
            <h1 className='mt-4 text-xl md:text-2xl font-extralight'>
                Select Local Government Area for the request
            </h1>
            <Combobox value={lgas} onChange={(event) => handleChange(event)}>
                <Combobox.Input 
                    onChange={(event) => setQuery(event.target.value)}
                    className={`w-full ${lcn.pathname === '/application' && 'md:w-2/5'} p-3 bg-transparent border-b border-gray-400 my-6 text-gray-600`}
                    placeholder='Local Government Area'
                />
                <Combobox.Options 
                    className='w-[93%] md:w-[32.5%] fixed z-10 mt-[-20px] bg-white border border-gray-200 px-4 rounded-b-md'
                >
                    {(lgas !== null && lgas !== undefined) && filteredLgas.map((lga) => (
                        <Combobox.Option key={lga.id} value={lga.id} className='cursor-pointer text-gray-700 py-3 border-b border-gray-100'>
                            {lga.name}
                        </Combobox.Option>
                    ))}
                </Combobox.Options>
            </Combobox>
            {error && <div className='text-red-500 my-3'>{error}</div>}
            <div className={`w-full justify-center md:flex md:justify-between md:flex-wrap`}>
                {
                    loading ? <ServiceLoader /> : 
                        (activeservices !== null && activeservices.length > 0) &&  activeservices.map(lgaActServ => {
                                return <Fragment>
                                    {
                                        localStorage.getItem('isLoggedIn') ? 
                                            <div 
                                                key={lgaActServ.id}
                                                className='w-full md:w-[32%] rounded-md border-gray-200 text-gray-500 my-3 shadow-lg bg-white cursor-pointer'
                                                onClick={() => goToAuthServicePage(lgaActServ)}
                                            > 
                                                <div className='flex justify-between items-center h-[100px] p-4'>
                                                    {lgaActServ.eservice.name}
                                                    <MdOutlineNavigateNext size={20} className='mt-1' />    
                                                </div>
                                            </div>
                                            : 
                                            <Link 
                                                to ='/service' 
                                                key={lgaActServ.id} 
                                                state={{ serviceObject : lgaActServ }} 
                                                className={`w-full md:w-[48%] rounded-md border-gray-200 text-gray-500 my-3 shadow-lg bg-white`}
                                            >   
                                                <div className='flex justify-between items-center h-[100px] p-4'>
                                                    {lgaActServ.eservice.name}
                                                    <MdOutlineNavigateNext size={20} className='mt-1' />    
                                                </div>
                                            </Link>
                                    }
                                </Fragment>
                            }
                        )
                }
            </div>
            {!loading && <div className={`${activeservices !== null ? 'hidden' : 'block'} w-full border border-yellow-300 bg-yellow-50 rounded-md p-4 font-medium text-gray-600 my-3`}>
                <p>To request for any service, you must select a Local Government Area to which you want to make the request. Above is a list of Local Government Areas in the state. Select any to proceed with your request</p>
            </div>}
        </div>
    )
}

export default ServicesForm
