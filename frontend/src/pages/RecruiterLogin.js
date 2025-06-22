import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaBuilding } from 'react-icons/fa';

const RecruiterLogin = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    companyName: '',
    fullName: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if already logged in
    const token = localStorage.getItem('recruiterToken');
    if (token) {
      navigate('/recruiter/dashboard');
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateEmail = (email) => {
    const companyDomainRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return companyDomainRegex.test(email) && !email.includes('@gmail.com') && !email.includes('@yahoo.com');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate email domain
    if (!validateEmail(formData.email)) {
      alert('Please use your company email address (not personal email)');
      setLoading(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Create mock token and user data
      const userData = {
        email: formData.email,
        companyName: isLogin ? 'TechCorp Inc' : formData.companyName,
        fullName: isLogin ? 'John Recruiter' : formData.fullName,
        id: 'rec-' + Date.now()
      };

      // Store in localStorage (simulated authentication)
      localStorage.setItem('recruiterToken', 'mock-jwt-token-' + Date.now());
      localStorage.setItem('recruiterData', JSON.stringify(userData));

      navigate('/recruiter/dashboard');
    } catch (error) {
      alert('Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    if (isLogin) {
      return formData.email;
    }
    return formData.email && formData.companyName && formData.fullName;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Recruiter Portal
          </h1>
          <p className="text-gray-600">
            {isLogin ? 'Sign in to your account' : 'Create your recruiter account'}
          </p>
        </div>

        <div className="card">
          {/* Toggle Tabs */}
          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
                isLogin
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
                !isLogin
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Work Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input pl-10"
                    placeholder="john@company.com"
                    required
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Use your company email address (not personal email)
                </p>
              </div>

              {/* Register-only fields */}
              {!isLogin && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUser className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="form-input pl-10"
                        placeholder="John Doe"
                        required={!isLogin}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaBuilding className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        className="form-input pl-10"
                        placeholder="TechCorp Inc"
                        required={!isLogin}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            <button
              type="submit"
              disabled={!isFormValid() || loading}
              className="w-full mt-6 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          {/* Demo credentials notice */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Demo Mode:</strong> Use any company email format (e.g., john@company.com) to access the dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterLogin;