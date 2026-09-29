import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

  const fetchApplications = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/applications');
      setApplications(res.data?.data?.applications || []);
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || 'Failed to load applications.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // Update Application Status in Real Time
  const handleStatusChange = async (appId, newStatus) => {
    setUpdatingId(appId);
    try {
      const res = await api.patch(`/applications/${appId}/status`, {
        status: newStatus
      });
      toast.success(res.data?.message || `Application status updated to "${newStatus}"`);
      // Update application in local state to refresh cards & statistics immediately
      setApplications((prev) =>
        prev.map((app) =>
          app._id === appId ? { ...app, status: newStatus } : app
        )
      );
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || 'Failed to update application status';
      toast.error(msg);
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Selected':
        return (
          <span className="badge bg-success text-white px-3 py-2 fw-semibold rounded-pill shadow-sm">
            <i className="fas fa-trophy me-1"></i> Selected
          </span>
        );
      case 'Shortlisted':
        return (
          <span className="badge bg-info-subtle text-info-emphasis border border-info-subtle px-3 py-2 fw-semibold rounded-pill">
            <i className="fas fa-star me-1 text-warning"></i> Shortlisted
          </span>
        );
      case 'Under Review':
        return (
          <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle px-3 py-2 fw-semibold rounded-pill">
            <i className="fas fa-eye me-1"></i> Under Review
          </span>
        );
      case 'Rejected':
        return (
          <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-3 py-2 fw-semibold rounded-pill">
            <i className="fas fa-times me-1"></i> Rejected
          </span>
        );
      case 'Applied':
      default:
        return (
          <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 fw-semibold rounded-pill">
            <i className="fas fa-paper-plane me-1"></i> Applied
          </span>
        );
    }
  };

  // Render Hiring Pipeline Stage Stepper
  const renderStatusPipeline = (status) => {
    const isRejected = status === 'Rejected';
    const stages = [
      { id: 'Applied', label: '1. Applied', icon: 'fa-check' },
      { id: 'Under Review', label: '2. Review', icon: 'fa-search' },
      { id: 'Shortlisted', label: '3. Shortlist', icon: 'fa-star' },
      {
        id: isRejected ? 'Rejected' : 'Selected',
        label: isRejected ? 'Decision: Rejected' : '4. Selected',
        icon: isRejected ? 'fa-times' : 'fa-trophy'
      }
    ];

    const orderMap = {
      'Applied': 1,
      'Under Review': 2,
      'Shortlisted': 3,
      'Selected': 4,
      'Rejected': 4
    };

    const currentOrder = orderMap[status] || 1;

    return (
      <div className="status-stepper-container mt-3">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="small text-muted fw-bold" style={{ fontSize: '0.75rem' }}>
            HIRING PIPELINE PROGRESS:
          </span>
          <span className="small text-secondary fw-semibold" style={{ fontSize: '0.75rem' }}>
            Current Stage: <span className="text-dark">{status}</span>
          </span>
        </div>

        <div className="status-stepper">
          {stages.map((stage, idx) => {
            const stageOrder = idx + 1;
            let stepClass = '';

            if (isRejected && stage.id === 'Rejected') {
              stepClass = 'rejected';
            } else if (stageOrder < currentOrder) {
              stepClass = 'completed';
            } else if (stageOrder === currentOrder) {
              stepClass = isRejected ? 'rejected' : 'active';
            }

            return (
              <div key={stage.id} className={`status-step ${stepClass}`}>
                <div className="status-step-circle">
                  <i className={`fas ${stage.icon}`}></i>
                </div>
                <span className="status-step-label">{stage.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const filteredApplications = applications.filter((app) => {
    if (filterStatus === 'ALL') return true;
    return app.status === filterStatus;
  });

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container">
        {/* Header with Title and Filter */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
          <div>
            <h2 className="fw-bolder text-dark mb-1 d-flex align-items-center">
              <i className="fas fa-file-contract text-primary me-3"></i>
              Application Tracker
            </h2>
            <p className="text-muted small mb-0">
              Track and manage hiring pipeline stages in real time
            </p>
          </div>

          {applications.length > 0 && (
            <div className="d-flex align-items-center gap-2">
              <span className="small fw-semibold text-muted text-nowrap">Filter Status:</span>
              <select
                id="statusFilter"
                className="form-select form-select-sm rounded-pill shadow-sm"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{ width: '170px' }}
              >
                <option value="ALL">All ({applications.length})</option>
                <option value="Applied">Applied</option>
                <option value="Under Review">Under Review</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Selected">Selected</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          )}
        </div>

        {/* Stats Row */}
        {applications.length > 0 && (
          <div className="row g-3 mb-4">
            <div className="col-6 col-md-3">
              <div className="card shadow-sm border-0 text-center p-3">
                <span className="text-muted small fw-medium">Total Applied</span>
                <span className="fs-3 fw-bold text-dark">{applications.length}</span>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="card shadow-sm border-0 text-center p-3">
                <span className="text-muted small fw-medium">In Review</span>
                <span className="fs-3 fw-bold text-warning">
                  {applications.filter((a) => a.status === 'Under Review').length}
                </span>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="card shadow-sm border-0 text-center p-3">
                <span className="text-muted small fw-medium">Shortlisted</span>
                <span className="fs-3 fw-bold text-info">
                  {applications.filter((a) => a.status === 'Shortlisted').length}
                </span>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="card shadow-sm border-0 text-center p-3">
                <span className="text-muted small fw-medium">Selected</span>
                <span className="fs-3 fw-bold text-success">
                  {applications.filter((a) => a.status === 'Selected').length}
                </span>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <LoadingSpinner message="Fetching your submitted applications..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={fetchApplications} />
        ) : applications.length === 0 ? (
          <div className="card shadow-sm border-0 text-center py-5 my-4">
            <div className="card-body p-5">
              <div
                className="bg-primary-subtle text-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                style={{ width: '80px', height: '80px' }}
              >
                <i className="fas fa-inbox fa-3x"></i>
              </div>
              <h4 className="fw-bold text-dark mb-2">No Applications Yet</h4>
              <p className="text-muted mx-auto mb-4" style={{ maxWidth: '440px' }}>
                You have not submitted any job applications yet. Browse through our open tech roles and submit your resume.
              </p>
              <Link to="/jobs" className="btn btn-primary px-4 rounded-pill fw-semibold">
                <i className="fas fa-compass me-2"></i> Explore Open Roles
              </Link>
            </div>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="card shadow-sm border-0 text-center py-5">
            <div className="card-body">
              <p className="text-muted mb-3">No applications found with status "{filterStatus}".</p>
              <button
                className="btn btn-outline-primary btn-sm rounded-pill"
                onClick={() => setFilterStatus('ALL')}
              >
                Reset Filter
              </button>
            </div>
          </div>
        ) : (
          <div className="row g-3">
            {filteredApplications.map((app) => {
              const appliedDate = app.appliedAt
                ? new Date(app.appliedAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })
                : '';

              const cleanServerUrl = (serverUrl || 'http://localhost:5000').replace(/\/+$/, '');
              const resumeUrl = app.resume
                ? (app.resume.startsWith('http') || app.resume.startsWith('data:')
                    ? app.resume
                    : `${cleanServerUrl}${app.resume.startsWith('/') ? '' : '/'}${app.resume}`)
                : null;

              const companyInitial = app.job?.company ? app.job.company.charAt(0).toUpperCase() : 'J';

              return (
                <div key={app._id} className="col-12">
                  <div className="card shadow-sm border-0">
                    <div className="card-body p-4">
                      <div className="row align-items-center gy-3">
                        {/* Company & Role */}
                        <div className="col-12 col-lg-4">
                          <div className="d-flex align-items-start">
                            <div className="company-avatar-box me-3 flex-shrink-0">
                              {companyInitial}
                            </div>
                            <div className="min-w-0 flex-grow-1">
                              <h5 className="fw-bold text-dark mb-1 text-truncate">
                                {app.job ? (
                                  <Link
                                    to={`/jobs/${app.job._id}`}
                                    className="text-dark text-decoration-none hover-primary"
                                  >
                                    {app.job.title}
                                  </Link>
                                ) : (
                                  <span className="text-muted">Position Inactive</span>
                                )}
                              </h5>
                              <div className="text-secondary small d-flex flex-wrap gap-2">
                                <span>
                                  <i className="fas fa-building me-1 text-muted"></i>
                                  <strong>{app.job?.company || 'Company'}</strong>
                                </span>
                                <span>•</span>
                                <span>
                                  <i className="fas fa-map-marker-alt text-danger me-1"></i>
                                  {app.job?.location || 'Location'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Applied Date & Resume link */}
                        <div className="col-12 col-sm-6 col-lg-3">
                          <div className="small text-muted mb-1">
                            <i className="far fa-calendar-check me-1 text-primary"></i>
                            Applied on: <strong className="text-dark">{appliedDate}</strong>
                          </div>
                          {resumeUrl && (
                            <a
                              href={resumeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-outline-secondary btn-sm py-1 px-3 rounded-pill small mt-1 text-truncate"
                              style={{ fontSize: '0.8rem' }}
                            >
                              <i className="fas fa-file-pdf text-danger me-1"></i>
                              Submitted Resume
                            </a>
                          )}
                        </div>

                        {/* Current Status Badge */}
                        <div className="col-12 col-sm-6 col-lg-2 text-start text-lg-center">
                          {getStatusBadge(app.status)}
                        </div>

                        {/* Interactive Status Changer Dropdown */}
                        <div className="col-12 col-lg-3 text-start text-lg-end">
                          <div className="d-flex align-items-center justify-content-lg-end gap-2">
                            <label
                              htmlFor={`status-select-${app._id}`}
                              className="small text-muted fw-semibold text-nowrap mb-0"
                            >
                              Change Status:
                            </label>
                            <select
                              id={`status-select-${app._id}`}
                              className="form-select form-select-sm rounded-pill fw-medium border-primary-subtle shadow-sm"
                              value={app.status}
                              onChange={(e) => handleStatusChange(app._id, e.target.value)}
                              disabled={updatingId === app._id}
                              style={{ width: '145px' }}
                            >
                              <option value="Applied">Applied</option>
                              <option value="Under Review">Under Review</option>
                              <option value="Shortlisted">Shortlisted</option>
                              <option value="Selected">Selected</option>
                              <option value="Rejected">Rejected</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Visual Status Pipeline Progress Stepper */}
                      {renderStatusPipeline(app.status)}

                      {/* Cover Letter Section */}
                      {app.coverLetter && (
                        <div className="mt-3 pt-3 border-top">
                          <div className="bg-light p-3 rounded-3 small">
                            <strong className="text-dark d-block mb-1">
                              <i className="fas fa-envelope-open-text text-secondary me-2"></i>
                              Cover Letter Note:
                            </strong>
                            <p className="text-secondary mb-0" style={{ whiteSpace: 'pre-line', lineHeight: '1.6' }}>
                              {app.coverLetter}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;
