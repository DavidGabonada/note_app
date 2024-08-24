import React, { useState } from 'react';
import { Form, Button, Alert, Card, Container, Row, Col } from 'react-bootstrap';

const Login = ({ onLogin, onSignup }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!username || !password) {
      setError('Username and password are required.');
      return;
    }

    try {
      const response = await fetch('http://localhost/hugot/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();

      if (data.success) {
        onLogin(data.user_id);
        setError('');
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem',
    }}>
      <Container className="d-flex justify-content-center">
        <Row className="align-items-center w-100">
          <Col md={6} className="text-center mb-4 mb-md-0">
            <h1 style={{ fontSize: '3rem', fontWeight: 'bold', color: '#fff' }}>Hugot Realization</h1>
            <p style={{ fontSize: '1.5rem', color: '#f0f0f0', marginTop: '1rem' }}>Where every emotion finds its echo</p>
          </Col>
          <Col md={6}>
            <Card className="shadow-lg p-5" style={{ borderRadius: '15px', maxWidth: '400px', width: '100%' }}>
              <Card.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form>
                  <Form.Group controlId="formUsername" className="mb-4">
                    <Form.Control
                      type="text"
                      placeholder="Email or Phone Number"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="rounded-pill"
                      style={{ padding: '1rem', fontSize: '1rem', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}
                    />
                  </Form.Group>

                  <Form.Group controlId="formPassword" className="mb-4">
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="rounded-pill"
                      style={{ padding: '1rem', fontSize: '1rem', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}
                    />
                  </Form.Group>

                  <Button
                    variant="primary"
                    onClick={handleLogin}
                    className="w-100 mb-3 rounded-pill"
                    style={{
                      padding: '1rem',
                      fontSize: '1.2rem',
                      backgroundColor: '#1877f2',
                      border: 'none',
                      boxShadow: '0 4px 15px rgba(24, 119, 242, 0.6)',
                    }}
                  >
                    Log In
                  </Button>

                  <Button
                    variant="link"
                    onClick={onSignup}
                    className="w-100 text-center"
                    style={{
                      color: '#1877f2',
                      textDecoration: 'none',
                      fontSize: '1.1rem',
                    }}
                  >
                    Sign Up for Hugot Realization
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
