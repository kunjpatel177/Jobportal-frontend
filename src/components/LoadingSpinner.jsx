import React from 'react';

const LoadingSpinner = ({ message = 'Loading, please wait...' }) => {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center py-5">
      <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
        <span className="visually-hidden">Loading...</span>
      </div>
      {message && <p className="mt-3 text-muted fw-medium">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
