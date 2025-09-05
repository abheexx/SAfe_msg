"""
Safe Chat Filter Backend
FastAPI application with OpenAI moderation and heuristic fallback
"""

import os
import re
import httpx
from typing import List, Dict, Any
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(
    title="Safe Chat Filter API",
    description="Bumble-inspired chat moderation service",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request/Response models
class CheckRequest(BaseModel):
    text: str

class CheckResponse(BaseModel):
    safe: bool
    reasons: List[str]
    mode: str

# Heuristic filter patterns
HEURISTIC_PATTERNS = {
    "violence": [
        r"\b(kill|murder|assault|attack|fight|violence|harm|hurt)\b",
        r"\b(weapon|gun|knife|bomb|explosive)\b",
        r"\b(threat|threaten|intimidate)\b"
    ],
    "harassment": [
        r"\b(stupid|idiot|moron|dumb|ugly|fat|gross)\b",
        r"\b(hate|despise|loathe)\b",
        r"\b(harass|bully|intimidate)\b"
    ],
    "inappropriate": [
        r"\b(sex|sexual|nude|naked|porn|adult)\b",
        r"\b(drug|alcohol|drunk|high|stoned)\b",
        r"\b(scam|fraud|cheat|steal|rob)\b"
    ],
    "spam": [
        r"\b(buy|sell|promo|discount|offer|deal)\b",
        r"\b(click|link|website|url)\b",
        r"\b(follow|subscribe|like|share)\b"
    ]
}

async def check_with_openai(text: str) -> Dict[str, Any]:
    """Check text using OpenAI moderation API"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.openai.com/v1/moderations",
                headers={
                    "Authorization": f"Bearer {os.getenv('OPENAI_API_KEY')}",
                    "Content-Type": "application/json"
                },
                json={"input": text},
                timeout=10.0
            )
            response.raise_for_status()
            data = response.json()
            
            result = data["results"][0]
            flagged = result["flagged"]
            categories = result["categories"]
            
            reasons = []
            if flagged:
                for category, is_flagged in categories.items():
                    if is_flagged:
                        reasons.append(f"Detected: {category.replace('_', ' ').title()}")
            
            return {
                "safe": not flagged,
                "reasons": reasons,
                "mode": "openai"
            }
    except Exception as e:
        print(f"OpenAI API error: {e}")
        raise HTTPException(status_code=500, detail="OpenAI moderation service unavailable")

def check_with_heuristic(text: str) -> Dict[str, Any]:
    """Check text using heuristic patterns"""
    text_lower = text.lower()
    reasons = []
    
    for category, patterns in HEURISTIC_PATTERNS.items():
        for pattern in patterns:
            if re.search(pattern, text_lower, re.IGNORECASE):
                reasons.append(f"Detected: {category.replace('_', ' ').title()}")
                break  # Only add one reason per category
    
    return {
        "safe": len(reasons) == 0,
        "reasons": reasons,
        "mode": "heuristic"
    }

@app.get("/")
async def root():
    """Health check endpoint"""
    return {"message": "Safe Chat Filter API is running", "version": "1.0.0"}

@app.post("/api/check", response_model=CheckResponse)
async def check_text(request: CheckRequest):
    """
    Check if text is safe for chat
    
    - **text**: The text message to check
    - Returns safety status, reasons, and detection mode
    """
    if not request.text.strip():
        return CheckResponse(
            safe=True,
            reasons=[],
            mode="none"
        )
    
    # Try OpenAI first if API key is available
    if os.getenv("OPENAI_API_KEY"):
        try:
            return CheckResponse(**await check_with_openai(request.text))
        except HTTPException:
            # Fall back to heuristic if OpenAI fails
            pass
    
    # Use heuristic fallback
    return CheckResponse(**check_with_heuristic(request.text))

@app.get("/api/health")
async def health_check():
    """Detailed health check"""
    openai_available = bool(os.getenv("OPENAI_API_KEY"))
    return {
        "status": "healthy",
        "openai_available": openai_available,
        "heuristic_available": True
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
