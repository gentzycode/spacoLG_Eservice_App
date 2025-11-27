import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { fetchAssessmentTemplates } from '../../../apis/invoiceAssessmentActions';
import { fetchRevenueHeads } from '../../../apis/revenueActions';

const AssessmentFilters = ({ filters, onFilterChange }) => {
    const { token } = useContext(AuthContext);
    const [templates, setTemplates] = useState([]);
    const [revenueHeads, setRevenueHeads] = useState([]);

    useEffect(() => {
        fetchTemplates();
        fetchRevHeads();
    }, []);

    const fetchTemplates = async () => {
        try {
            const response = await fetchAssessmentTemplates(token, { active_only: true }, null, () => {});
            // Handle different response structures
            const templatesData = response?.templates?.data || response?.data?.data || response?.data || [];
            setTemplates(Array.isArray(templatesData) ? templatesData : []);
        } catch (err) {
            console.error('Error fetching templates:', err);
        }
    };

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
            template_id: '',
            revenue_head_id: '',
            applicant_phone: '',
            start_date: '',
            end_date: '',
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
                        placeholder="Assessment number, applicant..."
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
                        <option value="pending">Pending</option>
                        <option value="under_review">Under Review</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="invoice_generated">Invoice Generated</option>
                        <option value="paid">Paid</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Template</label>
                    <select
                        value={filters.template_id}
                        onChange={(e) => handleChange('template_id', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                        <option value="">All Templates</option>
                        {templates.map((t) => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
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
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Applicant Phone</label>
                    <input
                        type="text"
                        value={filters.applicant_phone}
                        onChange={(e) => handleChange('applicant_phone', e.target.value)}
                        placeholder="080..."
                        className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
                    <input
                        type="date"
                        value={filters.start_date}
                        onChange={(e) => handleChange('start_date', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
                    <input
                        type="date"
                        value={filters.end_date}
                        onChange={(e) => handleChange('end_date', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
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

export default AssessmentFilters;
