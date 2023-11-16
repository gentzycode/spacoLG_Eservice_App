import React, { useEffect, useMemo, useState } from 'react'

const FilterComponent = ({ data, setFilteredData }) => {

    const [filtered, setFiltered] = useState('');

    const clearFilter = () => {
        setFiltered('');
    }

    const filterData = useMemo(() => {

        let filteredItems = data;

        if(filtered){
            filteredItems = data.filter(
                item =>
                  JSON.stringify(item)
                    .toLowerCase()
                    .indexOf(filtered.toLowerCase()) !== -1
              );
        }

        return filteredItems;

    }, [filtered])


    useEffect(() => {
        setFilteredData(filterData);
    }, [filtered])

    return (
        <div className='w-full flex justify-end mt-0.5 mb-4'>
            <div className='flex items-center'>
                <input 
                    type='text'
                    value={filtered}
                    className='border border-gray-400 bg-transparent rounded-l-md p-3'
                    placeholder='filter'
                    onChange={(e) => setFiltered(e.target.value)}
                />
                <div 
                    className='border-y border-r border-gray-400 p-3 rounded-r-md text-gray-500 cursor-pointer hover:bg-gray-100'
                    onClick={() => clearFilter()}
                >
                    X
                </div>
            </div>
        </div>
    )
}

export default FilterComponent
