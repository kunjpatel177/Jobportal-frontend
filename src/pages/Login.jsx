import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/jobs';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError('Please fill in both email and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password);
      toast.success('Welcome back! Login successful.');
      navigate(from, { replace: true });
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || 'Invalid email or password.';
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
                    <i className="fas fa-briefcase"></i>
                  </div>
                  <h3 className="fw-bolder text-dark mb-1">Welcome Back</h3>
                  <p className="text-muted small">
                    Sign in to track your job applications and profile
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
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="passwordInput" className="form-label fw-semibold small text-secondary">
                      Password
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
                        placeholder="••••••••"
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
                        Signing In...
                      </>
                    ) : (
                      <>
                        Sign In <i className="fas fa-arrow-right ms-2 small"></i>
                      </>
                    )}
                  </button>
                </form>

                <div className="text-center mt-4 pt-3 border-top">
                  <p className="text-muted small mb-0">
                    New to JobPortal?{' '}
                    <Link to="/register" className="fw-semibold text-primary text-decoration-none">
                      Create an account
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

export default Login;
