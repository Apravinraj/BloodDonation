import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

const Navbar1 = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <NavLink to="/" className="navbar-brand" onClick={closeMenu}>
          BloodConnect
        </NavLink>
        <div className="menu-toggle" onClick={toggleMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
        <div className={`navbar-links ${isOpen ? "active" : ""}`}>
          <NavLink to="/" className="nav-link" onClick={closeMenu}>Home</NavLink>
          <NavLink to="/register" className="nav-link" onClick={closeMenu}>Register</NavLink>
          <NavLink to="/find-donors" className="nav-link" onClick={closeMenu}>Find Donors</NavLink>
          <NavLink to="/request-blood" className="nav-link" onClick={closeMenu}>Request Blood</NavLink>
          <NavLink to="/blood-requests" className="nav-link" onClick={closeMenu}>Blood Requests</NavLink>

        </div>
      </div>
    </nav>
  );
};

export default Navbar1;
