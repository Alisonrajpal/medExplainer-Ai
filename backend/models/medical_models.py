from pydantic import BaseModel
from typing import Dict, List, Optional, Any
from datetime import datetime

class MedicalDocument(BaseModel):
    id: str
    patient_id: str
    filename: str
    document_type: str
    file_path: str
    processed_data: Dict[str, Any]
    uploaded_at: datetime
    metadata: Optional[Dict] = {}

class LabResult(BaseModel):
    id: str
    patient_id: str
    test_date: datetime
    results: Dict[str, float]
    reference_ranges: Optional[Dict] = {}
    analysis: Optional[Dict] = {}
    created_at: datetime

class Medication(BaseModel):
    id: str
    patient_id: str
    name: str
    dosage: str
    frequency: str
    instructions: Optional[str] = ""
    start_date: datetime
    end_date: Optional[datetime] = None
    prescribing_doctor: str
    status: str = "active"

class PatientProfile(BaseModel):
    id: str
    name: str
    email: str
    date_of_birth: datetime
    gender: str
    blood_type: Optional[str] = ""
    height_cm: Optional[float] = None
    weight_kg: Optional[float] = None
    allergies: List[str] = []
    chronic_conditions: List[str] = []
    emergency_contact: Dict[str, str] = {}
    created_at: datetime
    updated_at: datetime

class HealthMetrics(BaseModel):
    patient_id: str
    recorded_at: datetime
    metrics: Dict[str, Any]
    source: str = "manual"
    notes: Optional[str] = ""

class DiagnosisExplanation(BaseModel):
    diagnosis: str
    simple_explanation: str
    detailed_explanation: Optional[str] = ""
    treatment_options: List[str] = []
    lifestyle_recommendations: List[str] = []
    questions_for_doctor: List[str] = []
    generated_at: datetime

class RiskAssessment(BaseModel):
    patient_id: str
    assessed_at: datetime
    overall_risk: float
    risk_factors: List[Dict]
    recommendations: List[str]
    next_assessment: Optional[datetime] = None