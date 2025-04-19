import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

const RecentRequests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const q = query(collection(db, "requests"), orderBy("timestamp", "desc"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setRequests(data);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    fetchRequests();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="text-danger mb-4">Recent Blood Requests</h2>
      {requests.length === 0 ? (
        <p>No requests yet.</p>
      ) : (
        <div className="row">
          {requests.map((req) => (
            <div key={req.id} className="col-md-6 mb-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title text-danger">{req.patientName}</h5>
                  <p className="card-text">
                    <strong>Blood Group:</strong> {req.bloodGroup}<br />
                    <strong>Hospital:</strong> {req.hospital}<br />
                    <strong>Urgency:</strong> {req.urgency}<br />
                    <strong>Contact:</strong> {req.contact}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentRequests;
