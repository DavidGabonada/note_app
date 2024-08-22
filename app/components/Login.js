  import React, { useState } from 'react';
  import { Form, Button, Alert, Card, Container } from 'react-bootstrap';

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
          onLogin(data.user_id); // Pass user_id to parent component
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
      }}>
        

        <Container>
          <Card className="shadow-lg" style={{ maxWidth: '400px', borderRadius: '15px', overflow: 'hidden' }}>
            <Card.Body>
              <Card.Title className="mb-4 text-center">Login</Card.Title>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form>
                <Form.Group controlId="formUsername" className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="rounded-pill"
                  />
                </Form.Group>

                <Form.Group controlId="formPassword" className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="rounded-pill"
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  onClick={handleLogin}
                  className="w-100 mb-3 rounded-pill"
                  style={{ background: 'linear-gradient(45deg, #007bff, #00c6ff)' }}
                >
                  Login
                </Button>
                <Button
                  variant="secondary"
                  onClick={onSignup}
                  className="w-100 rounded-pill"
                  style={{ background: 'linear-gradient(45deg, #6c757d, #a0a0a0)' }}
                >
                  Sign Up
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Container>
      </div>
    );
  };

  export default Login;
