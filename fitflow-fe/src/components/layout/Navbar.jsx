import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-custom shadow-sm">
      <div className="container-fluid">
        <Link
          className="navbar-brand d-flex align-items-center"
          to="/"
          reloadDocument
        >
          <span className="navbar-brand brand-gradient">FitFlow</span>
        </Link>
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarMenu"
          aria-controls="navbarMenu"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon custom-toggler"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarMenu">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
            {user ? (
              <>
                <li className="nav-item me-3">
                  <span className="nav-link welcome-text">
                    Benvenuto, <strong>{user.email}</strong>
                  </span>
                </li>
                <li className="nav-link">
                  <Link to="/profile" className="btn btn-info">
                    Profilo
                  </Link>
                </li>
                <li className="nav-item">
                  <button className="btn btn-logout" onClick={onLogout}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <span className="nav-link text-light">Non sei loggato</span>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
