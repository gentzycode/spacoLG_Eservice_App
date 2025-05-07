import React, { Fragment, useState, useEffect, useContext } from 'react';
import { Combobox } from '@headlessui/react';
import { Link, useLocation } from 'react-router-dom';
import { getActiveservices, getLGAs } from '../../../apis/noAuthActions';
import ServiceLoader from '../../../common/ServiceLoader';
import { GrFormPreviousLink } from 'react-icons/gr';
import { AuthContext } from '../../../context/AuthContext';

const ServicesForm = ({ toggleShowform }) => {
    const location = useLocation();
    const { updateServiceObject } = useContext(AuthContext);

    const [lgas, setLgas] = useState(null);
    const [activeservices, setActiveservices] = useState(null);
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState('');
    const [noServicesMessage, setNoServicesMessage] = useState('');

    const filteredLgas = lgas !== null && (query === '' ? lgas : lgas.filter(lga => lga?.name.toLowerCase().includes(query.toLowerCase())));

    useEffect(() => {
        getLGAs(setLgas, setError);
    }, []);

    const handleChange = (event) => {
        if (event === "0") {
            setActiveservices(null);
            setError('You must select a Local Government Area!');
        } else {
            setError(null);
            getActiveservices(event, setActiveservices, setLoading, setNoServicesMessage);
        }
    };

    const goToAuthServicePage = (sObj) => {
        localStorage.setItem('selectedService', JSON.stringify(sObj));
        window.location.reload();
    };

    return (
        <div className={`${location.pathname === '/application' ? 'w-full' : 'w-4/5'} bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mt-6 animate-fadeIn`}>
            {location.pathname === '/services' ?
                <Link to="/" className="mt-4 group">
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-2 w-max shadow-md group-hover:shadow-lg transition-all">
                        <GrFormPreviousLink size={30} className="text-[#3B78BD] dark:text-[#F0B652]" />
                    </div>
                </Link> :
                <div className="mt-2">
                    <div className="bg-[#cce2d6] dark:bg-gray-700 rounded-full p-2 w-max cursor-pointer" onClick={() => toggleShowform()}>
                        <GrFormPreviousLink size={30} className="text-[#3B78BD] dark:text-[#F0B652]" />
                    </div>
                </div>
            }
            <h1 className="mt-10 text-xl md:text-2xl font-semibold text-gray-700 dark:text-gray-300">
                {location.pathname === '/services' ? 'Local Government Area' : 'What kind of application are you making?'}
            </h1>
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mt-4 rounded-md" role="alert">
                <p className="font-bold">Attention Needed!</p>
                <p>To access services, begin by selecting the Local Government Area (LGA) offering the service. This should be the LGA providing the service, not your home LGA. Type to see available LGAs, then choose one to proceed. Only active services can be selected!</p>
            </div>
            <Combobox value={lgas} onChange={handleChange}>
                <Combobox.Input
                    onChange={(event) => setQuery(event.target.value)}
                    className={`w-full ${location.pathname === '/application' && 'md:w-[50%]'} p-3 bg-transparent border border-gray-400 dark:border-gray-600 my-6 text-gray-700 dark:text-gray-300 rounded-md`}
                    placeholder="Start typing the LGA name..."
                />
                <Combobox.Options
                    className={`w-[93%] ${localStorage.getItem('isLoggedIn') ? 'md:w-[40%]' : 'md:w-[40%]'} fixed z-10 mt-[-20px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-0 rounded-b-md`}
                >
                    {lgas !== null && filteredLgas.map(lga => (
                        <Combobox.Option key={lga.id} value={lga.id} className="cursor-pointer hover:bg-[#e3ebe2] dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 p-3 border-b border-gray-200 dark:border-gray-700">
                            {lga.name}
                        </Combobox.Option>
                    ))}
                </Combobox.Options>
            </Combobox>
            {error && <div className="text-red-500 dark:text-red-400 my-3">{error}</div>}
            {noServicesMessage && <div className="text-red-500 dark:text-red-400 my-3">{noServicesMessage}</div>}
            <ServiceSelector activeservices={activeservices} loading={loading} goToAuthServicePage={goToAuthServicePage} />
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fadeIn { animation: fadeIn 0.8s ease-out forwards; }
            `}</style>
        </div>
    );
};

const ServiceSelector = ({ activeservices, loading, goToAuthServicePage }) => (
    <div className={`w-full ${location.pathname === '/application' && 'md:w-[50%]'} justify-center md:flex md:justify-between md:flex-wrap`}>
        {loading ? <ServiceLoader /> :
            (activeservices !== null && activeservices.length > 0) && activeservices.map(lgaActServ => (
                <Fragment key={lgaActServ.id}>
                    {localStorage.getItem('isLoggedIn') ? 
                        (lgaActServ.status === 'Enabled' ? 
                            <div
                                className="w-full md:w-[48%] cursor-pointer md:pb-6"
                                onClick={() => goToAuthServicePage(lgaActServ)}
                            >
                                <div className="flex bg-white dark:bg-gray-800 items-center rounded-md my-3 md:my-0 h-[100px] px-6 py-4 font-semibold text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-[#F0B652] hover:text-white transition-all duration-300">
                                    {lgaActServ.eservice.name}
                                </div>
                            </div>
                            :
                            <div
                                className="w-full md:w-[48%] cursor-not-allowed md:pb-6"
                            >
                                <div className="flex bg-gray-300 dark:bg-gray-600 items-center rounded-md my-3 md:my-0 h-[100px] px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">
                                    {lgaActServ.eservice.name}
                                </div>
                            </div>
                        )
                        :
                        (lgaActServ.status === 'Enabled' ? 
                            <Link
                                to="/service"
                                key={lgaActServ.id}
                                state={{ serviceObject: lgaActServ }}
                                className="w-full md:w-[48%] text-gray-700 my-3"
                            >
                                <div className="flex md:justify-center bg-[#e3ebe2] dark:bg-gray-700 items-center rounded-md my-3 md:my-0 h-[100px] p-4 hover:bg-[#F0B652] hover:text-white transition-all duration-300">
                                    {lgaActServ.eservice.name}
                                </div>
                            </Link>
                            :
                            <div
                                className="w-full md:w-[48%] cursor-not-allowed text-gray-400 my-3"
                            >
                                <div className="flex md:justify-center bg-gray-300 dark:bg-gray-600 items-center rounded-md my-3 md:my-0 h-[100px] p-4">
                                    {lgaActServ.eservice.name}
                                </div>
                            </div>
                        )
                    }
                </Fragment>
            ))
        }
    </div>
);

export default ServicesForm;