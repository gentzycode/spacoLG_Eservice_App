import { lazy } from "react";

const Dashboard = lazy(() => import('../protected/pages/Dashboard'));
// Import other components as needed

const coreRoutes = [
    {
        path: '/dashboard',
        title: 'Dashboard',
        component: Dashboard,
    },
    // Add other routes here
];

const routes = [...coreRoutes];
export default routes;