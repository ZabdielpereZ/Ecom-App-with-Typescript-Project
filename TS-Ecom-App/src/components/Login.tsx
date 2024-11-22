import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Button, Container } from 'react-bootstrap';

const Login: React.FC = () => {
  const { loginWithRedirect, isAuthenticated, logout } = useAuth0();

  return (
    <Container>
      {!isAuthenticated ? (
        <Button onClick={() => loginWithRedirect()}>Login</Button>
      ) : (
        <Button onClick={() => logout({ returnTo: window.location.origin })}>Logout</Button>
      )}
    </Container>
  );
};

export default Login;
