import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Landing from './public/pages/Landing'
import { Suspense, useEffect, useState } from 'react'
import Loader from './common/Loader';
import Auth from './public/pages/Auth';
import Services from './public/pages/Services';
import Service from './public/pages/Service'
import AuthContextProvider from './context/AuthContext';
import DefaultLayout from './protected/DefaultLayout';
import routes from './routes';
import Dashboard from './protected/pages/Dashboard';
import PrivateRoute from './protected/PrivateRoute';
import Landing2 from './public/pages/Landing2';
import Application from './protected/pages/Application'
import ApplicationDetail from './protected/pages/ApplicationDetail';
import AdminApplications from './protected/lga_admin/pages/AdminApplications';
import AdminApplicationDetail from './protected/lga_admin/pages/AdminApplicationDetail';
import Users from './protected/super_admin/pages/Users';
import LgasStaff from './protected/super_admin/pages/LgasStaff';

function App() {

    const [loading, setLoading] = useState(true);

    useEffect(() => {
      setTimeout(() => setLoading(false), 1000);
    }, [])

    return /**loading ? (<Loader />) : */ (
      <AuthContextProvider>
          <Router>
              <Routes>
                <Route path='/' element={<Landing2 />} />
                <Route path='/auth' element={<Auth />} />
                <Route path='/services' element={<Services />} />
                <Route path='/service' element={<Service />} />
                <Route element={<PrivateRoute><DefaultLayout /></PrivateRoute>}>
                    <Route path='/dashboard' element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                    <Route path='/application' element={<PrivateRoute><Application /></PrivateRoute>} />
                    <Route path='/application-detail' element={<PrivateRoute><ApplicationDetail /></PrivateRoute>} />
                    <Route path='/applications' element={<PrivateRoute><AdminApplications /></PrivateRoute>} />
                    <Route path='/admin-applications-detail' element={<PrivateRoute><AdminApplicationDetail /></PrivateRoute>} />
                    <Route path='/users' element={<PrivateRoute><Users /></PrivateRoute>} />
                    <Route path='/lgas-staff' element={<PrivateRoute><LgasStaff /></PrivateRoute>} />
                    {routes.map(({ path, component: Component }) => {
                      <Route 
                        path={path}
                        element={
                          <Suspense fallback={<Loader />}>
                            <Component />
                          </Suspense>
                        }
                      />
                    })}
                </Route>
              </Routes>
          </Router>
      </AuthContextProvider>
    )
}

export default App
