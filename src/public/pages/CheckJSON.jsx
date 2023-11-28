import React, { useEffect, useState } from 'react'
import { AiOutlineCloseCircle } from 'react-icons/ai';

const CheckJSON = () => {

    const [label, setLabel] = useState();
    const [type, setType] = useState();
    const [name, setName] = useState();
    const [condition, setCondition] = useState();
    const [source, setSource] = useState();
    const [required, setRequired] = useState(false);

    const [fields, setFields] = useState([]);
    const [formstructure, setFormstructure] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        setFields(fields => [
            ...fields,
            {
                label,
                type,
                name,
                condition,
                source,
                required
            }
        ]);
    }

    


    return (
        <div className='w-full flex justify-around items-center'>
            <div> 
                <div className='flex my-8'>
                    <h1 className='text-xl'>Create Forms</h1>
                </div>
                <form onSubmit={handleSubmit} className='space-y-4'>
                    <div className='grid space-y-1'>
                        <label>Field label</label>
                        <input 
                            type='text' 
                            className='w-full p-3 border border-gray-500 rounded-sm' 
                            onChange={(e) => setLabel(e.target.value)}   
                            required 
                        />
                    </div>
                    <div className='grid space-y-1'>
                        <label>Field type</label>
                        <select 
                            className='w-full p-3 border border-gray-500 rounded-sm'
                            onChange={(e) => setType(e.target.value)}  
                            required
                        >
                            <option value=''>select</option>
                            <option value='text'>text</option>
                            <option value='dropdown'>dropdown</option>
                            <option value='checkbox'>checkbox</option>
                        </select>
                    </div>
                {
                    type === 'dropdown' &&
                    <div className='grid space-y-1'>
                        <label>Data source</label>
                        <select 
                            className='w-full p-3 border border-gray-500 rounded-sm'
                            onChange={(e) => setSource(e.target.value)}  
                        >
                            <option value=''>select</option>
                            <option value='api/auth/community'>community</option>
                            <option value='api/auth/ward'>wards</option>
                            <option value='api/auth/localgovernments'>local governments</option>
                            <option value='api/auth/cities'>cities</option>
                        </select>
                    </div>
                }
                    <div className='grid space-y-1'>
                        <label>Field name</label>
                        <input 
                            type='text' 
                            className='w-full p-3 border border-gray-500 rounded-sm' 
                            onChange={(e) => setName(e.target.value)}  
                            required
                        />
                    </div>
                    <div className='grid space-y-1'>
                        <label>Field condition</label>
                        <input 
                            type='text' 
                            className='w-full p-3 border border-gray-500 rounded-sm' 
                            onChange={(e) => setCondition(e.target.value)}  
                        />
                    </div>
                    
                    <div className='grid space-y-1'>
                        <label>is Field required?</label>
                        <select 
                            className='w-full p-3 border border-gray-500 rounded-sm'
                            onChange={(e) => setRequired(e.target.value)}  
                        >
                            <option value=''>select</option>
                            <option value={true}>Yes</option>
                            <option value={false}>No</option>
                        </select>
                    </div>
                    <button className='bg-green-800 rounded-sm text-white p-3'>Add Field</button>
                </form>
            </div>
            <div className='my-6 w-[500px]'>
                {fields.length > 0 && fields.map((field, index) => {
                    return <div className='w-full grid border-b border-gray-200 my-2' key={index}>
                        {Object.keys(field).map((fld, i) => (
                            <div className='flex justify-between' key={i}>
                                <span>{fld}</span>
                                <span>{field[fld]}</span>
                                <AiOutlineCloseCircle size={15} />
                            </div>
                        ))}
                    </div>
                })}
            </div>
        </div>
    )
}

export default CheckJSON
