import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Footer = () => {
  const { isAuthenticated } = useAuth();
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="text-white mt-auto pt-5 pb-4"
      style={{
        backgroundColor: '#0f172a',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)'
      }}
    >
      <div className="container">
        {/* Main Footer Content */}
        <div className="row gy-4 gx-lg-5 justify-content-between pb-4 border-bottom border-secondary border-opacity-25">
          {/* Brand & Mission */}
          <div className="col-12 col-md-6 col-lg-4">
            <Link to="/" className="d-flex align-items-center text-decoration-none mb-3">
              <div className="navbar-brand-icon me-2">
                <i className="fas fa-briefcase"></i>
              </div>
              <span className="fw-bold fs-5 text-white tracking-tight">JobPortal</span>
            </Link>

            <p className="text-secondary small mb-3" style={{ lineHeight: '1.7' }}>
              The modern engineering job portal connecting talented software developers with high-growth tech companies worldwide. Fast, transparent, and direct application workflow.
            </p>

            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-white bg-opacity-10 text-light border border-white border-opacity-15 small py-1 px-2">
                <i className="fas fa-shield-alt text-success me-1"></i> JWT Secured
              </span>
              <span className="badge bg-white bg-opacity-10 text-light border border-white border-opacity-15 small py-1 px-2">
                <i className="fas fa-bolt text-warning me-1"></i> 1-Click Apply
              </span>
            </div>
          </div>

          {/* Quick Navigation for Candidates */}
          <div className="col-6 col-md-3 col-lg-2">
            <h6 className="fw-bold text-white text-uppercase small mb-3" style={{ letterSpacing: '0.05em' }}>
              For Candidates
            </h6>
            <ul className="list-unstyled small mb-0 d-flex flex-column gap-2">
              <li>
                <Link to="/jobs" className="text-secondary text-decoration-none hover-white transition-all">
                  <i className="fas fa-chevron-right me-1 small opacity-50"></i> Browse Jobs
                </Link>
              </li>
              {isAuthenticated ? (
                <>
                  <li>
                    <Link to="/applications" className="text-secondary text-decoration-none hover-white transition-all">
                      <i className="fas fa-chevron-right me-1 small opacity-50"></i> My Applications
                    </Link>
                  </li>
                  <li>
                    <Link to="/profile" className="text-secondary text-decoration-none hover-white transition-all">
                      <i className="fas fa-chevron-right me-1 small opacity-50"></i> Candidate Profile
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/login" className="text-secondary text-decoration-none hover-white transition-all">
                      <i className="fas fa-chevron-right me-1 small opacity-50"></i> Candidate Sign In
                    </Link>
                  </li>
                  <li>
                    <Link to="/register" className="text-secondary text-decoration-none hover-white transition-all">
                      <i className="fas fa-chevron-right me-1 small opacity-50"></i> Register Account
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Popular Categories */}
          <div className="col-6 col-md-3 col-lg-3">
            <h6 className="fw-bold text-white text-uppercase small mb-3" style={{ letterSpacing: '0.05em' }}>
              Top Domains
            </h6>
            <ul className="list-unstyled small mb-0 d-flex flex-column gap-2">
              <li>
                <Link to="/jobs" className="text-secondary text-decoration-none hover-white transition-all">
                  <i className="fas fa-code me-1 text-primary small"></i> Full Stack Development
                </Link>
              </li>
              <li>
                <Link to="/jobs" className="text-secondary text-decoration-none hover-white transition-all">
                  <i className="fab fa-react me-1 text-info small"></i> React.js Engineering
                </Link>
              </li>
              <li>
                <Link to="/jobs" className="text-secondary text-decoration-none hover-white transition-all">
                  <i className="fab fa-node me-1 text-success small"></i> Node.js & Backend
                </Link>
              </li>
              <li>
                <Link to="/jobs" className="text-secondary text-decoration-none hover-white transition-all">
                  <i className="fas fa-globe me-1 text-warning small"></i> Remote Positions
                </Link>
              </li>
            </ul>
          </div>

          {/* System & Support Info */}
          <div className="col-12 col-md-12 col-lg-3">
            <h6 className="fw-bold text-white text-uppercase small mb-3" style={{ letterSpacing: '0.05em' }}>
              Portal Reliability
            </h6>
            <div className="bg-opacity-5 p-3 rounded-3 border border-white border-opacity-10 mb-3">
              <div className="d-flex align-items-center mb-1">
                {/* <span className="me-2 bg-success"></span> */}
                <span className="small text-white fw-semibold">All Systems Operational</span>
              </div>
              <p className="text-secondary mb-0" style={{ fontSize: '0.8rem' }}>
                Instant resume upload verification and real-time status tracking.
              </p>
            </div>

            <div className="d-flex gap-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-secondary btn-sm rounded-circle d-flex align-items-center justify-content-center text-light"
                style={{ width: '36px', height: '36px', borderColor: 'rgba(255,255,255,0.15)' }}
                aria-label="GitHub"
              >
                <i className="fab fa-github"></i>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-secondary btn-sm rounded-circle d-flex align-items-center justify-content-center text-light"
                style={{ width: '36px', height: '36px', borderColor: 'rgba(255,255,255,0.15)' }}
                aria-label="LinkedIn"
              >
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-secondary btn-sm rounded-circle d-flex align-items-center justify-content-center text-light"
                style={{ width: '36px', height: '36px', borderColor: 'rgba(255,255,255,0.15)' }}
                aria-label="Twitter"
              >
                <i className="fab fa-x-twitter"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center pt-3 gap-2 small text-secondary">
          <div>
            <span>© {currentYear} JobPortal. All rights reserved.</span>
          </div>

          <div className="d-flex align-items-center gap-3">
            <span>Built with MERN Stack</span>
            <span>•</span>
            <span className="text-light">
              <i className="fas fa-lock text-success me-1"></i> Privacy Protected
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
