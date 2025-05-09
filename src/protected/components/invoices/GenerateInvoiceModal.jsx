import React, { useContext, useEffect, useState } from 'react';
import axios from '../../../apis/baseUrl';
import { AuthContext } from '../../../context/AuthContext';
import { getEserviceItems, generateInvoice } from '../../../apis/authActions';
import { AiOutlineClose } from 'react-icons/ai';
import Confetti from 'react-confetti';
import Select from 'react-select';
import PayInvoiceModal from './PayInvoiceModal'; // Import the PayInvoiceModal

const GenerateInvoiceModal = ({ closeModal, defaultCategory, defaultReferenceNumber }) => {
    const { token } = useContext(AuthContext);
    const [category, setCategory] = useState(defaultCategory || { value: 'individual', label: 'Individual' });
    const [referenceNumber, setReferenceNumber] = useState(defaultReferenceNumber || '');
    const [eserviceItemId, setEserviceItemId] = useState(null);
    const [tenementRate, setTenementRate] = useState('');
    const [calculatedAmount, setCalculatedAmount] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [invoiceData, setInvoiceData] = useState(null);
    const [payerInfo, setPayerInfo] = useState(null);
    const [eserviceItems, setEserviceItems] = useState([]);
    const [showConfetti, setShowConfetti] = useState(false);
    const [showPayModal, setShowPayModal] = useState(false); // State to control PayInvoiceModal visibility

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

    useEffect(() => {
        if (tenementRate && eserviceItemId?.label.includes('Tenement Rate')) {
            const calculated = (parseFloat(tenementRate) * 0.25).toFixed(2); // Correct: ₦0.25 per ₦1.00
            setCalculatedAmount(calculated);
        } else {
            setCalculatedAmount(null);
        }
    }, [tenementRate, eserviceItemId]);

    const fetchPayerInfo = async () => {
        setLoading(true);
        try {
            const endpoint = category.value === 'individual'
                ? `/individuals/reference/${referenceNumber}`
                : `/corporates/reference/${referenceNumber}`;
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
            let finalAmount = null;
            if (eserviceItemId?.label.includes('Tenement Rate') && tenementRate) {
                finalAmount = (parseFloat(tenementRate) * 0.25).toFixed(2);
            } else if (eserviceItemId) {
                const item = eserviceItems.find(item => item.id === eserviceItemId.value);
                finalAmount = item ? item.value : 0;
            }
            await generateInvoice(
                token,
                {
                    category: category.value,
                    reference_number: referenceNumber,
                    eservice_item_id: eserviceItemId?.value || null,
                    amount: finalAmount
                },
                setInvoiceData,
                setError,
                setLoading
            );
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 3000);
        } catch (err) {
            setError('Failed to generate invoice');
        }
    };

    const handlePayNow = () => {
        setShowPayModal(true); // Open the PayInvoiceModal
    };

    const customStyles = {
        control: provided => ({ ...provided, borderColor: '#3B78BD', '&:hover': { borderColor: '#3B78BD' }, boxShadow: 'none' }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? '#3B78BD' : state.isFocused ? '#D1E9FF' : 'white',
            color: state.isSelected ? 'white' : 'black',
            '&:hover': { backgroundColor: '#D1E9FF', color: 'black' }
        }),
        singleValue: provided => ({ ...provided, color: '#3B78BD' })
    };

    const formatEserviceOptions = eserviceItems.map(item => {
        let labelText = item.name;
        if (item.name.toLowerCase().includes('tenement rate')) {
            labelText += ' - 25 Kobo/₦1.00 (annually)';
        } else {
            labelText += ` - ₦${Number(item.value).toLocaleString()} (${item.category})`;
        }
        return { value: item.id, label: labelText };
    });

    return (
        <>
            <div style={{ position: 'fixed', inset: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: '50' }}>
                {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}
                <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-3xl relative">
                    <div className="flex justify-between items-center mb-6 bg-gradient-to-r from-[#3B78BD] to-[#F0B652] p-4 text-white rounded-t-lg">
                        <h2 className="text-xl font-bold">Generate Invoice</h2>
                        <button className="text-white" onClick={closeModal}><AiOutlineClose size={24} /></button>
                    </div>

                    <div className="mb-6">
                        <label className="block mb-2 text-lg font-medium text-[#3B78BD] dark:text-[#F0B652]">Category</label>
                        <Select styles={customStyles} className="w-full" value={category} onChange={selected => { setCategory(selected); setReferenceNumber(''); setPayerInfo(null); }} options={[{ value: 'individual', label: 'Individual' }, { value: 'corporate', label: 'Corporate' }]} />
                    </div>

                    <div className="mb-6">
                        <label className="block mb-2 text-lg font-medium text-[#3B78BD] dark:text-[#F0B652]">Reference Number</label>
                        <input type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B78BD]" value={referenceNumber} onChange={e => setReferenceNumber(e.target.value)} placeholder={`Please provide this ${category.label}'s reference number`} />
                    </div>

                    {payerInfo && (
                        <div className="mb-6 p-4 bg-blue-100 text-blue-700 rounded-lg">
                            {category.value === 'individual' ? (
                                <>
                                    <p><strong>Name:</strong> {payerInfo.first_name} {payerInfo.middle_name} {payerInfo.last_name}</p>
                                    <p><strong>Address:</strong> {payerInfo.address}</p>
                                    <p><strong>Mobile:</strong> {payerInfo.mobile_number}</p>
                                </>
                            ) : (
                                <>
                                    <p><strong>Company:</strong> {payerInfo.company_name}</p>
                                    <p><strong>Contact:</strong> {payerInfo.contact_person}</p>
                                    <p><strong>Phone:</strong> {payerInfo.phone_number}</p>
                                </>
                            )}
                        </div>
                    )}

                    <div className="mb-6">
                        <label className="block mb-2 text-lg font-medium text-[#3B78BD] dark:text-[#F0B652]">E-Service Item</label>
                        <Select styles={customStyles} className="w-full" value={eserviceItemId} onChange={selected => { setEserviceItemId(selected); setTenementRate(''); setCalculatedAmount(null); }} options={formatEserviceOptions} />
                    </div>

                    {eserviceItemId?.label.includes('Tenement Rate') && (
                        <div className="mb-6">
                            <label className="block mb-2 text-lg font-medium text-[#3B78BD] dark:text-[#F0B652]">Enter Tenement Rate Value (₦)</label>
                            <input type="number" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B78BD]" value={tenementRate} onChange={e => setTenementRate(e.target.value)} placeholder="Enter the assessed value of the property" />
                            {calculatedAmount && (
                                <p className="mt-2 text-lg text-green-700">Calculated Amount (₦0.25 per ₦1): ₦{Number(calculatedAmount).toLocaleString()}</p>
                            )}
                        </div>
                    )}

                    {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>}
                    {invoiceData && (
                        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">
                            <p>Invoice generated successfully!</p>
                            <p><strong>Amount:</strong> ₦{Number(invoiceData.invoice.amount).toLocaleString()}</p>
                            <p><strong>Purpose:</strong> {invoiceData.invoice.purpose}</p>
                            <p><strong>Description:</strong> {invoiceData.invoice.description}</p>
                            <p><strong>Reference Number:</strong> {invoiceData.invoice.reference_number}</p>
                        </div>
                    )}

                    <div className="flex justify-end space-x-4">
                        <button className="px-5 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-700" onClick={closeModal}>Close</button>
                        {!invoiceData ? (
                            <button className="px-5 py-3 bg-[#3B78BD] hover:bg-[#F0B652] text-white rounded-lg transition" onClick={handleSubmit} disabled={loading || !referenceNumber || (!eserviceItemId || (eserviceItemId.label.includes('Tenement Rate') && !tenementRate))}>
                                {loading ? 'Processing...' : 'Generate'}
                            </button>
                        ) : (
                            <button className="px-5 py-3 bg-[#3B78BD] hover:bg-[#F0B652] text-white rounded-lg transition" onClick={handlePayNow}>
                                Pay Now
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {showPayModal && (
                <PayInvoiceModal
                    closeModal={() => setShowPayModal(false)}
                    referenceNumber={invoiceData?.invoice?.reference_number} // Pass the generated invoice's reference number
                />
            )}
        </>
    );
};

export default GenerateInvoiceModal;