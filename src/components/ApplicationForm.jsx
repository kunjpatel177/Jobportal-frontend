import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { toast } from 'react-toastify';

const ApplicationForm = ({ job, hasResume, alreadyApplied = false, onSuccess }) => {
  const [coverLetter, setCoverLetter] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!hasResume) {
      toast.warning('Please upload your resume in your profile before applying!');
      return;
    }

    if (alreadyApplied) {
      toast.info('You have already submitted an application for this position.');
      return;
    }

    setShowConfirm(true);
  };

  const confirmAndSubmit = async () => {
    setSubmitting(true);
    setShowConfirm(false);

    try {
      const res = await api.post('/applications', {
        jobId: job._id,
        coverLetter
      });

      toast.success(res.data.message || 'Application submitted successfully!');
      if (onSuccess) {
        onSuccess(res.data.data.application);
      }
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || 'Failed to submit application.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (job?.status === 'Closed') {
    return (
      <div className="card shadow-sm border-0 border-top border-4 border-secondary">
        <div className="card-body p-4 text-center">
          <div
            className="bg-secondary-subtle text-secondary rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
            style={{ width: '60px', height: '60px' }}
          >
            <i className="fas fa-lock fa-2x"></i>
          </div>
          <h5 className="fw-bold text-dark mb-1">Position Closed</h5>
          <p className="text-muted small mb-0">
            This job posting is currently closed and is no longer accepting new applications.
          </p>
        </div>
      </div>
    );
  }

  if (alreadyApplied) {
    return (
      <div className="card shadow-sm border-0 border-top border-4 border-success">
        <div className="card-body p-4 text-center">
          <div
            className="bg-success-subtle text-success rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
            style={{ width: '60px', height: '60px' }}
          >
            <i className="fas fa-check-circle fa-2x"></i>
          </div>
          <h5 className="fw-bold text-dark mb-1">Application Submitted!</h5>
          <p className="text-muted small mb-3">
            You have already applied for the <strong>{job.title}</strong> role at{' '}
            <strong>{job.company}</strong>.
          </p>
          <Link to="/applications" className="btn btn-outline-success btn-sm rounded-pill px-4 fw-semibold">
            <i className="fas fa-file-contract me-1"></i> Track Application
          </Link>
        </div>
      </div>
    );
  }

  if (!hasResume) {
    return (
      <div className="card shadow-sm border-0 border-top border-4 border-warning">
        <div className="card-body p-4 text-center">
          <div
            className="bg-warning-subtle text-warning-emphasis rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
            style={{ width: '60px', height: '60px' }}
          >
            <i className="fas fa-file-upload fa-2x text-warning"></i>
          </div>
          <h5 className="fw-bold text-dark mb-2">Resume Required</h5>
          <p className="text-muted small mb-3">
            To apply for <strong>{job.title}</strong>, you need to upload your resume document first.
          </p>
          <Link to="/profile" className="btn btn-primary btn-sm rounded-pill px-4 fw-semibold shadow-sm">
            <i className="fas fa-cloud-upload-alt me-2"></i> Go to Profile & Upload Resume
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white py-3 border-bottom">
          <h5 className="card-title mb-0 fw-bold d-flex align-items-center text-dark">
            <i className="fas fa-paper-plane text-primary me-2"></i>
            Quick Apply
          </h5>
        </div>

        <div className="card-body p-4">
          <div className="alert bg-primary-subtle border border-primary-subtle py-2 px-3 mb-3 d-flex align-items-center rounded-3">
            <i className="fas fa-info-circle text-primary me-2 fs-5"></i>
            <span className="small text-dark">
              Your profile resume will be automatically attached to this application.
            </span>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="coverLetter" className="form-label fw-semibold small text-secondary">
                Cover Note <span className="text-muted fw-normal">(Optional)</span>
              </label>
              <textarea
                id="coverLetter"
                className="form-control"
                rows="5"
                placeholder="Explain why you're a great match for this role or highlight key projects..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                maxLength={2000}
              ></textarea>
              <div className="form-text text-end small">
                {coverLetter.length} / 2000 characters
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 py-2 fw-semibold rounded-pill shadow-sm"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Submitting Application...
                </>
              ) : (
                <>
                  <i className="fas fa-check me-2"></i>
                  Submit Application
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(15, 23, 42, 0.65)' }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow-lg border-0 rounded-4">
              <div className="modal-header border-bottom py-3">
                <h5 className="modal-title fw-bold text-dark d-flex align-items-center">
                  <i className="fas fa-check-double text-primary me-2"></i>
                  Confirm Application Submission
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowConfirm(false)}
                ></button>
              </div>
              <div className="modal-body p-4">
                <p className="text-secondary mb-3">
                  You are about to submit your application for <strong>{job.title}</strong> at{' '}
                  <strong>{job.company}</strong>.
                </p>
                <div className="bg-light p-3 rounded-3 small text-muted border">
                  <i className="fas fa-check-circle text-success me-2"></i>
                  Your active profile resume will be delivered directly to the hiring team.
                </div>
              </div>
              <div className="modal-footer border-top py-3">
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm rounded-pill px-3"
                  onClick={() => setShowConfirm(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm rounded-pill px-4 fw-semibold shadow-sm"
                  onClick={confirmAndSubmit}
                >
                  Confirm & Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ApplicationForm;
