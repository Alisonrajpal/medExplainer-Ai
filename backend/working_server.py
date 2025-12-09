from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
from datetime import datetime
import json
import os
import sys

print("=" * 60)
print("🧪 Starting Mediclinic Working Server")
print("=" * 60)

# Check imports
try:
    print("✅ FastAPI and dependencies loaded successfully")
except Exception as e:
    print(f"❌ Import error: {e}")
    sys.exit(1)

# Create app
app = FastAPI(
    title="Mediclinic AI Dashboard",
    description="Medical AI Dashboard Backend",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "*"  # Allow all for testing
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Create directories
try:
    os.makedirs("static/uploads", exist_ok=True)
    os.makedirs("static/charts", exist_ok=True)
    print("✅ Created static directories")
except Exception as e:
    print(f"⚠️  Directory creation warning: {e}")

# ========== BASIC ENDPOINTS ==========

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "app": "Mediclinic AI Dashboard",
        "version": "2.0.0",
        "status": "operational",
        "endpoints": {
            "/health": "Health check",
            "/demo/data": "Demo patient data",
            "/api/explain": "Explain medical text",
            "/api/analyze": "Analyze lab results",
            "/docs": "API documentation"
        },
        "timestamp": datetime.now().isoformat()
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "mediclinic-backend",
        "timestamp": datetime.now().isoformat(),
        "environment": "development"
    }

@app.get("/api/health")
async def api_health():
    """API health check"""
    return {
        "status": "healthy",
        "api_version": "v2",
        "timestamp": datetime.now().isoformat()
    }

# ========== DEMO ENDPOINTS ==========

@app.get("/demo/data")
async def get_demo_data():
    """Get demo patient data"""
    return {
        "patient": {
            "id": "demo-patient-001",
            "name": "John Doe",
            "age": 45,
            "gender": "male",
            "blood_type": "O+",
            "height_cm": 175,
            "weight_kg": 80,
            "allergies": ["Penicillin"],
            "chronic_conditions": ["Type 2 Diabetes", "Hypertension"],
            "emergency_contact": {
                "name": "Jane Doe",
                "relationship": "Spouse",
                "phone": "+1-555-0123"
            }
        },
        "lab_results": {
            "glucose": 145,
            "hba1c": 6.8,
            "cholesterol": 220,
            "ldl": 140,
            "hdl": 42,
            "triglycerides": 185,
            "creatinine": 1.1,
            "sodium": 140,
            "potassium": 4.2
        },
        "medications": [
            {
                "name": "Metformin",
                "dosage": "500mg",
                "frequency": "Twice daily",
                "instructions": "Take with meals",
                "status": "active"
            },
            {
                "name": "Lisinopril",
                "dosage": "10mg",
                "frequency": "Once daily",
                "instructions": "Take in the morning",
                "status": "active"
            }
        ],
        "vitals": {
            "blood_pressure": {"systolic": 135, "diastolic": 85},
            "heart_rate": 72,
            "temperature": 98.6,
            "respiratory_rate": 16,
            "oxygen_saturation": 98
        },
        "appointments": [
            {
                "date": "2024-02-15T10:00:00",
                "doctor": "Dr. Smith",
                "reason": "Diabetes follow-up",
                "status": "scheduled"
            }
        ],
        "timestamp": datetime.now().isoformat()
    }

@app.post("/demo/analyze")
async def demo_analyze():
    """Demo lab analysis"""
    return {
        "analysis": "Based on the demo lab results, your glucose and cholesterol levels are elevated. This indicates a need for lifestyle modifications and possibly medication adjustment.",
        "recommendations": [
            "Follow up with your endocrinologist",
            "Monitor blood sugar regularly",
            "Maintain heart-healthy diet",
            "Exercise 30 minutes daily"
        ],
        "risk_level": "moderate",
        "timestamp": datetime.now().isoformat()
    }

# ========== MEDICAL AI ENDPOINTS ==========

@app.post("/api/explain")
async def explain_medical_text(text: str, context: str = ""):
    """Explain medical text in simple terms"""
    
    # Simple explanation logic
    explanations = {
        "diabetes": "Diabetes is a condition where your body has trouble using sugar for energy, leading to high blood sugar levels.",
        "hypertension": "Hypertension means high blood pressure. It's like your heart is working too hard to pump blood through your body.",
        "cholesterol": "Cholesterol is a fatty substance in your blood. Your body needs some, but too much can clog arteries.",
        "metformin": "Metformin helps your body use insulin better to lower blood sugar in type 2 diabetes.",
        "lisinopril": "Lisinopril relaxes blood vessels to help lower blood pressure and make it easier for your heart to pump blood.",
        "myocardial infarction": "A heart attack happens when blood flow to part of the heart is blocked, damaging heart muscle."
    }
    
    text_lower = text.lower()
    found_explanation = None
    
    for term, explanation in explanations.items():
        if term in text_lower:
            found_explanation = explanation
            break
    
    if not found_explanation:
        found_explanation = f"'{text}' appears to be medical terminology. In simple terms, this relates to health conditions that should be discussed with your healthcare provider."
    
    return {
        "original": text,
        "explanation": found_explanation,
        "context": context,
        "confidence": "high",
        "model": "medical-knowledge-base",
        "timestamp": datetime.now().isoformat()
    }

