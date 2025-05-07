import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { getEserviceItems, generateInvoice } from '../../../apis/authActions';
import { AiOutlineClose } from 'react-icons/ai';
import Confetti from 'react-confetti';
import Select from 'react-select';

const GenerateInvoiceModal = ({ closeModal, defaultCategory, defaultReferenceNumber }) => {
    const { token } = useContext(AuthContext);
    const [category, setCategory] = useState(defaultCategory || { value: 'individual', label: 'Individual' });
    const [referenceNumber, setReferenceNumber] = useState(defaultReferenceNumber || '');
    const [eserviceItemId, setEserviceItemId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [invoiceData, setInvoiceData] = useState(null);
    const [payerInfo, setPayerInfo] = useState(null);
    const [eserviceItems, setEserviceItems] = useState([]);
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        const fetchEserviceItems = async () => {
            setLoading(true);
            try {
                const items = await getEserviceItems(token);
                setEserviceItems(items);
            } catch (err) {
                setError('Failed to fetch eService items.');
            }
            setLoading(false);
        };
        fetchEserviceItems();
    }, [token]);

    useEffect(() => {
        if (referenceNumber) fetchPayerInfo();
    }, [referenceNumber]);

    const fetchPayerInfo = async () => {
        setLoading(true);
        try {
            const endpoint = category.value === 'individual' ? '/individuals/reference/${referenceNumber}' : '/corporates/reference/${referenceNumber}';
            const response = await axios.get(endpoint, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setPayerInfo(response.data.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch payer information');
            setPayerInfo(null);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await generateInvoice(token, { category: category.value, reference_number: referenceNumber, eservice_item_id: parseInt(eserviceItemId.value) }, setInvoiceData, setError, setLoading);
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 3000);
        } catch (err) {
            setError('Failed to generate invoice');
        }
    };

    const customStyles = {
        control: provided => ({ ...provided, borderColor: '#3B78BD', '&:hover': { borderColor: '#3B78BD' }, boxShadow: 'none' }),
        option: (provided, state) => ({ ...provided, backgroundColor: state.isSelected ? '#3B78BD' : state.isFocused ? '#D1E9FF' : 'white', color: state.isSelected ? 'white' : 'black', '&:hover': { backgroundColor: '#D1E9FF', color: 'black' } }),
        singleValue: provided => ({ ...provided, color: '#3B78BD' })
    };

    return (
        <div style={{ position: 'fixed', inset: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: '50' }}>
            {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}
            <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-3xl transform transition-all duration-300 scale-100 hover:scale-105 relative">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', background: 'linear-gradient(90deg, #3B78BD, #F0B652)', padding: '10px', borderRadius: '8px 8px 0 0', color: 'white' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Generate Invoice</h2>
                    <button style={{ color: 'white', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }} onClick={closeModal}><AiOutlineClose size={24} /></button>
                </div>
                <div className="mb-6">
                    <label className="block mb-2 text-lg font-medium text-[#3B78BD] dark:text-[#F0B652]">Category</label>
                    <Select styles={customStyles} className="w-full" value={category} onChange={selected => { setCategory(selected); setReferenceNumber(''); setPayerInfo(null); }} options={[{ value: 'individual', label: 'Individual' }, { value: 'corporate', label: 'Corporate' }]} />
                </div>
                <div className="mb-6">
                    <label className="block mb-2 text-lg font-medium text-[#3B78BD] dark:text-[#F0B652]">Reference Number</label>
                    <input type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B78BD] dark:focus:ring-[#F0B652] transition-all duration-200" value={referenceNumber} onChange={e => setReferenceNumber(e.target.value)} placeholder={`Please provide this ${category.label}'s reference number`} />
                </div>
                {payerInfo && <div className="mb-6 p-4 bg-blue-100 text-blue-700 rounded-lg">{category.value === 'individual' ? <>
                    <p><strong>Name:</strong> {payerInfo.first_name} {payerInfo.middle_name} {payerInfo.last_name}</p>
                    <p><strong>Address:</strong> {payerInfo.address}</p>
                    <p><strong>Mobile:</strong> {payerInfo.mobile_number}</p>
                </> : <>
                    <p><strong>Company:</strong> {payerInfo.company_name}</p>
                    <p><strong>Contact:</strong> {payerInfo.contact_person}</p>
                    <p><strong>Phone:</strong> {payerInfo.phone_number}</p>
                </>}</div>}
                <div className="mb-6">
                    <label className="block mb-2 text-lg font-medium text-[#3B78BD] dark:text-[#F0B652]">E-Service Item</label>
                    <Select styles={customStyles} className="w-full" value={eserviceItemId} onChange={selected => setEserviceItemId(selected)} options={eserviceItems.map(item => ({ value: item.id, label: `${item.name} - ₦${Number(item.value).toLocaleString()} (${item.category})` }))} />
                </div>
                {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>}
                {invoiceData && <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">
                    <p>Invoice generated successfully!</p>
                    <p><strong>Amount:</strong> {invoiceData.invoice.amount}</p>
                    <p><strong>Purpose:</strong> {invoiceData.invoice.purpose}</p>
                    <p><strong>Description:</strong> {invoiceData.invoice.description}</p>
                    <p><strong>Reference Number:</strong> {invoiceData.invoice.reference_number} (Use this to pay for the invoice)</p>
                </div>}
                <div className="flex justify-end space-x-4">
                    <button className="px-5 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-700 transition-all duration-200" onClick={closeModal}>Close</button>
                    <button className="px-5 py-3 bg-[#3B78BD] hover:bg-[#F0B652] text-white rounded-lg transition-all duration-200" onClick={handleSubmit} disabled={loading || !referenceNumber || !eserviceItemId}>{loading ? 'Processing...' : 'Generate'}</button>
                </div>
            </div>
        </div>
    );
};

export default GenerateInvoiceModal;