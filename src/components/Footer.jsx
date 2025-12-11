import React from 'react';
import { FaTiktok } from "react-icons/fa";
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
          <p className="footer-meta">Version 1.0</p>
          <p className="footer-support">Support is handled by parent company <a className="footer-support-link" href="mailto:innoxation.tech@gmail.com">Innoxation</a></p>
        </div>

        <div className="footer-section footer-links">
          <a href="https://tiktok.com/@auri_plat_form" target="_blank" rel="noopener noreferrer" className="social-link">
            <FaTiktok size={24} />
            <span>TikTok</span>
          </a>
        </div>
      </div>
    </footer>
  );
};
