import React, { useState, useRef } from 'react';
import api from '../api/axios';
import { toast } from 'react-toastify';

const ResumeUpload = ({ currentResume, onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';
  const cleanServerUrl = serverUrl.replace(/\/+$/, '');
  const resumeFullUrl = currentResume
    ? (currentResume.startsWith('http') || currentResume.startsWith('data:')
        ? currentResume
        : `${cleanServerUrl}${currentResume.startsWith('/') ? '' : '/'}${currentResume}`)
    : null;

  const allowedExtensions = ['.pdf', '.doc', '.docx'];
  const maxSizeBytes = 5 * 1024 * 1024; // 5 MB

  const validateFile = (file) => {
    if (!file) return false;

    const ext = '.' + file.name.split('.').pop().toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      toast.error('Invalid file type! Only PDF, DOC, and DOCX files are allowed.');
      return false;
    }

    if (file.size > maxSizeBytes) {
      toast.error('File is too large! Maximum allowed size is 5 MB.');
      return false;
    }

    return true;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
    } else {
      e.target.value = null;
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      toast.warning('Please select a resume file first.');
      return;
    }

    const formData = new FormData();
    formData.append('resume', selectedFile);

    setUploading(true);
    try {
      const res = await api.post('/users/resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success(res.data.message || 'Resume uploaded successfully!');
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }

      if (onUploadSuccess && res.data?.data?.user) {
        onUploadSuccess(res.data.data.user);
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || err.message || 'Failed to upload resume';
      toast.error(errorMsg);
    } finally {
      setUploading(false);
    }
  };

  // Helper to get filename from path
  const getResumeDisplayTitle = (path) => {
    if (!path) return 'Uploaded Resume';
    try {
      const parts = path.split('/');
      const last = decodeURIComponent(parts[parts.length - 1]);
      return last.length > 35 ? `${last.substring(0, 32)}...` : last;
    } catch {
      return 'Uploaded Resume';
    }
  };

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-white py-3 border-bottom d-flex align-items-center justify-content-between">
        <h5 className="card-title mb-0 fw-bold d-flex align-items-center text-dark">
          <i className="fas fa-file-pdf text-danger me-2"></i>
          Resume Document
        </h5>
        <span className="badge bg-light text-muted border small">PDF / DOC / DOCX</span>
      </div>

      <div className="card-body p-4">
        {/* Current Resume Info */}
        {currentResume ? (
          <div className="alert bg-success-subtle border border-success-subtle d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 p-3 rounded-3">
            <div className="d-flex align-items-center mb-3 mb-md-0">
              <div
                className="bg-white rounded-circle p-2 shadow-sm d-flex align-items-center justify-content-center me-3"
                style={{ width: '48px', height: '48px' }}
              >
                <i className="fas fa-file-alt text-success fs-4"></i>
              </div>
              <div>
                <span className="badge bg-success text-white mb-1 small rounded-pill">
                  <i className="fas fa-check-circle me-1"></i> Active Resume
                </span>
                <p className="mb-0 fw-semibold text-break text-dark">
                  {getResumeDisplayTitle(currentResume)}
                </p>
                <small className="text-muted">
                  Attached automatically whenever you apply to any open opportunity.
                </small>
              </div>
            </div>
            {resumeFullUrl && (
              <a
                href={resumeFullUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-success btn-sm align-self-start align-self-md-center text-nowrap rounded-pill px-3 shadow-sm"
              >
                <i className="fas fa-external-link-alt me-1"></i> View File
              </a>
            )}
          </div>
        ) : (
          <div className="alert bg-warning-subtle border border-warning-subtle mb-4 d-flex align-items-center p-3 rounded-3">
            <i className="fas fa-exclamation-triangle fa-2x text-warning me-3"></i>
            <div>
              <strong className="text-dark">Resume Not Yet Uploaded</strong>
              <div className="small text-secondary">
                You must have an uploaded resume on your profile before you can apply to open jobs.
              </div>
            </div>
          </div>
        )}

        {/* Upload Form */}
        <form onSubmit={handleUpload}>
          <div
            className={`border rounded-3 p-4 text-center cursor-pointer mb-3 transition-all ${
              dragActive ? 'border-primary bg-primary-subtle' : 'border-secondary-subtle bg-light'
            }`}
            style={{ borderStyle: 'dashed !important', borderWidth: '2px', cursor: 'pointer' }}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx"
              style={{ display: 'none' }}
            />
            <div
              className="bg-white rounded-circle d-inline-flex align-items-center justify-content-center shadow-sm p-3 mb-2"
              style={{ width: '56px', height: '56px' }}
            >
              <i className="fas fa-cloud-upload-alt fa-2x text-primary"></i>
            </div>
            <h6 className="fw-bold mb-1 text-dark">
              {currentResume ? 'Upload Replacement Resume' : 'Select Resume File'}
            </h6>
            <p className="text-muted small mb-2">
              Drag & drop your file here, or click to browse from your device
            </p>
            <span className="badge bg-white text-secondary border small">
              Max file size: 5 MB
            </span>
          </div>

          {selectedFile && (
            <div className="card bg-light border-primary mb-3">
              <div className="card-body py-2 px-3 d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center text-truncate me-2">
                  <i className="fas fa-paperclip text-primary me-2"></i>
                  <span className="fw-semibold text-truncate small">{selectedFile.name}</span>
                  <span className="badge bg-secondary ms-2 small">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </span>
                </div>
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm py-0 px-2 rounded-circle"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = null;
                  }}
                >
                  <i className="fas fa-times small"></i>
                </button>
              </div>
            </div>
          )}

          <div className="d-flex justify-content-end">
            <button
              type="submit"
              className="btn btn-primary px-4 fw-semibold rounded-pill shadow-sm"
              disabled={!selectedFile || uploading}
            >
              {uploading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Uploading Resume...
                </>
              ) : (
                <>
                  <i className="fas fa-upload me-2"></i>
                  {currentResume ? 'Replace Active Resume' : 'Upload Resume'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResumeUpload;
