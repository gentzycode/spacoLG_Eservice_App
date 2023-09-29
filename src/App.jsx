import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Landing from './public/pages/Landing'
import { Suspense, useEffect, useState } from 'react'
import Loader from './common/Loader';
import Auth from './public/pages/Auth';
import Services from './public/pages/Services';
import Service from './public/pages/Service'
import AuthContextProvider from './context/AuthContext';
import RequestForm from './public/pages/RequestForm';
import DefaultLayout from './protected/DefaultLayout';
import routes from './routes';
import Dashboard from './protected/pages/Dashboard';
import PrivateRoute from './protected/PrivateRoute';

function App() {

    const [loading, setLoading] = useState(true);

    useEffect(() => {
      setTimeout(() => setLoading(false), 1000);
    }, [])

    return loading ? (<Loader />) : (
      <AuthContextProvider>
          <Router>
              <Routes>
                <Route path='/' element={<Landing />} />
                <Route path='/auth' element={<Auth />} />
                <Route path='/services' element={<Services />} />
                <Route path='/service' element={<Service />} />
                <Route path='/request-form' element={<RequestForm />} />
                <Route element={<PrivateRoute><DefaultLayout /></PrivateRoute>}>
                    <Route path='/dashboard' element={<PrivateRoute><Dashboard /></PrivateRoute>} />
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
