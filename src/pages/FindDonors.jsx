import React, { useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { FaSearch, FaPhone, FaMapMarkerAlt, FaTint, FaUser } from 'react-icons/fa';
import './FindDonors.css';

const FindDonors = () => {
  const [bloodGroup, setBloodGroup] = useState('');
  const [location, setLocation] = useState('');
  const [donors, setDonors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!bloodGroup || !location) {
      setError('Please select blood group and enter location');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const donorsRef = collection(db, "donors");
      const q = query(
        donorsRef,
        where("bloodGroup", "==", bloodGroup),
        where("location", "==", location),
        where("availability", "==", "Yes")
      );
      const querySnapshot = await getDocs(q);
      const results = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDonors(results);
      
      if (results.length === 0) {
        setError('No donors found matching your criteria');
      }
    } catch (err) {
      console.error("Error searching donors: ", err);
      setError('Failed to search donors. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="find-donors-container">
      <div className="search-section">
        <h1 className="page-title">
          <FaTint className="blood-icon" /> Find Blood Donors
        </h1>
        <p className="page-subtitle">
          Search for available donors in your area and save lives
        </p>
        
        <div className="search-box">
          <div className="search-input-group">
            <label htmlFor="bloodGroup"><FaTint /> Blood Group</label>
            <select 
              id="bloodGroup"
              value={bloodGroup} 
              onChange={e => setBloodGroup(e.target.value)}
              className="search-select"
            >
              <option value="">Select Blood Group</option>
              <option value="A+">A+</option>
              <option value="A−">A−</option>
              <option value="B+">B+</option>
              <option value="B−">B−</option>
              <option value="AB+">AB+</option>
              <option value="AB−">AB−</option>
              <option value="O+">O+</option>
              <option value="O−">O−</option>
            </select>
          </div>
          
          <div className="search-input-group">
            <label htmlFor="location"><FaMapMarkerAlt /> Location</label>
            <input
              type="text"
              id="location"
              className="search-input"
              placeholder="Enter city or district"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          
          <button 
            className="search-button"
            onClick={handleSearch}
            disabled={isLoading}
          >
            {isLoading ? 'Searching...' : (
              <>
                <FaSearch /> Search Donors
              </>
            )}
          </button>
        </div>
        
        {error && <div className="error-message">{error}</div>}
      </div>

      {donors.length > 0 && (
        <div className="results-section">
          <h2 className="results-title">
            Available Donors ({donors.length})
          </h2>
          
          <div className="donors-grid">
            {donors.map((donor) => (
              <div className="donor-card" key={donor.id}>
                <div className="donor-avatar">
                  <FaUser />
                </div>
                <div className="donor-info">
                  <h3 className="donor-name">{donor.name}</h3>
                  <div className="donor-details">
                    <div className="detail-item">
                      <FaTint className="detail-icon" />
                      <span>{donor.bloodGroup}</span>
                    </div>
                    <div className="detail-item">
                      <FaMapMarkerAlt className="detail-icon" />
                      <span>{donor.location}</span>
                    </div>
                    <div className="detail-item">
                      <FaPhone className="detail-icon" />
                      <a href={`tel:${donor.contact}`}>{donor.contact}</a>
                    </div>
                  </div>
                  {donor.lastDonationDate && (
                    <div className="last-donation">
                      Last donated: {new Date(donor.lastDonationDate).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FindDonors;