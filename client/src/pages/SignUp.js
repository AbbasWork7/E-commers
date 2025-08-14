import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Card, Alert } from 'react-bootstrap';
import axios from 'axios';

function Signup({ theme = 'light' }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    phone_number: '',
    role: 'customer',
    password: '',
    profile_picture:"",
    address: '',  // Add this line
  });

  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profile_picture') {
      setFormData({ ...formData, profile_picture: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setError('');
    setLoading(true);

    const validationErrors = {};

    if (!formData.username || formData.username.length < 3)
      validationErrors.username = 'Username must be at least 3 characters long';
    if (!formData.name) validationErrors.name = 'Full name is required';
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
      validationErrors.email = 'Valid email is required';
    if (!formData.password || formData.password.length < 6)
      validationErrors.password = 'Password must be at least 6 characters';
    if (!formData.phone_number) validationErrors.phone_number = 'Phone number is required';

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        payload.append(key, value);
      });

      const res = await axios.post('http://localhost:5004/api/sig', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        navigate('/');
      } else {
        setError(res.data.error || 'Signup failed');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-vh-100 d-flex align-items-center py-5 ${theme === 'dark' ? 'bg-dark text-light' : 'bg-light'}`}>
      <Container className="py-5">
        <Card className={`mx-auto shadow-lg ${theme === 'dark' ? 'bg-dark text-light border-secondary' : 'bg-white'}`} style={{ maxWidth: '500px' }}>
          <Card.Body className="p-4 p-md-5">
            <div className="text-center mb-4">
              <div className="bg-primary rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                <i className="bi bi-person-fill fs-2 text-white"></i>
              </div>
              <h2 className="mb-0">Create Account</h2>
              <p className={`mt-2 ${theme === 'dark' ? 'text-light' : 'text-muted'}`}>Join us today!</p>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              {['username', 'name', 'email', 'phone_number', 'password'].map((field, idx) => (
                <Form.Group className="mb-3" key={idx}>
                  <Form.Label>{field.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</Form.Label>
                  <Form.Control
                    type={field === 'password' ? 'password' : 'text'}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    isInvalid={!!errors[field]}
                    className={theme === 'dark' ? 'bg-dark text-light border-secondary' : ''}
                    placeholder={`Enter your ${field.replace('_', ' ')}`}
                    disabled={loading}
                  />
                  <Form.Control.Feedback type="invalid">{errors[field]}</Form.Control.Feedback>
                </Form.Group>
              ))}

              <Form.Group className="mb-3">
                <Form.Label>Role</Form.Label>
                <Form.Select name="role" value={formData.role} onChange={handleChange} disabled={loading}>
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                  <option value="subadmin">Subadmin</option>
                  <option value="superadmin">Superadmin</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Profile Picture</Form.Label>
                <Form.Control
                  type="file"
                  name="profile_picture"
                  onChange={handleChange}
                  disabled={loading}
                  accept="image/*"
                />
              </Form.Group>
              <Form.Group className="mb-3">
  <Form.Label>Address</Form.Label>
  <Form.Control
    type="text"
    name="address"
    value={formData.address}
    onChange={handleChange}
    isInvalid={!!errors.address}
    className={theme === 'dark' ? 'bg-dark text-light border-secondary' : ''}
    placeholder="Enter your address"
    disabled={loading}
  />
  <Form.Control.Feedback type="invalid">{errors.address}</Form.Control.Feedback>
</Form.Group>


              <Button variant="primary" type="submit" className="w-100 mb-3" size="lg" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>

              <div className="text-center">
                <span className={theme === 'dark' ? 'text-light' : 'text-muted'}>Already have an account? </span>
                <Link to="/login" className="text-decoration-none">Log in</Link>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default Signup;
