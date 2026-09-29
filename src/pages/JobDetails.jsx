import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ApplicationForm from '../components/ApplicationForm';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const JobDetails = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [userApplication, setUserApplication] = useState(null);

  const fetchJobDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/jobs/${id}`);
      setJob(res.data?.data?.job || null);

      // Check if user is authenticated and has applied for this job
      if (isAuthenticated) {
        try {
          const appRes = await api.get('/applications');
          const userApps = appRes.data?.data?.applications || [];
          const matchedApp = userApps.find(
            (app) => (app.job?._id || app.job).toString() === id.toString()
          );
          setAlreadyApplied(Boolean(matchedApp));
          setUserApplication(matchedApp || null);
        } catch (appErr) {
          console.error('Error fetching applications for check:', appErr);
        }
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Job not found.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobDetails();
  }, [id, isAuthenticated]);

  const handleApplicationSuccess = (newApp) => {
    setAlreadyApplied(true);
    setUserApplication(newApp);
  };

  if (loading) {
    return (
      <div className="container py-5">
        <LoadingSpinner message="Loading job details..." />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="container py-5">
        <ErrorMessage message={error || 'Job details could not be found.'} onRetry={fetchJobDetails} />
        <div className="mt-3">
          <Link to="/jobs" className="btn btn-outline-primary rounded-pill">
            <i className="fas fa-arrow-left me-1"></i> Back to All Jobs
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = job.createdAt
    ? new Date(job.createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : '';

  const companyInitial = job.company ? job.company.charAt(0).toUpperCase() : 'J';

  return (
    <div className="bg-light min-vh-100 py-4">
      <div className="container">
        {/* Navigation Breadcrumb */}
        <div className="d-flex align-items-center justify-content-between mb-4">
          <Link to="/jobs" className="btn btn-outline-secondary btn-sm rounded-pill px-3 shadow-sm bg-white">
            <i className="fas fa-arrow-left me-2"></i> All Open Jobs
          </Link>
          <span className="text-muted small">Job Reference ID: {job._id.substring(job._id.length - 8)}</span>
        </div>

        <div className="row g-4">
          {/* Main Job Information */}
          <div className="col-12 col-lg-8">
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-body p-4 p-md-5">
                {/* Header Profile */}
                <div className="d-flex flex-column flex-sm-row align-items-start gap-3 border-bottom pb-4 mb-4">
                  <div className="company-avatar-box fs-3" style={{ width: '64px', height: '64px' }}>
                    {companyInitial}
                  </div>
                  <div className="flex-grow-1">
                    <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-1">
                      <h2 className="fw-bolder text-dark mb-0">{job.title}</h2>
                      <div className="d-flex align-items-center gap-2">
                        {job.status === 'Closed' && (
                          <span className="badge bg-secondary px-3 py-2 fw-semibold rounded-pill">
                            <i className="fas fa-lock me-1"></i> Closed
                          </span>
                        )}
                        {alreadyApplied && (
                          <span className="badge-applied">
                            <i className="fas fa-check-circle me-1"></i> Applied
                            {userApplication?.status && userApplication.status !== 'Applied' && ` (${userApplication.status})`}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="d-flex flex-wrap gap-3 text-secondary mt-2 small">
                      <span className="d-flex align-items-center">
                        <i className="fas fa-building text-primary me-2"></i>
                        <strong className="text-dark">{job.company}</strong>
                      </span>
                      <span className="d-flex align-items-center">
                        <i className="fas fa-map-marker-alt text-danger me-2"></i>
                        <span>{job.location}</span>
                      </span>
                      {formattedDate && (
                        <span className="d-flex align-items-center">
                          <i className="far fa-calendar-alt text-muted me-2"></i>
                          <span>Posted {formattedDate}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Job Description */}
                <div className="mb-5">
                  <h5 className="fw-bold text-dark mb-3 d-flex align-items-center">
                    <i className="fas fa-file-alt text-primary me-2"></i>
                    Role Overview
                  </h5>
                  <div className="text-secondary" style={{ lineHeight: '1.8', whiteSpace: 'pre-line', fontSize: '0.975rem' }}>
                    {job.description}
                  </div>
                </div>

                {/* Job Requirements */}
                {job.requirements && job.requirements.length > 0 && (
                  <div>
                    <h5 className="fw-bold text-dark mb-3 d-flex align-items-center">
                      <i className="fas fa-list-check text-primary me-2"></i>
                      Required Skills & Qualifications
                    </h5>
                    <ul className="list-unstyled mb-0">
                      {job.requirements.map((req, index) => (
                        <li key={index} className="d-flex align-items-start mb-3 p-2 rounded bg-light">
                          <i className="fas fa-check-circle text-success mt-1 me-3 fs-5"></i>
                          <span className="text-secondary" style={{ fontSize: '0.95rem' }}>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Application Section */}
          <div className="col-12 col-lg-4">
            <div className="sticky-top" style={{ top: '80px' }}>
              {isAuthenticated ? (
                <ApplicationForm
                  job={job}
                  hasResume={Boolean(user?.resume && user.resume.trim() !== '')}
                  alreadyApplied={alreadyApplied}
                  onSuccess={handleApplicationSuccess}
                />
              ) : (
                <div className="card shadow-sm border-0 border-top border-4 border-primary">
                  <div className="card-body p-4 text-center">
                    <div
                      className="bg-primary-subtle text-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                      style={{ width: '64px', height: '64px' }}
                    >
                      <i className="fas fa-lock fa-2x"></i>
                    </div>
                    <h5 className="fw-bold text-dark mb-2">Ready to Apply?</h5>
                    <p className="text-muted small mb-4">
                      Create an account or sign in to submit your profile and resume for <strong>{job.title}</strong>.
                    </p>
                    <div className="d-grid gap-2">
                      <Link
                        to="/login"
                        state={{ from: { pathname: `/jobs/${job._id}` } }}
                        className="btn btn-primary fw-semibold rounded-pill"
                      >
                        <i className="fas fa-sign-in-alt me-2"></i> Sign In to Apply
                      </Link>
                      <Link
                        to="/register"
                        className="btn btn-outline-secondary fw-semibold rounded-pill"
                      >
                        <i className="fas fa-user-plus me-2"></i> Create an Account
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Summary Card */}
              <div className="card shadow-sm border-0 mt-4">
                <div className="card-header bg-white py-3 border-bottom">
                  <h6 className="card-title mb-0 fw-bold text-dark">
                    <i className="fas fa-info-circle text-primary me-2"></i>
                    Position Summary
                  </h6>
                </div>
                <div className="card-body p-3 small text-muted">
                  <div className="d-flex justify-content-between py-2 border-bottom">
                    <span>Company:</span>
                    <strong className="text-dark">{job.company}</strong>
                  </div>
                  <div className="d-flex justify-content-between py-2 border-bottom">
                    <span>Location:</span>
                    <strong className="text-dark">{job.location}</strong>
                  </div>
                  <div className="d-flex justify-content-between py-2 border-bottom">
                    <span>Status:</span>
                    {job.status === 'Closed' ? (
                      <span className="badge bg-secondary-subtle text-secondary border border-secondary-subtle">
                        <i className="fas fa-lock me-1"></i> Closed
                      </span>
                    ) : (
                      <span className="badge bg-success-subtle text-success border border-success-subtle">
                        <i className="fas fa-check-circle me-1"></i> Actively Hiring
                      </span>
                    )}
                  </div>
                  {alreadyApplied && userApplication?.status && (
                    <div className="d-flex justify-content-between py-2 border-bottom">
                      <span>Your Application:</span>
                      <Link to="/applications" className="badge bg-primary-subtle text-primary border border-primary-subtle text-decoration-none">
                        {userApplication.status} <i className="fas fa-external-link-alt ms-1 small"></i>
                      </Link>
                    </div>
                  )}
                  <div className="d-flex justify-content-between py-2">
                    <span>Applications:</span>
                    <span className="text-dark">Reviewed on a rolling basis</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
