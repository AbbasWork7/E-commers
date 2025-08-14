import React, { useState } from 'react';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Login = ({ theme = 'light' }) => {
  const navigate = useNavigate();
  const { loginWithBackendUser } = useAuth();
  const [userInput, setUserInput] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError('');
    setLoading(true);

    try {
      const usernameOrEmail = String(userInput).trim();
      const passwordValue = String(password).trim();

      const response = await axios.post('http://localhost:5004/api/log', {
        username: usernameOrEmail,
        password: passwordValue,
      });

      console.log(response.data); // Log the response data to check the structure

      if (response.data.success) {
        loginWithBackendUser(response.data.user);
        alert(`Login successful! Your user ID is: ${response.data.user.user_id || 'N/A'}`);
        localStorage.setItem('user_id', response.data.user.user_id);
        navigate('/');
      } else {
        setError(response.data.message || 'Login failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
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
              <h2 className="mb-0">Login</h2>
              <p className={`mt-2 ${theme === 'dark' ? 'text-light' : 'text-muted'}`}>Welcome back! Please login to your account.</p>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Username or Email</Form.Label>
                <Form.Control
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Enter username or email"
                  required
                  disabled={loading}
                  className={theme === 'dark' ? 'bg-dark text-light border-secondary' : ''}
                  autoComplete="username"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  disabled={loading}
                  className={theme === 'dark' ? 'bg-dark text-light border-secondary' : ''}
                  autoComplete="current-password"
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100 mb-3" size="lg" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </Button>

              <div className="text-center">
                <span className={theme === 'dark' ? 'text-light' : 'text-muted'}>Don't have an account? </span>
                <Link to="/signup" className={theme === 'dark' ? 'text-info' : 'text-primary'}>
                  Sign Up
                </Link>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default Login;
