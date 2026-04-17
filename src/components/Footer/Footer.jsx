import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import {
  FiMapPin,
  FiPhone,
  FiMail,
  FiFacebook,
  FiTwitter,
  FiInstagram,
  FiLinkedin,
} from "react-icons/fi";
import "./footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Events", href: "/events" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const companyLinks = [
    { name: "Terms & Conditions", href: "#" },
    { name: "Privacy Policy", href: "#" },
    { name: "Refund Policy", href: "#" },
    { name: "FAQ", href: "#" },
  ];

  const eventCategories = [
    { name: "Music Concerts", href: "#" },
    { name: "Sports Events", href: "#" },
    { name: "Tech Conferences", href: "#" },
    { name: "Festivals", href: "#" },
    { name: "Workshops", href: "#" },
    { name: "Networking", href: "#" },
  ];

  return (
    <footer className="footer-modern">
      {/* Main Footer Content */}
      <section className="footer-content">
        <Container>
          <Row className="footer-columns">
            {/* Brand Column */}
            <Col lg={3} md={6} sm={12} className="footer-col">
              <div className="footer-brand">
                <h5 className="footer-title">
                  <span className="brand-emoji">🎪</span> Eventra
                </h5>
                <p className="footer-description">
                  Discover amazing events with Eventra. We help you find and book the perfect events with exclusive deals and experiences.
                </p>

                {/* Social Icons */}
                <div className="social-icons">
                  <a href="#facebook" className="social-icon" title="Facebook">
                    <FiFacebook />
                  </a>

                  <a href="#twitter" className="social-icon" title="Twitter">
                    <FiTwitter />
                  </a>

                  <a
                    href="https://www.instagram.com/_harshil_1290/"
                    className="social-icon"
                    title="Instagram"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FiInstagram />
                  </a>

                  {/* ✅ FIXED LINKEDIN */}
                  <a
                    href="https://www.linkedin.com/in/harshil121"
                    className="social-icon"
                    title="LinkedIn"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FiLinkedin />
                  </a>
                </div>
              </div>
            </Col>

            {/* Quick Links */}
            <Col lg={2} md={6} sm={12} className="footer-col">
              <h6 className="footer-heading">Quick Links</h6>
              <ul className="footer-links">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <a href={link.href}>{link.name}</a>
                  </li>
                ))}
              </ul>
            </Col>

            {/* Event Categories */}
            <Col lg={2} md={6} sm={12} className="footer-col">
              <h6 className="footer-heading">Event Categories</h6>
              <ul className="footer-links">
                {eventCategories.map((category, index) => (
                  <li key={index}>
                    <a href={category.href}>{category.name}</a>
                  </li>
                ))}
              </ul>
            </Col>

            {/* Company */}
            <Col lg={2} md={6} sm={12} className="footer-col">
              <h6 className="footer-heading">Company</h6>
              <ul className="footer-links">
                {companyLinks.map((link, index) => (
                  <li key={index}>
                    <a href={link.href}>{link.name}</a>
                  </li>
                ))}
              </ul>
            </Col>

            {/* Contact Info */}
            <Col lg={3} md={12} sm={12} className="footer-col">
              <h6 className="footer-heading">Contact Us</h6>

              <div className="contact-info">
                <a href="tel:+919427819675" className="contact-item">
                  <FiPhone className="contact-icon" />
                  <span>+91 9427819675</span>
                </a>

                <a
                  href="mailto:harshilparmar2515@gmail.com"
                  className="contact-item"
                >
                  <FiMail className="contact-icon" />
                  <span>harshilparmar2515@gmail.com</span>
                </a>

                <div className="contact-item">
                  <FiMapPin className="contact-icon" />
                  <span>Bhavnagar, Gujarat</span>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <Container>
          <Row className="align-items-center">
            <Col md={6} className="text-center text-md-start">
              <p className="footer-copyright">
                &copy; {currentYear} Eventra. All rights reserved.
              </p>
            </Col>
            <Col md={6} className="text-center text-md-end">
              <p className="footer-credit">
                Made with <span className="heart">❤️</span> for event enthusiasts
              </p>
            </Col>
          </Row>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;