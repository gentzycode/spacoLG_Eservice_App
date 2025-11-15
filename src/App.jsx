import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ErrorBoundary from './components/ErrorBoundary';
import Loader from './common/Loader';
import AuthContextProvider from './context/AuthContext';

// Eager load critical components (landing page, auth)
import Landing2 from './public/pages/Landing2';
import Auth from './public/pages/Auth';

// Lazy load all other components for code splitting
const PrivateRoute = lazy(() => import('./protected/PrivateRoute'));
const DefaultLayout = lazy(() => import('./protected/DefaultLayout'));
const Services = lazy(() => import('./public/pages/Services'));
const Service = lazy(() => import('./public/pages/Service'));
const Statuscheck = lazy(() => import('./public/pages/Statuscheck'));
const CheckJSON = lazy(() => import('./public/pages/CheckJSON'));
const ReceiptVerificationComponent = lazy(() => import('./public/pages/ReceiptVerificationComponent'));

// Protected routes - lazy loaded
const Dashboard = lazy(() => import('./protected/pages/Dashboard'));
const Application = lazy(() => import('./protected/pages/Application'));
const ApplicationDetail = lazy(() => import('./protected/pages/ApplicationDetail'));
const ApplicationStatus = lazy(() => import('./public/pages/ApplicationStatus'));

// Admin routes - lazy loaded
const AdminApplications = lazy(() => import('./protected/lga_admin/pages/AdminApplications'));
const AdminApplicationDetail = lazy(() => import('./protected/lga_admin/pages/AdminApplicationDetail'));

// Super admin routes - lazy loaded
const Users = lazy(() => import('./protected/super_admin/pages/Users'));
const LgasStaff = lazy(() => import('./protected/super_admin/pages/LgasStaff'));
const Authorizers = lazy(() => import('./protected/super_admin/pages/Authorizers'));
const PricingManagement = lazy(() => import('./protected/super_admin/pages/PricingManagement'));
const PaymentGateways = lazy(() => import('./protected/super_admin/pages/PaymentGateways'));
const SystemSettings = lazy(() => import('./protected/super_admin/pages/SystemSettings'));
const FinancialReports = lazy(() => import('./protected/super_admin/pages/FinancialReports'));
const SecurityAuditLogs = lazy(() => import('./protected/super_admin/pages/SecurityAuditLogs'));

// Financial routes - lazy loaded
const Payments = lazy(() => import('./protected/pages/Payments'));
const MyWallet = lazy(() => import('./protected/pages/MyWallet'));
const TransactionStatus = lazy(() => import('./protected/pages/TransactionStatus'));
const ManageTokens = lazy(() => import('./protected/pages/ManageTokens'));
const ManageInvoices = lazy(() => import('./protected/pages/ManageInvoices'));
const PayerManagement = lazy(() => import('./protected/pages/PayerManagement'));
const InvoicesPage = lazy(() => import('./protected/pages/InvoicesPage'));

// Other routes - lazy loaded
const Support = lazy(() => import('./protected/pages/Support'));
const Reports = lazy(() => import('./protected/pages/Reports'));

// Import lazy routes
const routes = lazy(() => import('./routes'));

