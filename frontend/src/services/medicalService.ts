import { api, API_ENDPOINTS } from "./api";

// Types
export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  blood_type: string;
  height_cm: number;
  weight_kg: number;
  allergies: string[];
  chronic_conditions: string[];
  emergency_contact: {
    name: string;
    relationship: string;
    phone: string;
  };
}

export interface LabResult {
  [key: string]: number;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  instructions: string;
  status: string;
}

export interface MedicalExplanation {
  original: string;
  explanation: string;
  context: string;
  confidence: string;
  model: string;
  timestamp: string;
}

export interface LabAnalysis {
  lab_data: LabResult;
  analysis: {
    summary: string;
    findings: string[];
    recommendations: string[];
    risk_level: string;
    health_score: number;
  };
  analyzed_at: string;
  note: string;
}

export interface Document {
  id: string;
  filename: string;
  type: string;
  uploaded_at: string;
  size_kb: number;
  status: string;
}

export interface ChartData {
  chart_type: string;
  chart_data: any;
  generated_at: string;
}

export interface PatientSummary {
  patient_id: string;
  summary: {
    health_score: number;
    risk_level: string;
    conditions: string[];
    medications_count: number;
    lab_reports_count: number;
    last_checkup: string;
    next_appointment: string;
  };
  trends: {
    glucose: string;
    cholesterol: string;
    blood_pressure: string;
  };
  recommendations: string[];
  generated_at: string;
}

// Medical Service
class MedicalService {
  // Get demo data
  async getDemoData(): Promise<any> {
    try {
      console.log("Fetching demo data...");
      const data = await api.get(API_ENDPOINTS.DEMO_DATA);
      console.log("Demo data received:", data);
      return data;
    } catch (error) {
      console.error("Error fetching demo data:", error);
      throw error;
    }
  }

  // Explain medical text
  async explainText(
    text: string,
    context: string = ""
  ): Promise<MedicalExplanation> {
    try {
      console.log("Explaining text:", { text, context });
      const data = await api.post(API_ENDPOINTS.EXPLAIN, { text, context });
      return data;
    } catch (error) {
      console.error("Error explaining text:", error);
      throw error;
    }
  }

  // Analyze lab results
  async analyzeLabs(labData: LabResult): Promise<LabAnalysis> {
    try {
      console.log("Analyzing labs:", labData);
      const data = await api.post(API_ENDPOINTS.ANALYZE_LABS, labData);
      return data;
    } catch (error) {
      console.error("Error analyzing labs:", error);
      throw error;
    }
  }

  // Upload document
  async uploadDocument(
    file: File,
    documentType: string = "lab_report",
    patientId: string = "demo-patient-001"
  ): Promise<any> {
    try {
      console.log("Uploading document:", {
        filename: file.name,
        type: documentType,
        patientId,
      });

      const data = await api.upload(API_ENDPOINTS.UPLOAD, file, {
        document_type: documentType,
        patient_id: patientId,
      });

      return data;
    } catch (error) {
      console.error("Error uploading document:", error);
      throw error;
    }
  }

  // Get patient documents
  async getPatientDocuments(patientId: string = "demo-patient-001"): Promise<{
    patient_id: string;
    documents: Document[];
    count: number;
    timestamp: string;
  }> {
    try {
      console.log("Fetching documents for patient:", patientId);
      const data = await api.get(API_ENDPOINTS.GET_DOCUMENTS(patientId));
      return data;
    } catch (error) {
      console.error("Error fetching documents:", error);
      throw error;
    }
  }

  // Generate chart
  async generateChart(chartType: string = "blood_work"): Promise<ChartData> {
    try {
      console.log("Generating chart:", chartType);
      const data = await api.get(API_ENDPOINTS.GENERATE_CHART, {
        chart_type: chartType,
      });
      return data;
    } catch (error) {
      console.error("Error generating chart:", error);
      throw error;
    }
  }

  // Get patient summary
  async getPatientSummary(
    patientId: string = "demo-patient-001"
  ): Promise<PatientSummary> {
    try {
      console.log("Fetching patient summary:", patientId);
      const data = await api.get(API_ENDPOINTS.PATIENT_SUMMARY(patientId));
      return data;
    } catch (error) {
      console.error("Error fetching patient summary:", error);
      throw error;
    }
  }

  // Demo analysis
  async demoAnalyze(): Promise<any> {
    try {
      console.log("Running demo analysis...");
      const data = await api.post(API_ENDPOINTS.DEMO_ANALYZE);
      return data;
    } catch (error) {
      console.error("Error in demo analysis:", error);
      throw error;
    }
  }

  // Test API connection
  async testConnection(): Promise<boolean> {
    try {
      const response = await api.get(API_ENDPOINTS.HEALTH);
      return response.status === "healthy";
    } catch (error) {
      console.error("API Connection test failed:", error);
      return false;
    }
  }
}

// Create singleton instance
export const medicalService = new MedicalService();

// Export all services
export default medicalService;
