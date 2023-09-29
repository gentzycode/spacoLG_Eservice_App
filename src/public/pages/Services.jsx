import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AuthBanner from '../../common/AuthBanner'
import { getActiveservices, getLGAs } from '../../apis/noAuthActions'
import ServiceLoader from '../../common/ServiceLoader'
import { MdOutlineNavigateNext } from 'react-icons/md'
import DashboardButton from '../../common/DashboardButton'
import { Combobox } from '@headlessui/react'


const Services = () => {

    const [lgas, setLgas] = useState(null);
    const[activeservices, setActiveservices] = useState(null);
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);
    //const [lgaeservices, setLgaeservices] = useState(null);

    const [query, setQuery] = useState('')

    const filteredLgas =
        query === ''
        ? lgas
        : lgas.filter((lga) => {
            return lga?.name.toLowerCase().includes(query.toLowerCase())
            })

    const handleChange = (event) => {
        if(event === "0"){
            setActiveservices(null);
            setError('You must select a Local Government Area!')
        }
        else{
            setError(null);
            getActiveservices(event, setActiveservices, setLoading);
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
                    <Combobox value={lgas} onChange={(event) => handleChange(event)}>
                        <Combobox.Input 
                            onChange={(event) => setQuery(event.target.value)}
                            className='w-full p-3 bg-transparent border-b border-gray-400 my-6 text-gray-600' 
                            placeholder='Local Government Area'
                        />
                        <Combobox.Options className='w-[93%] md:w-[40%] fixed z-10 mt-[-20px] bg-white border border-gray-200 px-4 rounded-b-md'>
                            {(lgas !== null && lgas !== undefined) && filteredLgas.map((lga) => (
                                <Combobox.Option key={lga.id} value={lga.id} className='cursor-pointer text-gray-700 py-3 border-b border-gray-100'>
                                    {lga.name}
                                </Combobox.Option>
                            ))}
                        </Combobox.Options>
                    </Combobox>
                    {error && <div className='text-red-500 my-3'>{error}</div>}
                    <div className={`w-full justify-center md:flex md:justify-between md:flex-wrap`}>
                        {
                            loading ? <ServiceLoader /> : 
                                (activeservices !== null && activeservices.length > 0) &&  activeservices.map(lgaActServ => {
                                        return <Link to='/service' key={lgaActServ.id} state={{ serviceObject : lgaActServ }} className='w-full md:w-[48%]  rounded-md border-gray-200 text-gray-500 my-3 shadow'>   
                                            <div className='flex justify-between items-center h-[100px] p-4'>
                                                {lgaActServ.eservice.name}
                                                <MdOutlineNavigateNext size={20} className='mt-1' />    
                                            </div>
                                        </Link> 
                                    })
                        }
                    </div>
                    <div className={`${activeservices !== null ? 'hidden' : 'block'} w-full border border-yellow-300 bg-yellow-50 rounded-md p-4 font-medium text-gray-600`}>
                        <p>To request for any service, you must select a Local Government Area to which you want to make the request. Above is a list of Local Government Areas in the state. Select any to proceed with your request or <Link to='/' className='text-green-950 font-bold'>click here</Link> for other available actions you might want to take.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Services
