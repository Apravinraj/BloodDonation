import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { FaTint, FaHospital, FaPhone, FaClock, FaUser, FaExclamationTriangle, FaMapMarkerAlt, FaClipboardList } from 'react-icons/fa';
import './RecentRequests.css';

const RecentRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const q = query(collection(db, "requests"), orderBy("timestamp", "desc"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          // Convert Firestore timestamp to Date if needed
          timestamp: doc.data().timestamp?.toDate() || new Date()
        }));
        setRequests(data);
      } catch (error) {
        console.error("Error fetching requests:", error);
        setError('Failed to load requests. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'Emergency': return '#dc3545';
      case 'Urgent': return '#fd7e14';
      case 'Normal': return '#28a745';
      default: return '#6c757d';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="requests-container">
      <div className="requests-header">
        <h1><FaTint /> Recent Blood Requests</h1>
        <p>View and respond to recent blood donation requests in your area</p>
      </div>

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <div className="error-alert">
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        </div>
      ) : requests.length === 0 ? (
        <div className="no-requests">
          <div className="alert alert-info" role="alert">
            No blood requests found. Check back later.
          </div>
        </div>
      ) : (
        <div className="requests-grid">
          {requests.map((req) => (
            <div key={req.id} className="request-card">
              <div className="card-header">
                <div className="patient-info">
                  <FaUser className="icon" />
                  <h3>{req.patientName}</h3>
                </div>
                <div 
                  className="urgency-badge"
                  style={{ backgroundColor: getUrgencyColor(req.urgency) }}
                >
                  <FaExclamationTriangle className="icon" />
                  <span>{req.urgency}</span>
                </div>
              </div>

              <div className="card-body">
                <div className="detail-row">
                  <FaTint className="icon" />
                  <div>
                    <span className="detail-label">Blood Group:</span>
                    <span className="detail-value">{req.bloodGroup}</span>
                  </div>
                </div>

                <div className="detail-row">
                  <FaHospital className="icon" />
                  <div>
                    <span className="detail-label">Hospital:</span>
                    <span className="detail-value">{req.hospital}</span>
                  </div>
                </div>

                {req.hospitalAddress && (
                  <div className="detail-row">
                    <FaMapMarkerAlt className="icon" />
                    <div>
                      <span className="detail-label">Address:</span>
                      <span className="detail-value">{req.hospitalAddress}</span>
                    </div>
                  </div>
                )}

                <div className="detail-row">
                  <FaPhone className="icon" />
                  <div>
                    <span className="detail-label">Contact:</span>
                    <a href={`tel:${req.contact}`} className="detail-value">{req.contact}</a>
                  </div>
                </div>

                {req.unitsRequired && (
                  <div className="detail-row">
                    <FaClipboardList className="icon" />
                    <div>
                      <span className="detail-label">Units Needed:</span>
                      <span className="detail-value">{req.unitsRequired}</span>
                    </div>
                  </div>
                )}

                <div className="detail-row">
                  <FaClock className="icon" />
                  <div>
                    <span className="detail-label">Requested:</span>
                    <span className="detail-value">{formatDate(req.timestamp)}</span>
                  </div>
                </div>
              </div>

              <div className="card-footer">
                <button className="respond-btn">
                  <FaPhone /> Respond to Request
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentRequests;