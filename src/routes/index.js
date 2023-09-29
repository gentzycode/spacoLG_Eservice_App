import { lazy } from "react";

const Dashboard = lazy(() => import('../protected/pages/Dashboard'))


const coreRoutes = [
    {
        path: '/dashboard',
        title: 'Dashboard',
        component: Dashboard,
    },
];

const routes = [...coreRoutes];
export default routes