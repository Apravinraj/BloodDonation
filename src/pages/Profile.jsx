import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Card, Alert, Container } from 'react-bootstrap';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaTint, FaEdit, FaSave } from 'react-icons/fa';
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const Profile = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    bloodGroup: '',
    lastDonation: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          navigate('/login');
          return;
        }

        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          setError("No user data found");
        }
      } catch (err) {
        setError("Failed to fetch user data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) {
        navigate('/login');
        return;
      }

      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, userData);
      setSuccess('Profile updated successfully!');
      setEditMode(false);
    } catch (err) {
      setError('Failed to update profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <p>Loading profile...</p>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <div className="text-center mb-4">
        <h2>My Profile</h2>
        <p className="text-muted">Manage your personal information</p>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Card className="shadow-sm">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            {/* Personal Information Section */}
            <div className="mb-4">
              <h5 className="d-flex align-items-center">
                <FaUser className="me-2 text-danger" />
                Personal Information
              </h5>
              <hr className="mt-1" />

              <Form.Group className="mb-3">
                <Form.Label>Full Name</Form.Label>
                {editMode ? (
                  <Form.Control
                    type="text"
                    name="name"
                    value={userData.name}
                    onChange={handleInputChange}
                    required
                  />
                ) : (
                  <p className="form-control-plaintext">{userData.name}</p>
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <p className="form-control-plaintext">
                  <FaEnvelope className="me-2 text-muted" />
                  {userData.email}
                </p>
              </Form.Group>
            </div>

            {/* Contact Information Section */}
            <div className="mb-4">
              <h5 className="d-flex align-items-center">
                <FaPhone className="me-2 text-danger" />
                Contact Information
              </h5>
              <hr className="mt-1" />

              <Form.Group className="mb-3">
                <Form.Label>Phone Number</Form.Label>
                {editMode ? (
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={userData.phone}
                    onChange={handleInputChange}
                    required
                  />
                ) : (
                  <p className="form-control-plaintext">
                    <FaPhone className="me-2 text-muted" />
                    {userData.phone}
                  </p>
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Address</Form.Label>
                {editMode ? (
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="address"
                    value={userData.address}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p className="form-control-plaintext">
                    <FaMapMarkerAlt className="me-2 text-muted" />
                    {userData.address || 'Not specified'}
                  </p>
                )}
              </Form.Group>
            </div>

            {/* Blood Donation Information */}
            <div className="mb-4">
              <h5 className="d-flex align-items-center">
                <FaTint className="me-2 text-danger" />
                Blood Donation Information
              </h5>
              <hr className="mt-1" />

              <Form.Group className="mb-3">
                <Form.Label>Blood Group</Form.Label>
                {editMode ? (
                  <Form.Select
                    name="bloodGroup"
                    value={userData.bloodGroup}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </Form.Select>
                ) : (
                  <p className="form-control-plaintext">
                    <FaTint className="me-2 text-muted" />
                    {userData.bloodGroup || 'Not specified'}
                  </p>
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Last Donation Date</Form.Label>
                {editMode ? (
                  <Form.Control
                    type="date"
                    name="lastDonation"
                    value={userData.lastDonation}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p className="form-control-plaintext">
                    {userData.lastDonation || 'Never donated'}
                  </p>
                )}
              </Form.Group>
            </div>

            {/* Action Buttons */}
            <div className="d-flex justify-content-end gap-2">
              {editMode ? (
                <>
                  <Button
                    variant="outline-secondary"
                    onClick={() => setEditMode(false)}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="danger"
                    type="submit"
                    disabled={loading}
                  >
                    <FaSave className="me-1" />
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </>
              ) : (
                <Button
                  variant="danger"
                  onClick={() => setEditMode(true)}
                >
                  <FaEdit className="me-1" />
                  Edit Profile
                </Button>
              )}
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Profile;