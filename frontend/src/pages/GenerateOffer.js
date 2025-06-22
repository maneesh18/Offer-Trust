import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaDownload, FaCopy, FaQrcode } from 'react-icons/fa';
import { QRCodeCanvas } from 'qrcode.react';
import { generateOfferHash, generateQRData } from '../utils/hashUtils';

const GenerateOffer = () => {
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    candidateName: '',
    candidateEmail: '',
    position: '',
    salary: '',
    startDate: ''
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUserData = localStorage.getItem('recruiterData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      const offerData = {
        ...formData,
        companyName: userData.companyName,
        recruiterEmail: userData.email,
        recruiterName: userData.fullName,
        timestamp: new Date().toISOString()
      };

      // Generate hash and QR data
      const hash = generateOfferHash(offerData);
      const qrData = generateQRData(offerData, hash);
      const digitalSignature = `DS-${hash.substring(0, 16).toUpperCase()}`;

      setResult({
        hash,
        qrData,
        digitalSignature,
        offerData
      });
    } catch (error) {
      alert('Error generating offer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const downloadQRCode = () => {
    const canvas = document.querySelector('#qr-code canvas');
    const url = canvas.toDataURL();
    const a = document.createElement('a');
    a.href = url;
    a.download = `offer-qr-${formData.candidateName.replace(/\s+/g, '-').toLowerCase()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const isFormValid = () => {
    return formData.candidateName && formData.position;
  };

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link
            to="/recruiter/dashboard"
            className="flex items-center text-blue-600 hover:text-blue-800 mr-4"
          >
            <FaArrowLeft className="mr-2" />
            Back to Dashboard
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Generate Offer Letter</h1>
            <p className="text-gray-600 mt-1">Create a cryptographically signed job offer</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-6">Offer Details</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Candidate Full Name *
                  </label>
                  <input
                    type="text"
                    name="candidateName"
                    value={formData.candidateName}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Candidate Email
                  </label>
                  <input
                    type="email"
                    name="candidateEmail"
                    value={formData.candidateEmail}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="john.doe@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Position *
                  </label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Senior Software Engineer"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Salary
                  </label>
                  <input
                    type="text"
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="$120,000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>

                {/* Auto-filled fields */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Auto-filled from your account:</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><strong>Company:</strong> {userData.companyName}</p>
                    <p><strong>Recruiter:</strong> {userData.fullName}</p>
                    <p><strong>Email:</strong> {userData.email}</p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={!isFormValid() || loading}
                className="w-full mt-6 btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="loading-spinner"></div>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <FaQrcode />
                    <span>Generate QR Offer</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Result Section */}
          {result && (
            <div className="card">
              <h2 className="text-xl font-semibold mb-6">Generated Offer Verification</h2>
              
              {/* QR Code */}
              <div className="qr-container mb-6" id="qr-code">
                <QRCode
                  value={result.qrData}
                  size={200}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  level="M"
                  includeMargin={true}
                />
                <button
                  onClick={downloadQRCode}
                  className="mt-4 btn-secondary inline-flex items-center space-x-2"
                >
                  <FaDownload />
                  <span>Download QR Code</span>
                </button>
              </div>

              {/* Hash Display */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Offer Hash (SHA-256)
                </label>
                <div className="hash-display">
                  {result.hash}
                  <button
                    onClick={() => copyToClipboard(result.hash)}
                    className="copy-button"
                  >
                    <FaCopy className="inline mr-1" />
                    Copy
                  </button>
                </div>
              </div>

              {/* Digital Signature */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Digital Signature
                </label>
                <div className="hash-display">
                  {result.digitalSignature}
                  <button
                    onClick={() => copyToClipboard(result.digitalSignature)}
                    className="copy-button"
                  >
                    <FaCopy className="inline mr-1" />
                    Copy
                  </button>
                </div>
              </div>

              {/* Embed Code */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  QR Code Embed HTML
                </label>
                <div className="hash-display text-xs">
                  {`<img src="data:image/png;base64,..." alt="Offer Verification QR Code" />`}
                  <button
                    onClick={() => copyToClipboard(`<img src="data:image/png;base64,..." alt="Offer Verification QR Code" />`)}
                    className="copy-button"
                  >
                    <FaCopy className="inline mr-1" />
                    Copy
                  </button>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-sm font-semibold text-blue-800 mb-2">Next Steps:</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Add the QR code to your offer letter PDF</li>
                  <li>• Share the hash with the candidate for verification</li>
                  <li>• Candidates can verify this offer at /verify</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenerateOffer;