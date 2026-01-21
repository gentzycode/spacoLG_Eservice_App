import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { motion, AnimatePresence } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';
import {
    FaSun, FaMoon, FaBaby, FaCertificate, FaIdBadge, FaUsers,
    FaTrashAlt, FaRoad, FaTicketAlt, FaMoneyCheckAlt, FaChevronDown,
    FaFileAlt, FaUserCog, FaSearch, FaCheckCircle, FaShieldAlt,
    FaClock, FaDownload, FaArrowRight, FaPlay
} from 'react-icons/fa';
import PublicLinks from '../../common/PublicLinks';
import Logo from '../../assets/logo-bayelsa.png';
import BannerImage from '../../assets/landingBanner.png';

const services = [
    {
        title: "Birth Certificate",
        icon: FaBaby,
        url: "/services",
        description: "Get your official birth certificate digitally",
        color: "from-slate-600 to-slate-700"
    },
    {
        title: "Death Certificate",
        icon: FaCertificate,
        url: "/services",
        description: "Apply for death certificates online",
        color: "from-gray-600 to-gray-700"
    },
    {
        title: "Local Government ID",
        icon: FaIdBadge,
        url: "/services",
        description: "Register for your LG identification card",
        color: "from-emerald-700 to-emerald-800"
    },
    {
        title: "Club/Assoc. Registration",
        icon: FaUsers,
        url: "/services",
        description: "Register clubs and associations",
        color: "from-amber-700 to-amber-800"
    },
    {
        title: "Waste Management",
        icon: FaTrashAlt,
        url: "/services",
        description: "Pay waste management fees",
        color: "from-teal-700 to-teal-800"
    },
    {
        title: "Street Registration",
        icon: FaRoad,
        url: "/services",
        description: "Register new streets and addresses",
        color: "from-indigo-700 to-indigo-800"
    },
    {
        title: "Ticketing Services",
        icon: FaTicketAlt,
        url: "/services",
        description: "Access ticketing and permits",
        color: "from-blue-700 to-blue-800"
    },
    {
        title: "Other Services",
        icon: FaMoneyCheckAlt,
        url: "/services",
        description: "Explore additional LG services",
        color: "from-stone-600 to-stone-700"
    }
];

const features = [
    {
        icon: FaClock,
        title: "24/7 Accessibility",
        description: "Access services anytime, anywhere from any device",
        color: "bg-gradient-to-br from-slate-600 to-slate-700"
    },
    {
        icon: FaShieldAlt,
        title: "Secure & Encrypted",
        description: "Bank-level security for all your transactions and data",
        color: "bg-gradient-to-br from-emerald-700 to-emerald-800"
    },
    {
        icon: FaCheckCircle,
        title: "Real-Time Tracking",
        description: "Monitor application status with instant updates",
        color: "bg-gradient-to-br from-indigo-700 to-indigo-800"
    },
    {
        icon: FaDownload,
        title: "Digital Documents",
        description: "Download and store certificates in your wallet",
        color: "bg-gradient-to-br from-amber-700 to-amber-800"
    }
];

const stats = [
    { value: "15,000+", label: "Happy Citizens", color: "from-slate-600 to-slate-700" },
    { value: "99.9%", label: "Uptime", color: "from-emerald-700 to-emerald-800" },
    { value: "8+", label: "Services", color: "from-indigo-700 to-indigo-800" },
    { value: "24/7", label: "Support", color: "from-amber-700 to-amber-800" }
];

