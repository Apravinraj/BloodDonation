import React, { useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const FindDonors = () => {
  const [bloodGroup, setBloodGroup] = useState('');
  const [location, setLocation] = useState('');
  const [donors, setDonors] = useState([]);

  const handleSearch = async () => {
    const donorsRef = collection(db, "donors");
    const q = query(
      donorsRef,
      where("bloodGroup", "==", bloodGroup),
      where("location", "==", location),
      where("availability", "==", "Yes")
    );
    const querySnapshot = await getDocs(q);
    const results = querySnapshot.docs.map(doc => doc.data());
    setDonors(results);
  };

  return (
    <div className="container mt-4">
      <h2 className="text-danger">Find Donors</h2>
      <div className="d-flex gap-3 mb-4">
        <select className="form-select w-25" value={bloodGroup} onChange={e => setBloodGroup(e.target.value)}>
          <option value="">Select Blood Group</option>
          <option value="A+">A+</option><option value="A−">A−</option>
          <option value="B+">B+</option><option value="B−">B−</option>
          <option value="AB+">AB+</option><option value="AB−">AB−</option>
          <option value="O+">O+</option><option value="O−">O−</option>
        </select>
        <input
          type="text"
          className="form-control w-25"
          placeholder="Enter Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <button className="btn btn-danger" onClick={handleSearch}>Search</button>
      </div>

      <div className="row">
        {donors.map((donor, index) => (
          <div className="col-md-4 mb-3" key={index}>
            <div className="card shadow-sm">
              <div className="card-body">
                <h5>{donor.name}</h5>
                <p><strong>Blood Group:</strong> {donor.bloodGroup}</p>
                <p><strong>Location:</strong> {donor.location}</p>
                <p><strong>Contact:</strong> {donor.contact}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FindDonors;
