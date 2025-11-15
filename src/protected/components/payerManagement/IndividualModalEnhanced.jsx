import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { AiOutlineClose, AiOutlineCopy, AiOutlineEdit, AiOutlineUser, AiOutlineIdcard, AiOutlineHome, AiOutlineMail, AiOutlineDollar } from 'react-icons/ai';

const IndividualModalEnhanced = ({ individual, closeModal, onSave, viewMode }) => {
    const { user } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('basic');
    const [formData, setFormData] = useState({
        // Basic Info
        first_name: '',
        middle_name: '',
        last_name: '',
        gender: '',
        date_of_birth: '',
        title: '',

        // Government IDs
        nin: '',
        bvn: '',
        drivers_license: '',
        passport_number: '',
        voters_card: '',
        tin: '',

        // Personal Details
        marital_status: '',
        nationality: 'Nigerian',
        state_of_origin: '',
        lga_of_origin: '',
        religion: '',

        // Economic Profile
        employment_status: '',
        employer_name: '',
        employer_address: '',
        occupation: '',
        industry_sector: '',
        estimated_annual_income: '',
        income_bracket: '',

        // Location
        address: '',
        address_line2: '',
        area: '',
        city: '',
        lga_id: '',
        ward: '',
        community: '',
        postal_code: '',
        landmark: '',
        address_type: '',
        office_address: '',

        // Contact
        email: '',
        mobile_number: '',
        secondary_phone: '',
        work_phone: '',
        whatsapp_number: '',
        secondary_email: '',
        preferred_contact_method: '',

        // Metadata
        notes: '',
    });

    const [errors, setErrors] = useState({ message: '', fields: {} });
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [similarPayers, setSimilarPayers] = useState([]);

    useEffect(() => {
        if (individual) {
            setFormData({
                first_name: individual.first_name || '',
                middle_name: individual.middle_name || '',
                last_name: individual.last_name || '',
                gender: individual.gender || '',
                date_of_birth: individual.date_of_birth || '',
                title: individual.title || '',
                nin: individual.nin || '',
                bvn: individual.bvn || '',
                drivers_license: individual.drivers_license || '',
                passport_number: individual.passport_number || '',
                voters_card: individual.voters_card || '',
                tin: individual.tin || '',
                marital_status: individual.marital_status || '',
                nationality: individual.nationality || 'Nigerian',
                state_of_origin: individual.state_of_origin || '',
                lga_of_origin: individual.lga_of_origin || '',
                religion: individual.religion || '',
                employment_status: individual.employment_status || '',
                employer_name: individual.employer_name || '',
                employer_address: individual.employer_address || '',
                occupation: individual.occupation || '',
                industry_sector: individual.industry_sector || '',
                estimated_annual_income: individual.estimated_annual_income || '',
                income_bracket: individual.income_bracket || '',
                address: individual.address || '',
                address_line2: individual.address_line2 || '',
                area: individual.area || '',
                city: individual.city || '',
                lga_id: individual.lga_id || '',
                ward: individual.ward || '',
                community: individual.community || '',
                postal_code: individual.postal_code || '',
                landmark: individual.landmark || '',
                address_type: individual.address_type || '',
                office_address: individual.office_address || '',
                email: individual.email || '',
                mobile_number: individual.mobile_number || '',
                secondary_phone: individual.secondary_phone || '',
                work_phone: individual.work_phone || '',
                whatsapp_number: individual.whatsapp_number || '',
                secondary_email: individual.secondary_email || '',
                preferred_contact_method: individual.preferred_contact_method || '',
                notes: individual.notes || '',
            });
            checkForSimilarPayers();
        } else {
            setIsEditing(true);
        }
    }, [individual]);

    const checkForSimilarPayers = () => {
        // Mock implementation - replace with actual API call
        setSimilarPayers([]);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        const newErrors = { message: '', fields: {} };

        // Basic required fields
        if (!formData.first_name) newErrors.fields.first_name = 'First name is required';
        if (!formData.last_name) newErrors.fields.last_name = 'Last name is required';
        if (!formData.gender) newErrors.fields.gender = 'Gender is required';
        if (!formData.date_of_birth) newErrors.fields.date_of_birth = 'Date of birth is required';
        if (!formData.address) newErrors.fields.address = 'Address is required';
        if (!formData.email) newErrors.fields.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.fields.email = 'Email is invalid';

        // Validate mobile number format
        if (formData.mobile_number && !/^\d{10,15}$/.test(formData.mobile_number)) {
            newErrors.fields.mobile_number = 'Mobile number must be 10-15 digits';
        }

        // Validate NIN format (11 digits)
        if (formData.nin && !/^\d{11}$/.test(formData.nin)) {
            newErrors.fields.nin = 'NIN must be 11 digits';
        }

        // Validate BVN format (11 digits)
        if (formData.bvn && !/^\d{11}$/.test(formData.bvn)) {
            newErrors.fields.bvn = 'BVN must be 11 digits';
        }

        setErrors(newErrors);
        return Object.keys(newErrors.fields).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        setErrors({ message: '', fields: {} });

        const payload = {
            ...formData,
            created_by_id: user?.id,
        };

        try {
            await onSave(individual ? individual.id : null, payload);
            closeModal();
        } catch (err) {
            console.error('Error saving individual:', err.response?.data || err.message);
            const errorMessage = err.response?.data?.message || err.message || 'Failed to save individual';
            setErrors({ message: errorMessage, fields: err.response?.data?.errors || {} });
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        alert('Reference copied to clipboard');
    };

    const toggleEdit = () => {
        setIsEditing(!isEditing);
    };

    const tabs = [
        { id: 'basic', name: 'Basic Info', icon: AiOutlineUser },
        { id: 'ids', name: 'Government IDs', icon: AiOutlineIdcard },
        { id: 'personal', name: 'Personal Details', icon: AiOutlineUser },
        { id: 'economic', name: 'Economic Profile', icon: AiOutlineDollar },
        { id: 'location', name: 'Location', icon: AiOutlineHome },
        { id: 'contact', name: 'Contact', icon: AiOutlineMail },
    ];

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4 overflow-auto">
            <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-6xl transform transition-all duration-300 overflow-auto max-h-[90vh]">
                <div className="flex justify-between items-center mb-4 bg-gradient-to-r from-[#3B78BD] to-[#F0B652] p-4 rounded-t-lg sticky top-0 z-10">
                    <h2 className="text-3xl font-bold text-white">
                        {isEditing ? (individual ? 'Edit Individual' : 'Add Individual') : 'View Individual'}
                    </h2>
                    <div className="flex space-x-2">
                        {individual && !isEditing && (
                            <button
                                className="text-white hover:text-gray-200 transition-colors duration-200"
                                onClick={(e) => { e.stopPropagation(); toggleEdit(); }}
                            >
                                <AiOutlineEdit size={24} />
                            </button>
                        )}
                        <button
                            className="text-white hover:text-gray-200 transition-colors duration-200"
                            onClick={(e) => { e.stopPropagation(); closeModal(); }}
                        >
                            <AiOutlineClose size={24} />
                        </button>
                    </div>
                </div>

                {/* Display verification status and compliance scores for existing individuals */}
                {individual && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                        <div className="text-center">
                            <div className="text-sm text-gray-600">Verification Level</div>
                            <div className="text-2xl font-bold text-[#3B78BD]">{individual.verification_level || 1}/4</div>
                        </div>
                        <div className="text-center">
                            <div className="text-sm text-gray-600">Compliance Score</div>
                            <div className="text-2xl font-bold text-green-600">{individual.compliance_score || 50}/100</div>
                        </div>
                        <div className="text-center">
                            <div className="text-sm text-gray-600">Risk Category</div>
                            <div className={`text-xl font-bold ${
                                individual.risk_category === 'Low' ? 'text-green-600' :
                                individual.risk_category === 'High' ? 'text-red-600' : 'text-yellow-600'
                            }`}>{individual.risk_category || 'Medium'}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-sm text-gray-600">Payer Category</div>
                            <div className="text-lg font-semibold text-[#3B78BD]">{individual.payer_category || 'Regular'}</div>
                        </div>
                    </div>
                )}

                {similarPayers.length > 0 && (
                    <div className="mb-4 p-4 bg-yellow-100 text-yellow-700 rounded-lg">
                        <h3 className="font-bold">Potential Duplicates Found</h3>
                        <ul>
                            {similarPayers.map(payer => (
                                <li key={payer.id}>
                                    {payer.first_name} {payer.last_name} ({payer.email})
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {errors.message && <div className="text-red-500 mb-4 text-center p-3 bg-red-50 rounded-lg">{errors.message}</div>}

                {/* Tab Navigation */}
                <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
                    {tabs.map(tab => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center space-x-2 px-4 py-2 font-medium text-sm whitespace-nowrap ${
                                    activeTab === tab.id
                                        ? 'border-b-2 border-[#3B78BD] text-[#3B78BD]'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                <Icon size={18} />
                                <span>{tab.name}</span>
                            </button>
                        );
                    })}
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Basic Info Tab */}
                    {activeTab === 'basic' && (
                        <div className="space-y-4">
                            {individual && (
                                <div className="mb-4">
                                    <label className="block text-[#3B78BD] font-bold mb-2">Individual Reference</label>
                                    <div className="flex items-center">
                                        <input
                                            type="text"
                                            value={individual.individual_ref}
                                            className="w-full p-2 border border-gray-300 rounded-l-lg bg-gray-50"
                                            readOnly
                                        />
                                        <button
                                            type="button"
                                            className="px-4 py-2 bg-[#3B78BD] text-white rounded-r-lg hover:bg-[#F0B652] transition-all duration-300"
                                            onClick={(e) => { e.stopPropagation(); handleCopy(individual.individual_ref); }}
                                        >
                                            <AiOutlineCopy size={24} />
                                        </button>
                                    </div>
                                </div>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-[#3B78BD] font-bold mb-2">Title</label>
                                    <select
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B78BD]"
                                        disabled={!isEditing}
                                    >
                                        <option value="">Select Title</option>
                                        <option value="Mr">Mr</option>
                                        <option value="Mrs">Mrs</option>
                                        <option value="Miss">Miss</option>
                                        <option value="Dr">Dr</option>
                                        <option value="Prof">Prof</option>
                                        <option value="Chief">Chief</option>
                                        <option value="Alhaji">Alhaji</option>
                                        <option value="Alhaja">Alhaja</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[#3B78BD] font-bold mb-2">First Name *</label>
                                    <input
                                        type="text"
                                        name="first_name"
                                        value={formData.first_name}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B78BD]"
                                        disabled={!isEditing}
                                        required
                                    />
                                    {errors.fields.first_name && <div className="text-red-500 text-sm mt-1">{errors.fields.first_name}</div>}
                                </div>
                                <div>
                                    <label className="block text-[#3B78BD] font-bold mb-2">Middle Name</label>
                                    <input
                                        type="text"
                                        name="middle_name"
                                        value={formData.middle_name}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B78BD]"
                                        disabled={!isEditing}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-[#3B78BD] font-bold mb-2">Last Name *</label>
                                    <input
                                        type="text"
                                        name="last_name"
                                        value={formData.last_name}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B78BD]"
                                        disabled={!isEditing}
                                        required
                                    />
                                    {errors.fields.last_name && <div className="text-red-500 text-sm mt-1">{errors.fields.last_name}</div>}
                                </div>
                                <div>
                                    <label className="block text-[#3B78BD] font-bold mb-2">Gender *</label>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B78BD]"
                                        disabled={!isEditing}
                                        required
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                    {errors.fields.gender && <div className="text-red-500 text-sm mt-1">{errors.fields.gender}</div>}
                                </div>
                                <div>
                                    <label className="block text-[#3B78BD] font-bold mb-2">Date of Birth *</label>
                                    <input
                                        type="date"
                                        name="date_of_birth"
                                        value={formData.date_of_birth}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B78BD]"
                                        disabled={!isEditing}
                                        required
                                    />
                                    {errors.fields.date_of_birth && <div className="text-red-500 text-sm mt-1">{errors.fields.date_of_birth}</div>}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Government IDs Tab */}
                    {activeTab === 'ids' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[#3B78BD] font-bold mb-2">NIN (National ID Number)</label>
                                <input
                                    type="text"
                                    name="nin"
                                    value={formData.nin}
                                    onChange={handleChange}
                                    placeholder="11 digits"
                                    maxLength="11"
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B78BD]"
                                    disabled={!isEditing}
                                />
                                {errors.fields.nin && <div className="text-red-500 text-sm mt-1">{errors.fields.nin}</div>}
                                {individual?.nin_verified && (
                                    <div className="text-green-600 text-sm mt-1 flex items-center">
                                        <span className="mr-1">✓</span> Verified {individual.nin_verified_at && `on ${new Date(individual.nin_verified_at).toLocaleDateString()}`}
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-[#3B78BD] font-bold mb-2">BVN (Bank Verification Number)</label>
                                <input
                                    type="text"
                                    name="bvn"
                                    value={formData.bvn}
                                    onChange={handleChange}
                                    placeholder="11 digits"
                                    maxLength="11"
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B78BD]"
                                    disabled={!isEditing}
                                />
                                {errors.fields.bvn && <div className="text-red-500 text-sm mt-1">{errors.fields.bvn}</div>}
                                {individual?.bvn_verified && (
                                    <div className="text-green-600 text-sm mt-1 flex items-center">
                                        <span className="mr-1">✓</span> Verified {individual.bvn_verified_at && `on ${new Date(individual.bvn_verified_at).toLocaleDateString()}`}
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-[#3B78BD] font-bold mb-2">TIN (Tax Identification Number)</label>
                                <input
                                    type="text"
                                    name="tin"
                                    value={formData.tin}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B78BD]"
                                    disabled={!isEditing}
                                />
                            </div>
                            <div>
                                <label className="block text-[#3B78BD] font-bold mb-2">Driver's License</label>
                                <input
                                    type="text"
                                    name="drivers_license"
                                    value={formData.drivers_license}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B78BD]"
                                    disabled={!isEditing}
                                />
                            </div>
                            <div>
                                <label className="block text-[#3B78BD] font-bold mb-2">Passport Number</label>
                                <input
                                    type="text"
                                    name="passport_number"
                                    value={formData.passport_number}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B78BD]"
                                    disabled={!isEditing}
                                />
                            </div>
                            <div>
                                <label className="block text-[#3B78BD] font-bold mb-2">Voter's Card</label>
                                <input
                                    type="text"
                                    name="voters_card"
                                    value={formData.voters_card}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B78BD]"
                                    disabled={!isEditing}
                                />
                            </div>
                        </div>
                    )}

                    {/* Personal Details Tab */}
                    {activeTab === 'personal' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[#3B78BD] font-bold mb-2">Marital Status</label>
                                <select
                                    name="marital_status"
                                    value={formData.marital_status}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B78BD]"
                                    disabled={!isEditing}
                                >
                                    <option value="">Select Status</option>
                                    <option value="Single">Single</option>
                                    <option value="Married">Married</option>
                                    <option value="Divorced">Divorced</option>
                                    <option value="Widowed">Widowed</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[#3B78BD] font-bold mb-2">Nationality</label>
                                <input
                                    type="text"
                                    name="nationality"
                                    value={formData.nationality}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B78BD]"
                                    disabled={!isEditing}
                                />
                            </div>
                            <div>
                                <label className="block text-[#3B78BD] font-bold mb-2">State of Origin</label>
                                <input
                                    type="text"
                                    name="state_of_origin"
                                    value={formData.state_of_origin}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B78BD]"
                                    disabled={!isEditing}
                                />
                            </div>
                            <div>
                                <label className="block text-[#3B78BD] font-bold mb-2">LGA of Origin</label>
                                <input
                                    type="text"
                                    name="lga_of_origin"
                                    value={formData.lga_of_origin}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B78BD]"
                                    disabled={!isEditing}
                                />
                            </div>
                            <div>
                                <label className="block text-[#3B78BD] font-bold mb-2">Religion</label>
                                <select
                                    name="religion"
                                    value={formData.religion}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B78BD]"
                                    disabled={!isEditing}
                                >
                                    <option value="">Select Religion</option>
                                    <option value="Christianity">Christianity</option>
                                    <option value="Islam">Islam</option>
                                    <option value="Traditional">Traditional</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {/* Economic Profile Tab */}
                    {activeTab === 'economic' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[#3B78BD] font-bold mb-2">Employment Status</label>
                                <select
                                    name="employment_status"
                                    value={formData.employment_status}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B78BD]"
                                    disabled={!isEditing}
                                >
                                    <option value="">Select Status</option>
                                    <option value="Employed">Employed</option>
                                    <option value="Self-Employed">Self-Employed</option>
                                    <option value="Unemployed">Unemployed</option>
                                    <option value="Retired">Retired</option>
                                    <option value="Student">Student</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[#3B78BD] font-bold mb-2">Occupation</label>
                                <input
                                    type="text"
                                    name="occupation"
                                    value={formData.occupation}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B78BD]"
                                    disabled={!isEditing}
                                />
                            </div>
                            <div>
                                <label className="block text-[#3B78BD] font-bold mb-2">Employer Name</label>
                                <input
                                    type="text"
                                    name="employer_name"
                                    value={formData.employer_name}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B78BD]"
                                    disabled={!isEditing}
                                />
                            </div>
                            <div>
                                <label className="block text-[#3B78BD] font-bold mb-2">Industry Sector</label>
                                <input
                                    type="text"
                                    name="industry_sector"
                                    value={formData.industry_sector}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B78BD]"
                                    disabled={!isEditing}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-[#3B78BD] font-bold mb-2">Employer Address</label>
                                <input
                                    type="text"
                                    name="employer_address"
                                    value={formData.employer_address}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B78BD]"
                                    disabled={!isEditing}
                                />
                            </div>
                            <div>
                                <label className="block text-[#3B78BD] font-bold mb-2">Income Bracket</label>
                                <select
                                    name="income_bracket"
                                    value={formData.income_bracket}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B78BD]"
                                    disabled={!isEditing}
                                >
                                    <option value="">Select Bracket</option>
                                    <option value="Below 100k">Below ₦100,000</option>
                                    <option value="100k-500k">₦100,000 - ₦500,000</option>
                                    <option value="500k-1M">₦500,000 - ₦1,000,000</option>
                                    <option value="1M-5M">₦1,000,000 - ₦5,000,000</option>
                                    <option value="5M-10M">₦5,000,000 - ₦10,000,000</option>
                                    <option value="Above 10M">Above ₦10,000,000</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[#3B78BD] font-bold mb-2">Estimated Annual Income (₦)</label>
                                <input
                                    type="number"
                                    name="estimated_annual_income"
                                    value={formData.estimated_annual_income}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B78BD]"
                                    disabled={!isEditing}
                                />
                            </div>
                        </div>
                    )}

                    {/* Location Tab */}
                    {activeTab === 'location' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-[#3B78BD] font-bold mb-2">Address Line 1 *</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B78BD]"
                                    disabled={!isEditing}
                                    required
                                />
                                {errors.fields.address && <div className="text-red-500 text-sm mt-1">{errors.fields.address}</div>}
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-[#3B78BD] font-bold mb-2">Address Line 2</label>
                                <input
                                    type="text"
                                    name="address_line2"
                                    value={formData.address_line2}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B78BD]"
                                    disabled={!isEditing}
                                />
                            </div>
                            <div>
                                <label className="block text-[#3B78BD] font-bold mb-2">Area</label>
                                <input
                                    type="text"
                                    name="area"
                                    value={formData.area}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B78BD]"
                                    disabled={!isEditing}
                                />
                            </div>
                            <div>
                                <label className="block text-[#3B78BD] font-bold mb-2">City</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B78BD]"
                                    disabled={!isEditing}
                                />
                            </div>
                            <div>
                                <label className="block text-[#3B78BD] font-bold mb-2">Ward</label>
                                <input
                                    type="text"
                                    name="ward"
                                    value={formData.ward}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B78BD]"
                                    disabled={!isEditing}
                                />
                            </div>
                            <div>
                                <label className="block text-[#3B78BD] font-bold mb-2">Community</label>
                                <input
                                    type="text"
                                    name="community"
                                    value={formData.community}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B78BD]"
                                    disabled={!isEditing}
                                />
                            </div>
                            <div>
                                <label className="block text-[#3B78BD] font-bold mb-2">Postal Code</label>
                                <input
                                    type="text"
                                    name="postal_code"
                                    value={formData.postal_code}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B78BD]"
                                    disabled={!isEditing}
                                />
                            </div>
                            <div>
                                <label className="block text-[#3B78BD] font-bold mb-2">Landmark</label>
                                <input
                                    type="text"
                                    name="landmark"
                                    value={formData.landmark}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B78BD]"
                                    disabled={!isEditing}
                                />
                            </div>
                            <div>
                                <label className="block text-[#3B78BD] font-bold mb-2">Address Type</label>
                                <select
                                    name="address_type"
                                    value={formData.address_type}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B78BD]"
                                    disabled={!isEditing}
                                >
                                    <option value="">Select Type</option>
                                    <option value="Owned">Owned</option>
                                    <option value="Rented">Rented</option>
                                    <option value="Family House">Family House</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-[#3B78BD] font-bold mb-2">Office Address</label>
                                <input
                                    type="text"
                                    name="office_address"
                                    value={formData.office_address}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B78BD]"
                                    disabled={!isEditing}
                                />
                            </div>
                        </div>
                    )}

                    {/* Contact Tab */}
                    {activeTab === 'contact' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[#3B78BD] font-bold mb-2">Email *</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B78BD]"
                                    disabled={!isEditing}
                                    required
                                />
                                {errors.fields.email && <div className="text-red-500 text-sm mt-1">{errors.fields.email}</div>}
                                {individual?.email_verified && (
                                    <div className="text-green-600 text-sm mt-1 flex items-center">
                                        <span className="mr-1">✓</span> Verified
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-[#3B78BD] font-bold mb-2">Mobile Number</label>
                                <input
                                    type="text"
                                    name="mobile_number"
                                    value={formData.mobile_number}
                                    onChange={handleChange}
                                    placeholder="10-15 digits"
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B78BD]"
                                    disabled={!isEditing}
                                />
                                {errors.fields.mobile_number && <div className="text-red-500 text-sm mt-1">{errors.fields.mobile_number}</div>}
                                {individual?.phone_verified && (
                                    <div className="text-green-600 text-sm mt-1 flex items-center">
                                        <span className="mr-1">✓</span> Verified
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-[#3B78BD] font-bold mb-2">Secondary Email</label>
                                <input
                                    type="email"
                                    name="secondary_email"
                                    value={formData.secondary_email}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B78BD]"
                                    disabled={!isEditing}
                                />
                            </div>
                            <div>
                                <label className="block text-[#3B78BD] font-bold mb-2">Secondary Phone</label>
                                <input
                                    type="text"
                                    name="secondary_phone"
                                    value={formData.secondary_phone}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B78BD]"
                                    disabled={!isEditing}
                                />
                            </div>
                            <div>
                                <label className="block text-[#3B78BD] font-bold mb-2">Work Phone</label>
                                <input
                                    type="text"
                                    name="work_phone"
                                    value={formData.work_phone}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B78BD]"
                                    disabled={!isEditing}
                                />
                            </div>
                            <div>
                                <label className="block text-[#3B78BD] font-bold mb-2">WhatsApp Number</label>
                                <input
                                    type="text"
                                    name="whatsapp_number"
                                    value={formData.whatsapp_number}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B78BD]"
                                    disabled={!isEditing}
                                />
                            </div>
                            <div>
                                <label className="block text-[#3B78BD] font-bold mb-2">Preferred Contact Method</label>
                                <select
                                    name="preferred_contact_method"
                                    value={formData.preferred_contact_method}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B78BD]"
                                    disabled={!isEditing}
                                >
                                    <option value="">Select Method</option>
                                    <option value="Phone">Phone</option>
                                    <option value="Email">Email</option>
                                    <option value="SMS">SMS</option>
                                    <option value="WhatsApp">WhatsApp</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-[#3B78BD] font-bold mb-2">Notes</label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B78BD]"
                                    disabled={!isEditing}
                                />
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    {isEditing && (
                        <div className="flex justify-end space-x-4 mt-6 pt-4 border-t border-gray-200">
                            <button
                                type="button"
                                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-700 transition-all duration-200"
                                onClick={(e) => { e.stopPropagation(); closeModal(); }}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className={`px-6 py-3 bg-[#3B78BD] text-white rounded-lg hover:bg-[#F0B652] transition-all duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : 'Save Individual'}
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default IndividualModalEnhanced;
