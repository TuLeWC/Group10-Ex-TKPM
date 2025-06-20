import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import {
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaPinterestP,
  FaDribbble
} from 'react-icons/fa';

export const Footer = () => {
  return (
    <footer className="bg-white text-center py-5">
      <Container>
        <h4 className="text-primary fw-bold mb-4">EduHub</h4>

        <div className="d-flex justify-content-center flex-wrap mb-3 gap-3">
          {['About', 'Services', 'Press', 'Careers', 'FAQ', 'Legal', 'Contact'].map((item, idx) => (
            <a key={idx} href="#" className="text-dark text-decoration-none small">
              {item}
            </a>
          ))}
        </div>

        <p className="fw-medium mb-2">Stay in touch</p>

        <div className="d-flex justify-content-center gap-3 mb-3">
          <a href="#" className="text-dark"><FaInstagram /></a>
          <a href="#" className="text-dark"><FaFacebookF /></a>
          <a href="#" className="text-dark"><FaTwitter /></a>
          <a href="#" className="text-dark"><FaPinterestP /></a>
          <a href="#" className="text-dark"><FaDribbble /></a>
        </div>

        <small className="text-muted">&copy; Colorlib. All Rights Reserved.</small>
      </Container>
    </footer>
  );
}