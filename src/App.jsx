import React from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Navbar1 from './components/Navbar1'
import Home from './pages/Home'
import Register from './pages/Register'
import FindDonors from './pages/FindDonars'
import Request from './pages/Request'
import RecentRequests from './pages/RecentRequest'
import AuthForm from './pages/AuthForm'
const App = () => {
  return (
    <div>
 
      <BrowserRouter>
      <Navbar1/>
      <Home/>
      <Register/>
      <FindDonors/>
      <Request/>
      <RecentRequests/>
      <AuthForm/>
<Routes>

      <Route path="/home" element={<Home />}/>
      <Route path="/register" element={<Register />} />
      <Route path="/find-donors" element={<FindDonors />} />

      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
