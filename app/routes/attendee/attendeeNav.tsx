import { Outlet } from 'react-router';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router';

export default function AttendeeMenu() {
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
              <Nav.Link as={Link} to="/attendee/events" eventKey="events">
                Events
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/attendee/my-bookings"
                eventKey="bookings"
              >
                My Bookings
              </Nav.Link>
              <Nav.Link as={Link} to="/attendee/profile" eventKey="profile">
                Profile
              </Nav.Link>
              <Nav.Link as={Link} to="/logout" eventKey="logout">
                Log Out
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Outlet />
    </>
  );
}
