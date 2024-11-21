import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { Container, Navbar, Nav, Badge } from "react-bootstrap";
import LoginButton from "./LoginButton";
import LogoutButton from "./Logout";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";

const NavBar: React.FC = () => {
  const { user, isAuthenticated } = useAuth0();
  const totalItems = useSelector((state: RootState) => state.cart.totalItems);

  return (
    <Navbar className="bg-body-tertiary" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          E-Commerce App
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav className="ml-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/cart">
              Cart <Badge pill bg="primary">{totalItems}</Badge>
            </Nav.Link>
            {isAuthenticated ? (
              <>
                <Navbar.Text className='mx-4'>
                  Signed in as: <a href="/profile">{user?.name}</a>
                </Navbar.Text>
                <LogoutButton />
              </>
            ) : (
              <LoginButton />
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
