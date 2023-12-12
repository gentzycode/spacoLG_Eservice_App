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
import { RiErrorWarningLine } from 'react-icons/ri';

const ServicesForm = ({ toggleShowform }) => {
    
    //alert('I am in service form');

    const lcn = useLocation();
    const { updateServiceObject } = useContext(AuthContext);

    const [lgas, setLgas] = useState(null);
    const[activeservices, setActiveservices] = useState(null);
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);
    //const [lgaeservices, setLgaeservices] = useState(null);

    const [query, setQuery] = useState('')

    const filteredLgas =
        lgas !== null &&
        (query === ''
        ? lgas
        : lgas.filter((lga) => {
            return lga?.name.toLowerCase().includes(query.toLowerCase())
            }))

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
            {lcn.pathname === '/services' ?
                <div className='mt-2'>
                    <Link to='/' className='mt-4'>
                        <div className='bg-gray-100 rounded-full p-1 w-max'><GrFormPreviousLink size={30} /></div>
                    </Link>
                </div> : 
                <div className='mt-2'>
                    <div className='bg-[#cce2d6] mt-4 rounded-full p-1 w-max cursor-pointer' onClick={() => toggleShowform()}><GrFormPreviousLink size={30} /></div>
                </div>
            }
            <h1 className='mt-10 text-xl md:text-2xl font-semibold text-gray-700'>
                {
                    lcn.pathname === '/services' ? 'Local Government Area' : 'What kind of application are you making?'
                }
                
            </h1>
            <Combobox value={lgas} onChange={(event) => handleChange(event)}>
                <Combobox.Input 
                    onChange={(event) => setQuery(event.target.value)}
                    className={`w-full ${lcn.pathname === '/application' && 'md:w-[50%]'} p-3 bg-white border border-gray-400 my-6 text-gray-600 rounded-md`}
                    placeholder='Local Government Area'
                />
                <Combobox.Options 
                    className={`w-[93%] ${localStorage.getItem('isLoggedIn') ? 'md:w-[40%]' : 'md:w-[40%]'} fixed z-10 mt-[-20px] bg-white border border-gray-200 px-0 rounded-b-md`}
                >
                    {(lgas !== null && filteredLgas !== undefined) && filteredLgas.map((lga) => (
                        <Combobox.Option key={lga.id} value={lga.id} className='cursor-pointer hover:bg-[#e3ebe2] text-gray-700 p-3 border-b border-gray-100'>
                            {lga.name}
                        </Combobox.Option>
                    ))}
                </Combobox.Options>
            </Combobox>
            {error && <div className='text-red-500 my-3'>{error?.message}</div>}
            <div className={`w-full ${lcn.pathname === '/application' && 'md:w-[50%]'} justify-center md:flex md:justify-between md:flex-wrap`}>
                {
                    loading ? <ServiceLoader /> : 
                        (activeservices !== null && activeservices.length > 0) &&  activeservices.map(lgaActServ => {
                                return <Fragment key={lgaActServ.id}>
                                    {
                                        localStorage.getItem('isLoggedIn') ? 
                                            <div 
                                                className='w-full md:w-[48%] cursor-pointer md:pb-6'
                                                onClick={() => goToAuthServicePage(lgaActServ)}
                                            > 
                                                <div className='flex bg-white items-center rounded-md my-3 md:my-0 h-[100px] px-6 py-4 font-semibold text-gray-700'>
                                                    {lgaActServ.eservice.name}  
                                                </div>
                                            </div>
                                            : 
                                            <Link 
                                                to ='/service' 
                                                key={lgaActServ.id} 
                                                state={{ serviceObject : lgaActServ }} 
                                                className='w-full md:w-[48%] text-gray-700 my-3'
                                            >   
                                                <div className='flex md:justify-center bg-[#e3ebe2] items-center rounded-md my-3 md:my-0 h-[100px] p-4'>
                                                    {lgaActServ.eservice.name}   
                                                </div>
                                            </Link>
                                    }
                                </Fragment>
                            }
                        )
                }
            </div>
            {!loading && <div className={`${activeservices !== null ? 'hidden' : 'md:flex'} w-full md:w-[2/5] border border-orange-300 bg-orange-50 rounded-md p-4 font-medium text-gray-600 my-3`}>
                <div className='flex md:justify-center items-center pl-1 pr-5'>
                    <div className="bg-orange-100 p-2 rounded-full"><RiErrorWarningLine size={25} className='text-orange-300' /></div>
                </div>
                <div>
                    <p className='text-gray-600 font-semibold'>NOTE:</p>
                    <p>To request for any service, you must select a Local Government Area to which you want to make the request. Above is a list of Local Government Areas in the state. Select any to divroceed with your request</p>
                </div>
            </div>}
        </div>
    )
}

export default ServicesForm
