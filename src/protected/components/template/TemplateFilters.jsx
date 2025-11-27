import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { fetchRevenueHeads } from '../../../apis/revenueActions';

const TemplateFilters = ({ filters, onFilterChange }) => {
    const { token } = useContext(AuthContext);
    const [revenueHeads, setRevenueHeads] = useState([]);

    useEffect(() => {
        fetchRevHeads();
    }, []);

    const fetchRevHeads = async () => {
        try {
            const response = await fetchRevenueHeads();
            // API returns paginated data: { data: { data: [...] } }
            const heads = response?.data?.data || response?.data || [];
            setRevenueHeads(Array.isArray(heads) ? heads : []);
        } catch (err) {
            console.error('Error fetching revenue heads:', err);
            setRevenueHeads([]);
        }
    };

    const handleChange = (field, value) => {
        onFilterChange({ [field]: value });
    };

    const handleReset = () => {
        onFilterChange({
            status: '',
            assessment_type: '',
            revenue_head_id: '',
            search: '',
        });
    };

    return (
        <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Filters</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search</label>
                    <input
                        type="text"
                        value={filters.search}
                        onChange={(e) => handleChange('search', e.target.value)}
                        placeholder="Template name..."
                        className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                    <select
                        value={filters.status}
                        onChange={(e) => handleChange('status', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                        <option value="">All Statuses</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Template Type</label>
                    <select
                        value={filters.assessment_type}
                        onChange={(e) => handleChange('assessment_type', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                        <option value="">All Types</option>
                        <option value="formula">Formula</option>
                        <option value="criteria">Criteria</option>
                        <option value="tiered">Tiered</option>
                        <option value="manual">Manual</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Revenue Head</label>
                    <select
                        value={filters.revenue_head_id}
                        onChange={(e) => handleChange('revenue_head_id', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                        <option value="">All Revenue Heads</option>
                        {Array.isArray(revenueHeads) && revenueHeads.map((rh) => (
                            <option key={rh.id} value={rh.id}>{rh.name}</option>
                        ))}
                    </select>
                </div>
                <div className="flex items-end">
                    <button
                        onClick={handleReset}
                        className="w-full px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-colors"
                    >
                        Reset Filters
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TemplateFilters;
