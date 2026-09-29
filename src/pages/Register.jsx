import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  // Strict Password Criteria Checks
  const passwordCriteria = {
    hasMinLen: formData.password.length >= 8,
    hasUpper: /[A-Z]/.test(formData.password),
    hasLower: /[a-z]/.test(formData.password),
    hasNumber: /[0-9]/.test(formData.password),
    hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(formData.password)
  };

  const isPasswordValid = Object.values(passwordCriteria).every(Boolean);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!isPasswordValid) {
      setError(
        'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
      );
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await register(formData.name, formData.email, formData.password);
      toast.success('Registration successful! Please upload your resume in your profile.');
      navigate('/profile');
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || 'Registration failed. Please try again.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-light min-vh-100 d-flex align-items-center py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-5">
            <div className="card shadow-sm border-0">
              <div className="card-body p-4 p-md-5">
                <div className="text-center mb-4">
                  <div
                    className="navbar-brand-icon mx-auto mb-3 shadow"
                    style={{ width: '48px', height: '48px', fontSize: '1.4rem' }}
                  >
                    <i className="fas fa-user-plus"></i>
                  </div>
                  <h3 className="fw-bolder text-dark mb-1">Create Candidate Account</h3>
                  <p className="text-muted small">
                    Join today to search and apply for verified engineering positions
                  </p>
                </div>

                {error && (
                  <div className="alert alert-danger py-2 px-3 small d-flex align-items-center mb-3 rounded-3" role="alert">
                    <i className="fas fa-exclamation-circle me-2"></i>
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                  <div className="mb-3">
                    <label htmlFor="nameInput" className="form-label fw-semibold small text-secondary">
                      Full Name
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light text-muted border-end-0">
                        <i className="fas fa-user"></i>
                      </span>
                      <input
                        type="text"
                        id="nameInput"
                        name="name"
                        className="form-control border-start-0"
                        placeholder="e.g. Alex Morgan"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="emailInput" className="form-label fw-semibold small text-secondary">
                      Email Address
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light text-muted border-end-0">
                        <i className="fas fa-envelope"></i>
                      </span>
                      <input
                        type="email"
                        id="emailInput"
                        name="email"
                        className="form-control border-start-0"
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Password with Eye Show/Hide Toggle */}
                  <div className="mb-3">
                    <label htmlFor="passwordInput" className="form-label fw-semibold small text-secondary">
                      Password <span className="text-muted fw-normal">(min. 8 characters)</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light text-muted border-end-0">
                        <i className="fas fa-lock"></i>
                      </span>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="passwordInput"
                        name="password"
                        className="form-control border-start-0 border-end-0"
                        placeholder="Create strong password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                      <button
                        type="button"
                        className="input-group-text bg-light border-start-0 text-muted"
                        style={{ cursor: 'pointer' }}
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        tabIndex="-1"
                      >
                        <i className={showPassword ? 'fas fa-eye-slash text-primary' : 'fas fa-eye'}></i>
                      </button>
                    </div>

                    {/* Live Password Strength Criteria Indicator */}
                    {formData.password && (
                      <div className="bg-light p-2 rounded-3 mt-2 border small">
                        <div className="fw-semibold text-muted mb-1" style={{ fontSize: '0.75rem' }}>
                          Password Requirements:
                        </div>
                        <div className="d-flex flex-wrap gap-2" style={{ fontSize: '0.73rem' }}>
                          <span className={passwordCriteria.hasMinLen ? 'text-success fw-medium' : 'text-muted'}>
                            <i className={`fas ${passwordCriteria.hasMinLen ? 'fa-check-circle text-success' : 'fa-circle text-secondary opacity-50'} me-1`}></i>
                            8+ chars
                          </span>
                          <span className={passwordCriteria.hasUpper ? 'text-success fw-medium' : 'text-muted'}>
                            <i className={`fas ${passwordCriteria.hasUpper ? 'fa-check-circle text-success' : 'fa-circle text-secondary opacity-50'} me-1`}></i>
                            Uppercase (A-Z)
                          </span>
                          <span className={passwordCriteria.hasLower ? 'text-success fw-medium' : 'text-muted'}>
                            <i className={`fas ${passwordCriteria.hasLower ? 'fa-check-circle text-success' : 'fa-circle text-secondary opacity-50'} me-1`}></i>
                            Lowercase (a-z)
                          </span>
                          <span className={passwordCriteria.hasNumber ? 'text-success fw-medium' : 'text-muted'}>
                            <i className={`fas ${passwordCriteria.hasNumber ? 'fa-check-circle text-success' : 'fa-circle text-secondary opacity-50'} me-1`}></i>
                            Number (0-9)
                          </span>
                          <span className={passwordCriteria.hasSpecial ? 'text-success fw-medium' : 'text-muted'}>
                            <i className={`fas ${passwordCriteria.hasSpecial ? 'fa-check-circle text-success' : 'fa-circle text-secondary opacity-50'} me-1`}></i>
                            Special symbol (!@#$)
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password with Eye Show/Hide Toggle */}
                  <div className="mb-4">
                    <label htmlFor="confirmPasswordInput" className="form-label fw-semibold small text-secondary">
                      Confirm Password
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light text-muted border-end-0">
                        <i className="fas fa-shield-alt"></i>
                      </span>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="confirmPasswordInput"
                        name="confirmPassword"
                        className="form-control border-start-0 border-end-0"
                        placeholder="Confirm password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                      />
                      <button
                        type="button"
                        className="input-group-text bg-light border-start-0 text-muted"
                        style={{ cursor: 'pointer' }}
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                        tabIndex="-1"
                      >
                        <i className={showConfirmPassword ? 'fas fa-eye-slash text-primary' : 'fas fa-eye'}></i>
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-2 fw-semibold rounded-pill shadow-sm"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Registering Account...
                      </>
                    ) : (
                      <>
                        Create Account <i className="fas fa-arrow-right ms-2 small"></i>
                      </>
                    )}
                  </button>
                </form>

                <div className="text-center mt-4 pt-3 border-top">
                  <p className="text-muted small mb-0">
                    Already registered?{' '}
                    <Link to="/login" className="fw-semibold text-primary text-decoration-none">
                      Sign in here
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
