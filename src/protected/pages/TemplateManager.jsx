import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import {
    fetchAssessmentTemplates,
    getTemplateStatistics,
    deleteAssessmentTemplate,
    activateTemplate,
    deactivateTemplate,
    cloneTemplate,
} from '../../apis/invoiceAssessmentActions';
import { toast } from 'react-toastify';
import TemplateStatistics from '../components/template/TemplateStatistics';
import TemplateFilters from '../components/template/TemplateFilters';
import TemplateTable from '../components/template/TemplateTable';
import CreateTemplateModal from '../components/template/CreateTemplateModal';
import ViewTemplateModal from '../components/template/ViewTemplateModal';
import ConfirmModal from '../components/common/ConfirmModal';
import { AiOutlinePlus, AiOutlineClose } from 'react-icons/ai';

const TemplateManager = () => {
    const { token } = useContext(AuthContext);
    const [templates, setTemplates] = useState([]);
    const [statistics, setStatistics] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 15,
        total: 0,
    });

    const [filters, setFilters] = useState({
        status: '',
        assessment_type: '',
        revenue_head_id: '',
        search: '',
        per_page: 15,
        page: 1,
    });

    // Modal state
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showDeactivateModal, setShowDeactivateModal] = useState(false);
    const [showCloneModal, setShowCloneModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(null);

    useEffect(() => {
        fetchData();
        fetchStats();
    }, [token, filters]);

    const fetchData = async () => {
        try {
            const response = await fetchAssessmentTemplates(token, filters, setError, setLoading);
            console.log('Templates API Response:', response);
            if (response) {
                // Handle different response structures
                const templatesData = response.templates?.data || response.data?.data || response.data || [];
                const paginationData = response.templates || response.data || response.pagination || {};

                setTemplates(Array.isArray(templatesData) ? templatesData : []);
                if (paginationData.current_page) {
                    setPagination({
                        current_page: paginationData.current_page || 1,
                        last_page: paginationData.last_page || 1,
                        per_page: paginationData.per_page || 15,
                        total: paginationData.total || 0,
                    });
                }
            }
        } catch (err) {
            console.error('Error fetching templates:', err);
            setError(err.message);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await getTemplateStatistics(token, setError, () => {});
            if (response && response.statistics) {
                setStatistics(response.statistics);
            }
        } catch (err) {
            console.error('Error fetching statistics:', err);
        }
    };

    const handleFilterChange = (newFilters) => {
        setFilters({ ...filters, ...newFilters, page: 1 });
    };

    const handleView = (template) => {
        setSelectedTemplate(template);
        setShowViewModal(true);
    };

    const handleEdit = (template) => {
        toast.info('Edit functionality coming soon');
    };

    const handleActivate = async (template) => {
        try {
            await activateTemplate(token, template.id, setError, setLoading);
            toast.success('Template activated successfully');
            fetchData();
            fetchStats();
        } catch (err) {
            toast.error(err.message || 'Failed to activate template');
        }
    };

    const handleDeactivate = (template) => {
        setSelectedTemplate(template);
        setShowDeactivateModal(true);
    };

    const handleDeactivateConfirm = async () => {
        try {
            await deactivateTemplate(token, selectedTemplate.id, setError, setLoading);
            toast.success('Template deactivated successfully');
            setShowDeactivateModal(false);
            setSelectedTemplate(null);
            fetchData();
            fetchStats();
        } catch (err) {
            toast.error(err.message || 'Failed to deactivate template');
        }
    };

    const handleClone = (template) => {
        setSelectedTemplate(template);
        setShowCloneModal(true);
    };

    const handleCloneConfirm = async () => {
        try {
            await cloneTemplate(token, selectedTemplate.id, setError, setLoading);
            toast.success('Template cloned successfully');
            setShowCloneModal(false);
            setSelectedTemplate(null);
            fetchData();
            fetchStats();
        } catch (err) {
            toast.error(err.message || 'Failed to clone template');
        }
    };

    const handleDelete = (template) => {
        if (template.usage_count > 0) {
            toast.error('Cannot delete template with existing assessments');
            return;
        }
        setSelectedTemplate(template);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await deleteAssessmentTemplate(token, selectedTemplate.id, setError, setLoading);
            toast.success('Template deleted successfully');
            setShowDeleteModal(false);
            setSelectedTemplate(null);
            fetchData();
            fetchStats();
        } catch (err) {
            toast.error(err.message || 'Failed to delete template');
        }
    };

    const handleCreateSuccess = () => {
        setShowCreateModal(false);
        fetchData();
        fetchStats();
    };

    const handlePageChange = (newPage) => {
        setFilters({ ...filters, page: newPage });
    };

    return (
        <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900">
            {error && (
                <div className="px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between text-red-600 dark:text-red-400 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                        <span>{error}</span>
                        <button onClick={() => setError(null)} className="text-red-600 hover:text-red-800">
                            <AiOutlineClose size={20} />
                        </button>
                    </div>
                </div>
            )}

            <div className="px-4 sm:px-6 lg:px-8 py-6">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Assessment Templates</h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage assessment calculation templates for revenue collection</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="px-5 py-2.5 bg-[#3B78BD] text-white rounded-lg hover:bg-[#F0B652] transition-all duration-300 shadow-md flex items-center space-x-2 font-semibold"
                        >
                            <AiOutlinePlus size={20} />
                            <span>Create Template</span>
                        </button>
                    </div>
                </div>

                {/* Statistics Section */}
                <TemplateStatistics statistics={statistics} loading={!statistics} />

                {/* Filters Section */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 mb-6">
                    <TemplateFilters filters={filters} onFilterChange={handleFilterChange} />
                </div>

                {/* Table Section */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                    <div className="p-6">
                        <TemplateTable
                            templates={templates}
                            loading={loading}
                            error={error}
                            onView={handleView}
                            onEdit={handleEdit}
                            onActivate={handleActivate}
                            onDeactivate={handleDeactivate}
                            onClone={handleClone}
                            onDelete={handleDelete}
                        />
                    </div>

                    {/* Pagination */}
                    {pagination.last_page > 1 && (
                        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900">
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                Showing {((pagination.current_page - 1) * pagination.per_page) + 1} to{' '}
                                {Math.min(pagination.current_page * pagination.per_page, pagination.total)} of{' '}
                                {pagination.total} templates
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => handlePageChange(pagination.current_page - 1)}
                                    disabled={pagination.current_page === 1}
                                    className="px-4 py-2 bg-[#3B78BD] text-white rounded-lg hover:bg-[#F0B652] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <span className="text-gray-700 dark:text-gray-300 font-medium">
                                    Page {pagination.current_page} of {pagination.last_page}
                                </span>
                                <button
                                    onClick={() => handlePageChange(pagination.current_page + 1)}
                                    disabled={pagination.current_page === pagination.last_page}
                                    className="px-4 py-2 bg-[#3B78BD] text-white rounded-lg hover:bg-[#F0B652] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            {showCreateModal && (
                <CreateTemplateModal
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={handleCreateSuccess}
                />
            )}

            {showViewModal && selectedTemplate && (
                <ViewTemplateModal
                    template={selectedTemplate}
                    onClose={() => {
                        setShowViewModal(false);
                        setSelectedTemplate(null);
                    }}
                />
            )}

            {/* Deactivate Confirmation */}
            <ConfirmModal
                isOpen={showDeactivateModal}
                onClose={() => setShowDeactivateModal(false)}
                onConfirm={handleDeactivateConfirm}
                title="Deactivate Template"
                message={selectedTemplate ? `Deactivate template "${selectedTemplate.name}"? It will no longer be available for new assessments.` : ''}
                confirmText="Deactivate"
                confirmButtonClass="bg-orange-500 hover:bg-orange-600"
                loading={loading}
            />

            {/* Clone Confirmation */}
            <ConfirmModal
                isOpen={showCloneModal}
                onClose={() => setShowCloneModal(false)}
                onConfirm={handleCloneConfirm}
                title="Clone Template"
                message={selectedTemplate ? `Clone template "${selectedTemplate.name}"?` : ''}
                confirmText="Clone"
                confirmButtonClass="bg-blue-500 hover:bg-blue-600"
                loading={loading}
            />

            {/* Delete Confirmation */}
            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDeleteConfirm}
                title="Delete Template"
                message={selectedTemplate ? `Delete template "${selectedTemplate.name}"? This action cannot be undone.` : ''}
                confirmText="Delete"
                confirmButtonClass="bg-red-500 hover:bg-red-600"
                loading={loading}
            />
        </div>
    );
};

export default TemplateManager;
