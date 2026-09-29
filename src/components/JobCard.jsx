import React from 'react';
import { Link } from 'react-router-dom';

const JobCard = ({ job, isApplied = false }) => {
  const formattedDate = job.createdAt
    ? new Date(job.createdAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric'
      })
    : '';

  // Get company initial for the logo box
  const companyInitial = job.company ? job.company.charAt(0).toUpperCase() : 'J';

  // Detect location type for styling tag
  const isRemote = job.location?.toLowerCase().includes('remote');
  const isHybrid = job.location?.toLowerCase().includes('hybrid');

  return (
    <div className="card h-100 job-card border-0 shadow-sm">
      <div className="card-body p-4 d-flex flex-column">
        {/* Top Header: Company Avatar & Date */}
        <div className="d-flex justify-content-between align-items-start mb-3 gap-2">
          <div className="d-flex align-items-center min-w-0 flex-grow-1 me-2">
            <div className="company-avatar-box me-3">
              {companyInitial}
            </div>
            <div className="min-w-0 flex-grow-1">
              <h6 className="fw-semibold text-dark mb-0 text-truncate">
                {job.company}
              </h6>
              <span className="text-muted small d-flex align-items-center mt-1 text-truncate">
                <i className="fas fa-map-marker-alt text-danger me-1 small flex-shrink-0"></i>
                <span className="text-truncate">{job.location}</span>
              </span>
            </div>
          </div>

          <div className="text-end d-flex align-items-center gap-1">
            {job.status === 'Closed' && (
              <span className="badge bg-secondary-subtle text-secondary border border-secondary-subtle small px-2 py-1">
                <i className="fas fa-lock me-1 small"></i> Closed
              </span>
            )}
            {isRemote ? (
              <span className="badge bg-success-subtle text-success border border-success-subtle small px-2 py-1">
                Remote
              </span>
            ) : isHybrid ? (
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle small px-2 py-1">
                Hybrid
              </span>
            ) : (
              <span className="badge bg-secondary-subtle text-secondary border border-secondary-subtle small px-2 py-1">
                On-site
              </span>
            )}
          </div>
        </div>

        {/* Job Title */}
        <h5 className="card-title fw-bold text-dark mb-2">
          <Link to={`/jobs/${job._id}`} className="text-dark text-decoration-none hover-primary">
            {job.title}
          </Link>
        </h5>

        {/* Description snippet */}
        <p className="card-text text-secondary mb-3 small flex-grow-1" style={{ lineHeight: '1.6' }}>
          {job.description && job.description.length > 130
            ? `${job.description.substring(0, 130)}...`
            : job.description}
        </p>

        {/* Requirements Pills */}
        {job.requirements && job.requirements.length > 0 && (
          <div className="mb-3">
            <div className="d-flex flex-wrap gap-1">
              {job.requirements.slice(0, 3).map((req, index) => (
                <span
                  key={index}
                  className="badge bg-light text-secondary border py-1 px-2 text-truncate small"
                  style={{ maxWidth: '180px', fontWeight: 500 }}
                >
                  <i className="fas fa-check text-primary me-1 small"></i>
                  {req}
                </span>
              ))}
              {job.requirements.length > 3 && (
                <span className="badge bg-light text-muted border py-1 px-2 small">
                  +{job.requirements.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="d-flex justify-content-between align-items-center pt-3 border-top mt-auto gap-2">
          <div className="text-muted small text-nowrap">
            {formattedDate && (
              <span>
                <i className="far fa-clock me-1"></i>
                {formattedDate}
              </span>
            )}
          </div>

          <div className="d-flex align-items-center gap-2">
            <Link to={`/jobs/${job._id}`} className="btn btn-outline-primary btn-sm px-2 px-sm-3 text-nowrap">
              Details
            </Link>

            {isApplied ? (
              <span className="badge-applied d-inline-flex align-items-center text-nowrap">
                <i className="fas fa-check-circle me-1"></i> Applied
              </span>
            ) : job.status === 'Closed' ? (
              <span className="badge bg-secondary-subtle text-secondary border px-3 py-2 rounded-pill small fw-semibold text-nowrap">
                <i className="fas fa-lock me-1"></i> Closed
              </span>
            ) : (
              <Link to={`/jobs/${job._id}`} className="btn btn-primary btn-sm px-2 px-sm-3 text-nowrap">
                Apply Now <i className="fas fa-arrow-right ms-1 small"></i>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
