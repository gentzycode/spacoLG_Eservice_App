import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import Logo from '../../assets/abia512_512logo.png';
import { useNavigate } from 'react-router-dom';
import DashboardButton from '../../common/DashboardButton';

const Landing = () => {
    const [showConfetti, setShowConfetti] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => {
            setShowConfetti(false);
        }, 5000); // Stop confetti after 5 seconds
    }, []);

    const goToAuthentication = () => {
        navigate('/auth');
    };

    const goToService = () => {
        navigate('/services');
    };

    return (
        <div className="relative flex flex-col min-h-screen bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700">
            {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}
            
            <header className="flex justify-between items-center p-4 bg-blue-800 text-white shadow-lg">
                <img src={Logo} alt="logo" className="h-12 w-12" />
                {localStorage.getItem('isLoggedIn') && <DashboardButton />}
            </header>
            
            <main className="flex flex-grow justify-center items-center">
                <div className="text-center text-white space-y-8 p-6">
                    <h1 className="text-4xl md:text-6xl font-bold">Anambra LGA E-Services Solution</h1>
                    <p className="text-lg md:text-2xl">Providing digital solutions for efficient service delivery. Join us in transforming the public service experience.</p>
                    <button className="px-8 py-3 rounded-full bg-white text-blue-700 text-lg font-medium hover:bg-blue-100 transition duration-300" onClick={goToService}>
                        Get Started
                    </button>
                </div>
            </main>

            <section className="bg-white text-blue-700 p-8 shadow-lg">
                <div className="text-center text-3xl md:text-4xl font-light mb-6">What You Can Do</div>
                <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4">
                    <button 
                        className="w-full md:w-1/3 p-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition duration-300" 
                        onClick={goToService}
                    >
                        Request for a Service
                    </button>
                    <button 
                        className="w-full md:w-1/3 p-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition duration-300" 
                        onClick={goToAuthentication}
                    >
                        Manage your Requests
                    </button>
                    <button 
                        className="w-full md:w-1/3 p-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition duration-300"
                    >
                        Check your Request Status
                    </button>
                </div>
                <div className="text-center text-gray-500 mt-4">Click on any of the options above to proceed</div>
            </section>
        </div>
    );
};

export default Landing;
