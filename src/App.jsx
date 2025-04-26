import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar1 from './components/Navbar1'
import Home from './pages/Home'
import Register from './pages/Register'
import FindDonors from './pages/FindDonors'
import Request from './pages/Request'
import AuthForm from './pages/AuthForm'
import RecentRequests from './pages/RecentRequests'
import Profile from './pages/Profile'
// Create this component for 404 pages

const App = () => {
  return (
    <BrowserRouter>
      <Navbar1 />
      <Routes>
        {/* Home Route - Should be exact path */}
        <Route path="/" element={<Home />} />
        
        {/* Authentication */}
        <Route path="/login" element={<AuthForm isLogin={true} />} />
        <Route path="/signup" element={<AuthForm isLogin={false} />} />
        
        {/* Donor Routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/find-donors" element={<FindDonors />} />
        
        {/* Request Routes */}
        <Route path="/request-blood" element={<Request />} />
        <Route path="/blood-requests" element={<RecentRequests />} />
        
        {/* Informational Routes */}
        <Route path="/profile" element={<Profile />} />

        
       
      </Routes>
    </BrowserRouter>
  )
}

export default App