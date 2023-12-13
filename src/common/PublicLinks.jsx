import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Logo from '../assets/ansg_logo.png'

const PublicLinks = () => {

    const loc = useLocation();
    const navigate = useNavigate();

    const url = loc.pathname;

    const reloadPage = () => {
        url === '/auth' ? window.location.reload() : navigate('/auth');
    }

    return (
        <div 
            className={`fixed inset-0 z-20 mt-0 h-12 flex justify-between items-center py-6 pl-4 pr-6 ${url === '/' ? 'text-white' : 'text-[#0d544c]'}`}
        >
            <div className='pt-4'>
                <span className={`${url === '/' && 'hidden'} md:hidden`}>
                    <img src={Logo} alt="logo" width='50px' />
                </span>
            </div>
            <div className='flex justify-end space-x-6'>
                <Link to='https://lg.anambrastate.gov.ng/about'>FAQ</Link>
                <div className="cursor-pointer" onClick={() => reloadPage()}>Login</div>
            </div>
        </div>
    )
}

export default PublicLinks
