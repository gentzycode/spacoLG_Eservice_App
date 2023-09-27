import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AuthBanner from '../../common/AuthBanner'
import { getActiveservices, getLGAs } from '../../apis/noAuthActions'
import ServiceLoader from '../../common/ServiceLoader'
import { MdOutlineNavigateNext } from 'react-icons/md'
import DashboardButton from '../../common/DashboardButton'


const Services = () => {

    const [lgas, setLgas] = useState(null);
    const[activeservices, setActiveservices] = useState(null);
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);
    //const [lgaeservices, setLgaeservices] = useState(null);

    

    const handleChange = (event) => {
        if(event.target.value === "0"){
            setActiveservices(null);
            setError('You must select a Local Government Area!')
        }
        else{
            setError(null);
            getActiveservices(event.target.value, setActiveservices, setLoading);
        }        
    };

    useEffect(() => {
        getLGAs(setLgas, setError);
    }, [])



    return (
        <div className="w-full md:h-screen grid md:grid-cols-2 px-0 m-0">
            <AuthBanner />
            <div className="w-full col-span-1 my-0 md:my-8 flex justify-center px-4 md:px-0">
                <div className='w-full md:w-4/5'>
                    {localStorage.getItem('isLoggedIn') && 
                        <DashboardButton />
                    }
                    <h1 className='mt-6 md:mt-20 text-xl md:text-3xl font-extralight'>
                        Select Local Government Area for the request
                    </h1>
                    <select
                        className='w-full p-3 bg-transparent border-b border-gray-400 my-6 text-gray-600'
                        onChange={handleChange}
                    >   
                        <option value={0}>choose Local Government Area</option>
                        {
                            lgas !== null && lgas.map(lga => {
                                return <option key={lga.id} value={lga.id}>{lga.name}</option>
                            })
                        }
                    </select>
                    {error && <div className='text-red-500 my-3'>{error}</div>}
                    <div className={`w-full justify-center md:flex md:justify-between md:flex-wrap`}>
                        {
                            loading ? <ServiceLoader /> : 
                                (activeservices !== null && activeservices.length > 0) &&  activeservices.map(lgaActServ => {
                                        return <div key={lgaActServ.id} className='w-full md:w-[48%] h-[100px] flex justify-between items-center p-4 rounded-md border-gray-200 text-gray-500 my-3 shadow'>
                                            {lgaActServ.eservice.name}
                                            <Link to='/service' state={{ serviceObject : lgaActServ }}>   
                                                <MdOutlineNavigateNext size={20} className="cursor-pointer" />
                                            </Link> 
                                        </div>
                                    })
                        }
                    </div>
                    <div className={`${activeservices !== null ? 'hidden' : 'block'} w-full border border-gray-100 bg-green-50 rounded-md p-4 font-medium text-gray-600`}>
                        <p>To request for any service, you must select a Local Government Area to which you want to make the request. Above is a list of Local Government Areas in the state. Select any to proceed with your request or <Link to='/' className='text-green-950 font-bold'>click here</Link> for other available actions you might want to take.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Services
