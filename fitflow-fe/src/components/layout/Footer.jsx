import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer-custom py-5 mt-4">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-6 text-center mb-3 mb-md-0">
            <p className="footer-text">
              &copy; 2026 FitFlow. Tutti i diritti riservati.
            </p>
          </div>
          <div className="col-12 col-md-6 text-center">
            <div className="footer-icons">
              <a
                href="https://facebook.com"
                className="footer-icon"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://twitter.com"
                className="footer-icon"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTwitter />
              </a>
              <a
                href="https://instagram.com"
                className="footer-icon"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col text-center">
            <a href="/privacy" className="footer-link">
              Privacy
            </a>{" "}
            |
            <a href="/terms" className="footer-link">
              Termini
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
