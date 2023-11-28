import React, { useContext, useEffect, useRef, useState } from 'react'
import { AiOutlineCloseCircle } from 'react-icons/ai'
import { MdFileDownload } from 'react-icons/md'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { getApplicationByID } from '../../../apis/authActions'
import { AuthContext } from '../../../context/AuthContext'
import InitLoader from '../../../common/InitLoader'

const CertDownload = ({ setDownloadModal, appid }) => {

    const { token } = useContext(AuthContext);

    const [appdata, setAppdata] = useState(null);
    const [steps, setSteps] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const pdfRef = useRef();

    const downloadCert = () => {
        const input = pdfRef.current;
        html2canvas(input).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4', true);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
            const imgX = (pdfWidth - imgWidth * ratio) / 2;
            const imgY = 0;
            pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
            pdf.save('certificate.pdf');
        })
    }

    useEffect(() => {
        getApplicationByID(token, appid, setAppdata, setSteps, setError, setLoading);
    }, [])

    return (
        <div>
            <div className='fixed inset-0 z-50 bg-black bg-opacity-75 transition-opacity'></div>
            <div className="fixed inset-0 z-50 overflow-y-auto">
                <div className="flex mt-16 md:mt-0 md:min-h-full items-end justify-center p-4 sm:items-center sm:p-0">
                    <div className='w-full md:w-[600px] bg-white border border-gray-400 dark:text-gray-700 rounded-md px-6 py-1'>
                        <div className='flex justify-between items-center border-b border-gray-200 py-2'>
                            <div 
                                className='flex space-x-2 items-center text-blue-600 hover:text-blue-800 cursor-pointer'
                                onClick={() => downloadCert()}
                            >
                                <MdFileDownload size={17} />
                                <span className='uppercase font-bold'>
                                    Click here to download
                                </span>
                            </div>
                            <span
                                className='cursor-pointer text-red-500'
                                onClick={() => setDownloadModal(false)}
                            >    
                                <AiOutlineCloseCircle size={20} />
                            </span>
                        </div>

                        {loading || appdata === null ? <InitLoader /> : <div className='py-2' ref={pdfRef}>
                            <div className="w-full h-screen p-2 flex justify-center bg-[url('/assets/cert_template.png')] bg-cover">
                                <h1 className='text-xl font-bold mt-20 text-gray-800 uppercase'>
                                    {appdata?.data?.eservice?.name}
                                </h1>
                            </div>
                        </div>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CertDownload