const LandingEnhanced = () => {
    const navigate = useNavigate();
    const mainRef = useRef(null);
    const aosInitialized = useRef(false);
    const [darkMode, setDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('darkMode');
        return savedMode ? JSON.parse(savedMode) : false;
    });
    const [activeService, setActiveService] = useState(null);
    const [headerRef, headerInView] = useInView({ threshold: 0.1, triggerOnce: true });
    const [featuresRef, featuresInView] = useInView({ threshold: 0.1, triggerOnce: true });
    const [statsRef, statsInView] = useInView({ threshold: 0.1, triggerOnce: true });

    useEffect(() => {
        if (!aosInitialized.current) {
            AOS.init({
                duration: 1000,
                easing: 'ease-out-cubic',
                once: true,
                mirror: false,
                offset: 50
            });
            aosInitialized.current = true;
        }
    }, []); // Initialize AOS only once

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

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 100 }
        }
    };

    const floatVariants = {
        initial: { y: 0 },
        animate: {
            y: [-10, 10, -10],
            transition: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-500 font-sans overflow-x-hidden">
            <PublicLinks />

            {/* Hero Section with Parallax Effect */}
            <motion.header
                ref={headerRef}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="relative bg-gradient-to-br from-slate-700 via-slate-800 to-gray-900 min-h-screen flex items-center overflow-hidden"
            >
                {/* Animated Background */}
                <div className="absolute inset-0 overflow-hidden">
                    {/* Landing Banner Pattern - Visible Background */}
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-[0.15]"
                        style={{ backgroundImage: `url(${BannerImage})` }}
                    ></div>

                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-10 left-10 w-72 h-72 bg-slate-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
                        <div className="absolute top-0 right-10 w-72 h-72 bg-indigo-600 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
                        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-emerald-600 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
                    </div>

                    {/* Grid Pattern */}
                    <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                </div>

                <div className="container mx-auto px-4 sm:px-6 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="text-white"
                        >
                            <motion.div
                                variants={itemVariants}
                                className="flex items-center gap-4 mb-6"
                            >
                                <motion.img
                                    src={Logo}
                                    alt="Yenagoa LG Logo"
                                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white/30 shadow-2xl backdrop-blur-sm"
                                    whileHover={{ scale: 1.1, rotate: 360 }}
                                    transition={{ duration: 0.8 }}
                                />
                                <div>
                                    <motion.div
                                        variants={itemVariants}
                                        className="inline-block px-4 py-2 bg-amber-600/20 backdrop-blur-sm rounded-full border border-amber-500/30 mb-2"
                                    >
                                        <span className="text-amber-200 text-sm font-semibold">🚀 Next-Gen Government Services</span>
                                    </motion.div>
                                </div>
                            </motion.div>

                            <motion.h1
                                variants={itemVariants}
                                className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6 leading-tight"
                            >
                                Yenagoa
                                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 animate-gradient">
                                    E-Services
                                </span>
                            </motion.h1>

                            <motion.p
                                variants={itemVariants}
                                className="text-xl sm:text-2xl text-blue-100 mb-8 leading-relaxed max-w-xl"
                            >
                                Experience seamless, secure, and swift government services at your fingertips. Join thousands of satisfied citizens today!
                            </motion.p>

                            <motion.div
                                variants={itemVariants}
                                className="flex flex-col sm:flex-row gap-4"
                            >
                                <motion.button
                                    onClick={() => navigate('/services')}
                                    className="group px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold rounded-full shadow-2xl hover:shadow-amber-600/50 transition-all duration-300 flex items-center justify-center gap-2"
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Get Started Now
                                    <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                                </motion.button>

                                <motion.button
                                    onClick={() => navigate('/fee-schedule')}
                                    className="px-8 py-4 bg-white/10 backdrop-blur-md text-white font-bold rounded-full border-2 border-white/30 hover:bg-white/20 transition-all duration-300"
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    View Services
                                </motion.button>
                            </motion.div>

                            {/* Trust Indicators */}
                            <motion.div
                                variants={itemVariants}
                                className="flex items-center gap-6 mt-8"
                            >
                                <div className="flex -space-x-2">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 border-2 border-white"></div>
                                    ))}
                                </div>
                                <div className="text-sm">
                                    <div className="font-semibold">15,000+ Happy Citizens</div>
                                    <div className="text-blue-200">Trusted by residents</div>
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Right Content - Quick Actions Card */}
                        <motion.div
                            variants={floatVariants}
                            initial="initial"
                            animate="animate"
                            className="relative"
                        >
                            <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full blur-2xl opacity-50 animate-pulse"></div>

                                <h2 className="text-3xl font-bold text-white mb-6 text-center">
                                    Quick Actions
                                </h2>

                                <div className="space-y-4">
                                    {[
                                        { label: "Apply for Services", action: '/services', color: "from-slate-700 to-slate-800", icon: FaFileAlt },
                                        { label: "View Fee Schedule", action: '/fee-schedule', color: "from-indigo-700 to-indigo-800", icon: FaMoneyCheckAlt },
                                        { label: "Login to Account", action: '/auth', color: "from-amber-700 to-amber-800", icon: FaUserCog }
                                    ].map((item, index) => (
                                        <motion.button
                                            key={index}
                                            onClick={() => navigate(item.action)}
                                            className={`w-full py-4 px-6 bg-gradient-to-r ${item.color} text-white font-bold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-between group`}
                                            whileHover={{ scale: 1.02, x: 5 }}
                                            whileTap={{ scale: 0.98 }}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 * index }}
                                        >
                                            <div className="flex items-center gap-3">
                                                <item.icon className="text-xl" />
                                                <span>{item.label}</span>
                                            </div>
                                            <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                                        </motion.button>
                                    ))}
                                </div>

                                {/* Quick Search */}
                                <div className="mt-6 relative">
                                    <input
                                        type="text"
                                        placeholder="Search for a service..."
                                        className="w-full py-3 px-4 pr-12 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                    />
                                    <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60" />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <motion.button
                    onClick={scrollToMain}
                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white focus:outline-none z-20"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    aria-label="Scroll to main content"
                >
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-sm font-semibold">Scroll Down</span>
                        <FaChevronDown size={24} />
                    </div>
                </motion.button>
            </motion.header>

            {/* Main Content */}
            <main ref={mainRef} className="flex-grow">

                {/* Action Cards Section */}
                <section className="py-20 bg-gradient-to-b from-white via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
                    <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

                    <div className="container mx-auto px-4 sm:px-6 relative z-10">
                        <div className="text-center mb-16" data-aos="fade-up">
                            <motion.div
                                initial={{ scale: 0 }}
                                whileInView={{ scale: 1 }}
                                viewport={{ once: true }}
                                className="inline-block px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full mb-4 font-semibold"
                            >
                                Get Started in 3 Easy Steps
                            </motion.div>
                            <h2 className="text-4xl md:text-5xl font-black text-gray-800 dark:text-white mb-4">
                                How It <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Works</span>
                            </h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-6 rounded-full"></div>
                            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">
                                Access all local government services in three simple steps
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                {
                                    title: "Request Services",
                                    description: "Browse and apply for any service with just a few clicks. Our intuitive interface makes it easy.",
                                    icon: FaBaby,
                                    color: "from-indigo-700 to-indigo-800",
                                    action: '/services'
                                },
                                {
                                    title: "Manage Requests",
                                    description: "Track applications, manage payments, and download certificates from your personal dashboard.",
                                    icon: FaUsers,
                                    color: "from-amber-700 to-amber-800",
                                    action: '/auth'
                                },
                                {
                                    title: "Check Status",
                                    description: "Get real-time updates on your applications using your unique Request ID sent to your email.",
                                    icon: FaCertificate,
                                    color: "from-slate-700 to-slate-800",
                                    action: '/status-check'
                                }
                            ].map((item, index) => (
                                <motion.div
                                    key={index}
                                    data-aos="fade-up"
                                    data-aos-delay={index * 100}
                                    className="relative group cursor-pointer"
                                    onClick={() => navigate(item.action)}
                                    whileHover={{ y: -10 }}
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-br ${item.color} rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300`}></div>
                                    <div className="relative bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 h-full">
                                        {/* Step Number */}
                                        <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-indigo-700 to-indigo-800 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                                            {index + 1}
                                        </div>

                                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                            <item.icon className="text-white text-3xl" />
                                        </div>

                                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all">
                                            {item.title}
                                        </h3>

                                        <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                                            {item.description}
                                        </p>

                                        <div className="flex items-center text-blue-600 dark:text-blue-400 font-semibold group-hover:gap-3 gap-2 transition-all">
                                            <span>Get Started</span>
                                            <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Services Section */}
                <section className="container mx-auto px-4 sm:px-6 py-20">
                    <div className="text-center mb-16" data-aos="fade-up">
                        <motion.div
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            className="inline-block px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-full mb-4 font-semibold"
                        >
                            Available Services
                        </motion.div>
                        <h2 className="text-4xl md:text-5xl font-black text-gray-800 dark:text-white mb-4">
                            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Services</span>
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto mb-6 rounded-full"></div>
                        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">
                            Comprehensive digital solutions for all your local government needs
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {services.map((service, index) => (
                            <motion.div
                                key={index}
                                data-aos="zoom-in"
                                data-aos-delay={index * 50}
                                className="relative group"
                                onMouseEnter={() => setActiveService(index)}
                                onMouseLeave={() => setActiveService(null)}
                                whileHover={{ scale: 1.05 }}
                            >
                                <div
                                    onClick={() => navigate(service.url)}
                                    className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all cursor-pointer overflow-hidden border border-gray-100 dark:border-gray-700 h-full"
                                >
                                    {/* Hover Gradient */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>

                                    <div className="relative z-10">
                                        <div className={`w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-gradient-to-br ${service.color} rounded-xl text-white text-3xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                                            <service.icon />
                                        </div>

                                        <h3 className="text-xl font-bold text-center text-gray-800 dark:text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all">
                                            {service.title}
                                        </h3>

                                        <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                                            {service.description}
                                        </p>

                                        {/* Animated Arrow */}
                                        <motion.div
                                            className="mt-4 flex justify-center"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{
                                                opacity: activeService === index ? 1 : 0,
                                                x: activeService === index ? 0 : -10
                                            }}
                                        >
                                            <FaArrowRight className="text-blue-600 dark:text-blue-400" />
                                        </motion.div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Features Section */}
                <section
                    ref={featuresRef}
                    className="py-20 bg-gradient-to-br from-slate-700 via-indigo-800 to-slate-900 relative overflow-hidden"
                >
                    {/* Animated Background Elements */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-10 animate-blob"></div>
                        <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-300 rounded-full mix-blend-overlay filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
                    </div>

                    <div className="container mx-auto px-4 sm:px-6 relative z-10">
                        <div className="text-center mb-16" data-aos="fade-up">
                            <motion.div
                                initial={{ scale: 0 }}
                                whileInView={{ scale: 1 }}
                                viewport={{ once: true }}
                                className="inline-block px-6 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full mb-4 font-semibold border border-white/30"
                            >
                                Why Choose Us
                            </motion.div>
                            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                                World-Class Features
                            </h2>
                            <div className="w-24 h-1 bg-white/50 mx-auto mb-6 rounded-full"></div>
                            <p className="text-white/90 max-w-2xl mx-auto text-lg">
                                Built with cutting-edge technology to provide the best user experience
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    data-aos="flip-left"
                                    data-aos-delay={index * 100}
                                    className="relative group"
                                    whileHover={{ y: -10 }}
                                >
                                    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl hover:bg-white/20 transition-all duration-300 h-full">
                                        <div className={`w-14 h-14 rounded-xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg`}>
                                            <feature.icon className="text-white text-2xl" />
                                        </div>

                                        <h3 className="text-xl font-bold text-white mb-3">
                                            {feature.title}
                                        </h3>

                                        <p className="text-white/80 leading-relaxed">
                                            {feature.description}
                                        </p>

                                        <div className="mt-4 h-1 bg-gradient-to-r from-white/0 via-white/50 to-white/0 rounded-full"></div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Stats Section */}
                        <motion.div
                            ref={statsRef}
                            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
                            data-aos="fade-up"
                        >
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={index}
                                    className="text-center"
                                    initial={{ scale: 0, opacity: 0 }}
                                    whileInView={{ scale: 1, opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <div className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 shadow-2xl hover:scale-105 transition-transform duration-300`}>
                                        <div className="text-4xl font-black text-white mb-2">
                                            {statsInView && (
                                                <CountUpAnimation end={stat.value} />
                                            )}
                                        </div>
                                        <div className="text-white/90 font-semibold">
                                            {stat.label}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
                    <div className="container mx-auto px-4 sm:px-6">
                        <motion.div
                            data-aos="zoom-in"
                            className="relative bg-gradient-to-r from-slate-700 via-indigo-800 to-slate-800 rounded-3xl p-12 md:p-16 overflow-hidden shadow-2xl"
                        >
                            {/* Animated Background */}
                            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

                            <div className="relative z-10 text-center text-white">
                                <h2 className="text-4xl md:text-5xl font-black mb-6">
                                    Ready to Get Started?
                                </h2>
                                <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
                                    Join thousands of satisfied citizens experiencing the future of government services today!
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <motion.button
                                        onClick={() => navigate('/services')}
                                        className="px-10 py-5 bg-white text-blue-600 font-bold rounded-full shadow-2xl hover:shadow-white/50 transition-all duration-300 text-lg flex items-center justify-center gap-2"
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Apply Now
                                        <FaArrowRight />
                                    </motion.button>
                                    <motion.button
                                        onClick={() => navigate('/auth')}
                                        className="px-10 py-5 bg-transparent border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-blue-600 transition-all duration-300 text-lg"
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Login to Dashboard
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </main>

            {/* Enhanced Footer */}
            <footer className="bg-gray-900 dark:bg-black text-white py-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20"></div>

                <div className="container mx-auto px-4 sm:px-6 relative z-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                        <div>
                            <motion.img
                                src={Logo}
                                alt="Logo"
                                className="h-20 mb-4"
                                whileHover={{ scale: 1.1, rotate: 5 }}
                            />
                            <p className="text-gray-400 leading-relaxed">
                                Transforming government services through digital innovation and excellence.
                            </p>
                        </div>

                        <div>
                            <h4 className="text-lg font-bold mb-4 text-amber-400">Quick Links</h4>
                            <ul className="space-y-2">
                                {['Services', 'Fee Schedule', 'Login', 'Status Check'].map((link, i) => (
                                    <li key={i}>
                                        <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors flex items-center gap-2 group">
                                            <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-lg font-bold mb-4 text-amber-400">Services</h4>
                            <ul className="space-y-2">
                                {services.slice(0, 4).map((service, i) => (
                                    <li key={i}>
                                        <a href={service.url} className="text-gray-400 hover:text-amber-400 transition-colors flex items-center gap-2 group">
                                            <service.icon className="text-xs" />
                                            {service.title}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-lg font-bold mb-4 text-amber-400">Contact</h4>
                            <address className="text-gray-400 not-italic space-y-2">
                                <p>Yenagoa Local Government</p>
                                <p>Bayelsa State, Nigeria</p>
                                <a href="mailto:info@yenagoa-lg.gov" className="hover:text-amber-400 transition-colors block">
                                    info@yenagoa-lg.gov
                                </a>
                                <p className="text-sm pt-4">
                                    <span className="text-amber-400 font-semibold">24/7</span> Support Available
                                </p>
                            </address>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 pt-8 text-center">
                        <p className="text-gray-400">
                            © {new Date().getFullYear()} Yenagoa Local Government. All rights reserved.
                            <span className="mx-2">|</span>
                            <span className="text-amber-400">Built with ❤️ for the people</span>
                        </p>
                    </div>
                </div>
            </footer>

            {/* Dark Mode Toggle - Enhanced */}
            <motion.button
                className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-slate-600 to-slate-700 text-white rounded-full flex items-center justify-center shadow-2xl hover:shadow-slate-500/50 transition-all z-50"
                onClick={toggleDarkMode}
                aria-label="Toggle dark mode"
                whileHover={{ scale: 1.1, rotate: 180 }}
                whileTap={{ scale: 0.9 }}
            >
                {darkMode ? <FaSun size={24} /> : <FaMoon size={24} />}
            </motion.button>
        </div>
    );
};

// Count Up Animation Component
const CountUpAnimation = ({ end }) => {
    return <span>{end}</span>;
};

export default LandingEnhanced;
