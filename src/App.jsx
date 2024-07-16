import React, { Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Loader from './common/Loader';
import AuthContextProvider from './context/AuthContext';
import PrivateRoute from './protected/PrivateRoute';
import DefaultLayout from './protected/DefaultLayout';
import Landing2 from './public/pages/Landing2';
import Auth from './public/pages/Auth';
import Services from './public/pages/Services';
import Service from './public/pages/Service';
import Statuscheck from './public/pages/Statuscheck';
import CheckJSON from './public/pages/CheckJSON';
import routes from './routes';
import Dashboard from './protected/pages/Dashboard';
import Application from './protected/pages/Application';
import ApplicationDetail from './protected/pages/ApplicationDetail';
import AdminApplications from './protected/lga_admin/pages/AdminApplications';
import AdminApplicationDetail from './protected/lga_admin/pages/AdminApplicationDetail';
import Users from './protected/super_admin/pages/Users';
import LgasStaff from './protected/super_admin/pages/LgasStaff';
import Payments from './protected/pages/Payments';
import Authorizers from './protected/super_admin/pages/Authorizers';
import Support from './protected/pages/Support';
import ApplicationStatus from './public/pages/ApplicationStatus';
import MyWallet from './protected/pages/MyWallet';
import TransactionStatus from './protected/pages/TransactionStatus';
import ManageTokens from './protected/pages/ManageTokens';
import ManageInvoices from './protected/pages/ManageInvoices';
import PayerManagement from './protected/pages/PayerManagement'; // New import

function App() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => setLoading(false), 1000);
    }, []);

    return (
        <AuthContextProvider>
            <Router>
                <Routes>
                    <Route path='/' element={<Landing2 />} />
                    <Route path='/auth' element={<Auth />} />
                    <Route path='/services' element={<Services />} />
                    <Route path='/service' element={<Service />} />
                    <Route path='/check-json' element={<CheckJSON />} />
                    <Route path='/status-check' element={<Statuscheck />} />
                    <Route element={<PrivateRoute><DefaultLayout /></PrivateRoute>}>
                        <Route path='/dashboard' element={<Dashboard />} />
                        <Route path='/application' element={<Application />} />
                        <Route path='/application-detail' element={<ApplicationDetail />} />
                        <Route path='/applications' element={<AdminApplications />} />
                        <Route path='/admin-applications-detail' element={<AdminApplicationDetail />} />
                        <Route path='/users' element={<Users />} />
                        <Route path='/lgas-staff' element={<LgasStaff />} />
                        <Route path='/payments' element={<Payments />} />
                        <Route path='/authorizers' element={<Authorizers />} />
                        <Route path='/support' element={<Support />} />
                        <Route path='/check-status' element={<ApplicationStatus />} />
                        <Route path='/my-wallet' element={<MyWallet />} />
                        <Route path='/wallet/status' element={<TransactionStatus />} />
                        <Route path="/manage-tokens" element={<ManageTokens />} />
                        <Route path="/manage-invoices" element={<ManageInvoices />} />
                        <Route path="/manage-payers" element={<PayerManagement />} /> {/* New route */}
                        {routes.map(({ path, component: Component }) => (
                            <Route
                                key={path}
                                path={path}
                                element={
                                    <Suspense fallback={<Loader />}>
                                        <Component />
                                    </Suspense>
                                }
                            />
                        ))}
                    </Route>
                </Routes>
            </Router>
        </AuthContextProvider>
    );
}

export default App;