function App() {
    return (
        <ErrorBoundary>
            <AuthContextProvider>
                {/* Global Toast Container */}
                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="colored"
                />
                <Suspense fallback={<Loader />}>
                    <Routes>
                        {/* Public routes - no suspense needed, already loaded */}
                        <Route path='/' element={<Landing2 />} />
                        <Route path='/auth' element={<Auth />} />

                        {/* Public routes - lazy loaded */}
                        <Route
                            path='/services'
                            element={
                                <Suspense fallback={<Loader />}>
                                    <Services />
                                </Suspense>
                            }
                        />
                        <Route
                            path='/service'
                            element={
                                <Suspense fallback={<Loader />}>
                                    <Service />
                                </Suspense>
                            }
                        />
                        <Route
                            path='/check-json'
                            element={
                                <Suspense fallback={<Loader />}>
                                    <CheckJSON />
                                </Suspense>
                            }
                        />
                        <Route
                            path='/status-check'
                            element={
                                <Suspense fallback={<Loader />}>
                                    <Statuscheck />
                                </Suspense>
                            }
                        />
                        <Route
                            path='/verify'
                            element={
                                <Suspense fallback={<Loader />}>
                                    <ReceiptVerificationComponent />
                                </Suspense>
                            }
                        />

                        {/* Protected routes - all lazy loaded */}
                        <Route
                            element={
                                <Suspense fallback={<Loader />}>
                                    <PrivateRoute>
                                        <DefaultLayout />
                                    </PrivateRoute>
                                </Suspense>
                            }
                        >
                            <Route
                                path='/dashboard'
                                element={
                                    <Suspense fallback={<Loader />}>
                                        <Dashboard />
                                    </Suspense>
                                }
                            />
                            <Route
                                path='/application'
                                element={
                                    <Suspense fallback={<Loader />}>
                                        <Application />
                                    </Suspense>
                                }
                            />
                            <Route
                                path='/application-detail'
                                element={
                                    <Suspense fallback={<Loader />}>
                                        <ApplicationDetail />
                                    </Suspense>
                                }
                            />
                            <Route
                                path='/applications'
                                element={
                                    <Suspense fallback={<Loader />}>
                                        <AdminApplications />
                                    </Suspense>
                                }
                            />
                            <Route
                                path='/admin-applications-detail'
                                element={
                                    <Suspense fallback={<Loader />}>
                                        <AdminApplicationDetail />
                                    </Suspense>
                                }
                            />
                            <Route
                                path='/users'
                                element={
                                    <Suspense fallback={<Loader />}>
                                        <Users />
                                    </Suspense>
                                }
                            />
                            <Route
                                path='/lgas-staff'
                                element={
                                    <Suspense fallback={<Loader />}>
                                        <LgasStaff />
                                    </Suspense>
                                }
                            />
                            <Route
                                path='/payments'
                                element={
                                    <Suspense fallback={<Loader />}>
                                        <Payments />
                                    </Suspense>
                                }
                            />
                            <Route
                                path='/authorizers'
                                element={
                                    <Suspense fallback={<Loader />}>
                                        <Authorizers />
                                    </Suspense>
                                }
                            />
                            <Route
                                path='/tariffs'
                                element={
                                    <Suspense fallback={<Loader />}>
                                        <PricingManagement />
                                    </Suspense>
                                }
                            />
                            <Route
                                path='/payment-gateways'
                                element={
                                    <Suspense fallback={<Loader />}>
                                        <PaymentGateways />
                                    </Suspense>
                                }
                            />
                            <Route
                                path='/system-settings'
                                element={
                                    <Suspense fallback={<Loader />}>
                                        <SystemSettings />
                                    </Suspense>
                                }
                            />
                            <Route
                                path='/financial-reports'
                                element={
                                    <Suspense fallback={<Loader />}>
                                        <FinancialReports />
                                    </Suspense>
                                }
                            />
                            <Route
                                path='/audit-logs'
                                element={
                                    <Suspense fallback={<Loader />}>
                                        <SecurityAuditLogs />
                                    </Suspense>
                                }
                            />
                            <Route
                                path='/support'
                                element={
                                    <Suspense fallback={<Loader />}>
                                        <Support />
                                    </Suspense>
                                }
                            />
                            <Route
                                path='/check-status'
                                element={
                                    <Suspense fallback={<Loader />}>
                                        <ApplicationStatus />
                                    </Suspense>
                                }
                            />
                            <Route
                                path='/my-wallet'
                                element={
                                    <Suspense fallback={<Loader />}>
                                        <MyWallet />
                                    </Suspense>
                                }
                            />
                            <Route
                                path='/wallet/status'
                                element={
                                    <Suspense fallback={<Loader />}>
                                        <TransactionStatus />
                                    </Suspense>
                                }
                            />
                            <Route
                                path="/manage-tokens"
                                element={
                                    <Suspense fallback={<Loader />}>
                                        <ManageTokens />
                                    </Suspense>
                                }
                            />
                            <Route
                                path="/manage-invoices"
                                element={
                                    <Suspense fallback={<Loader />}>
                                        <ManageInvoices />
                                    </Suspense>
                                }
                            />
                            <Route
                                path="/manage-payers"
                                element={
                                    <Suspense fallback={<Loader />}>
                                        <PayerManagement />
                                    </Suspense>
                                }
                            />
                            <Route
                                path="/reports"
                                element={
                                    <Suspense fallback={<Loader />}>
                                        <Reports />
                                    </Suspense>
                                }
                            />
                            <Route
                                path="/advanced-invoicing"
                                element={
                                    <Suspense fallback={<Loader />}>
                                        <InvoicesPage />
                                    </Suspense>
                                }
                            />
                        </Route>
                    </Routes>
                </Suspense>
            </AuthContextProvider>
        </ErrorBoundary>
    );
}

export default App;