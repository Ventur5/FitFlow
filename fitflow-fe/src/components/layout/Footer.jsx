import { Container, Row, Col } from "react-bootstrap";
import { FaFacebookF, FaXTwitter, FaInstagram } from "react-icons/fa6";
import "./Footer.css";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-custom mt-auto">
      <Container>
        <Row className="align-items-center gy-4">
          <Col xs={12} md={4} className="text-center text-md-start">
            <h5 className="footer-brand">FitFlow</h5>
            <p className="footer-copyright">
              &copy; {currentYear} Tutti i diritti riservati.
            </p>
          </Col>
          <Col xs={12} md={4} className="text-center">
            <div className="footer-icons-wrapper">
              <a
                href="https://facebook.com"
                className="social-icon facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://x.com"
                className="social-icon x-social"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaXTwitter />
              </a>
              <a
                href="https://instagram.com"
                className="social-icon instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram />
              </a>
            </div>
          </Col>

          <Col xs={12} md={4} className="text-center text-md-end">
            <div className="footer-legal-links">
              <a href="/" className="footer-link">
                Privacy Policy
              </a>
              <span className="separator">|</span>
              <a href="/" className="footer-link">
                Termini
              </a>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
