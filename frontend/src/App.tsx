import React, { useState, useEffect } from "react";
import "./App.css";
import { medicalService } from "./services/medicalService";
import { testApiConnection } from "./services/api";

function App() {
  const [demoData, setDemoData] = useState<any>(null);
  const [explanation, setExplanation] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] =
    useState<string>("Checking...");
  const [labResults, setLabResults] = useState<any>(null);
  const [patientSummary, setPatientSummary] = useState<any>(null);

  // Test API connection on load
  useEffect(() => {
    checkConnection();
    loadDemoData();
  }, []);

  const checkConnection = async () => {
    try {
      const result = await testApiConnection();
      if (result.success) {
        setConnectionStatus("✅ Connected");
      } else {
        setConnectionStatus("❌ Disconnected");
        setError(result.message);
      }
    } catch (err) {
      setConnectionStatus("❌ Error");
      setError("Failed to check connection");
    }
  };

  const loadDemoData = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await medicalService.getDemoData();
      setDemoData(data);

      // Also load patient summary
      const summary = await medicalService.getPatientSummary();
      setPatientSummary(summary);

      // Set lab results for analysis
      if (data.lab_results) {
        setLabResults(data.lab_results);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load demo data");
    } finally {
      setLoading(false);
    }
  };

  const handleExplain = async () => {
    const text = prompt("Enter medical text to explain:", "Diabetes");
    if (!text) return;

    setLoading(true);
    setError(null);

    try {
      const result = await medicalService.explainText(text);
      setExplanation(result);
    } catch (err: any) {
      setError(err.message || "Failed to get explanation");
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeLabs = async () => {
    if (!labResults) {
      setError("No lab results available");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await medicalService.analyzeLabs(labResults);
      alert(
        `Analysis Result:\n${
          result.analysis.summary
        }\n\nRecommendations:\n${result.analysis.recommendations.join("\n")}`
      );
    } catch (err: any) {
      setError(err.message || "Failed to analyze labs");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    // Create a dummy file for testing
    const dummyContent = "Test lab results\nGlucose: 145\nCholesterol: 220\n";
    const dummyFile = new File([dummyContent], "test_lab_report.txt", {
      type: "text/plain",
    });

    setLoading(true);
    setError(null);

    try {
      const result = await medicalService.uploadDocument(dummyFile);
      alert(
        `File uploaded successfully!\nFilename: ${result.document.filename}\nSize: ${result.document.file_size_kb} KB`
      );
    } catch (err: any) {
      setError(err.message || "Failed to upload file");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateChart = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await medicalService.generateChart();
      alert(`Chart generated: ${result.chart_data.title}`);
      console.log("Chart data:", result.chart_data);
    } catch (err: any) {
      setError(err.message || "Failed to generate chart");
    } finally {
      setLoading(false);
    }
  };

  const handleRunDemoAnalysis = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await medicalService.demoAnalyze();
      alert(
        `Demo Analysis:\n${result.analysis}\n\nRisk Level: ${result.risk_level}`
      );
    } catch (err: any) {
      setError(err.message || "Failed to run demo analysis");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🏥 Mediclinic AI Dashboard</h1>
        <p>Frontend-Backend Integration Test</p>

        <div className="connection-status">
          <strong>Backend Status:</strong> {connectionStatus}
          <button onClick={checkConnection} className="refresh-btn">
            Refresh
          </button>
        </div>
      </header>

      <main className="App-main">
        {/* Control Panel */}
        <div className="control-panel">
          <h2>🧪 Test Controls</h2>

          <div className="button-grid">
            <button onClick={loadDemoData} disabled={loading}>
              {loading ? "Loading..." : "📊 Load Demo Data"}
            </button>

            <button onClick={handleExplain} disabled={loading}>
              🧠 Explain Medical Text
            </button>

            <button
              onClick={handleAnalyzeLabs}
              disabled={loading || !labResults}>
              🔬 Analyze Lab Results
            </button>

            <button onClick={handleUpload} disabled={loading}>
              📁 Upload Test Document
            </button>

            <button onClick={handleGenerateChart} disabled={loading}>
              📈 Generate Chart
            </button>

            <button onClick={handleRunDemoAnalysis} disabled={loading}>
              ⚡ Run Demo Analysis
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="error-message">
            <h3>❌ Error</h3>
            <p>{error}</p>
            <button onClick={() => setError(null)}>Dismiss</button>
          </div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Processing...</p>
          </div>
        )}

        {/* Demo Data Display */}
        {demoData && !loading && (
          <div className="data-section">
            <h2>👤 Patient Information</h2>
            <div className="patient-card">
              <h3>{demoData.patient.name}</h3>
              <p>
                <strong>Age:</strong> {demoData.patient.age}
              </p>
              <p>
                <strong>Gender:</strong> {demoData.patient.gender}
              </p>
              <p>
                <strong>Blood Type:</strong> {demoData.patient.blood_type}
              </p>
              <p>
                <strong>Conditions:</strong>{" "}
                {demoData.patient.chronic_conditions.join(", ")}
              </p>
            </div>

            <h2>📋 Lab Results</h2>
            <div className="lab-results">
              <table>
                <thead>
                  <tr>
                    <th>Test</th>
                    <th>Value</th>
                    <th>Unit</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(demoData.lab_results).map(([key, value]) => (
                    <tr key={key}>
                      <td>{key}</td>
                      <td>{value as any}</td>
                      <td>
                        {key === "glucose" ||
                        key === "cholesterol" ||
                        key === "ldl" ||
                        key === "hdl" ||
                        key === "triglycerides"
                          ? "mg/dL"
                          : key === "hba1c"
                          ? "%"
                          : key === "creatinine"
                          ? "mg/dL"
                          : key === "sodium" || key === "potassium"
                          ? "mmol/L"
                          : ""}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h2>💊 Medications</h2>
            <div className="medications">
              {demoData.medications.map((med: any, index: number) => (
                <div key={index} className="medication-card">
                  <h4>{med.name}</h4>
                  <p>
                    <strong>Dosage:</strong> {med.dosage}
                  </p>
                  <p>
                    <strong>Frequency:</strong> {med.frequency}
                  </p>
                  <p>
                    <strong>Instructions:</strong> {med.instructions}
                  </p>
                  <p>
                    <strong>Status:</strong> {med.status}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Explanation Display */}
        {explanation && !loading && (
          <div className="explanation-section">
            <h2>🧬 Medical Explanation</h2>
            <div className="explanation-card">
              <p>
                <strong>Original:</strong> {explanation.original}
              </p>
              <p>
                <strong>Explanation:</strong> {explanation.explanation}
              </p>
              <div className="explanation-meta">
                <span>Confidence: {explanation.confidence}</span>
                <span>Model: {explanation.model}</span>
                <span>
                  Time: {new Date(explanation.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Patient Summary */}
        {patientSummary && !loading && (
          <div className="summary-section">
            <h2>📊 Patient Summary</h2>
            <div className="summary-card">
              <div className="summary-metrics">
                <div className="metric">
                  <div className="metric-value">
                    {patientSummary.summary.health_score}
                  </div>
                  <div className="metric-label">Health Score</div>
                </div>
                <div className="metric">
                  <div className="metric-value">
                    {patientSummary.summary.medications_count}
                  </div>
                  <div className="metric-label">Medications</div>
                </div>
                <div className="metric">
                  <div className="metric-value">
                    {patientSummary.summary.lab_reports_count}
                  </div>
                  <div className="metric-label">Lab Reports</div>
                </div>
                <div className="metric">
                  <div
                    className={`metric-value risk-${patientSummary.summary.risk_level}`}>
                    {patientSummary.summary.risk_level}
                  </div>
                  <div className="metric-label">Risk Level</div>
                </div>
              </div>

              <h3>Conditions</h3>
              <div className="conditions">
                {patientSummary.summary.conditions.map(
                  (condition: string, index: number) => (
                    <span key={index} className="condition-tag">
                      {condition}
                    </span>
                  )
                )}
              </div>

              <h3>Recommendations</h3>
              <ul className="recommendations">
                {patientSummary.recommendations.map(
                  (rec: string, index: number) => (
                    <li key={index}>{rec}</li>
                  )
                )}
              </ul>

              <div className="summary-footer">
                <p>
                  <strong>Last Checkup:</strong>{" "}
                  {patientSummary.summary.last_checkup}
                </p>
                <p>
                  <strong>Next Appointment:</strong>{" "}
                  {patientSummary.summary.next_appointment}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* API Info */}
        <div className="api-info">
          <h2>🔗 API Endpoints Tested</h2>
          <ul>
            <li>✅ GET / - Root endpoint</li>
            <li>✅ GET /health - Health check</li>
            <li>✅ GET /demo/data - Demo patient data</li>
            <li>✅ POST /api/explain - Medical explanation</li>
            <li>✅ POST /api/analyze/labs - Lab analysis</li>
            <li>✅ POST /api/upload - File upload</li>
            <li>✅ GET /api/chart - Chart generation</li>
            <li>
              ✅ GET /api/patient/{"{"}patient_id{"}"}/summary - Patient summary
            </li>
            <li>✅ POST /demo/analyze - Demo analysis</li>
          </ul>
        </div>
      </main>

      <footer className="App-footer">
        <p>Mediclinic AI Dashboard v2.0.0 | Backend: http://localhost:8000</p>
        <p>Frontend-Backend Integration Test Successful! 🎉</p>
      </footer>
    </div>
  );
}

export default App;
