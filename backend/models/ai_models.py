from pydantic import BaseModel
from typing import Dict, List, Optional, Any

class ExplanationRequest(BaseModel):
    text: str
    context: Optional[str] = ""
    language: str = "english"
    simplify_level: str = "patient"

class DiagnosisRequest(BaseModel):
    diagnosis: str
    notes: Optional[str] = ""
    patient_age: Optional[int] = None
    patient_gender: Optional[str] = None

class LabAnalysisRequest(BaseModel):
    lab_data: Dict[str, float]
    patient_info: Optional[Dict] = {}
    previous_results: Optional[Dict] = {}

class MedicationExplanationRequest(BaseModel):
    medication_name: str
    dosage: Optional[str] = ""
    frequency: Optional[str] = ""
    patient_conditions: Optional[List[str]] = []

class SymptomAnalysisRequest(BaseModel):
    symptoms: List[str]
    duration_days: Optional[int] = None
    severity: Optional[str] = "mild"
    patient_info: Optional[Dict] = {}

class HealthReportRequest(BaseModel):
    patient_id: str
    include_labs: bool = True
    include_medications: bool = True
    include_documents: bool = False
    time_period_days: Optional[int] = 365