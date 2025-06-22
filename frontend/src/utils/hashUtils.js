import CryptoJS from 'crypto-js';

/**
 * Generate SHA-256 hash for offer data
 * @param {Object} offerData - The offer data to hash
 * @returns {string} - The SHA-256 hash
 */
export const generateOfferHash = (offerData) => {
  // Create a consistent string representation of the offer data
  const dataString = [
    offerData.candidateName,
    offerData.companyName,
    offerData.recruiterEmail,
    offerData.position || '',
    offerData.salary || '',
    offerData.startDate || '',
    offerData.timestamp
  ].join('|');
  
  // Generate SHA-256 hash
  const hash = CryptoJS.SHA256(dataString).toString();
  return hash;
};

/**
 * Generate QR code data with offer information
 * @param {Object} offerData - The offer data
 * @param {string} hash - The generated hash
 * @returns {string} - JSON string for QR code
 */
export const generateQRData = (offerData, hash) => {
  const qrData = {
    type: 'offer_verification',
    hash: hash,
    candidate: offerData.candidateName,
    company: offerData.companyName,
    recruiter: offerData.recruiterEmail,
    timestamp: offerData.timestamp,
    verifyUrl: `${window.location.origin}/verify?hash=${hash}`
  };
  
  return JSON.stringify(qrData);
};

/**
 * Generate a simulated digital signature
 * @param {string} hash - The offer hash
 * @returns {string} - Simulated digital signature
 */
export const generateDigitalSignature = (hash) => {
  // This is a simplified simulation - in real implementation, 
  // this would use proper cryptographic signing
  const signature = CryptoJS.HmacSHA256(hash, 'OFFERTRUST_SECRET_KEY').toString();
  return `SIG-${signature.substring(0, 32).toUpperCase()}`;
};

/**
 * Verify hash against stored offer
 * @param {Object} inputData - The input data to verify
 * @param {string} storedHash - The stored hash to compare against
 * @returns {boolean} - Whether the hash matches
 */
export const verifyOfferHash = (inputData, storedHash) => {
  const generatedHash = generateOfferHash(inputData);
  return generatedHash === storedHash;
};

/**
 * Parse QR code data
 * @param {string} qrData - The QR code data string
 * @returns {Object} - Parsed QR data
 */
export const parseQRData = (qrData) => {
  try {
    const parsed = JSON.parse(qrData);
    if (parsed.type === 'offer_verification') {
      return parsed;
    }
    throw new Error('Invalid QR code format');
  } catch (error) {
    throw new Error('Failed to parse QR code data');
  }
};

/**
 * Extract offer data from file (simulated OCR/PDF parsing)
 * @param {File} file - The uploaded file
 * @returns {Promise<Object>} - Extracted offer data
 */
export const extractOfferFromFile = async (file) => {
  // Simulate file processing delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Simulate OCR/PDF parsing results
  // In a real implementation, this would use actual OCR or PDF parsing libraries
  const mockExtractedData = {
    candidateName: 'John Doe',
    companyName: 'TechCorp Inc',
    recruiterEmail: 'recruiter@techcorp.com',
    position: 'Senior Software Engineer',
    salary: '$120,000',
    startDate: '2025-02-01'
  };
  
  // Add some variation based on filename for demo
  if (file.name.toLowerCase().includes('alice')) {
    mockExtractedData.candidateName = 'Alice Johnson';
    mockExtractedData.position = 'Product Manager';
  } else if (file.name.toLowerCase().includes('bob')) {
    mockExtractedData.candidateName = 'Bob Smith';
    mockExtractedData.position = 'Data Scientist';
  }
  
  return mockExtractedData;
};