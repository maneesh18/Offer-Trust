import { generateOfferHash, verifyOfferHash } from './hashUtils';

// Simulated database of verified offers
const VERIFIED_OFFERS = [
  {
    hash: '5d41402abc4b2a76b9719d911017c592', // Example hash
    candidateName: 'John Doe',
    companyName: 'TechCorp Inc',
    recruiterEmail: 'recruiter@techcorp.com',
    recruiterName: 'Sarah Johnson',
    position: 'Senior Software Engineer',
    dateSigned: '2025-01-15T10:30:00Z',
    status: 'verified'
  },
  {
    hash: 'aab0c4b2a76b9719d911017c5925d414', // Example hash
    candidateName: 'Alice Johnson',
    companyName: 'DataCorp Ltd',
    recruiterEmail: 'hr@datacorp.com',
    recruiterName: 'Mike Wilson',
    position: 'Product Manager',
    dateSigned: '2025-01-14T14:20:00Z',
    status: 'verified'
  }
];

/**
 * Simulate offer verification API call
 * @param {Object} verificationData - Data to verify
 * @returns {Promise<Object>} - Verification result
 */
export const verifyOffer = async (verificationData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Generate hash from input data
  const inputHash = generateOfferHash({
    candidateName: verificationData.fullName,
    companyName: verificationData.companyName,
    recruiterEmail: verificationData.recruiterEmail,
    timestamp: '2025-01-15T10:30:00Z' // In real app, this would be stored
  });
  
  // Check if hash exists in verified offers
  const verifiedOffer = VERIFIED_OFFERS.find(offer => 
    offer.candidateName.toLowerCase() === verificationData.fullName?.toLowerCase() &&
    offer.companyName.toLowerCase() === verificationData.companyName?.toLowerCase() &&
    offer.recruiterEmail.toLowerCase() === verificationData.recruiterEmail?.toLowerCase()
  );
  
  if (verifiedOffer) {
    return {
      success: true,
      message: `This offer was verified and signed by ${verifiedOffer.recruiterName} at ${verifiedOffer.companyName} on ${new Date(verifiedOffer.dateSigned).toLocaleDateString()}.`,
      details: {
        recruiterName: verifiedOffer.recruiterName,
        companyName: verifiedOffer.companyName,
        position: verifiedOffer.position,
        dateSigned: verifiedOffer.dateSigned,
        dateSignedFormatted: new Date(verifiedOffer.dateSigned).toLocaleDateString(),
        hash: verifiedOffer.hash
      }
    };
  }
  
  // 30% chance of random verification success for demo purposes
  if (Math.random() < 0.3) {
    return {
      success: true,
      message: `This offer was verified and signed by HR Department at ${verificationData.companyName} on ${new Date().toLocaleDateString()}.`,
      details: {
        recruiterName: 'HR Department',
        companyName: verificationData.companyName,
        position: 'Position not specified',
        dateSigned: new Date().toISOString(),
        dateSignedFormatted: new Date().toLocaleDateString(),
        hash: inputHash
      }
    };
  }
  
  return {
    success: false,
    message: 'This offer could not be verified. Please double-check the source or report fraud if you suspect this offer is not legitimate.'
  };
};

/**
 * Simulate storing a new offer for verification
 * @param {Object} offerData - Offer data to store
 * @returns {Promise<Object>} - Storage result
 */
export const storeOffer = async (offerData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const hash = generateOfferHash(offerData);
  
  // In a real app, this would store to a database
  const newOffer = {
    hash,
    ...offerData,
    dateSigned: new Date().toISOString(),
    status: 'verified'
  };
  
  // Add to our mock database
  VERIFIED_OFFERS.push(newOffer);
  
  return {
    success: true,
    hash,
    message: 'Offer successfully stored and ready for verification'
  };
};

/**
 * Simulate recruiter authentication
 * @param {Object} credentials - Login credentials
 * @returns {Promise<Object>} - Authentication result
 */
export const authenticateRecruiter = async (credentials) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simple email validation for demo
  if (credentials.email && credentials.email.includes('@') && !credentials.email.includes('@gmail.com')) {
    return {
      success: true,
      token: `jwt-token-${Date.now()}`,
      user: {
        id: `rec-${Date.now()}`,
        email: credentials.email,
        companyName: credentials.companyName || 'Demo Company',
        fullName: credentials.fullName || 'Demo User'
      }
    };
  }
  
  return {
    success: false,
    message: 'Please use a valid company email address'
  };
};

/**
 * Simulate getting recruiter's offers
 * @param {string} recruiterId - Recruiter ID
 * @returns {Promise<Array>} - List of offers
 */
export const getRecruiterOffers = async (recruiterId) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return mock offers for demo
  return [
    {
      id: 1,
      candidateName: 'John Doe',
      candidateEmail: 'john@email.com',
      position: 'Senior Software Engineer',
      salary: '$120,000',
      dateCreated: '2025-01-15',
      status: 'Verified',
      hash: generateOfferHash({
        candidateName: 'John Doe',
        companyName: 'TechCorp Inc',
        recruiterEmail: 'recruiter@techcorp.com',
        timestamp: '2025-01-15T10:30:00Z'
      })
    },
    {
      id: 2,
      candidateName: 'Alice Johnson',
      candidateEmail: 'alice@email.com',
      position: 'Product Manager',
      salary: '$110,000',
      dateCreated: '2025-01-14',
      status: 'Pending',
      hash: generateOfferHash({
        candidateName: 'Alice Johnson',
        companyName: 'TechCorp Inc',
        recruiterEmail: 'recruiter@techcorp.com',
        timestamp: '2025-01-14T14:20:00Z'
      })
    }
  ];
};

/**
 * Simulate file upload and parsing
 * @param {File} file - Uploaded file
 * @returns {Promise<Object>} - Parsed file data
 */
export const parseUploadedFile = async (file) => {
  // Simulate file processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  if (file.type === 'application/pdf') {
    // Simulate PDF parsing
    return {
      success: true,
      extractedData: {
        fullName: 'John Doe',
        companyName: 'TechCorp Inc',
        recruiterEmail: 'recruiter@techcorp.com',
        position: 'Senior Software Engineer',
        salary: '$120,000'
      }
    };
  } else if (file.type.startsWith('image/')) {
    // Simulate OCR processing
    return {
      success: true,
      extractedData: {
        fullName: 'Alice Johnson',
        companyName: 'DataCorp Ltd',
        recruiterEmail: 'hr@datacorp.com',
        position: 'Product Manager',
        salary: '$110,000'
      }
    };
  }
  
  return {
    success: false,
    message: 'Unsupported file format'
  };
};