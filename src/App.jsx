import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Landing from './public/pages/Landing'
import { useEffect, useState } from 'react'
import Loader from './common/Loader';
import Auth from './public/pages/Auth';
import Services from './public/pages/Services';
import Service from './public/pages/Service'
import AuthContextProvider from './context/AuthContext';

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
              </Routes>
          </Router>
      </AuthContextProvider>
    )
}

export default App
