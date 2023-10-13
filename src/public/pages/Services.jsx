import { useEffect } from 'react'
import AuthBanner from '../../common/AuthBanner'
import ServicesForm from '../components/service/ServicesForm'


const Services = () => {

    useEffect(() => {
        localStorage.getItem('selectedService') && localStorage.removeItem('selectedService');
    }, [])

    return (
        <div className="w-full md:h-screen grid md:grid-cols-2 px-0 m-0">
            <AuthBanner />
            <div className="w-full col-span-1 my-4 md:my-8 flex justify-center px-2 md:px-0">
                <ServicesForm />
            </div>
        </div>
    )
}

export default Services
