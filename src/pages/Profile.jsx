import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ResumeUpload from '../components/ResumeUpload';

const Profile = () => {
  const { user, updateUser, refreshProfile } = useAuth();

  const handleResumeSuccess = (updatedUser) => {
    if (updatedUser) {
      updateUser(updatedUser);
    } else {
      refreshProfile();
    }
  };

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    : '';

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container">
        {/* Page Title */}
        <div className="mb-4">
          <h2 className="fw-bolder text-dark mb-1 d-flex align-items-center">
            <i className="fas fa-id-badge text-primary me-2"></i>
            Candidate Dashboard
          </h2>
          <p className="text-muted small mb-0">
            Manage your account credentials and uploaded resume for instant applications
          </p>
        </div>

        <div className="row g-4">
          {/* User Profile Card */}
          <div className="col-12 col-lg-4">
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-body p-4 text-center">
                <div
                  className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3 text-white fw-bold shadow"
                  style={{
                    width: '84px',
                    height: '84px',
                    fontSize: '2.2rem',
                    background: 'linear-gradient(135deg, #2563eb 0%, #6366f1 100%)'
                  }}
                >
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <h4 className="fw-bold text-dark mb-1">{user?.name}</h4>
                <p className="text-muted small mb-3">{user?.email}</p>

                <div className="border-top pt-3 text-start small">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Account Status:</span>
                    <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1">
                      Active Candidate
                    </span>
                  </div>
                  {memberSince && (
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">Member Since:</span>
                      <span className="text-dark fw-medium">{memberSince}</span>
                    </div>
                  )}
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Resume Document:</span>
                    {user?.resume ? (
                      <span className="badge-applied">
                        <i className="fas fa-check-circle me-1"></i> Uploaded
                      </span>
                    ) : (
                      <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle px-2 py-1">
                        <i className="fas fa-exclamation-triangle me-1"></i> Missing
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Navigation */}
            <div className="card shadow-sm border-0">
              <div className="card-header bg-white py-3 border-bottom">
                <h6 className="card-title mb-0 fw-bold text-dark">
                  <i className="fas fa-compass text-primary me-2"></i>
                  Quick Actions
                </h6>
              </div>
              <div className="list-group list-group-flush small">
                <Link
                  to="/jobs"
                  className="list-group-item list-group-item-action d-flex justify-content-between align-items-center py-3"
                >
                  <div>
                    <i className="fas fa-search text-primary me-2"></i>
                    <span className="fw-medium">Explore Open Jobs</span>
                  </div>
                  <i className="fas fa-chevron-right text-muted small"></i>
                </Link>
                <Link
                  to="/applications"
                  className="list-group-item list-group-item-action d-flex justify-content-between align-items-center py-3"
                >
                  <div>
                    <i className="fas fa-file-contract text-primary me-2"></i>
                    <span className="fw-medium">Track Submitted Applications</span>
                  </div>
                  <i className="fas fa-chevron-right text-muted small"></i>
                </Link>
              </div>
            </div>
          </div>

          {/* Resume Upload & Management Section */}
          <div className="col-12 col-lg-8">
            <ResumeUpload
              currentResume={user?.resume}
              onUploadSuccess={handleResumeSuccess}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
