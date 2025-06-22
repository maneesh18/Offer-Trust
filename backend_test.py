#!/usr/bin/env python3
import requests
import json
import os
import unittest
import time
import logging
from dotenv import load_dotenv
from pathlib import Path

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load environment variables from frontend .env to get the backend URL
frontend_env_path = Path('/app/frontend/.env')
load_dotenv(frontend_env_path)

# Get the backend URL from environment variables
BACKEND_URL = os.environ.get('REACT_APP_BACKEND_URL')
if not BACKEND_URL:
    raise ValueError("REACT_APP_BACKEND_URL not found in environment variables")

API_URL = f"{BACKEND_URL}/api"
logger.info(f"Using API URL: {API_URL}")

class OfferTrustBackendTests(unittest.TestCase):
    """Test suite for OfferTrust backend API endpoints"""

    def setUp(self):
        """Set up test data"""
        self.valid_offer = {
            "fullName": "John Doe", 
            "companyName": "TechCorp Inc", 
            "recruiterEmail": "recruiter@techcorp.com", 
            "source": "manual"
        }
        
        self.invalid_offer = {
            "fullName": "Unknown Person", 
            "companyName": "FakeCompany", 
            "recruiterEmail": "fake@fake.com", 
            "source": "manual"
        }
        
        self.generate_offer_data = {
            "candidateName": "Alice Smith", 
            "position": "Software Engineer", 
            "companyName": "TechCorp Inc", 
            "recruiterEmail": "hr@techcorp.com", 
            "recruiterName": "John Recruiter",
            "salary": "$120,000",  # Adding salary to avoid NoneType error
            "startDate": "2025-07-15"  # Adding startDate to avoid NoneType error
        }
        
        self.auth_data = {
            "email": "recruiter@company.com", 
            "companyName": "TechCorp Inc", 
            "fullName": "John Recruiter"
        }

    def test_01_health_check(self):
        """Test the API health check endpoint"""
        logger.info("Testing API health check endpoint")
        response = requests.get(f"{API_URL}/")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["message"], "OfferTrust API is running")
        logger.info("Health check test passed")

    def test_02_verify_valid_offer(self):
        """Test verifying a valid offer"""
        logger.info("Testing valid offer verification")
        response = requests.post(f"{API_URL}/verify-offer", json=self.valid_offer)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        # Since verification has a random component in the backend, we just check the structure
        self.assertIn("success", data)
        self.assertIn("message", data)
        logger.info(f"Verification response: {data}")
        logger.info("Valid offer verification test passed")

    def test_03_verify_invalid_offer(self):
        """Test verifying an invalid offer"""
        logger.info("Testing invalid offer verification")
        response = requests.post(f"{API_URL}/verify-offer", json=self.invalid_offer)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        # The backend has a 30% chance of verifying any offer, so we can't assert on success
        # We just check the structure
        self.assertIn("success", data)
        self.assertIn("message", data)
        logger.info(f"Invalid offer verification response: {data}")
        logger.info("Invalid offer verification test passed")

    def test_04_generate_offer(self):
        """Test generating a new offer"""
        logger.info("Testing offer generation")
        response = requests.post(f"{API_URL}/generate-offer", json=self.generate_offer_data)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data["success"])
        self.assertIn("hash", data)
        self.assertIn("digitalSignature", data)
        self.assertIn("qrData", data)
        
        # Verify QR data structure
        qr_data = json.loads(data["qrData"])
        self.assertEqual(qr_data["candidate"], self.generate_offer_data["candidateName"])
        self.assertEqual(qr_data["company"], self.generate_offer_data["companyName"])
        self.assertEqual(qr_data["recruiter"], self.generate_offer_data["recruiterEmail"])
        logger.info("Offer generation test passed")

    def test_05_recruiter_authentication(self):
        """Test recruiter authentication"""
        logger.info("Testing recruiter authentication")
        response = requests.post(f"{API_URL}/auth/recruiter", json=self.auth_data)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data["success"])
        self.assertIn("token", data)
        self.assertIn("user", data)
        self.assertEqual(data["user"]["email"], self.auth_data["email"])
        self.assertEqual(data["user"]["companyName"], self.auth_data["companyName"])
        self.assertEqual(data["user"]["fullName"], self.auth_data["fullName"])
        logger.info("Recruiter authentication test passed")

    def test_06_invalid_recruiter_authentication(self):
        """Test invalid recruiter authentication with gmail address"""
        logger.info("Testing invalid recruiter authentication")
        invalid_auth = {
            "email": "recruiter@gmail.com", 
            "companyName": "TechCorp Inc", 
            "fullName": "John Recruiter"
        }
        response = requests.post(f"{API_URL}/auth/recruiter", json=invalid_auth)
        self.assertEqual(response.status_code, 400)
        data = response.json()
        self.assertIn("detail", data)
        logger.info("Invalid recruiter authentication test passed")

    def test_07_file_upload(self):
        """Test file upload functionality with a mock PDF"""
        logger.info("Testing file upload")
        # Create a mock PDF file
        mock_file_path = "/tmp/mock_offer.pdf"
        with open(mock_file_path, "wb") as f:
            f.write(b"%PDF-1.5\nMock PDF content for testing")
        
        with open(mock_file_path, "rb") as file_obj:
            files = {"file": ("mock_offer.pdf", file_obj, "application/pdf")}
            response = requests.post(f"{API_URL}/upload-file", files=files)
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data["success"])
        self.assertIn("extractedData", data)
        self.assertEqual(data["fileName"], "mock_offer.pdf")
        logger.info("File upload test passed")
        
        # Clean up
        os.remove(mock_file_path)

    def test_08_invalid_file_upload(self):
        """Test file upload with invalid file type"""
        logger.info("Testing invalid file upload")
        # Create a mock text file
        mock_file_path = "/tmp/invalid.txt"
        with open(mock_file_path, "w") as f:
            f.write("This is not a valid file type")
        
        with open(mock_file_path, "rb") as file_obj:
            files = {"file": ("invalid.txt", file_obj, "text/plain")}
            response = requests.post(f"{API_URL}/upload-file", files=files)
        
        self.assertEqual(response.status_code, 400)
        data = response.json()
        self.assertIn("detail", data)
        logger.info("Invalid file upload test passed")
        
        # Clean up
        os.remove(mock_file_path)

    def test_09_get_recruiter_offers(self):
        """Test getting recruiter offers"""
        logger.info("Testing get recruiter offers")
        # First generate an offer to ensure there's data
        requests.post(f"{API_URL}/generate-offer", json=self.generate_offer_data)
        
        # Now get the offers for this recruiter
        recruiter_email = self.generate_offer_data["recruiterEmail"]
        response = requests.get(f"{API_URL}/recruiter/offers?recruiter_email={recruiter_email}")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("offers", data)
        # There should be at least one offer
        self.assertGreaterEqual(len(data["offers"]), 1)
        
        # Check the structure of the first offer
        if data["offers"]:
            offer = data["offers"][0]
            self.assertIn("id", offer)
            self.assertIn("candidateName", offer)
            self.assertIn("position", offer)
            self.assertIn("status", offer)
            self.assertIn("hash", offer)
        logger.info("Get recruiter offers test passed")

if __name__ == "__main__":
    # Add a small delay to ensure the server is fully started
    time.sleep(1)
    unittest.main(verbosity=2)