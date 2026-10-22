import { Alert, Navbar, Container, Nav } from 'react-bootstrap';
import { useNavigate, NavLink } from 'react-router';
import { useAuth } from '~/utils/AuthContext';
import { useState } from 'react';
import { Outlet } from 'react-router';

export default function AttendeeMenu() {
  const { user, logout } = useAuth();
  const [logoutAlert, setLogoutAlert] = useState('');
  const navigate = useNavigate();

  async function handleLogout(event: React.MouseEvent) {
    event.preventDefault();

    try {
      const result = await logout();
      navigate('/attendee/events');
    } catch (err) {
      setLogoutAlert('Failed to log out.');
      setTimeout(() => setLogoutAlert(''), 5000);
    }
  }

  return (
    <>
      <Navbar variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="/">
            <img
              src="/logo.svg"
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
              <Nav.Link as={NavLink} to="/attendee/events">
                Events
              </Nav.Link>
              {user && user.role === 'ATTENDEE' ? (
                <>
                  <Nav.Link as={NavLink} to="/attendee/my-bookings">
                    My Bookings
                  </Nav.Link>
                  <Nav.Link as={NavLink} to="/attendee/profile">
                    Profile
                  </Nav.Link>
                  <Nav.Link as={NavLink} to="/" onClick={handleLogout}>
                    Log Out
                  </Nav.Link>
                </>
              ) : (
                <Nav.Link as={NavLink} to="/attendee/login" eventKey="login">
                  Log In
                </Nav.Link>
              )}
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
