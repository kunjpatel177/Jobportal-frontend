import React from 'react';

const ErrorMessage = ({ message = 'An error occurred', onRetry }) => {
  return (
    <div className="alert alert-danger d-flex align-items-center justify-content-between my-3 shadow-sm" role="alert">
      <div className="d-flex align-items-center">
        <i className="fas fa-exclamation-triangle fa-lg me-3 text-danger"></i>
        <div>
          <h6 className="alert-heading mb-0 fw-bold">Error</h6>
          <span className="small">{message}</span>
        </div>
      </div>
      {onRetry && (
        <button
          className="btn btn-outline-danger btn-sm ms-3"
          onClick={onRetry}
          type="button"
        >
          <i className="fas fa-redo me-1"></i> Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
