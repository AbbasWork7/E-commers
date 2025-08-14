import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Navbar as BootstrapNavbar, Nav, Container, Button, Dropdown, NavDropdown, Badge } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ theme, onThemeChange, cartCount = 0 }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navbarStyle = {
    backgroundColor: theme === 'dark' ? '#1a1a1a' : '#90caf9',
    borderBottom: `1px solid ${theme === 'dark' ? '#333' : '#64b5f6'}`,
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  };

  const linkStyle = {
    color: theme === 'dark' ? '#fff' : '#2c3e50',
    textDecoration: 'none',
    padding: '0.5rem 1rem',
    display: 'block',
    fontWeight: '500',
  };

  const brandStyle = {
    ...linkStyle,
    fontSize: '24px',
    fontWeight: 'bold',
  };

  return (
    <BootstrapNavbar
      expand="lg"
      style={navbarStyle}
      className={`${theme === 'dark' ? 'navbar-dark' : 'navbar-light'}`}
      sticky="top"
    >
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/" style={brandStyle}>
          MyShop
        </BootstrapNavbar.Brand>

        <BootstrapNavbar.Toggle
          aria-controls="basic-navbar-nav"
          style={{
            borderColor: theme === 'dark' ? '#555' : '#64b5f6',
          }}
        />

        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" style={linkStyle} active={location.pathname === '/'}>Home</Nav.Link>
            <Nav.Link as={Link} to="/products" style={linkStyle} active={location.pathname === '/products'}>Products</Nav.Link>

            {/* Categories Dropdown */}
            <NavDropdown
              title="Categories"
              id="basic-nav-dropdown"
              className={theme === 'dark' ? 'dropdown-dark' : ''}
            >
              <NavDropdown.Item as={Link} to="/category/fashion">
                <i className="bi bi-bag me-2"></i> Fashion
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/category/electronics">
                <i className="bi bi-laptop me-2"></i> Electronics
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/category/shoes">
                <i className="bi bi-bag-heart me-2"></i> Shoes
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/category/watches">
                <i className="bi bi-watch me-2"></i> Watches
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/category/furniture">
                <i className="bi bi-house-door me-2"></i> Furniture
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/category/beauty">
                <i className="bi bi-brush me-2"></i> Beauty & Personal Care
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/category/books">
                <i className="bi bi-book me-2"></i> Books & Stationery
              </NavDropdown.Item>
            </NavDropdown>


            {/* {isAuthenticated && (
  <Nav.Link as={Link} to="/chat" style={linkStyle} active={location.pathname === '/chat'}>Chat</Nav.Link>
)} */}

          </Nav>

          <Nav className="d-flex align-items-center gap-3">
            {/* Wishlist Icon */}
            <Nav.Link
              as={Link}
              to="/wishlist"
              className="position-relative me-3"
              style={linkStyle}
              active={location.pathname === '/wishlist'}
            >
              <i className="bi bi-heart fs-5"></i>
            </Nav.Link>

            {/* Cart Icon */}
            <Nav.Link
              as={Link}
              to="/cart"
              className="position-relative me-3"
              style={linkStyle}
              active={location.pathname === '/cart'}
            >
              <i className="bi bi-cart fs-5"></i>
              {cartCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {cartCount}
                </span>
              )}
            </Nav.Link>

            {/* Theme Toggle */}
            <Button
              variant="link"
              className={`p-0 border-0 ${theme === 'dark' ? 'text-light' : 'text-dark'} me-3`}
              onClick={() => onThemeChange(theme === 'dark' ? 'light' : 'dark')}
            >
              <i className={`bi ${theme === 'dark' ? 'bi-sun' : 'bi-moon'} fs-5`}></i>
            </Button>

            {/* User Profile Dropdown */}
            <Dropdown align="end" className={theme === 'dark' ? 'dropdown-dark' : ''}>
              <Dropdown.Toggle
                variant="link"
                className="p-0 border-0"
                id="user-dropdown"
                style={{ backgroundColor: 'transparent' }}
              >
                <img
                  src={user?.profileImage || 'https://th.bing.com/th/id/OIP.l9ZSLXztloCwOLd5vLIrLwHaHa?w=187&h=187&c=7&r=0&o=5&dpr=1.3&pid=1.7'}
                  alt="Profile"
                  className="rounded-circle"
                  width="32"
                  height="32"
                  style={{ objectFit: 'cover' }}
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/32'; }}
                />
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item as={Link} to="/profile">
                  <i className="bi bi-person me-2"></i> Profile
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/edit-profile">
                  <i className="bi bi-pencil me-2"></i> Edit Profile
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/wishlist">
                  <i className="bi bi-heart me-2"></i> Wishlist
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/orders">
                  <i className="bi bi-box me-2"></i> Orders
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right me-2"></i> Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            {/* Login/Sign Up Buttons */}
            {!isAuthenticated && (
              <div className="d-flex gap-2">
                <Button
                  variant={theme === 'dark' ? 'outline-light' : 'outline-primary'}
                  size="sm"
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/signup')}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
