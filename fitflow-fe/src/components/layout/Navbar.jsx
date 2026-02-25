import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { FaUserCircle, FaSignOutAlt, FaUser, FaBars, FaTimes, FaBolt } from "react-icons/fa";
import "./Navbar.css";

function MyNavbar({ user, onLogout }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Navbar 
      expanded={expanded} 
      onToggle={(expand) => setExpanded(expand)}
      collapseOnSelect 
      expand="lg" 
      variant="dark" 
      className="navbar-custom sticky-top shadow"
    >
      <Container>
        <Navbar.Brand as={Link} to="/" className="brand-container p-0" onClick={() => setExpanded(false)}>
          <div className="logo-wrapper">
            <span className="brand-logo">
              FIT<FaBolt className="logo-icon" /><span className="logo-accent">FLOW</span>
            </span>
          </div>
        </Navbar.Brand>

        <Navbar.Toggle 
          aria-controls="responsive-navbar-nav" 
          className="border-0 shadow-none"
        >
          <div className={`burger-wrapper ${expanded ? "active" : ""}`}>
            {expanded ? <FaTimes /> : <FaBars />}
          </div>
        </Navbar.Toggle>
        
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ms-auto align-items-center py-3 py-lg-0">
            {user ? (
              <>
                <Nav.Item className="me-lg-4 mb-3 mb-lg-0">
                  <span className="welcome-text">
                    <FaUserCircle className="me-2" />
                    Ciao, <strong>{user.email.split('@')[0]}</strong>
                  </span>
                </Nav.Item>
                
                <Nav.Link as={Link} to="/profile" className="me-lg-3 mb-2 mb-lg-0">
                  <span className="custom-nav-link"><FaUser className="me-1" /> Profilo</span>
                </Nav.Link>

                <Nav.Item>
                  <Button className="btn-logout" onClick={() => { onLogout(); setExpanded(false); }}>
                    <FaSignOutAlt className="me-2" /> Logout
                  </Button>
                </Nav.Item>
              </>
            ) : (
              <Nav.Link as={Link} to="/login" className="custom-nav-link">Accedi</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MyNavbar;