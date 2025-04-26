import React, { useState, useEffect } from 'react';
import { LoadScript, GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import './FindCenter.css';

// Map configuration
const mapContainerStyle = {
  width: '100%',
  height: '70vh'
};

const center = {
  lat: 28.6139,  // Default to New Delhi coordinates
  lng: 77.2090
};

const libraries = ['places'];

const FindCenter = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [bloodBanks, setBloodBanks] = useState([]);
  const [selectedBank, setSelectedBank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          findNearbyBloodBanks(position.coords.latitude, position.coords.longitude);
        },
        (err) => {
          console.error("Error getting location: ", err);
          setError("Couldn't get your location. Showing default locations.");
          findNearbyBloodBanks(center.lat, center.lng);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser. Showing default locations.");
      findNearbyBloodBanks(center.lat, center.lng);
    }
  }, []);

  // Simulate finding nearby blood banks (in a real app, you'd use Google Places API)
  const findNearbyBloodBanks = (lat, lng) => {
    setLoading(true);
    
    // Mock data - in a real app, you would use Google Places API
    const mockBloodBanks = [
      {
        id: 1,
        name: "Red Cross Blood Bank",
        location: { lat: lat + 0.01, lng: lng + 0.01 },
        address: "123 Health Street, Medical Complex",
        contact: "+91 9876543210",
        hours: "9:00 AM - 7:00 PM"
      },
      {
        id: 2,
        name: "LifeBlood Center",
        location: { lat: lat - 0.01, lng: lng - 0.01 },
        address: "456 Donation Road, Health District",
        contact: "+91 9876543211",
        hours: "8:00 AM - 6:00 PM"
      },
      {
        id: 3,
        name: "City Blood Services",
        location: { lat: lat + 0.02, lng: lng - 0.005 },
        address: "789 Care Avenue, Civic Center",
        contact: "+91 9876543212",
        hours: "10:00 AM - 8:00 PM"
      }
    ];

    setTimeout(() => {
      setBloodBanks(mockBloodBanks);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="find-center-container">
      <div className="header">
        <h1>Find Nearby Blood Banks</h1>
        <p>Locate the closest blood donation centers in your area</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="map-container">
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Finding blood banks near you...</p>
          </div>
        ) : (
          <LoadScript
          googleMapsApiKey={googleMapsApiKey} // Replace with your actual API key
            libraries={libraries}
          >
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={userLocation || center}
              zoom={14}
            >
              {/* User location marker */}
              {userLocation && (
  <Marker
    position={userLocation}
    icon={{
      url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
    }}
  />
)}

              {/* Blood bank markers */}
              {bloodBanks.map((bank) => (
                <Marker
                  key={bank.id}
                  position={bank.location}
                  onClick={() => setSelectedBank(bank)}
                  icon={{
                    url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png"
                  }}
                />
              ))}

              {/* Info window when a marker is clicked */}
              {selectedBank && (
                <InfoWindow
                  position={selectedBank.location}
                  onCloseClick={() => setSelectedBank(null)}
                >
                  <div className="info-window">
                    <h3>{selectedBank.name}</h3>
                    <p>{selectedBank.address}</p>
                    <p><strong>Contact:</strong> {selectedBank.contact}</p>
                    <p><strong>Hours:</strong> {selectedBank.hours}</p>
                    <button className="directions-btn">
                      Get Directions
                    </button>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          </LoadScript>
        )}
      </div>

      <div className="blood-banks-list">
        <h2>Available Blood Banks</h2>
        {loading ? (
          <p>Loading blood banks...</p>
        ) : (
          <div className="banks-grid">
            {bloodBanks.map((bank) => (
              <div key={bank.id} className="bank-card">
                <h3>{bank.name}</h3>
                <p className="address">{bank.address}</p>
                <p className="contact"><strong>Contact:</strong> {bank.contact}</p>
                <p className="hours"><strong>Hours:</strong> {bank.hours}</p>
                <button 
                  className="view-on-map-btn"
                  onClick={() => setSelectedBank(bank)}
                >
                  View on Map
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FindCenter;