@app.post("/api/analyze/labs")
async def analyze_lab_results(lab_data: dict):
    """Analyze lab results"""
    
    # Simple analysis logic
    analysis = {
        "summary": "Lab Results Analysis",
        "findings": [],
        "recommendations": [],
        "risk_level": "normal",
        "health_score": 75
    }
    
    # Check common lab values
    if "glucose" in lab_data:
        glucose = lab_data["glucose"]
        if glucose > 126:
            analysis["findings"].append("High blood glucose (possible diabetes)")
            analysis["recommendations"].append("Consult endocrinologist")
            analysis["risk_level"] = "high"
        elif glucose > 100:
            analysis["findings"].append("Borderline high glucose")
            analysis["recommendations"].append("Monitor diet and exercise")
            analysis["risk_level"] = "moderate"
    
    if "cholesterol" in lab_data:
        cholesterol = lab_data["cholesterol"]
        if cholesterol > 200:
            analysis["findings"].append("High cholesterol")
            analysis["recommendations"].append("Heart-healthy diet recommended")
            if analysis["risk_level"] != "high":
                analysis["risk_level"] = "moderate"
    
    if "hdl" in lab_data:
        hdl = lab_data["hdl"]
        if hdl < 40:
            analysis["findings"].append("Low HDL (good cholesterol)")
            analysis["recommendations"].append("Increase aerobic exercise")
    
    if not analysis["findings"]:
        analysis["findings"].append("All values appear normal")
        analysis["recommendations"].append("Continue healthy lifestyle")
    
    return {
        "lab_data": lab_data,
        "analysis": analysis,
        "analyzed_at": datetime.now().isoformat(),
        "note": "Basic analysis - connect AI model for detailed insights"
    }

@app.post("/api/upload")
async def upload_medical_document(
    file: UploadFile = File(...),
    document_type: str = Form("lab_report"),
    patient_id: str = Form("demo-patient-001")
):
    """Upload medical document"""
    
    try:
        # Create filename
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        safe_filename = f"{patient_id}_{timestamp}_{file.filename}"
        file_path = f"static/uploads/{safe_filename}"
        
        # Read and save file
        content = await file.read()
        file_size_kb = len(content) / 1024
        
        with open(file_path, "wb") as f:
            f.write(content)
        
        # Return success
        return JSONResponse(
            status_code=200,
            content={
                "success": True,
                "message": "File uploaded successfully",
                "document": {
                    "id": f"doc_{timestamp}",
                    "filename": file.filename,
                    "patient_id": patient_id,
                    "document_type": document_type,
                    "file_path": file_path,
                    "file_size_kb": round(file_size_kb, 2),
                    "uploaded_at": datetime.now().isoformat(),
                    "download_url": f"/{file_path}"
                },
                "processing": {
                    "status": "completed",
                    "extracted_data": {
                        "type": document_type,
                        "note": "File saved successfully"
                    }
                }
            }
        )
        
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "error": str(e),
                "message": "File upload failed"
            }
        )

@app.get("/api/documents/{patient_id}")
async def get_patient_documents(patient_id: str):
    """Get patient documents"""
    return {
        "patient_id": patient_id,
        "documents": [
            {
                "id": "doc_001",
                "filename": "blood_test_january.pdf",
                "type": "lab_report",
                "uploaded_at": "2024-01-15T10:30:00",
                "size_kb": 245,
                "status": "processed"
            },
            {
                "id": "doc_002",
                "filename": "doctor_notes_february.docx",
                "type": "doctor_note",
                "uploaded_at": "2024-02-01T14:20:00",
                "size_kb": 89,
                "status": "processed"
            }
        ],
        "count": 2,
        "timestamp": datetime.now().isoformat()
    }

