import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import JobCard from '../components/JobCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const Jobs = () => {
  const { isAuthenticated } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('ALL');

  const fetchJobsAndApplications = async () => {
    setLoading(true);
    setError('');
    try {
      // 1. Fetch all open jobs
      const jobsRes = await api.get('/jobs');
      const jobList = jobsRes.data?.data?.jobs || [];
      setJobs(jobList);
      setFilteredJobs(jobList);

      // 2. If logged in, fetch user applications to see which jobs are already applied
      if (isAuthenticated) {
        try {
          const appRes = await api.get('/applications');
          const userApps = appRes.data?.data?.applications || [];
          const appliedIds = new Set(
            userApps.map((app) => (app.job?._id || app.job).toString())
          );
          setAppliedJobIds(appliedIds);
        } catch (appErr) {
          console.error('Could not fetch user applications:', appErr);
        }
      } else {
        setAppliedJobIds(new Set());
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to load jobs.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobsAndApplications();
  }, [isAuthenticated]);

  // Handle Search and Tag filtering
  useEffect(() => {
    let result = [...jobs];

    // Filter by tag if selected
    if (selectedTag === 'REMOTE') {
      result = result.filter((j) => j.location.toLowerCase().includes('remote'));
    } else if (selectedTag === 'HYBRID') {
      result = result.filter((j) => j.location.toLowerCase().includes('hybrid'));
    } else if (selectedTag === 'NODE') {
      result = result.filter(
        (j) =>
          j.title.toLowerCase().includes('node') ||
          j.description.toLowerCase().includes('node')
      );
    } else if (selectedTag === 'REACT') {
      result = result.filter(
        (j) =>
          j.title.toLowerCase().includes('react') ||
          j.description.toLowerCase().includes('react')
      );
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (job) =>
          job.title.toLowerCase().includes(term) ||
          job.company.toLowerCase().includes(term) ||
          job.location.toLowerCase().includes(term) ||
          job.description.toLowerCase().includes(term)
      );
    }

    setFilteredJobs(result);
  }, [searchTerm, selectedTag, jobs]);

  return (
    <div className="bg-light min-vh-100 pb-5">
      {/* Executive Hero Banner */}
      <section
        className="py-5 text-white position-relative"
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        <div className="container py-4 text-center">
          <div className="hero-pill-badge">
            <span className="badge-dot"></span>
            <i className="fas fa-sparkles badge-icon"></i>
            <span>Discover Top Engineering Roles</span>
          </div>

          <h1 className="fw-bolder display-5 mb-3 text-white">
            Find Your Next Career Move
          </h1>
          <p className="lead text-light text-opacity-75 mx-auto mb-4" style={{ maxWidth: '640px' }}>
            Explore verified opportunities across leading tech companies. Apply directly with your uploaded resume in one click.
          </p>

          {/* Search Bar */}
          <div className="row justify-content-center">
            <div className="col-12 col-md-10 col-lg-7">
              <div
                className="input-group p-1 bg-white rounded-pill shadow-lg border hero-search-wrapper"
                style={{ borderColor: 'rgba(0,0,0,0.08)' }}
              >
                <span className="input-group-text bg-transparent border-0 ps-3 text-primary d-none d-sm-flex">
                  <i className="fas fa-search fs-5"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-0 bg-transparent py-2 py-sm-3 shadow-none text-dark"
                  placeholder="Search by job title, skill, company, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    className="btn btn-link text-muted pe-2 pe-sm-3 text-decoration-none shadow-none"
                    type="button"
                    onClick={() => setSearchTerm('')}
                    aria-label="Clear search"
                  >
                    <i className="fas fa-times-circle fs-5"></i>
                  </button>
                )}
                <button className="btn btn-primary rounded-pill px-3 px-sm-4 fw-semibold btn-search" type="button">
                  Search
                </button>
              </div>

              {/* Quick Filter Tags */}
              <div className="d-flex flex-wrap justify-content-center gap-2 mt-3">
                <span className="small text-light text-opacity-75 align-self-center me-1">Popular:</span>
                {[
                  { id: 'ALL', label: 'All Jobs' },
                  { id: 'REMOTE', label: 'Remote' },
                  { id: 'HYBRID', label: 'Hybrid' },
                  { id: 'REACT', label: 'React.js' },
                  { id: 'NODE', label: 'Node.js' }
                ].map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => setSelectedTag(tag.id)}
                    className={`hero-tag-btn ${selectedTag === tag.id ? 'active' : ''}`}
                  >
                    {tag.label}
                  </button>

                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container py-4">
        {loading ? (
          <LoadingSpinner message="Loading open tech opportunities..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={fetchJobsAndApplications} />
        ) : filteredJobs.length === 0 ? (
          <div className="card shadow-sm border-0 text-center py-5 my-4">
            <div className="card-body">
              <div className="mb-3">
                <i className="fas fa-briefcase fa-4x text-muted opacity-50"></i>
              </div>
              <h4 className="fw-bold text-dark">No Matching Jobs Found</h4>
              <p className="text-muted mb-3">
                {searchTerm || selectedTag !== 'ALL'
                  ? 'No jobs match your current search criteria. Try adjusting your search keywords or tags.'
                  : 'There are currently no job listings available.'}
              </p>
              {(searchTerm || selectedTag !== 'ALL') && (
                <button
                  className="btn btn-outline-primary btn-sm px-4 rounded-pill"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedTag('ALL');
                  }}
                >
                  <i className="fas fa-redo me-1"></i> Reset Filters
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Results Header */}
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-4 gap-2">
              <div>
                <h5 className="fw-bold text-dark mb-0">Open Positions</h5>
                <span className="text-muted small">
                  Showing {filteredJobs.length} {filteredJobs.length === 1 ? 'position' : 'positions'}
                  {appliedJobIds.size > 0 && ` (${appliedJobIds.size} already applied)`}
                </span>
              </div>

              {(searchTerm || selectedTag !== 'ALL') && (
                <button
                  className="btn btn-outline-secondary btn-sm rounded-pill"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedTag('ALL');
                  }}
                >
                  <i className="fas fa-times me-1"></i> Clear Filter
                </button>
              )}
            </div>

            {/* Jobs Grid */}
            <div className="row g-4">
              {filteredJobs.map((job) => (
                <div key={job._id} className="col-12 col-md-6 col-lg-4">
                  <JobCard
                    job={job}
                    isApplied={appliedJobIds.has(job._id.toString())}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Jobs;
