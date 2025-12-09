from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse, FileResponse
from typing import List, Optional
import os
from datetime import datetime
import shutil
import json

from services.llama_service import LlamaMedicalService
from services.document_processor import DocumentProcessor
from services.medical_analyzer import MedicalAnalyzer
from services.visualization_service import VisualizationService
from services.supabase_service import SupabaseService

# Initialize services
llama_service = LlamaMedicalService()
document_processor = DocumentProcessor()
medical_analyzer = MedicalAnalyzer()
visualization_service = VisualizationService()
supabase_service = SupabaseService()

app = FastAPI(
    title="Mediclinic AI Medical Dashboard",
    description="AI-powered medical dashboard with Llama 3.2 11B",
    version="2.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
os.makedirs("static/uploads", exist_ok=True)
os.makedirs("static/charts", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
async def root():
    return {
        "app": "Mediclinic AI Medical Dashboard",
        "version": "2.0.0",
        "ai_model": "Llama 3.2 11B",
        "status": "operational",
        "features": [
            "Medical text explanation",
            "Diagnosis interpretation",
            "Lab result analysis",
            "Document processing",
            "Medication explanation",
            "Health visualization"
        ]
    }

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "services": {
            "llama_model": "loaded" if llama_service.model_loaded else "not_loaded",
            "supabase": "connected" if supabase_service.connected else "local",
            "document_processor": "ready",
            "medical_analyzer": "ready"
        }
    }

@app.post("/api/explain")
async def explain_medical(
    text: str = Form(...),
    context: Optional[str] = Form(""),
    language: str = Form("english")
):
    """Explain medical text"""
    explanation = llama_service.explain_medical_text(text, context)
    return JSONResponse(content=explanation)

@app.post("/api/explain-diagnosis")
async def explain_diagnosis(
    diagnosis: str = Form(...),
    notes: Optional[str] = Form("")
):
    """Explain medical diagnosis"""
    explanation = llama_service.explain_diagnosis(diagnosis, notes)
    return JSONResponse(content=explanation)

@app.post("/api/analyze-lab")
async def analyze_lab_results(lab_data: dict):
    """Analyze lab results with AI"""
    analysis = llama_service.analyze_lab_results(lab_data)
    
    # Also run through medical analyzer for categorization
    categorization = medical_analyzer.categorize_lab_results(lab_data)
    analysis["categorization"] = categorization
    
    return JSONResponse(content=analysis)

@app.post("/api/explain-medication")
async def explain_medication(medication: str = Form(...)):
    """Explain medication"""
    explanation = llama_service.explain_medication(medication)
    return JSONResponse(content=explanation)

@app.post("/api/upload-document")
async def upload_document(
    file: UploadFile = File(...),
    document_type: str = Form("lab_report"),
    patient_id: str = Form("demo-patient")
):
    """Upload and process medical document"""
    
    # Save file
    file_path = f"static/uploads/{patient_id}_{datetime.now().timestamp()}_{file.filename}"
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Process document
    result = document_processor.process_document(file_path, document_type)
    
    # Save to database
    supabase_service.save_document({
        "patient_id": patient_id,
        "filename": file.filename,
        "document_type": document_type,
        "file_path": file_path,
        "processed_data": result,
        "uploaded_at": datetime.now().isoformat()
    })
    
    return JSONResponse(content={
        "success": True,
        "filename": file.filename,
        "document_type": document_type,
        "processed_data": result,
        "file_url": f"/{file_path}"
    })

@app.get("/api/documents/{patient_id}")
async def get_patient_documents(patient_id: str):
    """Get patient documents"""
    documents = supabase_service.get_patient_documents(patient_id)
    return JSONResponse(content={"documents": documents})

@app.post("/api/generate-chart")
async def generate_chart(chart_data: dict):
    """Generate medical chart"""
    chart_type = chart_data.get("type", "blood_work")
    data = chart_data.get("data", {})
    
    chart_result = visualization_service.generate_chart(chart_type, data)
    
    return JSONResponse(content=chart_result)

@app.get("/api/patient/{patient_id}/summary")
async def get_patient_summary(patient_id: str):
    """Get comprehensive patient summary"""
    # Get documents
    documents = supabase_service.get_patient_documents(patient_id)
    
    # Get lab results from documents
    lab_results = []
    for doc in documents:
        if doc.get("document_type") == "lab_report":
            lab_results.append(doc.get("processed_data", {}))
    
    # Analyze if we have lab results
    analysis = {}
    if lab_results:
        latest_labs = lab_results[-1]
        analysis = llama_service.analyze_lab_results(latest_labs)
    
    # Generate health summary
    summary = {
        "patient_id": patient_id,
        "document_count": len(documents),
        "lab_reports": len([d for d in documents if d.get("document_type") == "lab_report"]),
        "doctor_notes": len([d for d in documents if d.get("document_type") == "doctor_note"]),
        "latest_analysis": analysis,
        "last_updated": datetime.now().isoformat()
    }
    
    return JSONResponse(content=summary)

@app.post("/api/auth/login")
async def login(email: str = Form(...), password: str = Form(...)):
    """User login"""
    user = supabase_service.authenticate_user(email, password)
    if user:
        return JSONResponse(content={
            "success": True,
            "user": user,
            "token": "demo-token-for-auth"  # In production, use JWT
        })
    else:
        raise HTTPException(status_code=401, detail="Invalid credentials")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)