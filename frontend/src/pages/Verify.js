import React, { useState } from 'react';
import { FaUpload, FaSpinner, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useDropzone } from 'react-dropzone';
import { verifyOffer } from '../utils/dummyApi';

const Verify = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    recruiterEmail: ''
  });
  const [uploadedFile, setUploadedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.jpg', '.jpeg', '.png']
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    onDrop: (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        alert('File rejected. Please upload PDF, JPG, PNG, or JPEG files under 5MB.');
        return;
      }
      if (acceptedFiles.length > 0) {
        setUploadedFile(acceptedFiles[0]);
        // Clear form data when file is uploaded
        setFormData({ fullName: '', companyName: '', recruiterEmail: '' });
      }
    }
  });

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
    setResult(null);

    try {
      let verificationData;
      
      if (uploadedFile) {
        // Simulate file parsing
        verificationData = {
          fullName: 'John Doe', // Simulated OCR result
          companyName: 'TechCorp Inc',
          recruiterEmail: 'recruiter@techcorp.com',
          source: 'file',
          fileName: uploadedFile.name
        };
      } else {
        verificationData = {
          ...formData,
          source: 'manual'
        };
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const verificationResult = await verifyOffer(verificationData);
      setResult(verificationResult);
    } catch (error) {
      setResult({
        success: false,
        message: 'An error occurred during verification. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    if (uploadedFile) return true;
    return formData.fullName && formData.companyName && formData.recruiterEmail;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Verify Offer Letter
          </h1>
          <p className="text-xl text-gray-600">
            Enter your offer details manually or upload your offer letter document
          </p>
        </div>

        <div className="card max-w-2xl mx-auto">
          <form onSubmit={handleSubmit}>
            {/* Manual Input Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Enter Details Manually</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Enter your full name"
                    disabled={uploadedFile}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Enter company name"
                    disabled={uploadedFile}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recruiter Email
                  </label>
                  <input
                    type="email"
                    name="recruiterEmail"
                    value={formData.recruiterEmail}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Enter recruiter's email"
                    disabled={uploadedFile}
                  />
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">OR</span>
              </div>
            </div>

            {/* File Upload Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Upload Offer Letter</h3>
              <div
                {...getRootProps()}
                className={`dropzone ${isDragActive ? 'active' : ''}`}
              >
                <input {...getInputProps()} />
                <FaUpload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                {uploadedFile ? (
                  <div>
                    <p className="text-green-600 font-medium mb-2">File uploaded successfully!</p>
                    <p className="text-sm text-gray-600">{uploadedFile.name}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Size: {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <button
                      type="button"
                      onClick={() => setUploadedFile(null)}
                      className="mt-2 text-sm text-red-600 hover:text-red-800"
                    >
                      Remove file
                    </button>
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-600 mb-2">
                      {isDragActive
                        ? 'Drop the file here...'
                        : 'Drag & drop your offer letter here, or click to browse'}
                    </p>
                    <p className="text-sm text-gray-500">
                      Supports PDF, JPG, PNG, JPEG (max 5MB)
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isFormValid() || loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <span>Verify Offer</span>
              )}
            </button>
          </form>

          {/* Results Section */}
          {result && (
            <div className={`result-card ${result.success ? 'result-success' : 'result-error'}`}>
              <div className="flex items-start space-x-3">
                {result.success ? (
                  <FaCheckCircle className="h-6 w-6 text-green-600 mt-1" />
                ) : (
                  <FaTimesCircle className="h-6 w-6 text-red-600 mt-1" />
                )}
                <div>
                  <h3 className="font-semibold mb-2">
                    {result.success ? 'Verification Successful' : 'Verification Failed'}
                  </h3>
                  <p>{result.message}</p>
                  {result.success && result.details && (
                    <div className="mt-3 text-sm">
                      <p><strong>Verified by:</strong> {result.details.recruiterName}</p>
                      <p><strong>Company:</strong> {result.details.companyName}</p>
                      <p><strong>Date signed:</strong> {result.details.dateSignedFormatted}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Verify;