import React from 'react';
import '../styles/Footer.css';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <img src="/auri_logo.png" alt="Auri Logo" className="footer-logo" />
        </div>

        <div className="footer-section">
          <p className="company-name">Innoxation Tech Inc</p>
          <p className="copyright">&copy; {currentYear} All rights reserved.</p>
        </div>

        <div className="footer-section footer-links">
          <a href="#tos" className="footer-link">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};
