import os
import json
import io
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pdfplumber
from groq import Groq
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(
    title="Lab Note Structurer API",
    description="Backend API to parse lab note PDFs and structure them using Gemini"
)

# Enable CORS for frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Groq API client
def get_groq_client():
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="Groq API key is missing. Please set GROQ_API_KEY in the backend/.env file."
        )
    return Groq(api_key=api_key)

def get_system_prompt():
    return (
        "You are an expert scientific assistant. Your job is to extract and structure "
        "information from the provided laboratory notes or scientific report.\n\n"
        "Return only valid JSON matching this schema exactly:\n"
        "{\n"
        "  \"title\": \"inferred title of the document\",\n"
        "  \"methodology\": \"how the experiment or process was conducted\",\n"
        "  \"observations\": \"what was noticed or recorded\",\n"
        "  \"results\": \"quantitative or qualitative outcomes\",\n"
        "  \"conclusions\": \"what the results mean\",\n"
        "  \"confidence_note\": \"a short string where you flag anything you were uncertain about in the document\"\n"
        "}"
    )

@app.post("/structure")
async def structure_pdf(file: UploadFile = File(...)):
    # Verify file type
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Unsupported file type. Please upload a valid PDF file."
        )

    # 1. Extract raw text from PDF using pdfplumber
    raw_text = ""
    try:
        file_bytes = await file.read()
        with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
            pages = []
            for page in pdf.pages:
                text = page.extract_text()
                if text:
                    pages.append(text)
            raw_text = "\n\n".join(pages)
            
        if not raw_text.strip():
            raise HTTPException(
                status_code=400,
                detail="No text could be extracted from this PDF. Please ensure it contains digital text (not a scanned image)."
            )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error reading and extracting PDF content: {str(e)}"
        )

    # 2. Call Groq API
    try:
        client = get_groq_client()
        system_prompt = get_system_prompt()
        user_prompt = f"Here is the raw extracted text from the lab note:\n\n{raw_text}"
        
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            response_format={"type": "json_object"},
            temperature=0.1
        )
        
        response_text = completion.choices[0].message.content.strip()
        structured_data = json.loads(response_text)
        
        # Ensure all required keys exist
        required_keys = ["title", "methodology", "observations", "results", "conclusions", "confidence_note"]
        for key in required_keys:
            if key not in structured_data:
                structured_data[key] = f"No {key} information could be extracted."
                
        return {
            "raw_text": raw_text,
            "structured_data": structured_data
        }
        
    except json.JSONDecodeError as jde:
        raise HTTPException(
            status_code=500,
            detail=f"Groq response was not a valid JSON structure: {response_text}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error communicating with Groq API: {str(e)}"
        )
