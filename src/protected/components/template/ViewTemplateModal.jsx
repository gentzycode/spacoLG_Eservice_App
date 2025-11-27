import React from 'react';
import { format } from 'date-fns';

const ViewTemplateModal = ({ template, onClose }) => {
    if (!template) return null;

    const config = template.configuration || {};

    const getTypeColor = (type) => {
        const colors = {
            formula: 'bg-purple-100 text-purple-800',
            criteria: 'bg-indigo-100 text-indigo-800',
            tiered: 'bg-orange-100 text-orange-800',
            manual: 'bg-blue-100 text-blue-800'
        };
        return colors[type] || 'bg-gray-100 text-gray-800';
    };

    const getStatusColor = (status) => {
        return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Template Details</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl">
                        ×
                    </button>
                </div>

                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Template Name</label>
                        <p className="text-lg font-semibold text-gray-800 dark:text-white">{template.name}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Revenue Head</label>
                        <p className="text-lg text-gray-800 dark:text-white">{template.revenue_head?.name || 'N/A'}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Assessment Type</label>
                        <span className={`inline-block px-3 py-1 text-sm rounded ${getTypeColor(template.assessment_type)}`}>
                            {template.assessment_type}
                        </span>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Status</label>
                        <span className={`inline-block px-3 py-1 text-sm rounded ${getStatusColor(template.status)}`}>
                            {template.status}
                        </span>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Base Rate</label>
                        <p className="text-lg font-semibold text-green-600">₦{Number(template.base_rate || 0).toLocaleString()}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Usage Count</label>
                        <p className="text-lg text-gray-800 dark:text-white">{template.usage_count || 0} assessments</p>
                    </div>
                </div>

                {template.description && (
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Description</label>
                        <p className="text-gray-700 dark:text-gray-300">{template.description}</p>
                    </div>
                )}

                {/* Type-Specific Configuration */}
                <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Configuration</h3>

                    {/* Formula Configuration */}
                    {template.assessment_type === 'formula' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Formula</label>
                            <div className="bg-gray-800 text-green-400 p-3 rounded font-mono text-sm">
                                {config.formula || 'No formula defined'}
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                This formula will be evaluated with the base rate and application data variables
                            </p>
                        </div>
                    )}

                    {/* Criteria Configuration */}
                    {template.assessment_type === 'criteria' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Criteria Rules</label>
                            {config.criteria && config.criteria.length > 0 ? (
                                <div className="space-y-2">
                                    {config.criteria.map((criterion, index) => (
                                        <div key={index} className="bg-white dark:bg-gray-600 p-3 rounded border border-gray-200 dark:border-gray-500">
                                            <div className="grid grid-cols-4 gap-2 text-sm">
                                                <div>
                                                    <span className="font-medium text-gray-600 dark:text-gray-300">Field:</span>
                                                    <p className="text-gray-800 dark:text-white">{criterion.field}</p>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-gray-600 dark:text-gray-300">Operator:</span>
                                                    <p className="text-gray-800 dark:text-white">{criterion.operator}</p>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-gray-600 dark:text-gray-300">Value:</span>
                                                    <p className="text-gray-800 dark:text-white">{criterion.value}</p>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-gray-600 dark:text-gray-300">Adjustment:</span>
                                                    <p className="text-green-600 font-semibold">
                                                        {criterion.type === 'percentage' ? `${criterion.adjustment}%` : `₦${Number(criterion.adjustment).toLocaleString()}`}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">No criteria defined</p>
                            )}
                        </div>
                    )}

                    {/* Tiered Configuration */}
                    {template.assessment_type === 'tiered' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Tier Structure</label>
                            {config.tiers && config.tiers.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-gray-200 dark:bg-gray-600">
                                            <tr>
                                                <th className="p-2 text-left">Min Value</th>
                                                <th className="p-2 text-left">Max Value</th>
                                                <th className="p-2 text-left">Rate</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {config.tiers.map((tier, index) => (
                                                <tr key={index} className="border-b border-gray-200 dark:border-gray-600">
                                                    <td className="p-2">{Number(tier.min_value).toLocaleString()}</td>
                                                    <td className="p-2">{tier.max_value ? Number(tier.max_value).toLocaleString() : 'Unlimited'}</td>
                                                    <td className="p-2 font-semibold text-green-600">₦{Number(tier.rate).toLocaleString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-gray-500">No tiers defined</p>
                            )}
                        </div>
                    )}

                    {/* Manual Configuration */}
                    {template.assessment_type === 'manual' && (
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            <p>This is a manual assessment template. The base rate of <span className="font-semibold text-green-600">₦{Number(template.base_rate).toLocaleString()}</span> serves as a starting point.</p>
                            <p className="mt-2">Reviewers will manually determine the final assessed amount during the approval process based on application details and their professional judgment.</p>
                        </div>
                    )}
                </div>

                {/* Metadata */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-sm">
                    <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Created At</label>
                        <p className="text-gray-700 dark:text-gray-300">
                            {template.created_at ? format(new Date(template.created_at), 'dd MMM yyyy, HH:mm') : 'N/A'}
                        </p>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Last Updated</label>
                        <p className="text-gray-700 dark:text-gray-300">
                            {template.updated_at ? format(new Date(template.updated_at), 'dd MMM yyyy, HH:mm') : 'N/A'}
                        </p>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Template ID</label>
                        <p className="text-gray-700 dark:text-gray-300">#{template.id}</p>
                    </div>
                </div>

                {/* Close Button */}
                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewTemplateModal;
