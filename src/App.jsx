import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar1 from './components/Navbar1'
import Home from './pages/Home'
import Register from './pages/Register'
import FindDonors from './pages/FindDonors'
import Request from './pages/Request'
import RecentRequests from './pages/RecentRequests'
import FindCenter from './pages/FindCenter'


const App = () => {
  return (
    <BrowserRouter>
      <Navbar1 />
      <Routes>
        {/* Home Route - Should be exact path */}
        <Route path="/BloodDonation/" element={<Home />} />
        
        
        
        {/* Donor Routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/find-donors" element={<FindDonors />} />
        
        {/* Request Routes */}
        <Route path="/request-blood" element={<Request />} />
        <Route path="/blood-requests" element={<RecentRequests />} />
        
        {/* Informational Routes */}
        <Route path="/findcenter" element={<FindCenter />} />

        
       
      </Routes>
    </BrowserRouter>
  )
}

export default App