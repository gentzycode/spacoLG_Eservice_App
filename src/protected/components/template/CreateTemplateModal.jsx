import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { createAssessmentTemplate } from '../../../apis/invoiceAssessmentActions';
import { fetchRevenueHeads } from '../../../apis/revenueActions';
import { toast } from 'react-toastify';

const CreateTemplateModal = ({ onClose, onSuccess }) => {
    const { token } = useContext(AuthContext);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [revenueHeads, setRevenueHeads] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        assessment_type: 'formula',
        revenue_head_id: '',
        base_rate: '',
        formula: '',
        criteria_config: [],
        tier_config: [],
    });

    useEffect(() => {
        loadRevenueHeads();
    }, []);

    const loadRevenueHeads = async () => {
        try {
            const response = await fetchRevenueHeads();
            const heads = response?.data?.data || response?.data || [];
            setRevenueHeads(Array.isArray(heads) ? heads : []);
        } catch (err) {
            console.error('Error fetching revenue heads:', err);
        }
    };

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            // Prepare config based on type
            let config = {};
            if (formData.assessment_type === 'formula') {
                config = { formula: formData.formula };
            } else if (formData.assessment_type === 'criteria') {
                config = { criteria: formData.criteria_config };
            } else if (formData.assessment_type === 'tiered') {
                config = { tiers: formData.tier_config };
            }

            const payload = {
                name: formData.name,
                description: formData.description,
                assessment_type: formData.assessment_type,
                revenue_head_id: formData.revenue_head_id,
                base_rate: formData.base_rate,
                configuration: config,
            };

            await createAssessmentTemplate(token, payload, setError, setSubmitting);
            toast.success('Template created successfully');
            onSuccess();
        } catch (err) {
            toast.error(err.message || 'Failed to create template');
        }
    };

    // Criteria handlers
    const addCriterion = () => {
        setFormData({
            ...formData,
            criteria_config: [
                ...formData.criteria_config,
                { field: '', operator: 'equals', value: '', adjustment: 0, type: 'fixed' }
            ]
        });
    };

    const updateCriterion = (index, field, value) => {
        const updated = [...formData.criteria_config];
        updated[index][field] = value;
        setFormData({ ...formData, criteria_config: updated });
    };

    const removeCriterion = (index) => {
        setFormData({
            ...formData,
            criteria_config: formData.criteria_config.filter((_, i) => i !== index)
        });
    };

    // Tier handlers
    const addTier = () => {
        setFormData({
            ...formData,
            tier_config: [
                ...formData.tier_config,
                { min_value: 0, max_value: null, rate: 0 }
            ]
        });
    };

    const updateTier = (index, field, value) => {
        const updated = [...formData.tier_config];
        updated[index][field] = value === '' ? null : value;
        setFormData({ ...formData, tier_config: updated });
    };

    const removeTier = (index) => {
        setFormData({
            ...formData,
            tier_config: formData.tier_config.filter((_, i) => i !== index)
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Create Assessment Template</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl">
                        ×
                    </button>
                </div>

                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

                <form onSubmit={handleSubmit}>
                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Template Name *</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Revenue Head *</label>
                            <select
                                value={formData.revenue_head_id}
                                onChange={(e) => handleChange('revenue_head_id', e.target.value)}
                                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                required
                            >
                                <option value="">Select Revenue Head</option>
                                {Array.isArray(revenueHeads) && revenueHeads.map((rh) => (
                                    <option key={rh.id} value={rh.id}>{rh.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            rows="2"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Assessment Type *</label>
                            <select
                                value={formData.assessment_type}
                                onChange={(e) => handleChange('assessment_type', e.target.value)}
                                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                required
                            >
                                <option value="formula">Formula-Based</option>
                                <option value="criteria">Criteria-Based</option>
                                <option value="tiered">Tiered Pricing</option>
                                <option value="manual">Manual Assessment</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Base Rate (₦) *</label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.base_rate}
                                onChange={(e) => handleChange('base_rate', e.target.value)}
                                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                required
                            />
                        </div>
                    </div>

                    {/* Type-Specific Configuration */}
                    <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                            {formData.assessment_type === 'formula' && 'Formula Configuration'}
                            {formData.assessment_type === 'criteria' && 'Criteria Configuration'}
                            {formData.assessment_type === 'tiered' && 'Tier Configuration'}
                            {formData.assessment_type === 'manual' && 'Manual Assessment'}
                        </h3>

                        {/* Formula Type */}
                        {formData.assessment_type === 'formula' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Formula * <span className="text-xs text-gray-500">(e.g., base_rate * area * 1.1)</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.formula}
                                    onChange={(e) => handleChange('formula', e.target.value)}
                                    placeholder="base_rate * variable_name"
                                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Available variables: base_rate, and any custom fields defined in application_data
                                </p>
                            </div>
                        )}

                        {/* Criteria Type */}
                        {formData.assessment_type === 'criteria' && (
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Add criteria that adjust the base rate</p>
                                    <button
                                        type="button"
                                        onClick={addCriterion}
                                        className="px-3 py-1 bg-[#3B78BD] hover:bg-[#F0B652] text-white text-sm rounded"
                                    >
                                        + Add Criterion
                                    </button>
                                </div>
                                {formData.criteria_config.map((criterion, index) => (
                                    <div key={index} className="grid grid-cols-12 gap-2 mb-2 items-end">
                                        <div className="col-span-3">
                                            <input
                                                type="text"
                                                value={criterion.field}
                                                onChange={(e) => updateCriterion(index, 'field', e.target.value)}
                                                placeholder="Field name"
                                                className="w-full px-2 py-1 border rounded text-sm dark:bg-gray-600 dark:border-gray-500"
                                                required
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <select
                                                value={criterion.operator}
                                                onChange={(e) => updateCriterion(index, 'operator', e.target.value)}
                                                className="w-full px-2 py-1 border rounded text-sm dark:bg-gray-600 dark:border-gray-500"
                                            >
                                                <option value="equals">Equals</option>
                                                <option value="greater_than">Greater Than</option>
                                                <option value="less_than">Less Than</option>
                                                <option value="contains">Contains</option>
                                            </select>
                                        </div>
                                        <div className="col-span-2">
                                            <input
                                                type="text"
                                                value={criterion.value}
                                                onChange={(e) => updateCriterion(index, 'value', e.target.value)}
                                                placeholder="Value"
                                                className="w-full px-2 py-1 border rounded text-sm dark:bg-gray-600 dark:border-gray-500"
                                                required
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <select
                                                value={criterion.type}
                                                onChange={(e) => updateCriterion(index, 'type', e.target.value)}
                                                className="w-full px-2 py-1 border rounded text-sm dark:bg-gray-600 dark:border-gray-500"
                                            >
                                                <option value="fixed">Fixed (₦)</option>
                                                <option value="percentage">Percentage (%)</option>
                                            </select>
                                        </div>
                                        <div className="col-span-2">
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={criterion.adjustment}
                                                onChange={(e) => updateCriterion(index, 'adjustment', e.target.value)}
                                                placeholder="Amount"
                                                className="w-full px-2 py-1 border rounded text-sm dark:bg-gray-600 dark:border-gray-500"
                                                required
                                            />
                                        </div>
                                        <div className="col-span-1">
                                            <button
                                                type="button"
                                                onClick={() => removeCriterion(index)}
                                                className="w-full px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Tiered Type */}
                        {formData.assessment_type === 'tiered' && (
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Define rate tiers based on quantity ranges</p>
                                    <button
                                        type="button"
                                        onClick={addTier}
                                        className="px-3 py-1 bg-[#3B78BD] hover:bg-[#F0B652] text-white text-sm rounded"
                                    >
                                        + Add Tier
                                    </button>
                                </div>
                                {formData.tier_config.map((tier, index) => (
                                    <div key={index} className="grid grid-cols-12 gap-2 mb-2 items-end">
                                        <div className="col-span-4">
                                            <label className="text-xs text-gray-600">Min Value</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={tier.min_value}
                                                onChange={(e) => updateTier(index, 'min_value', e.target.value)}
                                                className="w-full px-2 py-1 border rounded text-sm dark:bg-gray-600 dark:border-gray-500"
                                                required
                                            />
                                        </div>
                                        <div className="col-span-4">
                                            <label className="text-xs text-gray-600">Max Value (null = unlimited)</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={tier.max_value || ''}
                                                onChange={(e) => updateTier(index, 'max_value', e.target.value)}
                                                placeholder="Unlimited"
                                                className="w-full px-2 py-1 border rounded text-sm dark:bg-gray-600 dark:border-gray-500"
                                            />
                                        </div>
                                        <div className="col-span-3">
                                            <label className="text-xs text-gray-600">Rate (₦)</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={tier.rate}
                                                onChange={(e) => updateTier(index, 'rate', e.target.value)}
                                                className="w-full px-2 py-1 border rounded text-sm dark:bg-gray-600 dark:border-gray-500"
                                                required
                                            />
                                        </div>
                                        <div className="col-span-1">
                                            <button
                                                type="button"
                                                onClick={() => removeTier(index)}
                                                className="w-full px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Manual Type */}
                        {formData.assessment_type === 'manual' && (
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                <p>Manual assessment templates use the base rate as a starting point.</p>
                                <p className="mt-2">Reviewers will manually adjust the final assessed amount during the approval process.</p>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md"
                            disabled={submitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-[#3B78BD] hover:bg-[#F0B652] text-white rounded-md disabled:bg-gray-400"
                            disabled={submitting}
                        >
                            {submitting ? 'Creating...' : 'Create Template'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTemplateModal;
