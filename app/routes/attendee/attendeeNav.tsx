import { Outlet } from 'react-router';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link, useNavigate, NavLink } from 'react-router';
import { useAuth } from '~/utils/AuthContext';

export default function AttendeeMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout(event: React.MouseEvent) {
    event.preventDefault();
    console.log('Logout clicked');

    try {
      const result = await logout();
      console.log(result);
      navigate('/attendee/events');
    } catch (err) {
      console.log(err);
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
            <Nav variant="underline" defaultActiveKey="events">
              <Nav.Link as={NavLink} to="/attendee/events" eventKey="events">
                Events
              </Nav.Link>
              {user && user.role === 'ATTENDEE' ? (
                <>
                  <Nav.Link
                    as={NavLink}
                    to="/attendee/my-bookings"
                    eventKey="bookings"
                  >
                    My Bookings
                  </Nav.Link>
                  <Nav.Link
                    as={NavLink}
                    to="/attendee/profile"
                    eventKey="profile"
                  >
                    Profile
                  </Nav.Link>
                  <Nav.Link
                    as={NavLink}
                    to="/"
                    onClick={handleLogout}
                    eventKey="logout"
                  >
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
    </>
  );
}
