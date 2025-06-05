// src/common/AppStepsTab.jsx
import React, { Fragment, useContext, useState } from 'react';
import { FcApproval } from 'react-icons/fc';
import RequestForm from '../protected/components/application/RequestForm';
import ManagePayments from '../protected/components/payments/ManagePayments';
import { AiOutlineCheckCircle, AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import { formatDate, formatDateAndTime } from '../apis/functions';
import Reviews from './Reviews';
import { AuthContext } from '../context/AuthContext';
import Approvals from './Approvals';
import Authorizations from '../protected/lga_admin/components/Authorizations';

const AppStepsTab = ({ steps, fetching, current_step, serviceName, currentStep, steps_completed, purpose_id, admin_notes, app_lga_id }) => {
    const { user } = useContext(AuthContext);
    const [flag, setFlag] = useState(currentStep);
    const [order, setOrder] = useState(current_step);
    const [paymodal, setPaymodal] = useState(false);
    const [infoToShow, setInfoToShow] = useState(null);

    const stepActions = (stepObj) => {
        if (current_step >= stepObj?.order_no) {
            setFlag(stepObj?.step?.flag);
            setOrder(stepObj?.order_no);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fadeIn">
            <div className="col-span-1 bg-white rounded-l-lg p-4 shadow-md">
                {fetching ? (
                    <div className="flex justify-center my-5">
                        <svg
                            className="animate-spin h-8 w-8 text-[#3B78BD] dark:text-[#F0B652]"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v8h-8z"
                            ></path>
                        </svg>
                    </div>
                ) : (
                    steps.map((step) => (
                        <div
                            key={step?.id}
                            className={`w-full flex justify-between py-4 ${
                                steps.length !== step?.order_no && 'border-b'
                            } border-gray-100 ${
                                step?.order_no === current_step
                                    ? 'text-[#3B78BD] font-bold bg-gradient-to-r from-[#3B78BD]/10 to-[#F0B652]/10'
                                    : 'text-gray-600 hover:text-gray-900'
                            } ${current_step >= step?.order_no ? 'cursor-pointer' : 'text-gray-300'} items-center transition-all duration-200`}
                            onClick={current_step >= step?.order_no ? () => stepActions(step) : undefined}
                        >
                            <span
                                className={`md:hidden rounded-full ${
                                    step?.order_no === current_step
                                        ? 'bg-[#3B78BD] text-white'
                                        : 'text-[#3B78BD] border border-[#3B78BD]'
                                } px-2`}
                            >
                                {step?.order_no}
                            </span>
                            <span className="hidden md:block text-sm uppercase">
                                {current_step >= step?.order_no ? step?.step?.step_name : <i>{step?.step?.step_name}</i>}
                            </span>
                            {current_step > step?.order_no && <FcApproval size={18} />}
                        </div>
                    ))
                )}
            </div>
            <div className="col-span-3 bg-white rounded-r-lg p-6 shadow-md">
                {order === current_step ? (
                    steps.map((activestep) =>
                        activestep?.order_no === order ? (
                            <div className="w-full animate-fadeIn" key={activestep?.id}>
                                <h1 className="text-xl font-bold text-[#3B78BD] dark:text-[#F0B652] mb-4">
                                    {activestep?.step?.step_name}
                                </h1>
                                <div className="w-full my-4">
                                    {activestep?.step?.flag !== 'P_CERT' &&
                                        activestep?.step?.flag !== 'D_CERT' &&
                                        activestep?.step?.flag !== 'PAYMENT_REQUIRED' &&
                                        admin_notes &&
                                        admin_notes.length > 0 &&
                                        admin_notes.map(
                                            (note) =>
                                                current_step < note?.eservice_step_id && (
                                                    <p
                                                        key={note?.id}
                                                        className="grid md:flex items-center md:space-x-4 py-1 text-orange-600"
                                                    >
                                                        <span>{note?.notification?.message}</span>
                                                        <span className="hidden md:flex">-</span>
                                                        <span className="text-gray-400 text-xs">
                                                            {formatDateAndTime(note?.notification?.created_at)}
                                                        </span>
                                                    </p>
                                                )
                                        )}
                                </div>
                                {activestep?.step?.flag === 'ADD_INFO' && (
                                    user?.role === 'PublicUser' ? (
                                        <RequestForm
                                            action_id={activestep?.action_id}
                                            eservice_id={activestep?.eservices_id}
                                            lg_id={app_lga_id}
                                            order_id={activestep?.order_no}
                                            steps_completed={steps_completed}
                                            app_id={purpose_id}
                                        />
                                    ) : (
                                        <div className="w-full my-4 text-gray-600 dark:text-gray-300">
                                            Applicant yet to provide required information...
                                        </div>
                                    )
                                )}
                                {activestep?.step?.flag === 'PAYMENT_REQUIRED' && (
                                    user?.role === 'PublicUser' ? (
                                        <Fragment>
                                            <button
                                                className="max-w-max px-8 py-3 rounded-md bg-[#3B78BD] hover:bg-[#F0B652] text-white transition-all duration-300 shadow-lg transform hover:scale-105"
                                                onClick={() => setPaymodal(true)}
                                            >
                                                Proceed to Payment
                                            </button>
                                            {paymodal && (
                                                <ManagePayments
                                                    purpose={activestep?.step?.id}
                                                    purpose_id={purpose_id}
                                                    order_no={order}
                                                    setPaymodal={setPaymodal}
                                                />
                                            )}
                                        </Fragment>
                                    ) : (
                                        <div className="w-full my-4 text-gray-600 dark:text-gray-300">
                                            Yet to receive notification on Applicant's payment...
                                        </div>
                                    )
                                )}
                                {(activestep?.step?.flag === 'AWAITING_PAYMENT_CONFIRMATION' ||
                                    activestep?.step?.flag === 'INFO_REQ_ADMIN_REVIEW' ||
                                    activestep?.step?.flag === 'REQ_ADMIN_REVIEW') && (
                                    <Reviews id={purpose_id} flag={activestep?.step?.flag} />
                                )}
                                {(activestep?.step?.flag === 'P_CERT' || activestep?.step?.flag === 'D_CERT') && (
                                    <Fragment>
                                        {user?.role !== 'PublicUser' && (
                                            <Authorizations
                                                authorizations={activestep?.authorizations}
                                                flag={activestep?.step?.flag}
                                                authorizers={activestep?.authorizers}
                                            />
                                        )}
                                        <Approvals id={purpose_id} flag={activestep?.step?.flag} />
                                    </Fragment>
                                )}
                            </div>
                        ) : null
                    )
                ) : (
                    steps_completed.length > 0 &&
                    steps_completed.map(
                        (stp) =>
                            stp?.order_no === order && (
                                <div className="w-full animate-fadeIn" key={stp?.id}>
                                    <h1 className="text-xl font-bold text-[#3B78BD] dark:text-[#F0B652] mb-4">
                                        {stp?.step_name}
                                    </h1>
                                    <div className="flex flex-col-reverse">
                                        {stp?.submission &&
                                            stp?.submission.length > 0 &&
                                            stp?.submission.map((sub, index) => (
                                                <div key={sub?.id} className="mb-3 shadow-md p-4 rounded-lg">
                                                    <div className={`${infoToShow === index ? 'max-h-max' : 'h-4'} overflow-hidden`}>
                                                        <div className="flex justify-between items-center">
                                                            {infoToShow === index ? (
                                                                <AiOutlineMinus
                                                                    size={15}
                                                                    className="cursor-pointer text-gray-700"
                                                                    onClick={() => setInfoToShow(null)}
                                                                />
                                                            ) : (
                                                                <AiOutlinePlus
                                                                    size={15}
                                                                    className="cursor-pointer text-gray-700"
                                                                    onClick={() => setInfoToShow(index)}
                                                                />
                                                            )}
                                                            <span className="text-xs text-gray-600">
                                                                {index === stp?.submission.length - 1 ? (
                                                                    <span className="text-[#3B78BD]">Latest submission</span>
                                                                ) : (
                                                                    'Submitted'
                                                                )}{' '}
                                                                on {formatDateAndTime(sub?.created_at)}
                                                            </span>
                                                        </div>
                                                        <div className="grid md:grid-cols-2 gap-4 mt-2">
                                                            {sub?.data &&
                                                                Object.entries(JSON.parse(sub?.data)).map(
                                                                    ([key, value]) =>
                                                                        key !== 'user_id' && (
                                                                            <div
                                                                                key={key}
                                                                                className="py-2 border-b border-gray-100 text-gray-500"
                                                                            >
                                                                                <p className="text-xs capitalize py-1">
                                                                                    {key.replace(/_/g, ' ')}
                                                                                </p>
                                                                                <p className="text-gray-700">
                                                                                    {value === 'on' ? 'Yes' : value}
                                                                                </p>
                                                                            </div>
                                                                        )
                                                                )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        {stp?.payment_info &&
                                            stp?.payment_info.length > 0 &&
                                            stp?.payment_info.map((pinfo) => (
                                                pinfo?.status === 'Completed' && (
                                                    <div key={pinfo?.id} className="grid border-gray-100 pb-8">
                                                        <h1
                                                            className={`text-lg px-2 py-1 rounded-md ${
                                                                pinfo?.status === 'Failed' || pinfo?.status === 'Rejected'
                                                                    ? 'bg-red-100 text-red-800'
                                                                    : pinfo?.status === 'Completed'
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : 'bg-orange-100 text-orange-600'
                                                            }`}
                                                        >
                                                            {pinfo?.status}
                                                        </h1>
                                                        <div className="grid my-2 gap-2">
                                                            <div className="flex items-center my-1">
                                                                <span className="w-1/3 text-gray-600">Reference ID</span>
                                                                <span>{pinfo?.ref_no || 'N/A'}</span>
                                                            </div>
                                                            <div className="flex items-center my-1">
                                                                <span className="w-1/3 text-gray-600">Payment Channel</span>
                                                                <span>{pinfo?.payment_gateway?.gateway_name || 'N/A'}</span>
                                                            </div>
                                                            <div className="flex items-center my-1">
                                                                <span className="w-1/3 text-gray-600">Category</span>
                                                                <span>{pinfo?.tariff?.category || 'N/A'}</span>
                                                            </div>
                                                            <div className="flex items-center my-1">
                                                                <span className="w-1/3 text-gray-600">Amount</span>
                                                                <span>₦ {pinfo?.tariff?.amount || 'N/A'}</span>
                                                            </div>
                                                            <div className="flex items-center my-1">
                                                                <span className="w-1/3 text-gray-600">Date</span>
                                                                <span>{formatDate(pinfo?.updated_at) || 'N/A'}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            ))}
                                        {stp?.flag === 'AWAITING_PAYMENT_CONFIRMATION' && (
                                            <div className="flex justify-center my-6">
                                                <div className="w-full flex justify-between items-center rounded-lg bg-green-100 text-green-800 p-4">
                                                    <span className="text-lg">Payment Confirmed</span>
                                                    <AiOutlineCheckCircle size={25} />
                                                </div>
                                            </div>
                                        )}
                                        {(stp?.flag === 'REQ_ADMIN_REVIEW' || stp?.flag === 'INFO_REQ_ADMIN_REVIEW') && (
                                            <div className="flex justify-center my-6">
                                                <div className="w-full flex justify-between items-center rounded-lg bg-green-100 text-green-800 p-4">
                                                    <span className="text-lg">Application Reviewed and Approved</span>
                                                    <AiOutlineCheckCircle size={25} />
                                                </div>
                                            </div>
                                        )}
                                        {stp?.flag === 'P_CERT' && (
                                            <div className="flex justify-center my-6">
                                                <div className="w-full flex justify-between items-center rounded-lg bg-green-100 text-green-800 p-4">
                                                    <span className="text-lg">
                                                        Application final review and certificate processing completed
                                                    </span>
                                                    <AiOutlineCheckCircle size={25} />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                    )
                )}
            </div>
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.6s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default AppStepsTab;