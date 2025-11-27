import React from 'react';
import { format } from 'date-fns';

const TemplateTable = ({ templates, loading, error, onView, onEdit, onActivate, onDeactivate, onClone, onDelete }) => {
    if (loading) return <div className="text-center py-8"><div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#3B78BD]"></div><p className="mt-2 text-gray-600 dark:text-gray-400">Loading templates...</p></div>;
    if (error) return <div className="text-center py-8"><p className="text-red-500">{error}</p></div>;
    if (!templates || templates.length === 0) return <div className="text-center py-8"><p className="text-gray-600 dark:text-gray-400">No templates found.</p></div>;

    const getStatusColor = (status) => {
        return status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    };

    const getTypeColor = (type) => {
        const colors = {
            formula: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
            criteria: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
            tiered: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
            manual: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
        };
        return colors[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
                <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                        <th className="p-3 border-b font-semibold text-gray-800 dark:text-gray-200">Name</th>
                        <th className="p-3 border-b font-semibold text-gray-800 dark:text-gray-200">Type</th>
                        <th className="p-3 border-b font-semibold text-gray-800 dark:text-gray-200">Revenue Head</th>
                        <th className="p-3 border-b font-semibold text-gray-800 dark:text-gray-200">Base Rate</th>
                        <th className="p-3 border-b font-semibold text-gray-800 dark:text-gray-200">Status</th>
                        <th className="p-3 border-b font-semibold text-gray-800 dark:text-gray-200">Usage Count</th>
                        <th className="p-3 border-b font-semibold text-gray-800 dark:text-gray-200">Created</th>
                        <th className="p-3 border-b font-semibold text-gray-800 dark:text-gray-200">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {templates.map((template) => (
                        <tr key={template.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                            <td className="p-3">
                                <div>
                                    <p className="font-medium text-gray-800 dark:text-white">{template.name}</p>
                                    {template.description && <p className="text-xs text-gray-500 dark:text-gray-400">{template.description}</p>}
                                </div>
                            </td>
                            <td className="p-3">
                                <span className={`px-2 py-1 text-xs rounded ${getTypeColor(template.assessment_type)}`}>
                                    {template.assessment_type}
                                </span>
                            </td>
                            <td className="p-3 text-gray-800 dark:text-gray-200">{template.revenue_head?.name || 'N/A'}</td>
                            <td className="p-3 font-semibold text-gray-800 dark:text-gray-200">₦{Number(template.base_rate || 0).toLocaleString()}</td>
                            <td className="p-3">
                                <span className={`px-2 py-1 text-xs rounded ${getStatusColor(template.status)}`}>
                                    {template.status}
                                </span>
                            </td>
                            <td className="p-3 text-center text-gray-800 dark:text-gray-200">{template.usage_count || 0}</td>
                            <td className="p-3 text-gray-800 dark:text-gray-200">{template.created_at ? format(new Date(template.created_at), 'dd/MM/yyyy') : 'N/A'}</td>
                            <td className="p-3">
                                <div className="flex flex-wrap gap-1">
                                    <button onClick={() => onView(template)} className="px-2 py-1 bg-gray-500 hover:bg-gray-600 text-white text-xs rounded" title="View">View</button>
                                    {template.status === 'inactive' && <button onClick={() => onEdit(template)} className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded">Edit</button>}
                                    {template.status === 'active' && <button onClick={() => onDeactivate(template)} className="px-2 py-1 bg-yellow-500 hover:bg-yellow-600 text-white text-xs rounded">Deactivate</button>}
                                    {template.status === 'inactive' && <button onClick={() => onActivate(template)} className="px-2 py-1 bg-green-500 hover:bg-green-600 text-white text-xs rounded">Activate</button>}
                                    <button onClick={() => onClone(template)} className="px-2 py-1 bg-[#3B78BD] hover:bg-[#F0B652] text-white text-xs rounded">Clone</button>
                                    {template.usage_count === 0 && <button onClick={() => onDelete(template)} className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded">Delete</button>}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TemplateTable;
