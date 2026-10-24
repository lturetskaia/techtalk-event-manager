import { Outlet, useNavigate, NavLink } from 'react-router';
import { Nav, Navbar, Alert, Container } from 'react-bootstrap';
import { useAuth } from '~/utils/AuthContext';
import { useState } from 'react';

export default function OrganiserMenu() {
  const { logout } = useAuth();
  const [logoutAlert, setLogoutAlert] = useState('');
  const navigate = useNavigate();

  async function handleLogout(event: React.MouseEvent) {
    event.preventDefault();

    try {
      const result = await logout();
      navigate('/');
    } catch (err) {
      setLogoutAlert('Failed to log out.');
      setTimeout(() => setLogoutAlert(''), 5000);
    }
  }

  return (
    <>
      <Navbar variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="/event-manager">
            <img
              src="/api/logo.svg"
              alt=""
              width="30"
              height="24"
              className="d-inline-block align-text-top"
            />
            TechTalk
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="navbarNavAltMarkup">
            <Nav variant="underline">
              <Nav.Link as={NavLink} to="/organiser/dashboard">
                Dashboard
              </Nav.Link>
              <Nav.Link as={NavLink} to="/organiser/events/new-event">
                New Event
              </Nav.Link>
              <Nav.Link as={NavLink} to="/" onClick={handleLogout}>
                Log Out
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Outlet />
      <Alert
        show={logoutAlert !== ''}
        className="pop-up-alert"
        variant="danger"
      >
        {logoutAlert}
      </Alert>
    </>
  );
}
