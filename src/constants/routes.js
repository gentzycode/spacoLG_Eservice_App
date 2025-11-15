/**
 * Centralized Route Constants
 * All application routes are defined here to avoid hardcoding throughout the app
 */

// Public Routes
export const PUBLIC_ROUTES = {
  HOME: '/',
  AUTH: '/auth',
  SERVICES: '/services',
  LANDING: '/landing',
  STATUS_CHECK: '/status-check',
  RECEIPT_VERIFICATION: '/receipt-verification',
};

// Protected Routes - Common
export const PROTECTED_ROUTES = {
  DASHBOARD: '/dashboard',
  CHECK_STATUS: '/check-status',
  APPLICATION: '/application',
  APPLICATION_DETAIL: '/application/:id',
  PAYMENTS: '/payments',
  PROFILE: '/profile',
  FAQ: '/faq',
  SUPPORT: '/support',
};

// Agent Routes
export const AGENT_ROUTES = {
  MY_WALLET: '/my-wallet',
  MANAGE_TOKENS: '/manage-tokens',
  APPLICATIONS: '/applications',
  MANAGE_INVOICES: '/manage-invoices',
  ADVANCED_INVOICING: '/advanced-invoicing',
  MANAGE_PAYERS: '/manage-payers',
  REPORTS: '/reports',
};

// Staff Routes
export const STAFF_ROUTES = {
  APPLICATIONS: '/applications',
  USERS: '/users',
  AUTHORIZERS: '/authorizers',
};

// Super Admin Routes
export const SUPER_ADMIN_ROUTES = {
  USERS: '/users',
  TARIFFS: '/tariffs',
  LGAS_STAFF: '/lgas-staff',
  AUTHORIZERS: '/authorizers',
  PAYMENT_GATEWAYS: '/payment-gateways',
  SYSTEM_SETTINGS: '/system-settings',
  FINANCIAL_REPORTS: '/financial-reports',
  AUDIT_LOGS: '/audit-logs',
  AGENT_MANAGEMENT: '/agent-management',
};

// Combine all routes for easy access
export const ROUTES = {
  ...PUBLIC_ROUTES,
  ...PROTECTED_ROUTES,
  ...AGENT_ROUTES,
  ...STAFF_ROUTES,
  ...SUPER_ADMIN_ROUTES,
};

// Helper function to generate dynamic routes
export const generateRoute = (template, params) => {
  let route = template;
  Object.keys(params).forEach(key => {
    route = route.replace(`:${key}`, params[key]);
  });
  return route;
};

export default ROUTES;
