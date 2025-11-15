import React, { useContext, useEffect, useState } from 'react';
import { HiDocumentText, HiUserGroup } from 'react-icons/hi';
import { FaRegListAlt, FaRegUser, FaFileAlt, FaCreditCard, FaCog, FaChartBar, FaShieldAlt } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { AiFillHome } from 'react-icons/ai';
import { RiQuestionnaireLine, RiWalletFill } from 'react-icons/ri';
import { BsClockHistory, BsHouses } from 'react-icons/bs';
import { MdSupportAgent, MdOutlineAccountBalanceWallet } from 'react-icons/md';
import { AGENT_ROUTES, PROTECTED_ROUTES, STAFF_ROUTES, SUPER_ADMIN_ROUTES } from '../constants/routes';

const NavDB = ({ collapsed }) => {
    const locatn = useLocation();
    const { user } = useContext(AuthContext);
    const [navlinks, setNavlinks] = useState(null);

    const publicUser = [
        { id: 1, title: "Home", url: PROTECTED_ROUTES.DASHBOARD, icon: <AiFillHome size={17} /> },
        { id: 2, title: "Application status", url: PROTECTED_ROUTES.CHECK_STATUS, icon: <BsClockHistory size={17} /> },
        { id: 3, title: "Application request", url: PROTECTED_ROUTES.APPLICATION, icon: <FaRegListAlt size={17} /> },
        { id: 4, title: "Payments", url: PROTECTED_ROUTES.PAYMENTS, icon: <MdOutlineAccountBalanceWallet size={17} /> },
        { id: 5, title: "Profile", url: PROTECTED_ROUTES.PROFILE, icon: <FaRegUser size={17} /> },
        { id: 6, title: "FAQ", url: PROTECTED_ROUTES.FAQ, icon: <RiQuestionnaireLine size={17} /> },
        { id: 7, title: "Support", url: PROTECTED_ROUTES.SUPPORT, icon: <MdSupportAgent size={17} /> },
    ];

    const staff = [
        { id: 1, title: "Home", url: PROTECTED_ROUTES.DASHBOARD, icon: <AiFillHome size={17} /> },
        { id: 2, title: "Applications", url: STAFF_ROUTES.APPLICATIONS, icon: <HiDocumentText size={17} /> },
        { id: 3, title: "Users", url: STAFF_ROUTES.USERS, icon: <HiUserGroup size={17} /> },
        { id: 4, title: "Authorizers", url: STAFF_ROUTES.AUTHORIZERS, icon: <FaFileAlt size={17} /> },
    ];

    const superAdmin = [
        { id: 1, title: "Home", url: PROTECTED_ROUTES.DASHBOARD, icon: <AiFillHome size={17} /> },
        { id: 2, title: "Users", url: SUPER_ADMIN_ROUTES.USERS, icon: <HiUserGroup size={17} /> },
        { id: 3, title: "Tariffs", url: SUPER_ADMIN_ROUTES.TARIFFS, icon: <RiWalletFill size={17} /> },
        { id: 4, title: "Payment Gateways", url: SUPER_ADMIN_ROUTES.PAYMENT_GATEWAYS, icon: <FaCreditCard size={17} /> },
        { id: 5, title: "Financial Reports", url: SUPER_ADMIN_ROUTES.FINANCIAL_REPORTS, icon: <FaChartBar size={17} /> },
        { id: 6, title: "Security & Audit", url: SUPER_ADMIN_ROUTES.AUDIT_LOGS, icon: <FaShieldAlt size={17} /> },
        { id: 7, title: "System Settings", url: SUPER_ADMIN_ROUTES.SYSTEM_SETTINGS, icon: <FaCog size={17} /> },
    ];

    const agent = [
        { id: 1, title: "Home", url: PROTECTED_ROUTES.DASHBOARD, icon: <AiFillHome size={17} /> },
        { id: 2, title: "My Wallet", url: AGENT_ROUTES.MY_WALLET, icon: <MdOutlineAccountBalanceWallet size={17} /> },
        { id: 3, title: "Manage Tokens", url: AGENT_ROUTES.MANAGE_TOKENS, icon: <RiWalletFill size={17} /> },
        { id: 4, title: "Applications", url: AGENT_ROUTES.APPLICATIONS, icon: <HiDocumentText size={17} /> },
        { id: 5, title: "General Invoices", url: AGENT_ROUTES.MANAGE_INVOICES, icon: <MdOutlineAccountBalanceWallet size={17} /> },
        { id: 6, title: "Advanced Invoicing", url: AGENT_ROUTES.ADVANCED_INVOICING, icon: <MdOutlineAccountBalanceWallet size={17} /> },
        { id: 7, title: "Manage Payers", url: AGENT_ROUTES.MANAGE_PAYERS, icon: <FaRegUser size={17} /> },
        { id: 8, title: "Reports", url: AGENT_ROUTES.REPORTS, icon: <FaRegListAlt size={17} /> },
    ];

    useEffect(() => {
        const setUserLinks = (role, publicUserLinks, staffLinks, superAdminLinks, agentLinks, setLinks) => {
            switch (role) {
                case 'PublicUser':
                    setLinks(publicUserLinks);
                    break;
                case 'Staff':
                    setLinks(staffLinks);
                    break;
                case 'SuperAdmin':
                    setLinks(superAdminLinks);
                    break;
                case 'Agent':
                    setLinks(agentLinks);
                    break;
                default:
                    setLinks(publicUserLinks);
                    break;
            }
        };

        setUserLinks(user?.role, publicUser, staff, superAdmin, agent, setNavlinks);
    }, [user?.role]);

    return (
        <ul className={`w-full transition-all duration-300 ${collapsed ? 'space-y-1' : 'space-y-2'}`}>
            {navlinks !== null && navlinks.map(nav => (
                <li
                    key={nav.id}
                    className={`${
                        locatn.pathname === nav.url || locatn.pathname.includes(nav.url.replace("/", ''))
                            ? 'bg-[#2b7d54] text-gray-100 font-semibold'
                            : 'text-gray-300'
                    } ${
                        collapsed ? 'md:px-2 md:py-2 px-3 py-2' : 'px-3 py-2'
                    } rounded-md transition-all duration-300 hover:bg-[#F0B652]/20`}
                    title={collapsed ? nav.title : ''}
                >
                    <Link
                        to={nav.url}
                        className={`flex items-center my-1 transition-all duration-300 ${
                            collapsed ? 'md:justify-center justify-start md:space-x-0 space-x-3' : 'justify-start space-x-3'
                        }`}
                    >
                        <span className={`flex-shrink-0 transition-all duration-300 ${
                            collapsed ? 'md:text-xl' : ''
                        }`}>
                            {nav.icon}
                        </span>
                        <span className={`transition-opacity duration-300 whitespace-nowrap ${
                            collapsed ? 'md:hidden' : ''
                        }`}>
                            {nav.title}
                        </span>
                    </Link>
                </li>
            ))}
        </ul>
    );
};

export default NavDB;