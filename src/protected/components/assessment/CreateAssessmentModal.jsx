import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { createAssessment, fetchAssessmentTemplates } from '../../../apis/invoiceAssessmentActions';
import { fetchRevenueHeads } from '../../../apis/revenueActions';
import { toast } from 'react-toastify';

const CreateAssessmentModal = ({ onClose, onSuccess }) => {
    const { token } = useContext(AuthContext);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [templates, setTemplates] = useState([]);
    const [revenueHeads, setRevenueHeads] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [calculatedAmount, setCalculatedAmount] = useState(null);

    const [formData, setFormData] = useState({
        template_id: '',
        revenue_head_id: '',
        applicant_name: '',
        applicant_phone: '',
        applicant_email: '',
        applicant_address: '',
        payer_type: 'individual',
        application_data: {},
        notes: '',
    });

    useEffect(() => {
        loadTemplates();
        loadRevenueHeads();
    }, []);

    useEffect(() => {
        if (selectedTemplate) {
            calculatePreview();
        }
    }, [formData.application_data, selectedTemplate]);

    const loadTemplates = async () => {
        try {
            const response = await fetchAssessmentTemplates(token, { active_only: true }, null, () => {});
            // Handle different response structures
            const templatesData = response?.templates?.data || response?.data?.data || response?.data || [];
            setTemplates(Array.isArray(templatesData) ? templatesData : []);
        } catch (err) {
            console.error('Error fetching templates:', err);
        }
    };

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

    const handleTemplateChange = (templateId) => {
        const template = templates.find(t => t.id === parseInt(templateId));
        setSelectedTemplate(template);
        setFormData({
            ...formData,
            template_id: templateId,
            revenue_head_id: template?.revenue_head_id || '',
            application_data: {},
        });
        setCalculatedAmount(null);
    };

    const handleApplicationDataChange = (field, value) => {
        setFormData({
            ...formData,
            application_data: {
                ...formData.application_data,
                [field]: value,
            },
        });
    };

    const calculatePreview = () => {
        if (!selectedTemplate) return;

        try {
            const baseRate = parseFloat(selectedTemplate.base_rate) || 0;
            const config = selectedTemplate.configuration || {};
            const appData = formData.application_data;
            let amount = baseRate;

            switch (selectedTemplate.assessment_type) {
                case 'formula':
                    if (config.formula) {
                        // Simple formula evaluation (for preview only)
                        let formula = config.formula;
                        formula = formula.replace(/base_rate/g, baseRate);
                        Object.keys(appData).forEach(key => {
                            const regex = new RegExp(key, 'g');
                            formula = formula.replace(regex, parseFloat(appData[key]) || 0);
                        });
                        try {
                            amount = eval(formula);
                        } catch (e) {
                            amount = baseRate;
                        }
                    }
                    break;

                case 'criteria':
                    if (config.criteria && Array.isArray(config.criteria)) {
                        config.criteria.forEach(criterion => {
                            const fieldValue = appData[criterion.field];
                            let matches = false;

                            switch (criterion.operator) {
                                case 'equals':
                                    matches = String(fieldValue) === String(criterion.value);
                                    break;
                                case 'greater_than':
                                    matches = parseFloat(fieldValue) > parseFloat(criterion.value);
                                    break;
                                case 'less_than':
                                    matches = parseFloat(fieldValue) < parseFloat(criterion.value);
                                    break;
                                case 'contains':
                                    matches = String(fieldValue).toLowerCase().includes(String(criterion.value).toLowerCase());
                                    break;
                            }

                            if (matches) {
                                if (criterion.type === 'percentage') {
                                    amount += (baseRate * parseFloat(criterion.adjustment) / 100);
                                } else {
                                    amount += parseFloat(criterion.adjustment) || 0;
                                }
                            }
                        });
                    }
                    break;

                case 'tiered':
                    if (config.tiers && Array.isArray(config.tiers)) {
                        const quantity = parseFloat(appData.quantity) || 0;
                        const tier = config.tiers.find(t => {
                            const min = parseFloat(t.min_value) || 0;
                            const max = t.max_value ? parseFloat(t.max_value) : Infinity;
                            return quantity >= min && quantity <= max;
                        });
                        if (tier) {
                            amount = parseFloat(tier.rate) || baseRate;
                        }
                    }
                    break;

                case 'manual':
                default:
                    amount = baseRate;
                    break;
            }

            setCalculatedAmount(amount);
        } catch (err) {
            console.error('Error calculating preview:', err);
            setCalculatedAmount(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!selectedTemplate) {
            setError('Please select a template');
            return;
        }

        try {
            await createAssessment(token, formData, setError, setSubmitting);
            toast.success('Assessment created successfully');
            onSuccess();
        } catch (err) {
            toast.error(err.message || 'Failed to create assessment');
        }
    };

    const renderDynamicFields = () => {
        if (!selectedTemplate) return null;

        const config = selectedTemplate.configuration || {};

        switch (selectedTemplate.assessment_type) {
            case 'formula':
                // Extract variable names from formula
                const formulaVars = config.formula ?
                    config.formula.match(/\b(?!base_rate\b)\w+/g)?.filter((v, i, arr) => arr.indexOf(v) === i) || []
                    : [];
                return (
                    <div>
                        <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Application Details</h4>
                        <p className="text-xs text-gray-500 mb-3">Formula: {config.formula}</p>
                        {formulaVars.map((varName, index) => (
                            <div key={index} className="mb-3">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    {varName.charAt(0).toUpperCase() + varName.slice(1).replace(/_/g, ' ')} *
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.application_data[varName] || ''}
                                    onChange={(e) => handleApplicationDataChange(varName, e.target.value)}
                                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    required
                                />
                            </div>
                        ))}
                    </div>
                );

            case 'criteria':
                const fields = config.criteria ? [...new Set(config.criteria.map(c => c.field))] : [];
                return (
                    <div>
                        <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Application Details</h4>
                        {fields.map((fieldName, index) => (
                            <div key={index} className="mb-3">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    {fieldName.charAt(0).toUpperCase() + fieldName.slice(1).replace(/_/g, ' ')} *
                                </label>
                                <input
                                    type="text"
                                    value={formData.application_data[fieldName] || ''}
                                    onChange={(e) => handleApplicationDataChange(fieldName, e.target.value)}
                                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    required
                                />
                            </div>
                        ))}
                    </div>
                );

            case 'tiered':
                return (
                    <div>
                        <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Application Details</h4>
                        <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Quantity *
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.application_data.quantity || ''}
                                onChange={(e) => handleApplicationDataChange('quantity', e.target.value)}
                                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                required
                            />
                        </div>
                        {config.tiers && (
                            <div className="text-xs text-gray-500 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                                <p className="font-medium mb-1">Rate Tiers:</p>
                                {config.tiers.map((tier, i) => (
                                    <p key={i}>{tier.min_value} - {tier.max_value || '∞'}: ₦{Number(tier.rate).toLocaleString()}</p>
                                ))}
                            </div>
                        )}
                    </div>
                );

            case 'manual':
            default:
                return (
                    <div className="text-sm text-gray-600 dark:text-gray-400 p-3 bg-gray-50 dark:bg-gray-700 rounded">
                        This template uses manual assessment. The base rate serves as a starting point, and the final amount will be determined during the approval process.
                    </div>
                );
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Create Assessment</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl">
                        ×
                    </button>
                </div>

                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

                <form onSubmit={handleSubmit}>
                    {/* Template Selection */}
                    <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Assessment Template *</label>
                        <select
                            value={formData.template_id}
                            onChange={(e) => handleTemplateChange(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            required
                        >
                            <option value="">Select a template</option>
                            {templates.map((t) => (
                                <option key={t.id} value={t.id}>
                                    {t.name} - {t.assessment_type} (₦{Number(t.base_rate).toLocaleString()})
                                </option>
                            ))}
                        </select>
                        {selectedTemplate && (
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                                {selectedTemplate.description || `Base rate: ₦${Number(selectedTemplate.base_rate).toLocaleString()}`}
                            </p>
                        )}
                    </div>

                    {selectedTemplate && (
                        <>
                            {/* Applicant Information */}
                            <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Applicant Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Payer Type *</label>
                                        <select
                                            value={formData.payer_type}
                                            onChange={(e) => handleChange('payer_type', e.target.value)}
                                            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            required
                                        >
                                            <option value="individual">Individual</option>
                                            <option value="corporate">Corporate</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name *</label>
                                        <input
                                            type="text"
                                            value={formData.applicant_name}
                                            onChange={(e) => handleChange('applicant_name', e.target.value)}
                                            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number *</label>
                                        <input
                                            type="tel"
                                            value={formData.applicant_phone}
                                            onChange={(e) => handleChange('applicant_phone', e.target.value)}
                                            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                                        <input
                                            type="email"
                                            value={formData.applicant_email}
                                            onChange={(e) => handleChange('applicant_email', e.target.value)}
                                            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
                                        <textarea
                                            value={formData.applicant_address}
                                            onChange={(e) => handleChange('applicant_address', e.target.value)}
                                            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            rows="2"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Dynamic Fields Based on Template */}
                            <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                {renderDynamicFields()}
                            </div>

                            {/* Calculation Preview */}
                            {calculatedAmount !== null && (
                                <div className="mb-4 p-4 bg-green-50 dark:bg-green-900 rounded-lg">
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Calculated Amount (Preview)</h3>
                                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                                        ₦{Number(calculatedAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                        This is a preview. Final amount may be adjusted during review.
                                    </p>
                                </div>
                            )}

                            {/* Notes */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) => handleChange('notes', e.target.value)}
                                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    rows="3"
                                    placeholder="Any additional information..."
                                />
                            </div>
                        </>
                    )}

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
                            disabled={submitting || !selectedTemplate}
                        >
                            {submitting ? 'Creating...' : 'Create Assessment'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateAssessmentModal;
