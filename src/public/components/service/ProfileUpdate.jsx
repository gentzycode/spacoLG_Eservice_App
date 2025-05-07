import React, { useContext, useEffect, useState } from 'react';
import ButtonLoader from '../../../common/ButtonLoader';
import { AuthContext } from '../../../context/AuthContext';
import { getCities, getLGAs, updateProfile } from '../../../apis/noAuthActions';
import { Combobox } from '@headlessui/react';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../../apis/functions';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Multiselect from 'multiselect-react-dropdown';
import LGAsList from '../../../common/LGAsList';
import CitiesList from '../../../common/CitiesList';

const ProfileUpdate = () => {
    const { token, user, logout, updateUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const warningAlert = (msg) => toast.warning(msg);

    const [first_name, setFirst_name] = useState();
    const [last_name, setLast_name] = useState();
    const [gender, setGender] = useState();
    const [date_of_birth, setDate_of_birth] = useState();
    const [address, setAddress] = useState();
    const [city_id, setCity_id] = useState(null);
    const [localgovernments_id, setLocalgovernments_id] = useState(null);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [lgas, setLgas] = useState(null);
    const [lgaselected, setLgaselected] = useState('');
    const [cityselected, setCityselected] = useState('');
    const [cities, setCities] = useState(null);
    const [lgasquery, setLgasquery] = useState('');
    const [citiesquery, setCitiesquery] = useState('');
    const [loading, setLoading] = useState(false);

    const filteredLgas = lgasquery === '' ? lgas : lgas?.filter((lga) => lga?.name.toLowerCase().includes(lgasquery.toLowerCase()));
    const filteredCities = citiesquery === '' ? cities : cities?.filter((cty) => cty?.name.toLowerCase().includes(citiesquery.toLowerCase()));

    const handleLgasChange = (event) => {
        setLocalgovernments_id(event);
        let selected = lgas?.filter(lga => lga.id === event);
        setLgaselected(selected[0]?.name);
    };

    const handleCitiesChange = (event) => {
        setCity_id(event);
        let selected = cities?.filter(city => city.id === event);
        setCityselected(selected[0]?.name);
    };

    const handleUpdate = (e) => {
        e.preventDefault();

        if (city_id === null || localgovernments_id === null) {
            warningAlert('Local Government Area and City must be selected!');
        } else {
            const data = {
                user_id: user?.id,
                first_name,
                last_name,
                gender,
                date_of_birth: formatDate(date_of_birth),
                address,
                city_id,
                localgovernments_id
            };

            updateProfile(token, data, setSuccess, setError, setUpdating);
        }
    };

    if (success !== null) {
        updateUser(success?.user);
        toast.success('You have successfully updated your personal information');
        location.reload();
    }

    useEffect(() => {
        getLGAs(setLgas, setError);
    }, []);

    useEffect(() => {
        getCities(setCities, setError);
    }, []);

    return (
        <div className="w-full md:px-8 md:mt-12">
            <div className="w-full flex justify-start items-center space-x-2 text-gray-700 dark:text-gray-300 font-semibold py-6 border-gray-300 dark:border-gray-700">
                <h1 className="text-2xl md:text-2xl">Update your profile</h1>
            </div>

            {error !== null && <span className="text-red-500 my-2">{error?.message}</span>}

            <form onSubmit={handleUpdate} className="w-full md:flex md:flex-wrap md:justify-between my-4 bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 transition-all duration-300">
                <div className="w-full md:w-[31%] my-4">
                    <div className="text-gray-500 dark:text-gray-400 font-semibold mb-1.5">First name</div>
                    <input
                        type="text"
                        className="w-full p-3.5 rounded-md border border-gray-400 dark:border-gray-600 bg-transparent dark:text-white"
                        onChange={(e) => setFirst_name(e.target.value)}
                        required
                    />
                </div>

                <div className="w-full md:w-[31%] my-4">
                    <div className="text-gray-500 dark:text-gray-400 font-semibold mb-1.5">Last name</div>
                    <input
                        type="text"
                        className="w-full p-3.5 rounded-md border border-gray-400 dark:border-gray-600 bg-transparent dark:text-white"
                        onChange={(e) => setLast_name(e.target.value)}
                        required
                    />
                </div>

                <div className="w-full md:w-[31%] my-4">
                    <div className="text-gray-500 dark:text-gray-400 font-semibold mb-1.5">Gender</div>
                    <select
                        className="w-full px-3 py-3.5 rounded-md border border-gray-400 dark:border-gray-600 bg-transparent dark:text-white"
                        onChange={(e) => setGender(e.target.value)}
                        required
                    >
                        <option value=""></option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </div>

                <div className="w-full md:w-[31%] my-4">
                    <div className="text-gray-500 dark:text-gray-400 font-semibold mb-1.5">Date of Birth</div>
                    <input
                        type="date"
                        className="w-full p-3.5 rounded-md border border-gray-400 dark:border-gray-600 bg-transparent dark:text-white"
                        placeholder="Date of birth"
                        onChange={(e) => setDate_of_birth(e.target.value)}
                        required
                    />
                </div>

                <div className="w-full md:w-[31%] my-4">
                    <div className="text-gray-500 dark:text-gray-400 font-semibold mb-1.5">Address</div>
                    <input
                        type="text"
                        className="w-full p-3.5 rounded-md border border-gray-400 dark:border-gray-600 bg-transparent dark:text-white"
                        onChange={(e) => setAddress(e.target.value)}
                        required
                    />
                </div>

                <div className="w-full md:w-[32%] my-4 md:pl-2">
                    <div className="text-gray-500 dark:text-gray-400 font-semibold mb-1.5">Local Government Area</div>
                    <LGAsList setLocalgovernments_id={setLocalgovernments_id} />
                </div>

                <div className="w-full md:w-[31%] my-4">
                    <div className="text-gray-500 dark:text-gray-400 font-semibold mb-1.5">City</div>
                    <CitiesList setCity_id={setCity_id} />
                </div>

                <div className="w-full flex justify-end">
                    {updating ? 
                        <button className="w-[200px] flex justify-center p-4 rounded-md bg-[#F0B652] hover:bg-[#3B78BD] text-white transition-all duration-300">
                            <ButtonLoader />
                        </button> : 
                        <button className="w-[200px] p-4 rounded-md bg-[#F0B652] hover:bg-[#3B78BD] text-white transition-all duration-300">
                            Submit
                        </button>
                    }
                </div>
            </form>
            <ToastContainer />
        </div>
    );
};

export default ProfileUpdate;