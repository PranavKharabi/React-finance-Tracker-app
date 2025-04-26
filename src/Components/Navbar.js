import React from 'react';
import { Link, useLocation } from 'react-router-dom'; 
import { Navbar as BSNavbar, Nav, Container } from 'react-bootstrap'; 

function Navbar() {
  const location = useLocation(); // Hook to access the current route path
  const userName = localStorage.getItem('name') || 'User'; // Get user's name from localStorage, fallback to 'User'

  const getNavLinkClass = (path) => {
    return location.pathname === path ? 'nav-link active' : 'nav-link';
  };

  return (
    // Bootstrap dark-themed responsive Navbar
    <BSNavbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
      <Container>
        {/* Brand/logo text linked to the homepage */}
        <BSNavbar.Brand as={Link} to="/">Finance Tracker</BSNavbar.Brand>

        {/* Toggle button for smaller screens */}
        <BSNavbar.Toggle aria-controls="responsive-navbar-nav" />

        {/* Collapsible navigation links */}
        <BSNavbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            {/* Navigation links with conditional active class based on current path */}
            <Nav.Link as={Link} to="/" className={getNavLinkClass('/')}>Dashboard</Nav.Link>
            <Nav.Link as={Link} to="/add" className={getNavLinkClass('/add')}>Add Transaction</Nav.Link>
            <Nav.Link as={Link} to="/history" className={getNavLinkClass('/history')}>History</Nav.Link>
            <Nav.Link as={Link} to="/budgets" className={getNavLinkClass('/budgets')}>Budgets</Nav.Link>
            <Nav.Link as={Link} to="/reports" className={getNavLinkClass('/reports')}>Reports</Nav.Link>
            <Nav.Link as={Link} to="/settings" className={getNavLinkClass('/settings')}>Settings</Nav.Link>
          </Nav>

          {/* Display user name on the right */}
          <Nav>
            <Nav.Link disabled className="text-light">
              Hello, {userName}
            </Nav.Link>
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
}

export default Navbar; 
