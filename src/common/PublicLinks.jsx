import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const PublicLinks = () => {

    const loc = useLocation();
    const navigate = useNavigate();

    const url = loc.pathname;

    const reloadPage = () => {
        url === '/auth' ? window.location.reload() : navigate('/auth');
    }

    return (
        <div 
            className={`fixed inset-0 z-20 mt-0 h-8 flex justify-end items-center space-x-6 p-6 ${url === '/' ? 'text-white' : 'text-[#0d544c]'}`}
        >
            <Link to='#'>FAQ</Link>
            <div className="cursor-pointer" onClick={() => reloadPage()}>Login</div>
        </div>
    )
}

export default PublicLinks
