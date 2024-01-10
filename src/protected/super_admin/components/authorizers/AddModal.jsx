import React, { useContext, useEffect, useState } from 'react'
import { AiOutlineCloseCircle } from 'react-icons/ai'
import { getActiveservices, getEservices, getLGAs } from '../../../../apis/noAuthActions';
import ButtonLoader from '../../../../common/ButtonLoader';
import { AuthContext } from '../../../../context/AuthContext';
import { createAuthorizer, getStaffByLga } from '../../../../apis/adminActions';
import { HiOutlineTrash } from 'react-icons/hi';

const AddModal = ({ setShowmodal }) => {

    const { token, refreshRecord } = useContext(AuthContext);

    const [lga_id, setLga_id] = useState(null);
    const [lgas, setLgas] = useState(null);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);
    const [staff, setStaff] = useState(null);
    const [lgaStaff, setLgaStaff] = useState(null);
    const [creating, setCreating] = useState(null);
    const [loading, setLoading] = useState(null);
    const [eservice, setEservice] = useState([]);
    const [activeservices, setActiveservices] = useState(null);

    const getLgaStaff = (val) => {
        setLga_id(val);
        getStaffByLga(token, val, setLgaStaff, setError, setLoading);
        getEservices(val, setActiveservices, setLoading);
    }

    const handleSelectService = (val) => {
        !eservice.includes(val) && setEservice(eservice => [
            ...eservice,
            parseInt(val)
        ])
    }

    const removeEservice = (service_id, service_name) => {
        if(window.confirm(`Are you sure you want to remove ${service_name} from your selection?`)){
            let filteredArray = eservice.filter(item => item !== service_id);
            console.log(filteredArray);
            setEservice(filteredArray);
        }
    }


    const handleSubmit = (e) => {
        e.preventDefault();

        if(eservice.length === 0){
            alert('No E-Service was selected');
        }
        else{
            const data = {
                user_id : staff,
                local_government_id : lga_id,
                eservices : eservice
            }
            createAuthorizer(token, data, setSuccess, setError, setCreating);
        }
    }

    if(success !== null){
        alert(success?.status);
        setSuccess(null);
        refreshRecord(Date.now());
        setShowmodal(false);
    }

    useEffect(() => {
        getLGAs(setLgas, setError);
    }, [])
    
    return (
        <div>
            <div className='fixed inset-0 z-50 bg-black bg-opacity-75 transition-opacity'></div>
            <div className="fixed inset-0 z-50 overflow-y-auto">
                <div className="flex mt-16 md:mt-0 md:min-h-full items-end justify-center p-4 sm:items-center sm:p-0">
                    <div className='w-full md:w-[600px] bg-white border border-gray-400 dark:text-gray-700 rounded-md px-6 py-1'>
                        <div className='flex justify-between items-center border-b border-gray-200 py-2 text-red-500'>
                            <span className='text-lg text-gray-700 uppercase font-bold'>
                                Create Authorizer
                            </span>
                            <span
                                className='cursor-pointer'
                                onClick={() => setShowmodal(false)}
                            >    
                                <AiOutlineCloseCircle size={20} />
                            </span>
                        </div>

                        <div className='py-4'>
                            
                            {error !== null && <span className='text-red-500 py-2'>{error?.message}</span>}
                            <form onSubmit={handleSubmit} className='space-y-4 text-gray-700'>
                                <div className='w-full grid space-y-2'>
                                    <label>Local Government Area</label>
                                    <select 
                                        className='w-full border border-gray-400 rounded-md p-2 bg-transparent'
                                        required
                                        onChange={(e) => getLgaStaff(e.target.value)}
                                    >
                                        <option value=''>select</option>
                                        {
                                            lgas !== null && lgas.map(lga => {
                                                return <option key={lga?.id} value={lga?.id}>{lga?.name}</option>
                                            })
                                        }
                                    </select>
                                </div>

                                <div className='w-full grid space-y-2'>
                                    <label>Staff</label>
                                    <select 
                                        className='w-full border border-gray-400 rounded-md p-2 bg-transparent'
                                        onChange={(e) => setStaff(e.target.value)}
                                        required
                                    >
                                        <option value=''>{loading ? 'loading...' : 'select'}</option>
                                        {
                                            lgaStaff !== null && lgaStaff.map(stf => {
                                                return <option key={stf?.id} value={stf?.id}>{stf?.username} - {stf?.email}</option>
                                            })
                                        }
                                    </select>
                                </div>

                                <div className='w-full grid space-y-2'>
                                    <label>E-Service</label>
                                    <select 
                                        className='w-full border border-gray-400 rounded-md p-2 bg-transparent'
                                        onChange={(e) => handleSelectService(e.target.value)}
                                    >
                                        <option value=''>{loading ? 'loading...' : 'select'}</option>
                                        {
                                            activeservices !== null && activeservices.map(actserv => {
                                                return <option key={actserv?.id} value={actserv?.eservices_id}>{actserv?.eservice?.name}</option>
                                            })
                                        }
                                    </select>
                                </div>

                                <div className='w-full flex flex-wrap rounded-md border border-gray-100 p-3 text-sm'>
                                    {
                                        eservice.length === 0 ? <span className='text-gray-500'>No E-Service selected yet</span> : 
                                        (
                                            activeservices !== null && activeservices.map(aserv => {
                                                return eservice.includes(aserv?.id) && 
                                                <div className='flex mr-4 space-x-4 items-center p-2 bg-green-50 rounded-md my-2'>
                                                    <span className='whitespace-normal'>{aserv?.eservice?.name}</span>
                                                    <HiOutlineTrash 
                                                        size={15} 
                                                        className='text-red-600 cursor-pointer' 
                                                        onClick={()=> removeEservice(aserv?.id, aserv?.eservice?.name)}
                                                    
                                                    />
                                                </div>
                                            })
                                        )
                                    }
                                </div>

                                <div className='w-full flex justify-between md:justify-end items-center md:space-x-3 pt-2'>
                                    <button 
                                        className='w-[150px] p-3 hover:bg-gray-100 border border-[#0d544c] text-[#0d544c] rounded-md'
                                        onClick={() => setShowmodal(false)}
                                    >
                                        Cancel
                                    </button>
                                    {
                                        creating ? 
                                        <button className='w-[150px] flex justify-center p-3 bg-[#0d544c] hover:bg-[#143531] text-white rounded-md'>
                                            <ButtonLoader />
                                        </button>
                                        :
                                        <button className='w-[150px] p-3 bg-[#0d544c] hover:bg-[#143531] text-white rounded-md'>
                                            Create
                                        </button>
                                    }
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        
        </div>
    )
}

export default AddModal
