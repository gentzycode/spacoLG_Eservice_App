import { useEffect } from 'react';
import BannerImage from '../../assets/landingBanner.png';
import Logo from '../../assets/logo-bayelsa.png';
import ServicesForm from '../components/service/ServicesForm';
import { useNavigate } from 'react-router-dom';
import PublicLinks from '../../common/PublicLinks';

const Services = () => {
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.getItem('selectedService') && localStorage.removeItem('selectedService');
    }, []);

    useEffect(() => {
        localStorage.getItem('isLoggedIn') && navigate('/dashboard');
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 font-poppins transition-colors duration-500">
            <PublicLinks />
            <div className="flex-grow grid grid-cols-1 md:grid-cols-2 w-full">
                {/* Left Section with Banner Background */}
                <div className="hidden lg:flex relative bg-cover bg-center" style={{ backgroundImage: `url(${BannerImage})` }}>
                    <div className="absolute inset-0 bg-black/40"></div>
                    <div className="relative z-10 flex flex-col justify-center items-center p-12 w-full h-full">
                        <img 
                            src={Logo} 
                            alt="Yenagoa LG Logo" 
                            className="w-32 h-32 rounded-full border-4 border-white shadow-xl mb-8 animate-fadeIn" 
                        />
                        <h1 className="text-4xl font-bold text-white mb-4 text-center animate-fadeIn">
                            Yenagoa <span className="text-[#F0B652]">E-Services</span>
                        </h1>
                        <p className="text-xl text-gray-100 max-w-md text-center animate-fadeIn">
                            Modern digital solutions for all local government services
                        </p>
                    </div>
                </div>
                <div className="w-full col-span-1 my-4 md:my-8 flex justify-center px-2 md:px-0 animate-slideIn">
                    <ServicesForm />
                </div>
            </div>
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn { animation: fadeIn 0.8s ease-out forwards; }
                .animate-slideIn { animation: slideIn 0.6s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default Services;