@app.get("/api/chart")
async def generate_medical_chart(chart_type: str = "blood_work"):
    """Generate medical chart"""
    
    chart_data = {
        "blood_work": {
            "type": "bar",
            "title": "Blood Work Analysis",
            "data": {
                "labels": ["Glucose", "Cholesterol", "HDL", "LDL", "Triglycerides"],
                "values": [145, 220, 42, 140, 185],
                "reference_ranges": {
                    "glucose": [70, 100],
                    "cholesterol": [125, 200],
                    "hdl": [40, 60],
                    "ldl": [0, 100],
                    "triglycerides": [0, 150]
                }
            },
            "colors": ["#EF4444", "#F59E0B", "#10B981", "#F59E0B", "#EF4444"]
        },
        "vitals": {
            "type": "gauge",
            "title": "Vital Signs",
            "data": {
                "heart_rate": {"value": 72, "min": 60, "max": 100},
                "blood_pressure": {"systolic": 135, "diastolic": 85},
                "temperature": {"value": 98.6, "min": 97, "max": 99}
            }
        }
    }
    
    return {
        "chart_type": chart_type,
        "chart_data": chart_data.get(chart_type, chart_data["blood_work"]),
        "generated_at": datetime.now().isoformat()
    }

@app.get("/api/patient/{patient_id}/summary")
async def get_patient_summary(patient_id: str):
    """Get patient health summary"""
    return {
        "patient_id": patient_id,
        "summary": {
            "health_score": 78,
            "risk_level": "moderate",
            "conditions": ["Type 2 Diabetes", "Hypertension"],
            "medications_count": 2,
            "lab_reports_count": 3,
            "last_checkup": "2024-01-15",
            "next_appointment": "2024-02-15"
        },
        "trends": {
            "glucose": "slightly improving",
            "cholesterol": "stable",
            "blood_pressure": "improving"
        },
        "recommendations": [
            "Continue current medications",
            "Monitor blood sugar daily",
            "Follow up with cardiologist",
            "Maintain low-salt diet"
        ],
        "generated_at": datetime.now().isoformat()
    }

# ========== ERROR HANDLING ==========

@app.exception_handler(404)
async def not_found_handler(request, exc):
    return JSONResponse(
        status_code=404,
        content={"error": "Endpoint not found", "path": request.url.path}
    )

@app.exception_handler(500)
async def server_error_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error", "message": str(exc)}
    )

# ========== STARTUP LOGIC ==========

if __name__ == "__main__":
    print("\n" + "=" * 60)
    print("🚀 STARTUP SEQUENCE INITIATED")
    print("=" * 60)
    
    # Startup checks
    startup_checks = []
    
    try:
        # Check port availability
        import socket
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(1)
        result = sock.connect_ex(('localhost', 8000))
        sock.close()
        
        if result == 0:
            startup_checks.append(("❌", "Port 8000 is already in use"))
            print("⚠️  Warning: Port 8000 might be in use")
            print("   Trying to start anyway...")
        else:
            startup_checks.append(("✅", "Port 8000 is available"))
    except:
        startup_checks.append(("⚠️", "Could not check port availability"))
    
    try:
        # Check static directories
        if os.path.exists("static/uploads"):
            startup_checks.append(("✅", "Upload directory exists"))
        else:
            startup_checks.append(("⚠️", "Creating upload directory"))
            os.makedirs("static/uploads", exist_ok=True)
        
        if os.path.exists("static/charts"):
            startup_checks.append(("✅", "Charts directory exists"))
        else:
            startup_checks.append(("⚠️", "Creating charts directory"))
            os.makedirs("static/charts", exist_ok=True)
    except Exception as e:
        startup_checks.append(("❌", f"Directory error: {e}"))
    
    # Print startup checks
    print("\n🔍 Startup Checks:")
    for status, message in startup_checks:
        print(f"   {status} {message}")
    
    print("\n" + "=" * 60)
    print("🌐 SERVER INFORMATION")
    print("=" * 60)
    print(f"   📍 Local URL: http://localhost:8000")
    print(f"   🌍 Network URL: http://127.0.0.1:8000")
    print(f"   📚 Documentation: http://localhost:8000/docs")
    print(f"   🏥 Health Check: http://localhost:8000/health")
    print(f"   🎯 Demo Data: http://localhost:8000/demo/data")
    print("\n" + "=" * 60)
    print("🔄 Starting server...")
    print("=" * 60)
    print("Press Ctrl+C to stop the server\n")
    
    try:
        uvicorn.run(
            app,
            host="0.0.0.0",
            port=8000,
            reload=False,  # Set to False for debugging
            log_level="info",
            access_log=True
        )
    except Exception as e:
        print(f"\n❌ Server failed to start: {e}")
        print("\n💡 Troubleshooting tips:")
        print("1. Check if port 8000 is already in use")
        print("2. Try: netstat -ano | findstr :8000")
        print("3. Or use a different port: change port=8001")
        input("\nPress Enter to exit...")