import React from 'react';
import { Link } from 'react-router-dom';
import { FaShieldAlt, FaCheck, FaUserTie, FaQrcode } from 'react-icons/fa';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-section text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Verify Your Job Offer Letter. Instantly.
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Protect yourself from fraudulent job offers with our advanced verification system.
          </p>
          <p className="text-lg mb-10 text-blue-100">
            Upload your offer letter or enter details manually to verify its authenticity in seconds.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/verify"
              className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center space-x-2"
            >
              <FaShieldAlt />
              <span>Verify Offer</span>
            </Link>
            <Link
              to="/recruiter"
              className="glass-effect text-white font-semibold py-4 px-8 rounded-lg hover:bg-white hover:bg-opacity-20 transition-all duration-200 inline-flex items-center justify-center space-x-2"
            >
              <FaUserTie />
              <span>I'm a Recruiter</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How OfferTrust Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform ensures job offer authenticity through advanced verification and digital signatures.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaShieldAlt className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Instant Verification</h3>
              <p className="text-gray-600">
                Upload your offer letter or enter details manually. Our system instantly verifies authenticity.
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheck className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Secure Digital Signatures</h3>
              <p className="text-gray-600">
                Recruiters can generate cryptographically signed offers that are impossible to forge.
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaQrcode className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">QR Code Integration</h3>
              <p className="text-gray-600">
                Generate QR codes for offers that can be easily verified by candidates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Verify Your Offer?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of job seekers who trust OfferTrust to protect them from fraud.
          </p>
          <Link
            to="/verify"
            className="btn-primary text-lg px-8 py-4 inline-flex items-center space-x-2"
          >
            <FaShieldAlt />
            <span>Start Verification</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;