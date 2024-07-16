import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSun, FaMoon, FaBaby, FaIdBadge, FaUsers, FaTrashAlt, FaRoad, FaCertificate, FaMoneyCheckAlt, FaTicketAlt } from 'react-icons/fa';
import PublicLinks from '../../common/PublicLinks';
import Confetti from 'react-confetti';
import Logo from '../../assets/abia512_512logo.png';

const services = [
    { title: "Birth Certificate", icon: FaBaby, url: "/services" },
    { title: "Death Certificate", icon: FaCertificate, url: "/services" },
    { title: "Local Government ID", icon: FaIdBadge, url: "/services" },
    { title: "Club/Assoc. Registration", icon: FaUsers, url: "/services" },
    { title: "Waste Management Fees", icon: FaTrashAlt, url: "/services" },
    { title: "Street Registration", icon: FaRoad, url: "/services" },
    { title: "Ticketing", icon: FaTicketAlt, url: "/services" },
    { title: "Other Fees", icon: FaMoneyCheckAlt, url: "/services" }
];

const Landing2 = () => {
    const navigate = useNavigate();
    const [darkMode, setDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('darkMode');
        return savedMode ? JSON.parse(savedMode) : false;
    });

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    const toggleDarkMode = () => {
        setDarkMode(prevMode => {
            const newMode = !prevMode;
            localStorage.setItem('darkMode', JSON.stringify(newMode));
            return newMode;
        });
    };

    useEffect(() => {
        setTimeout(() => {
            const confettiElement = document.getElementById('confetti');
            if (confettiElement) {
                confettiElement.style.display = 'none';
            }
        }, 5000);
    }, []);

    const goToService = () => {
        navigate('/services');
    };

    const goToStatuscheck = () => {
        navigate('/status-check');
    };

    const goToAuthentication = () => {
        navigate('/auth');
    };

    return (
        <div className={`dark:bg-gray-800 min-h-screen flex flex-col`}>
            <PublicLinks />
            <div className="w-full grid px-0 m-0">
                <div className="w-full bg-[#0d544c] md:bg-[url('/assets/landingBanner.png')] bg-cover px-6 md:px-12 py-12">
                    <div className="w-full space-y-4">
                        <div className="flex justify-center">
                            <img src={Logo} alt="logo" width="120px" />
                        </div>
                        <div className="text-md md:text-2xl break-normal font-semibold leading-tight text-white text-center uppercase">
                            Local Government E-Services Solution
                        </div>
                        <div className="text-xl md:text-4xl break-normal font-extrabold leading-tight text-white text-center uppercase">
                            LGA PORTAL
                        </div>
                    </div>
                </div>

                <div className="w-full flex justify-center py-12">
                    <div className="grid gap-12 md:grid-cols-3 px-6">
                        <div className="bg-[#f4f7f4] dark:bg-gray-600 rounded-md p-8 shadow-md">
                            <h1 className="text-2xl mb-4 font-semibold text-center text-[#0d544c] dark:text-white">
                                Request for a Service
                            </h1>
                            <p className="text-gray-500 dark:text-gray-300 mb-6 text-center">
                                You can apply for any of the e-services available on this platform ranging from Birth Certificate, Marriage Registration, Local Government Identification, etc.
                            </p>
                            <div className="flex justify-center">
                                <button
                                    className="w-[150px] py-3 bg-[#0d544c] rounded-md text-white font-medium shadow-xl transition duration-300 ease-in-out hover:bg-[#0a3a34]"
                                    onClick={goToService}
                                >
                                    Click here
                                </button>
                            </div>
                        </div>
                        <div className="bg-[#f4f7f4] dark:bg-gray-600 rounded-md p-8 shadow-md">
                            <h1 className="text-2xl mb-4 font-semibold text-center text-[#0d544c] dark:text-white">
                                Manage your Requests
                            </h1>
                            <p className="text-gray-500 dark:text-gray-300 mb-6 text-center">
                                You can register and login to your account to manage your applications, payments, invoices, certificates, etc., as well as track your requests in real-time.
                            </p>
                            <div className="flex justify-center">
                                <button
                                    className="w-[150px] py-3 bg-[#e5c55b] rounded-md font-medium shadow-xl transition duration-300 ease-in-out hover:bg-[#c1a140]"
                                    onClick={goToAuthentication}
                                >
                                    Click here
                                </button>
                            </div>
                        </div>
                        <div className="bg-[#f4f7f4] dark:bg-gray-600 rounded-md p-8 shadow-md">
                            <h1 className="text-2xl mb-4 font-semibold text-center text-[#0d544c] dark:text-white">
                                Check your Request Status
                            </h1>
                            <p className="text-gray-500 dark:text-gray-300 mb-6 text-center">
                                You can check the status of your application or request using the unique Request ID sent to your email on completion of your application or request.
                            </p>
                            <div className="flex justify-center">
                                <button
                                    className="w-[150px] py-3 bg-[#0d544c] rounded-md text-white font-medium shadow-xl transition duration-300 ease-in-out hover:bg-[#0a3a34]"
                                    onClick={goToStatuscheck}
                                >
                                    Click here
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full bg-[#f4f7f4] dark:bg-gray-600 py-12">
                    <div className="flex justify-center text-2xl font-bold pt-6 border-[#0d544c] dark:text-white">
                        <span className="py-3 uppercase">Available E-Services</span>
                    </div>
                    <div className="flex justify-center">
                        <div className="w-[50px] border-b-4 border-[#0d544c]"></div>
                    </div>
                    <div className="flex justify-center my-16">
                        <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4 px-4">
                            {services.map((service, index) => (
                                <div key={index} className="bg-white dark:bg-gray-600 rounded-md py-6 px-4 shadow-md cursor-pointer transition duration-300 ease-in-out transform hover:scale-105" onClick={() => navigate(service.url)}>
                                    <div className="flex justify-center text-4xl text-[#0d544c] dark:text-white mb-4">
                                        <service.icon />
                                    </div>
                                    <div className="text-md text-center text-[#0d544c] dark:text-white font-semibold">{service.title}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div id="confetti">
                <Confetti />
            </div>
            <div className="fixed bottom-4 right-4">
                <button
                    className="w-[50px] h-[50px] flex items-center justify-center bg-[#0d544c] rounded-full text-white font-medium shadow-xl transition duration-300 ease-in-out hover:bg-[#0a3a34]"
                    onClick={toggleDarkMode}
                >
                    {darkMode ? <FaSun /> : <FaMoon />}
                </button>
            </div>
            <footer className="bg-[#0d544c] dark:bg-gray-900 text-white py-4 text-center mt-12">
                <p>© {new Date().getFullYear()} Local Government Council E-Services Solution. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Landing2;
