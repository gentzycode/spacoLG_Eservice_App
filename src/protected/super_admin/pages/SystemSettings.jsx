import React, { useState, useEffect, useContext } from 'react';
import axios from '../../../apis/baseUrl';
import { AuthContext } from '../../../context/AuthContext';
import {
    FaCog, FaSave, FaTimes, FaCheckCircle, FaExclamationTriangle,
    FaEnvelope, FaShieldAlt, FaBell, FaServer, FaKey, FaGlobe,
    FaDatabase, FaTools, FaToggleOn, FaToggleOff, FaInfoCircle
} from 'react-icons/fa';
import { MdSecurity, MdNotifications, MdEmail } from 'react-icons/md';
import PageLoader from '../../../common/PageLoader';

const SystemSettings = () => {
    const { token } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [activeTab, setActiveTab] = useState('general');

    // General Settings
    const [generalSettings, setGeneralSettings] = useState({
        system_name: 'Yenagoa LGA Revenue System',
        system_email: 'admin@yenagoa-lga.gov.ng',
        system_phone: '+234-XXX-XXXX-XXX',
        timezone: 'Africa/Lagos',
        date_format: 'DD/MM/YYYY',
        currency: 'NGN',
        currency_symbol: '₦',
        maintenance_mode: false,
        allow_registration: true,
        default_language: 'en'
    });

    // Email Settings
    const [emailSettings, setEmailSettings] = useState({
        mail_driver: 'smtp',
        mail_host: 'smtp.mailtrap.io',
        mail_port: '587',
        mail_username: '',
        mail_password: '',
        mail_encryption: 'tls',
        mail_from_address: 'noreply@yenagoa-lga.gov.ng',
        mail_from_name: 'Yenagoa LGA',
        enable_email_notifications: true
    });

    // Payment Settings
    const [paymentSettings, setPaymentSettings] = useState({
        default_payment_gateway: 'paystack',
        enable_wallet: true,
        minimum_wallet_balance: '1000',
        transaction_fee_type: 'percentage', // 'fixed' or 'percentage'
        transaction_fee_value: '1.5',
        enable_reminders: true,
        reminder_days_before: '7',
        reminder_days_after: '3',
        show_record_payment_button: true // Toggle for Record Payment button visibility
    });

    // Security Settings
    const [securitySettings, setSecuritySettings] = useState({
        session_lifetime: '120',
        enable_2fa: false,
        password_expiry_days: '90',
        max_login_attempts: '5',
        lockout_duration: '30',
        require_strong_password: true,
        password_min_length: '8',
        enable_audit_logs: true,
        enable_ip_whitelist: false,
        allowed_ips: ''
    });

    // Notification Settings
    const [notificationSettings, setNotificationSettings] = useState({
        email_on_new_user: true,
        email_on_new_payment: true,
        email_on_failed_payment: true,
        email_on_wallet_low: true,
        sms_on_payment: false,
        sms_on_invoice: false,
        dashboard_notifications: true,
        notification_retention_days: '30'
    });

    useEffect(() => {
        // In production, fetch settings from API
        // fetchSettings();
    }, [token]);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/settings', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            // Update state with fetched settings
            setLoading(false);
        } catch (err) {
            console.error('Error fetching settings:', err);
            setError('Failed to load settings');
            setLoading(false);
        }
    };

    const handleSaveSettings = async () => {
        setSaving(true);
        setError(null);
        setSuccess(null);

        try {
            let settingsToSave = {};

            switch (activeTab) {
                case 'general':
                    settingsToSave = generalSettings;
                    break;
                case 'email':
                    settingsToSave = emailSettings;
                    break;
                case 'payment':
                    settingsToSave = paymentSettings;
                    break;
                case 'security':
                    settingsToSave = securitySettings;
                    break;
                case 'notifications':
                    settingsToSave = notificationSettings;
                    break;
                default:
                    break;
            }

            // In production, send to API
            // const response = await axios.put('/settings', {
            //     category: activeTab,
            //     settings: settingsToSave
            // }, {
            //     headers: { 'Authorization': `Bearer ${token}` }
            // });

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Save payment settings to localStorage for client-side access
            if (activeTab === 'payment') {
                localStorage.setItem('paymentSettings', JSON.stringify(paymentSettings));
            }

            setSuccess('Settings saved successfully!');
            setSaving(false);

            window.scrollTo({ top: 0, behavior: 'smooth' });
            setTimeout(() => setSuccess(null), 5000);
        } catch (err) {
            console.error('Save settings error:', err);
            setError(err.response?.data?.message || 'Failed to save settings');
            setSaving(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setTimeout(() => setError(null), 5000);
        }
    };

    const handleTestEmail = async () => {
        try {
            setSuccess('Sending test email...');
            // await axios.post('/settings/test-email', emailSettings, {
            //     headers: { 'Authorization': `Bearer ${token}` }
            // });
            await new Promise(resolve => setTimeout(resolve, 2000));
            setSuccess('Test email sent successfully! Check your inbox.');
            setTimeout(() => setSuccess(null), 5000);
        } catch (err) {
            setError('Failed to send test email');
            setTimeout(() => setError(null), 5000);
        }
    };

    const tabs = [
        { id: 'general', label: 'General', icon: FaCog },
        { id: 'email', label: 'Email', icon: FaEnvelope },
        { id: 'payment', label: 'Payment', icon: FaServer },
        { id: 'security', label: 'Security', icon: FaShieldAlt },
        { id: 'notifications', label: 'Notifications', icon: FaBell }
    ];

    const SettingRow = ({ label, children, description }) => (
        <div className="py-4 border-b border-gray-200 dark:border-gray-700 last:border-0">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
                <div className="flex-1">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        {label}
                    </label>
                    {description && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
                    )}
                </div>
                <div className="md:ml-4 md:w-1/2">
                    {children}
                </div>
            </div>
        </div>
    );

    const ToggleSwitch = ({ checked, onChange, label }) => (
        <button
            onClick={() => onChange(!checked)}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${
                checked ? 'bg-[#0d544c]' : 'bg-gray-300 dark:bg-gray-600'
            }`}
        >
            <span
                className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                    checked ? 'translate-x-6' : 'translate-x-1'
                }`}
            />
        </button>
    );

    return (
        <div className="w-full bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-500 animate-fadeIn">
            <div className="w-full p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                    <div>
                        <h1 className='flex space-x-2 items-center text-2xl md:text-3xl font-bold text-gray-900 dark:text-white'>
                            <FaCog size={30} className='text-[#0d544c]' />
                            <span>System Settings</span>
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2 ml-10">
                            Configure system-wide settings and preferences
                        </p>
                    </div>
                </div>

                {/* Success/Error Messages */}
                {success && (
                    <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border-l-4 border-[#0d544c] rounded flex items-center animate-slideIn">
                        <FaCheckCircle className="text-[#0d544c] mr-3" size={20} />
                        <span className="text-[#0d544c] dark:text-green-400">{success}</span>
                    </div>
                )}

                {error && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-[#f06752] rounded flex items-center animate-slideIn">
                        <FaExclamationTriangle className="text-[#f06752] mr-3" size={20} />
                        <span className="text-[#f06752] dark:text-red-400">{error}</span>
                    </div>
                )}

                {/* Settings Container */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                    {/* Tabs */}
                    <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                        <nav className="flex overflow-x-auto">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                                            activeTab === tab.id
                                                ? 'border-[#0d544c] text-[#0d544c] dark:text-[#3B78BD]'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                                        }`}
                                    >
                                        <Icon size={18} />
                                        <span>{tab.label}</span>
                                    </button>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {/* General Settings */}
                        {activeTab === 'general' && (
                            <div className="space-y-1">
                                <div className="mb-6">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2 mb-2">
                                        <FaGlobe className="text-[#3B78BD]" />
                                        <span>General Configuration</span>
                                    </h2>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Basic system settings and preferences
                                    </p>
                                </div>

                                <SettingRow
                                    label="System Name"
                                    description="The name displayed throughout the application"
                                >
                                    <input
                                        type="text"
                                        value={generalSettings.system_name}
                                        onChange={(e) => setGeneralSettings({ ...generalSettings, system_name: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-[#3B78BD]"
                                    />
                                </SettingRow>

                                <SettingRow
                                    label="System Email"
                                    description="Primary contact email for the system"
                                >
                                    <input
                                        type="email"
                                        value={generalSettings.system_email}
                                        onChange={(e) => setGeneralSettings({ ...generalSettings, system_email: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-[#3B78BD]"
                                    />
                                </SettingRow>

                                <SettingRow
                                    label="System Phone"
                                    description="Contact phone number"
                                >
                                    <input
                                        type="text"
                                        value={generalSettings.system_phone}
                                        onChange={(e) => setGeneralSettings({ ...generalSettings, system_phone: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-[#3B78BD]"
                                    />
                                </SettingRow>

                                <SettingRow
                                    label="Timezone"
                                    description="System timezone for date/time display"
                                >
                                    <select
                                        value={generalSettings.timezone}
                                        onChange={(e) => setGeneralSettings({ ...generalSettings, timezone: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-[#3B78BD]"
                                    >
                                        <option value="Africa/Lagos">Africa/Lagos (WAT)</option>
                                        <option value="UTC">UTC</option>
                                        <option value="America/New_York">America/New_York (EST)</option>
                                    </select>
                                </SettingRow>

                                <SettingRow
                                    label="Date Format"
                                    description="How dates are displayed in the system"
                                >
                                    <select
                                        value={generalSettings.date_format}
                                        onChange={(e) => setGeneralSettings({ ...generalSettings, date_format: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-[#3B78BD]"
                                    >
                                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                                    </select>
                                </SettingRow>

                                <SettingRow
                                    label="Currency"
                                    description="Default currency for transactions"
                                >
                                    <div className="flex space-x-4">
                                        <input
                                            type="text"
                                            value={generalSettings.currency}
                                            onChange={(e) => setGeneralSettings({ ...generalSettings, currency: e.target.value })}
                                            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-[#3B78BD]"
                                            placeholder="NGN"
                                        />
                                        <input
                                            type="text"
                                            value={generalSettings.currency_symbol}
                                            onChange={(e) => setGeneralSettings({ ...generalSettings, currency_symbol: e.target.value })}
                                            className="w-20 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-[#3B78BD]"
                                            placeholder="₦"
                                        />
                                    </div>
                                </SettingRow>

                                <SettingRow
                                    label="Maintenance Mode"
                                    description="Temporarily disable access for non-admin users"
                                >
                                    <div className="flex items-center space-x-3">
                                        <ToggleSwitch
                                            checked={generalSettings.maintenance_mode}
                                            onChange={(value) => setGeneralSettings({ ...generalSettings, maintenance_mode: value })}
                                        />
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {generalSettings.maintenance_mode ? 'Enabled' : 'Disabled'}
                                        </span>
                                    </div>
                                </SettingRow>

                                <SettingRow
                                    label="Allow User Registration"
                                    description="Enable new users to register accounts"
                                >
                                    <div className="flex items-center space-x-3">
                                        <ToggleSwitch
                                            checked={generalSettings.allow_registration}
                                            onChange={(value) => setGeneralSettings({ ...generalSettings, allow_registration: value })}
                                        />
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {generalSettings.allow_registration ? 'Enabled' : 'Disabled'}
                                        </span>
                                    </div>
                                </SettingRow>
                            </div>
                        )}

                        {/* Email Settings */}
                        {activeTab === 'email' && (
                            <div className="space-y-1">
                                <div className="mb-6">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2 mb-2">
                                        <MdEmail className="text-[#3B78BD]" />
                                        <span>Email Configuration</span>
                                    </h2>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Configure SMTP and email notification settings
                                    </p>
                                </div>

                                <SettingRow
                                    label="Mail Driver"
                                    description="Email delivery method"
                                >
                                    <select
                                        value={emailSettings.mail_driver}
                                        onChange={(e) => setEmailSettings({ ...emailSettings, mail_driver: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-[#3B78BD]"
                                    >
                                        <option value="smtp">SMTP</option>
                                        <option value="sendmail">Sendmail</option>
                                        <option value="mailgun">Mailgun</option>
                                        <option value="ses">Amazon SES</option>
                                    </select>
                                </SettingRow>

                                <SettingRow
                                    label="SMTP Host"
                                    description="Mail server address"
                                >
                                    <input
                                        type="text"
                                        value={emailSettings.mail_host}
                                        onChange={(e) => setEmailSettings({ ...emailSettings, mail_host: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-[#3B78BD]"
                                    />
                                </SettingRow>

                                <SettingRow
                                    label="SMTP Port"
                                    description="Mail server port (usually 587 for TLS, 465 for SSL)"
                                >
                                    <input
                                        type="text"
                                        value={emailSettings.mail_port}
                                        onChange={(e) => setEmailSettings({ ...emailSettings, mail_port: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-[#3B78BD]"
                                    />
                                </SettingRow>

                                <SettingRow
                                    label="SMTP Username"
                                    description="Authentication username"
                                >
                                    <input
                                        type="text"
                                        value={emailSettings.mail_username}
                                        onChange={(e) => setEmailSettings({ ...emailSettings, mail_username: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-[#3B78BD]"
                                    />
                                </SettingRow>

                                <SettingRow
                                    label="SMTP Password"
                                    description="Authentication password"
                                >
                                    <input
                                        type="password"
                                        value={emailSettings.mail_password}
                                        onChange={(e) => setEmailSettings({ ...emailSettings, mail_password: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-[#3B78BD]"
                                        placeholder="••••••••"
                                    />
                                </SettingRow>

                                <SettingRow
                                    label="Encryption"
                                    description="Email encryption method"
                                >
                                    <select
                                        value={emailSettings.mail_encryption}
                                        onChange={(e) => setEmailSettings({ ...emailSettings, mail_encryption: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-[#3B78BD]"
                                    >
                                        <option value="tls">TLS</option>
                                        <option value="ssl">SSL</option>
                                        <option value="none">None</option>
                                    </select>
                                </SettingRow>

                                <SettingRow
                                    label="From Address"
                                    description="Email address shown in 'From' field"
                                >
                                    <input
                                        type="email"
                                        value={emailSettings.mail_from_address}
                                        onChange={(e) => setEmailSettings({ ...emailSettings, mail_from_address: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-[#3B78BD]"
                                    />
                                </SettingRow>

                                <SettingRow
                                    label="From Name"
                                    description="Name shown in 'From' field"
                                >
                                    <input
                                        type="text"
                                        value={emailSettings.mail_from_name}
                                        onChange={(e) => setEmailSettings({ ...emailSettings, mail_from_name: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-[#3B78BD]"
                                    />
                                </SettingRow>

                                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                                    <button
                                        onClick={handleTestEmail}
                                        className="px-6 py-2 bg-[#3B78BD] text-white rounded-lg hover:bg-[#0d544c] transition-colors flex items-center space-x-2"
                                    >
                                        <FaEnvelope />
                                        <span>Send Test Email</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Payment Settings */}
                        {activeTab === 'payment' && (
                            <div className="space-y-1">
                                <div className="mb-6">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2 mb-2">
                                        <FaServer className="text-[#3B78BD]" />
                                        <span>Payment Configuration</span>
                                    </h2>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Configure payment gateways and transaction settings
                                    </p>
                                </div>

                                <SettingRow
                                    label="Default Payment Gateway"
                                    description="Primary payment gateway for transactions"
                                >
                                    <select
                                        value={paymentSettings.default_payment_gateway}
                                        onChange={(e) => setPaymentSettings({ ...paymentSettings, default_payment_gateway: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-[#3B78BD]"
                                    >
                                        <option value="paystack">Paystack</option>
                                        <option value="interswitch">Interswitch</option>
                                        <option value="remita">Remita</option>
                                        <option value="tranzakt">Tranzakt</option>
                                        <option value="flutterwave">Flutterwave</option>
                                    </select>
                                </SettingRow>

                                <SettingRow
                                    label="Enable Wallet System"
                                    description="Allow users to maintain wallet balance"
                                >
                                    <div className="flex items-center space-x-3">
                                        <ToggleSwitch
                                            checked={paymentSettings.enable_wallet}
                                            onChange={(value) => setPaymentSettings({ ...paymentSettings, enable_wallet: value })}
                                        />
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {paymentSettings.enable_wallet ? 'Enabled' : 'Disabled'}
                                        </span>
                                    </div>
                                </SettingRow>

                                <SettingRow
                                    label="Minimum Wallet Balance"
                                    description="Minimum balance to maintain in wallet (₦)"
                                >
                                    <input
                                        type="number"
                                        value={paymentSettings.minimum_wallet_balance}
                                        onChange={(e) => setPaymentSettings({ ...paymentSettings, minimum_wallet_balance: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-[#3B78BD]"
                                    />
                                </SettingRow>

                                <SettingRow
                                    label="Transaction Fee Type"
                                    description="How transaction fees are calculated"
                                >
                                    <select
                                        value={paymentSettings.transaction_fee_type}
                                        onChange={(e) => setPaymentSettings({ ...paymentSettings, transaction_fee_type: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-[#3B78BD]"
                                    >
                                        <option value="percentage">Percentage</option>
                                        <option value="fixed">Fixed Amount</option>
                                    </select>
                                </SettingRow>

                                <SettingRow
                                    label="Transaction Fee Value"
                                    description={paymentSettings.transaction_fee_type === 'percentage' ? 'Percentage fee (%)' : 'Fixed fee amount (₦)'}
                                >
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={paymentSettings.transaction_fee_value}
                                        onChange={(e) => setPaymentSettings({ ...paymentSettings, transaction_fee_value: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-[#3B78BD]"
                                    />
                                </SettingRow>

                                <SettingRow
                                    label="Enable Payment Reminders"
                                    description="Send automatic reminders for unpaid invoices"
                                >
                                    <div className="flex items-center space-x-3">
                                        <ToggleSwitch
                                            checked={paymentSettings.enable_reminders}
                                            onChange={(value) => setPaymentSettings({ ...paymentSettings, enable_reminders: value })}
                                        />
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {paymentSettings.enable_reminders ? 'Enabled' : 'Disabled'}
                                        </span>
                                    </div>
                                </SettingRow>

                                {paymentSettings.enable_reminders && (
                                    <>
                                        <SettingRow
                                            label="Reminder Days Before Due"
                                            description="Send reminder X days before invoice due date"
                                        >
                                            <input
                                                type="number"
                                                value={paymentSettings.reminder_days_before}
                                                onChange={(e) => setPaymentSettings({ ...paymentSettings, reminder_days_before: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-[#3B78BD]"
                                            />
                                        </SettingRow>

                                        <SettingRow
                                            label="Reminder Days After Due"
                                            description="Send reminder X days after invoice is overdue"
                                        >
                                            <input
                                                type="number"
                                                value={paymentSettings.reminder_days_after}
                                                onChange={(e) => setPaymentSettings({ ...paymentSettings, reminder_days_after: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-[#3B78BD]"
                                            />
                                        </SettingRow>
                                    </>
                                )}

                                <SettingRow
                                    label="Show Record Payment Button"
                                    description="Display the 'Record Payment' button on invoice tables for offline payment recording"
                                >
                                    <div className="flex items-center space-x-3">
                                        <ToggleSwitch
                                            checked={paymentSettings.show_record_payment_button}
                                            onChange={(value) => setPaymentSettings({ ...paymentSettings, show_record_payment_button: value })}
                                        />
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {paymentSettings.show_record_payment_button ? 'Visible' : 'Hidden'}
                                        </span>
                                    </div>
                                </SettingRow>
                            </div>
                        )}

                        {/* Security Settings */}
                        {activeTab === 'security' && (
                            <div className="space-y-1">
                                <div className="mb-6">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2 mb-2">
                                        <MdSecurity className="text-[#3B78BD]" />
                                        <span>Security Configuration</span>
                                    </h2>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Configure authentication and security settings
                                    </p>
                                </div>

                                <SettingRow
                                    label="Session Lifetime"
                                    description="User session timeout in minutes"
                                >
                                    <input
                                        type="number"
                                        value={securitySettings.session_lifetime}
                                        onChange={(e) => setSecuritySettings({ ...securitySettings, session_lifetime: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-[#3B78BD]"
                                    />
                                </SettingRow>

                                <SettingRow
                                    label="Enable Two-Factor Authentication"
                                    description="Require 2FA for all user logins"
                                >
                                    <div className="flex items-center space-x-3">
                                        <ToggleSwitch
                                            checked={securitySettings.enable_2fa}
                                            onChange={(value) => setSecuritySettings({ ...securitySettings, enable_2fa: value })}
                                        />
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {securitySettings.enable_2fa ? 'Enabled' : 'Disabled'}
                                        </span>
                                    </div>
                                </SettingRow>

                                <SettingRow
                                    label="Password Expiry"
                                    description="Force password change after X days (0 = never)"
                                >
                                    <input
                                        type="number"
                                        value={securitySettings.password_expiry_days}
                                        onChange={(e) => setSecuritySettings({ ...securitySettings, password_expiry_days: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-[#3B78BD]"
                                    />
                                </SettingRow>

                                <SettingRow
                                    label="Max Login Attempts"
                                    description="Lock account after X failed login attempts"
                                >
                                    <input
                                        type="number"
                                        value={securitySettings.max_login_attempts}
                                        onChange={(e) => setSecuritySettings({ ...securitySettings, max_login_attempts: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-[#3B78BD]"
                                    />
                                </SettingRow>

                                <SettingRow
                                    label="Lockout Duration"
                                    description="Account lockout duration in minutes"
                                >
                                    <input
                                        type="number"
                                        value={securitySettings.lockout_duration}
                                        onChange={(e) => setSecuritySettings({ ...securitySettings, lockout_duration: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-[#3B78BD]"
                                    />
                                </SettingRow>

                                <SettingRow
                                    label="Require Strong Password"
                                    description="Enforce password complexity rules"
                                >
                                    <div className="flex items-center space-x-3">
                                        <ToggleSwitch
                                            checked={securitySettings.require_strong_password}
                                            onChange={(value) => setSecuritySettings({ ...securitySettings, require_strong_password: value })}
                                        />
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {securitySettings.require_strong_password ? 'Enabled' : 'Disabled'}
                                        </span>
                                    </div>
                                </SettingRow>

                                <SettingRow
                                    label="Minimum Password Length"
                                    description="Minimum characters required for passwords"
                                >
                                    <input
                                        type="number"
                                        value={securitySettings.password_min_length}
                                        onChange={(e) => setSecuritySettings({ ...securitySettings, password_min_length: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-[#3B78BD]"
                                    />
                                </SettingRow>

                                <SettingRow
                                    label="Enable Audit Logs"
                                    description="Record all system activities for auditing"
                                >
                                    <div className="flex items-center space-x-3">
                                        <ToggleSwitch
                                            checked={securitySettings.enable_audit_logs}
                                            onChange={(value) => setSecuritySettings({ ...securitySettings, enable_audit_logs: value })}
                                        />
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {securitySettings.enable_audit_logs ? 'Enabled' : 'Disabled'}
                                        </span>
                                    </div>
                                </SettingRow>

                                <SettingRow
                                    label="IP Whitelist"
                                    description="Restrict access to specific IP addresses"
                                >
                                    <div className="flex items-center space-x-3">
                                        <ToggleSwitch
                                            checked={securitySettings.enable_ip_whitelist}
                                            onChange={(value) => setSecuritySettings({ ...securitySettings, enable_ip_whitelist: value })}
                                        />
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {securitySettings.enable_ip_whitelist ? 'Enabled' : 'Disabled'}
                                        </span>
                                    </div>
                                </SettingRow>

                                {securitySettings.enable_ip_whitelist && (
                                    <SettingRow
                                        label="Allowed IP Addresses"
                                        description="Comma-separated list of allowed IPs"
                                    >
                                        <textarea
                                            value={securitySettings.allowed_ips}
                                            onChange={(e) => setSecuritySettings({ ...securitySettings, allowed_ips: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-[#3B78BD]"
                                            rows="3"
                                            placeholder="192.168.1.1, 10.0.0.1"
                                        />
                                    </SettingRow>
                                )}
                            </div>
                        )}

                        {/* Notification Settings */}
                        {activeTab === 'notifications' && (
                            <div className="space-y-1">
                                <div className="mb-6">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2 mb-2">
                                        <MdNotifications className="text-[#3B78BD]" />
                                        <span>Notification Configuration</span>
                                    </h2>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Configure email, SMS and in-app notifications
                                    </p>
                                </div>

                                <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-[#3B78BD] p-4 mb-6 rounded">
                                    <div className="flex items-start space-x-3">
                                        <FaInfoCircle className="text-[#3B78BD] mt-0.5" />
                                        <div>
                                            <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                                                Email Notifications
                                            </p>
                                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                                Configure when the system sends email notifications to admins
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <SettingRow
                                    label="New User Registration"
                                    description="Email when a new user registers"
                                >
                                    <div className="flex items-center space-x-3">
                                        <ToggleSwitch
                                            checked={notificationSettings.email_on_new_user}
                                            onChange={(value) => setNotificationSettings({ ...notificationSettings, email_on_new_user: value })}
                                        />
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {notificationSettings.email_on_new_user ? 'Enabled' : 'Disabled'}
                                        </span>
                                    </div>
                                </SettingRow>

                                <SettingRow
                                    label="Successful Payment"
                                    description="Email when a payment is successful"
                                >
                                    <div className="flex items-center space-x-3">
                                        <ToggleSwitch
                                            checked={notificationSettings.email_on_new_payment}
                                            onChange={(value) => setNotificationSettings({ ...notificationSettings, email_on_new_payment: value })}
                                        />
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {notificationSettings.email_on_new_payment ? 'Enabled' : 'Disabled'}
                                        </span>
                                    </div>
                                </SettingRow>

                                <SettingRow
                                    label="Failed Payment"
                                    description="Email when a payment fails"
                                >
                                    <div className="flex items-center space-x-3">
                                        <ToggleSwitch
                                            checked={notificationSettings.email_on_failed_payment}
                                            onChange={(value) => setNotificationSettings({ ...notificationSettings, email_on_failed_payment: value })}
                                        />
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {notificationSettings.email_on_failed_payment ? 'Enabled' : 'Disabled'}
                                        </span>
                                    </div>
                                </SettingRow>

                                <SettingRow
                                    label="Low Wallet Balance"
                                    description="Email when wallet balance is low"
                                >
                                    <div className="flex items-center space-x-3">
                                        <ToggleSwitch
                                            checked={notificationSettings.email_on_wallet_low}
                                            onChange={(value) => setNotificationSettings({ ...notificationSettings, email_on_wallet_low: value })}
                                        />
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {notificationSettings.email_on_wallet_low ? 'Enabled' : 'Disabled'}
                                        </span>
                                    </div>
                                </SettingRow>

                                <div className="bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-500 p-4 my-6 rounded">
                                    <div className="flex items-start space-x-3">
                                        <FaInfoCircle className="text-purple-500 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                                                SMS Notifications
                                            </p>
                                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                                Configure when the system sends SMS to users (requires SMS gateway)
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <SettingRow
                                    label="SMS on Payment"
                                    description="Send SMS when payment is completed"
                                >
                                    <div className="flex items-center space-x-3">
                                        <ToggleSwitch
                                            checked={notificationSettings.sms_on_payment}
                                            onChange={(value) => setNotificationSettings({ ...notificationSettings, sms_on_payment: value })}
                                        />
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {notificationSettings.sms_on_payment ? 'Enabled' : 'Disabled'}
                                        </span>
                                    </div>
                                </SettingRow>

                                <SettingRow
                                    label="SMS on Invoice"
                                    description="Send SMS when new invoice is generated"
                                >
                                    <div className="flex items-center space-x-3">
                                        <ToggleSwitch
                                            checked={notificationSettings.sms_on_invoice}
                                            onChange={(value) => setNotificationSettings({ ...notificationSettings, sms_on_invoice: value })}
                                        />
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {notificationSettings.sms_on_invoice ? 'Enabled' : 'Disabled'}
                                        </span>
                                    </div>
                                </SettingRow>

                                <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 my-6 rounded">
                                    <div className="flex items-start space-x-3">
                                        <FaInfoCircle className="text-green-500 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                                                In-App Notifications
                                            </p>
                                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                                Configure dashboard notifications and alerts
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <SettingRow
                                    label="Dashboard Notifications"
                                    description="Show real-time notifications in dashboard"
                                >
                                    <div className="flex items-center space-x-3">
                                        <ToggleSwitch
                                            checked={notificationSettings.dashboard_notifications}
                                            onChange={(value) => setNotificationSettings({ ...notificationSettings, dashboard_notifications: value })}
                                        />
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {notificationSettings.dashboard_notifications ? 'Enabled' : 'Disabled'}
                                        </span>
                                    </div>
                                </SettingRow>

                                <SettingRow
                                    label="Notification Retention"
                                    description="Delete notifications older than X days"
                                >
                                    <input
                                        type="number"
                                        value={notificationSettings.notification_retention_days}
                                        onChange={(e) => setNotificationSettings({ ...notificationSettings, notification_retention_days: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-[#3B78BD]"
                                    />
                                </SettingRow>
                            </div>
                        )}
                    </div>

                    {/* Save Button */}
                    <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
                        <button
                            onClick={handleSaveSettings}
                            disabled={saving}
                            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#0d544c] to-[#3B78BD] text-white rounded-lg hover:from-[#3B78BD] hover:to-[#0d544c] transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {saving ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <>
                                    <FaSave />
                                    <span>Save Settings</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideIn {
                    from { opacity: 0; transform: translateX(-20px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.6s ease-out forwards;
                }
                .animate-slideIn {
                    animation: slideIn 0.6s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default SystemSettings;
