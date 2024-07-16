import React from 'react';
import './PayerList.css';

const PayerList = ({ title, payers, onEdit }) => {
    return (
        <div className="payer-list-container">
            <h2 className="text-xl font-semibold mb-4">{title}</h2>
            {payers.length === 0 ? (
                <p className="text-gray-600">No {title.toLowerCase()} available.</p>
            ) : (
                <ul className="payer-list">
                    {payers.map((payer) => (
                        <li key={payer.id} className="payer-item">
                            <div className="payer-info">
                                <p><strong>{payer.first_name || payer.company_name}</strong></p>
                                <p>{payer.email}</p>
                                <p>{payer.individual_ref || payer.corporate_ref}</p>
                            </div>
                            <button onClick={() => onEdit(payer)} className="edit-btn">
                                Edit
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default PayerList;
