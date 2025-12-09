import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSun, FaMoon, FaBaby, FaCertificate, FaIdBadge, FaUsers, FaTrashAlt, FaRoad, FaTicketAlt, FaMoneyCheckAlt, FaChevronDown, FaFileAlt, FaUserCog, FaSearch } from 'react-icons/fa';
import PublicLinks from '../../common/PublicLinks';
import Logo from '../../assets/logo-bayelsa.png';
import BannerImage from '../../assets/landingBanner.png';

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

const testimonials = [
    { name: "John Doe", text: "The easiest way to get my birth certificate!" },
    { name: "Jane Smith", text: "Tracking my application was seamless." },
    { name: "Mike Johnson", text: "Highly recommend for all LG services!" },
];

const Landing2 = () => {
    const navigate = useNavigate();
    const mainRef = useRef(null);
    const [darkMode, setDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('darkMode');
        return savedMode ? JSON.parse(savedMode) : false;
    });

    useEffect(() => {
        document.documentElement.classList.toggle('dark', darkMode);
    }, [darkMode]);

    const toggleDarkMode = () => {
        setDarkMode(prev => {
            const newMode = !prev;
            localStorage.setItem('darkMode', JSON.stringify(newMode));
            return newMode;
        });
    };

    const scrollToMain = () => {
        mainRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-500 font-poppins">
            <PublicLinks />

            {/* Optimized Header with Enhanced Quick Actions */}
            <header className="relative bg-cover bg-center h-[400px] sm:h-[500px] md:h-[600px] animate-parallax" style={{ backgroundImage: `url(${BannerImage})` }}>
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="container mx-auto px-4 sm:px-6 h-full flex items-center relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                        <div className="flex flex-col justify-center">
                            <img
                                src={Logo}
                                alt="Yenagoa LG Logo"
                                className="w-32 sm:w-40 h-32 sm:h-40 rounded-full border-4 border-white shadow-xl mb-6"
                            />
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                                Yenagoa <span className="text-[#F0B652]">E-Services</span>
                            </h1>
                            <p className="text-lg sm:text-xl text-gray-100 max-w-md">
                                Modern digital solutions for all local government services
                            </p>
                        </div>
                        
                        {/* Enhanced Quick Actions Box */}
                        <div className="flex items-center justify-center md:justify-end">
                            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md p-6 rounded-xl shadow-2xl w-full max-w-sm border border-white/20 animate-subtleBounce">
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
                                    Quick Actions
                                </h2>
                                <div className="space-y-4">
                                    <button
                                        onClick={() => navigate('/services')}
                                        className="w-full py-4 bg-[#f06752] text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all hover:brightness-110"
                                    >
                                        Apply for Services
                                    </button>
                                    <button
                                        onClick={() => navigate('/fee-schedule')}
                                        className="w-full py-4 bg-[#3B78BD] text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all hover:brightness-110"
                                    >
                                        View Fee Schedule
                                    </button>
                                    <button
                                        onClick={() => navigate('/auth')}
                                        className="w-full py-4 bg-[#F0B652] text-gray-900 font-bold rounded-lg shadow-lg hover:shadow-xl transition-all hover:brightness-110"
                                    >
                                        Login to Account
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <button
                    onClick={scrollToMain}
                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white focus:outline-none z-20"
                    aria-label="Scroll to main content"
                >
                    <FaChevronDown size={30} className="animate-pulse" />
                </button>
            </header>

            {/* Main Content */}
            <main ref={mainRef} className="flex-grow pt-0">


                {/* Reintroduced Sections: Request, Manage, Check Status */}
{/* Action Cards Section */}
<section className="py-16 bg-gradient-to-b from-[#F0B652]/10 to-[#3B78BD]/10 dark:from-gray-800/50 dark:to-gray-900">
  <div className="container mx-auto px-4 sm:px-6">
    <div className="text-center mb-16">
      <h2 className="text-3xl md:text-4xl font-bold text-[#3B78BD] dark:text-white mb-4">
        Get Started With <span className="text-[#F0B652]">E-Services</span>
      </h2>
      <div className="w-20 h-1 bg-[#F0B652] mx-auto mb-6"></div>
      <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
        Simple steps to access all local government services
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Request Card */}
      <div 
        className="relative group overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer"
        onClick={() => navigate('/services')}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#3B78BD] to-[#2a5690] opacity-90 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="relative z-10 p-8 h-full flex flex-col">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-6">
            <FaBaby className="text-white text-2xl" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">Request for a Service</h3>
          <p className="text-gray-100 mb-6">
            Apply for any of our e-services ranging from Birth Certificates to Local Government IDs
          </p>
          <div className="mt-auto">
            <button className="px-6 py-2 bg-white text-[#3B78BD] rounded-full font-medium hover:bg-gray-100 transition">
              Get Started
            </button>
          </div>
        </div>
      </div>

      {/* Manage Card */}
      <div 
        className="relative group overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer"
        onClick={() => navigate('/auth')}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#F0B652] to-[#d4a53a] opacity-90 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="relative z-10 p-8 h-full flex flex-col">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-6">
            <FaUsers className="text-white text-2xl" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">Manage your Requests</h3>
          <p className="text-gray-100 mb-6">
            Track applications, manage payments, and access certificates through your account
          </p>
          <div className="mt-auto">
            <button className="px-6 py-2 bg-white text-[#F0B652] rounded-full font-medium hover:bg-gray-100 transition">
              Login Now
            </button>
          </div>
        </div>
      </div>

      {/* Status Card */}
      <div 
        className="relative group overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer"
        onClick={() => navigate('/status-check')}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#f06752] to-[#d45644] opacity-90 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="relative z-10 p-8 h-full flex flex-col">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-6">
            <FaCertificate className="text-white text-2xl" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">Check Request Status</h3>
          <p className="text-gray-100 mb-6">
            Track your application status using the unique Request ID from your email
          </p>
          <div className="mt-auto">
            <button className="px-6 py-2 bg-white text-[#f06752] rounded-full font-medium hover:bg-gray-100 transition">
              Check Status
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

                {/* Services Section */}
                <section className="container mx-auto px-4 sm:px-6 py-16">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-[#3B78BD] dark:text-white mb-4">
                            Our <span className="text-[#F0B652]">Services</span>
                        </h2>
                        <div className="w-20 h-1 bg-[#F0B652] mx-auto mb-6"></div>
                        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            Access all local government services from the comfort of your home
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {services.map((service, index) => (
                            <div 
                                key={index}
                                onClick={() => navigate(service.url)}
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all cursor-pointer group"
                            >
                                <div className="p-6">
                                    <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center text-[#3B78BD] dark:text-[#F0B652] text-3xl">
                                        <service.icon />
                                    </div>
                                    <h3 className="text-xl font-semibold text-center text-gray-800 dark:text-white group-hover:text-[#F0B652] transition-colors">
                                        {service.title}
                                    </h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Vibrant Features Section */}
                <section className="py-16 bg-gradient-to-br from-[#3B78BD]/10 via-[#F0B652]/10 to-[#f06752]/10 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                    <div className="container mx-auto px-4 sm:px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-[#3B78BD] dark:text-white mb-4">
                                Why Choose <span className="text-[#F0B652]">Yenagoa E-Services</span>
                            </h2>
                            <div className="w-20 h-1 bg-[#F0B652] mx-auto mb-6"></div>
                            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                                Experience government services like never before with our innovative platform
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Feature 1 */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2 border-t-4 border-[#3B78BD]">
                                <div className="w-14 h-14 rounded-full bg-[#3B78BD]/10 flex items-center justify-center mb-4">
                                    <div className="w-10 h-10 rounded-full bg-[#3B78BD] flex items-center justify-center text-white text-xl">
                                        1
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-[#3B78BD] dark:text-[#F0B652] mb-3">Instant Access</h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Apply for services anytime, anywhere with our 24/7 digital platform
                                </p>
                            </div>

                            {/* Feature 2 */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2 border-t-4 border-[#F0B652]">
                                <div className="w-14 h-14 rounded-full bg-[#F0B652]/10 flex items-center justify-center mb-4">
                                    <div className="w-10 h-10 rounded-full bg-[#F0B652] flex items-center justify-center text-gray-900 text-xl">
                                        2
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-[#3B78BD] dark:text-[#F0B652] mb-3">Real-Time Tracking</h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Monitor your application status with live updates and notifications
                                </p>
                            </div>

                            {/* Feature 3 */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2 border-t-4 border-[#f06752]">
                                <div className="w-14 h-14 rounded-full bg-[#f06752]/10 flex items-center justify-center mb-4">
                                    <div className="w-10 h-10 rounded-full bg-[#f06752] flex items-center justify-center text-white text-xl">
                                        3
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-[#3B78BD] dark:text-[#F0B652] mb-3">Secure Payments</h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Multiple payment options with bank-level security and encryption
                                </p>
                            </div>

                            {/* Feature 4 */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2 border-t-4 border-[#3B78BD]">
                                <div className="w-14 h-14 rounded-full bg-[#3B78BD]/10 flex items-center justify-center mb-4">
                                    <div className="w-10 h-10 rounded-full bg-[#3B78BD] flex items-center justify-center text-white text-xl">
                                        4
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-[#3B78BD] dark:text-[#F0B652] mb-3">Digital Certificates</h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Receive and store important documents in your secure digital wallet
                                </p>
                            </div>
                        </div>

                        {/* Colorful Stats */}
                        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-[#3B78BD] rounded-xl p-6 text-center text-white shadow-lg">
                                <div className="text-3xl font-bold mb-2">10,000+</div>
                                <div className="text-sm">Happy Residents</div>
                            </div>
                            <div className="bg-[#F0B652] rounded-xl p-6 text-center text-gray-900 shadow-lg">
                                <div className="text-3xl font-bold mb-2">24/7</div>
                                <div className="text-sm">Service Availability</div>
                            </div>
                            <div className="bg-[#f06752] rounded-xl p-6 text-center text-white shadow-lg">
                                <div className="text-3xl font-bold mb-2">98%</div>
                                <div className="text-sm">Satisfaction Rate</div>
                            </div>
                            <div className="bg-[#3B78BD] rounded-xl p-6 text-center text-white shadow-lg">
                                <div className="text-3xl font-bold mb-2">8+</div>
                                <div className="text-sm">Services Available</div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-[#313131] dark:bg-gray-900 text-white py-12">
                <div className="container mx-auto px-4 sm:px-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                        <div>
                            <img src={Logo} alt="Logo" className="h-16 mb-4" />
                            <p className="text-gray-100">
                                Modern digital solutions for Yenagoa Local Government
                            </p>
                        </div>
                        <div>
                            <h4 className="text-lg font-bold mb-4 text-[#F0B652]">Services</h4>
                            <ul className="space-y-2">
                                {services.slice(0, 4).map((service, index) => (
                                    <li key={index}>
                                        <a href={service.url} className="text-gray-100 hover:text-[#F0B652] transition">
                                            {service.title}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-lg font-bold mb-4 text-[#F0B652]">Quick Links</h4>
                            <ul className="space-y-2">
                                <li><a href="/services" className="text-gray-100 hover:text-[#F0B652] transition">Apply</a></li>
                                <li><a href="/auth" className="text-gray-100 hover:text-[#F0B652] transition">Login</a></li>
                                <li><a href="/status-check" className="text-gray-100 hover:text-[#F0B652] transition">Check Status</a></li>
                                <li><a href="/contact" className="text-gray-100 hover:text-[#F0B652] transition">Contact</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-lg font-bold mb-4 text-[#F0B652]">Contact</h4>
                            <address className="text-gray-100 not-italic">
                                Yenagoa Local Government<br />
                                Bayelsa State, Nigeria<br />
                                <a href="mailto:info@yenagoa-lg.gov" className="hover:text-[#F0B652] transition">info@yenagoa-lg.gov</a>
                            </address>
                        </div>
                    </div>
                    <div className="border-t border-gray-500 mt-8 pt-8 text-center text-gray-200">
                        <p>© {new Date().getFullYear()} Yenagoa Local Government. All rights reserved.</p>
                    </div>
                </div>
            </footer>

            {/* Dark Mode Toggle */}
            <button
                className="fixed bottom-8 right-8 w-14 h-14 bg-[#3B78BD] text-white rounded-full flex items-center justify-center shadow-xl hover:bg-[#2a5690] transition-transform hover:scale-110"
                onClick={toggleDarkMode}
                aria-label="Toggle dark mode"
            >
                {darkMode ? <FaSun size={24} /> : <FaMoon size={24} />}
            </button>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes subtleBounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
                .animate-fadeIn { animation: fadeIn 0.6s ease-out forwards; }
                .animate-subtleBounce { animation: subtleBounce 1.5s ease-in-out infinite; }
                .animate-parallax {
                    background-attachment: fixed;
                    background-position: center;
                    background-size: cover;
                }
            `}</style>
        </div>
    );
};

export default Landing2;