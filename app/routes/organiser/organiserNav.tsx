import { Outlet } from 'react-router';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useNavigate, NavLink } from 'react-router';
import { useAuth } from '~/utils/AuthContext';

export default function OrganiserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout(event: React.MouseEvent) {
    event.preventDefault();

    try {
      const result = await logout();
      navigate('/');
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
            <Nav variant="underline">
              <Nav.Link as={NavLink} to="/organiser/dashboard">
                Dashboard
              </Nav.Link>
              <Nav.Link as={NavLink} to="/organiser/site-settings">
                Site Settings
              </Nav.Link>
              <Nav.Link as={NavLink} to="/" onClick={handleLogout}>
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
