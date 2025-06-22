from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pathlib import Path
import os
import logging
import uuid
from datetime import datetime
import hashlib
import json

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app
app = FastAPI(title="OfferTrust API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Pydantic Models
class OfferVerificationRequest(BaseModel):
    fullName: str
    companyName: str
    recruiterEmail: str
    source: str = "manual"  # "manual" or "file"
    fileName: Optional[str] = None

class OfferVerificationResponse(BaseModel):
    success: bool
    message: str
    details: Optional[dict] = None

class GenerateOfferRequest(BaseModel):
    candidateName: str
    candidateEmail: Optional[str] = None
    position: str
    salary: Optional[str] = None
    startDate: Optional[str] = None
    companyName: str
    recruiterEmail: str
    recruiterName: str

class GenerateOfferResponse(BaseModel):
    success: bool
    hash: str
    digitalSignature: str
    qrData: str
    message: str

class RecruiterAuth(BaseModel):
    email: str
    companyName: Optional[str] = None
    fullName: Optional[str] = None

class VerifiedOffer(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    hash: str
    candidateName: str
    companyName: str
    recruiterEmail: str
    recruiterName: str
    position: str
    salary: Optional[str] = None
    startDate: Optional[str] = None
    dateSigned: datetime = Field(default_factory=datetime.utcnow)
    status: str = "verified"

# Utility functions
def generate_offer_hash(offer_data: dict) -> str:
    """Generate SHA-256 hash for offer data"""
    data_string = "|".join([
        offer_data.get('candidateName', ''),
        offer_data.get('companyName', ''),
        offer_data.get('recruiterEmail', ''),
        offer_data.get('position', ''),
        offer_data.get('salary', ''),
        offer_data.get('startDate', ''),
        offer_data.get('timestamp', str(datetime.utcnow()))
    ])
    return hashlib.sha256(data_string.encode()).hexdigest()

def generate_digital_signature(hash_value: str) -> str:
    """Generate simulated digital signature"""
    signature_data = f"OFFERTRUST_{hash_value}_SECRET"
    signature_hash = hashlib.sha256(signature_data.encode()).hexdigest()
    return f"DS-{signature_hash[:16].upper()}"

def generate_qr_data(offer_data: dict, hash_value: str) -> str:
    """Generate QR code data"""
    qr_data = {
        "type": "offer_verification",
        "hash": hash_value,
        "candidate": offer_data.get('candidateName'),
        "company": offer_data.get('companyName'),
        "recruiter": offer_data.get('recruiterEmail'),
        "timestamp": offer_data.get('timestamp', str(datetime.utcnow())),
        "verifyUrl": f"/verify?hash={hash_value}"
    }
    return json.dumps(qr_data)

# API Routes
@api_router.get("/")
async def root():
    return {"message": "OfferTrust API is running"}

@api_router.post("/verify-offer", response_model=OfferVerificationResponse)
async def verify_offer(request: OfferVerificationRequest):
    """Verify an offer letter"""
    try:
        # Generate hash from input data
        offer_data = {
            'candidateName': request.fullName,
            'companyName': request.companyName,
            'recruiterEmail': request.recruiterEmail,
            'timestamp': str(datetime.utcnow())
        }
        input_hash = generate_offer_hash(offer_data)
        
        # Check if offer exists in database
        stored_offer = await db.verified_offers.find_one({
            "candidateName": {"$regex": f"^{request.fullName}$", "$options": "i"},
            "companyName": {"$regex": f"^{request.companyName}$", "$options": "i"},
            "recruiterEmail": {"$regex": f"^{request.recruiterEmail}$", "$options": "i"}
        })
        
        if stored_offer:
            return OfferVerificationResponse(
                success=True,
                message=f"This offer was verified and signed by {stored_offer['recruiterName']} at {stored_offer['companyName']} on {stored_offer['dateSigned'].strftime('%B %d, %Y')}.",
                details={
                    "recruiterName": stored_offer['recruiterName'],
                    "companyName": stored_offer['companyName'],
                    "position": stored_offer['position'],
                    "dateSigned": stored_offer['dateSigned'].isoformat(),
                    "dateSignedFormatted": stored_offer['dateSigned'].strftime('%B %d, %Y'),
                    "hash": stored_offer['hash']
                }
            )
        
        # For demo purposes, randomly verify some offers
        import random
        if random.random() < 0.3:  # 30% chance of verification
            return OfferVerificationResponse(
                success=True,
                message=f"This offer was verified and signed by HR Department at {request.companyName} on {datetime.now().strftime('%B %d, %Y')}.",
                details={
                    "recruiterName": "HR Department",
                    "companyName": request.companyName,
                    "position": "Position not specified",
                    "dateSigned": datetime.now().isoformat(),
                    "dateSignedFormatted": datetime.now().strftime('%B %d, %Y'),
                    "hash": input_hash
                }
            )
        
        return OfferVerificationResponse(
            success=False,
            message="This offer could not be verified. Please double-check the source or report fraud if you suspect this offer is not legitimate."
        )
        
    except Exception as e:
        logging.error(f"Error verifying offer: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error during verification")

@api_router.post("/generate-offer", response_model=GenerateOfferResponse)
async def generate_offer(request: GenerateOfferRequest):
    """Generate a new signed offer"""
    try:
        # Prepare offer data
        offer_data = {
            'candidateName': request.candidateName,
            'companyName': request.companyName,
            'recruiterEmail': request.recruiterEmail,
            'position': request.position,
            'salary': request.salary,
            'startDate': request.startDate,
            'timestamp': str(datetime.utcnow())
        }
        
        # Generate hash and signature
        hash_value = generate_offer_hash(offer_data)
        digital_signature = generate_digital_signature(hash_value)
        qr_data = generate_qr_data(offer_data, hash_value)
        
        # Store in database
        verified_offer = VerifiedOffer(
            hash=hash_value,
            candidateName=request.candidateName,
            companyName=request.companyName,
            recruiterEmail=request.recruiterEmail,
            recruiterName=request.recruiterName,
            position=request.position,
            salary=request.salary,
            startDate=request.startDate
        )
        
        await db.verified_offers.insert_one(verified_offer.dict())
        
        return GenerateOfferResponse(
            success=True,
            hash=hash_value,
            digitalSignature=digital_signature,
            qrData=qr_data,
            message="Offer generated successfully"
        )
        
    except Exception as e:
        logging.error(f"Error generating offer: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error during offer generation")

@api_router.post("/auth/recruiter")
async def authenticate_recruiter(request: RecruiterAuth):
    """Authenticate recruiter (simulated)"""
    try:
        # Simple validation for demo
        if not request.email or '@' not in request.email or 'gmail.com' in request.email:
            raise HTTPException(status_code=400, detail="Please use a valid company email address")
        
        # Create mock token and user data
        user_data = {
            "id": f"rec-{uuid.uuid4()}",
            "email": request.email,
            "companyName": request.companyName or "Demo Company",
            "fullName": request.fullName or "Demo User"
        }
        
        return {
            "success": True,
            "token": f"jwt-token-{uuid.uuid4()}",
            "user": user_data
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error authenticating recruiter: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error during authentication")

@api_router.get("/recruiter/offers")
async def get_recruiter_offers(recruiter_email: str):
    """Get offers for a specific recruiter"""
    try:
        offers = await db.verified_offers.find(
            {"recruiterEmail": recruiter_email}
        ).to_list(length=100)
        
        # Convert to response format
        formatted_offers = []
        for offer in offers:
            formatted_offers.append({
                "id": offer['id'],
                "candidateName": offer['candidateName'],
                "candidateEmail": offer.get('candidateEmail', ''),
                "position": offer['position'],
                "salary": offer.get('salary', ''),
                "dateCreated": offer['dateSigned'].strftime('%Y-%m-%d'),
                "status": offer['status'].title(),
                "hash": offer['hash'][:20] + "..."
            })
        
        return {"offers": formatted_offers}
        
    except Exception as e:
        logging.error(f"Error getting recruiter offers: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.post("/upload-file")
async def upload_file(file: UploadFile = File(...)):
    """Handle file upload and parsing (simulated)"""
    try:
        # Validate file type and size
        allowed_types = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
        if file.content_type not in allowed_types:
            raise HTTPException(status_code=400, detail="Unsupported file type")
        
        # Simulate file processing
        if file.content_type == 'application/pdf':
            # Simulate PDF parsing
            extracted_data = {
                "fullName": "John Doe",
                "companyName": "TechCorp Inc",
                "recruiterEmail": "recruiter@techcorp.com",
                "position": "Senior Software Engineer",
                "salary": "$120,000"
            }
        else:
            # Simulate OCR processing
            extracted_data = {
                "fullName": "Alice Johnson",
                "companyName": "DataCorp Ltd",
                "recruiterEmail": "hr@datacorp.com",
                "position": "Product Manager",
                "salary": "$110,000"
            }
        
        return {
            "success": True,
            "extractedData": extracted_data,
            "fileName": file.filename
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error processing file upload: {str(e)}")
        raise HTTPException(status_code=500, detail="Error processing uploaded file")

# Include the router in the main app
app.include_router(api_router)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()