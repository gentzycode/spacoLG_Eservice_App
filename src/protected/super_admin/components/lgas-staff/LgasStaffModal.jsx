import React, { useContext, useState } from 'react'
import { AuthContext } from '../../../../context/AuthContext';
import ButtonLoader from '../../../../common/ButtonLoader';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { createLgaStaff, updateLgaStaff } from '../../../../apis/adminActions';

const LgasStaffModal = ({ users, lgas, setShowmodal, lgastaff, setLagstaff }) => {

    const { token, refreshRecord } = useContext(AuthContext);

    const [user_id, setUser_id] = useState(lgastaff !== null ? lgastaff?.user_id : '' );
    const [local_government_id, setLocal_government_id] = useState(lgastaff !== null ? lgastaff?.local_government_id : '');
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const closeShowmodal = () => {
        setLagstaff(null);
        setShowmodal(false);
    }

    const data = {
        user_id,
        local_government_id
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if(lgastaff !== null){
            // update action
            updateLgaStaff(token, lgastaff?.id, data, setSuccess, setError, setCreating)
        }
        else{
            // create action
            createLgaStaff(token, data, setSuccess, setError, setCreating);
        }
    }


    if(success !== null){
        alert('Local Government Staff update successfull!');
        closeShowmodal();
        refreshRecord(Date.now());
    }


    return (
        <div>
            <div className='fixed inset-0 z-50 bg-black bg-opacity-75 transition-opacity'></div>
            <div className="fixed inset-0 z-50 overflow-y-auto">
                <div className="flex mt-16 md:mt-0 md:min-h-full items-end justify-center p-4 sm:items-center sm:p-0">
                    <div className='w-full md:w-[600px] bg-white border border-gray-400 dark:text-gray-700 rounded-md px-6 py-1'>
                        <div className='flex justify-between items-center border-b border-gray-200 py-2 text-red-500'>
                            <span className='text-lg text-gray-700 uppercase font-bold'>
                                {lgastaff !== null ? 'Edit LGA Staff' : 'New LGA Staff'}
                            </span>
                            <span
                                className='cursor-pointer'
                                onClick={(e) => closeShowmodal(false)}
                            >    
                                <AiOutlineCloseCircle size={20} />
                            </span>
                        </div>
                        <div className='py-4'>
                            
                            {error !== null && <span className='text-red-500 py-2'>{error?.message}</span>}
                            <form onSubmit={handleSubmit} className='space-y-4 text-gray-700'>
                            {
                                lgastaff !== null ? 
                                <div className='w-full grid space-y-1'>
                                    <label>User</label>
                                    <select 
                                        className='w-full border border-gray-400 rounded-md p-2 bg-transparent'
                                        required
                                        disabled
                                    >
                                        <option value=''>{lgastaff !== null && lgastaff?.user?.username}</option>
                                    </select>
                                </div>
                                :
                                <div className='w-full grid space-y-1'>
                                    <label>User</label>
                                    <select 
                                        className='w-full border border-gray-400 rounded-md p-2 bg-transparent'
                                        required
                                        onChange={(e) => setUser_id(e.target.value)}
                                    >
                                        <option value=''></option>
                                        {
                                            users !== null && users.map(usr => {
                                                return <option key={usr?.id} value={usr?.id}>{usr?.username}</option>
                                            })
                                        }
                                    </select>
                                </div>
                            }
                                
                                <div className='w-full grid space-y-1'>
                                    <label>Local Government Area</label>
                                    <select 
                                        className='w-full border border-gray-400 rounded-md p-2 bg-transparent'
                                        value={local_government_id}
                                        required
                                        onChange={(e) => setLocal_government_id(e.target.value)}
                                    >
                                        <option value=''>{lgastaff !== null && lgastaff?.local_government?.name}</option>
                                        {
                                            lgas !== null && lgas.map(lga => {
                                                return <option key={lga?.id} value={lga?.id}>{lga?.name}</option>
                                            })
                                        }
                                    </select>
                                </div>
                                <div className='w-full flex justify-between md:justify-end items-center md:space-x-3 pt-2'>
                                    <button 
                                        className='w-[150px] p-3 hover:bg-gray-100 border border-[#0d544c] text-[#0d544c] rounded-md'
                                        onClick={() => closeShowmodal()}
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
                                            {lgastaff !== null ? 'Update' : 'Add'}
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

export default LgasStaffModal
