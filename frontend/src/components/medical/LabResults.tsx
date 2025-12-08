import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Download,
  Filter,
  RefreshCw,
  Eye,
  Share2,
  Zap
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import ApiService from '../../services/api';
import LocalStorageService from '../../services/localStorage';
import toast from 'react-hot-toast';

const LabResults: React.FC = () => {
  const [labData, setLabData] = useState<any[]>([]);
  const [selectedTest, setSelectedTest] = useState<string>('glucose');
  const [timeRange, setTimeRange] = useState<string>('6m');
  const [loading, setLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);

  useEffect(() => {
    loadLabData();
  }, [timeRange]);

  const loadLabData = async () => {
    setLoading(true);
    try {
      const data = LocalStorageService.getLabResults();
      setLabData(data);
      
      // Get latest lab results for AI analysis
      if (data.length > 0) {
        const latestResults = data[data.length - 1];
        const analysis = await ApiService.analyzeLabResults(latestResults);
        setAiAnalysis(analysis);
      }
    } catch (error) {
      toast.error('Error loading lab data');
    } finally {
      setLoading(false);
    }
  };

  const generateMockLabData = () => {
    const today = new Date();
    const data = [];
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date(today);
      date.setMonth(date.getMonth() - i);
      
      data.push({
        date: date.toISOString().split('T')[0],
        glucose: 85 + Math.random() * 40,
        hba1c: 5.0 + Math.random() * 2.5,
        cholesterol: 150 + Math.random() * 100,
        ldl: 70 + Math.random() * 80,
        hdl: 40 + Math.random() * 30,
        triglycerides: 100 + Math.random() * 150,
        creatinine: 0.8 + Math.random() * 0.4,
        bun: 10 + Math.random() * 10,
        sodium: 138 + Math.random() * 4,
        potassium: 4.0 + Math.random() * 0.8,
      });
    }
    
    return data;
  };

  const getLatestValues = () => {
    if (labData.length === 0) return {};
    const latest = labData[labData.length - 1];
    
    // Categorize each value
    const categorized = Object.keys(latest).map(key => {
      if (key === 'date') return null;
      
      const value = latest[key];
      let status = 'normal';
      let color = 'green';
      
      // Define reference ranges
      const ranges: Record<string, { min: number; max: number }> = {
        glucose: { min: 70, max: 100 },
        hba1c: { min: 4.0, max: 5.6 },
        cholesterol: { min: 125, max: 200 },
        ldl: { min: 0, max: 100 },
        hdl: { min: 40, max: 60 },
        triglycerides: { min: 0, max: 150 },
        creatinine: { min: 0.6, max: 1.2 },
        bun: { min: 7, max: 20 },
        sodium: { min: 135, max: 145 },
        potassium: { min: 3.5, max: 5.0 },
      };
      
      if (ranges[key]) {
        const { min, max } = ranges[key];
        if (value < min * 0.8 || value > max * 1.3) {
          status = 'critical';
          color = 'red';
        } else if (value < min * 0.9 || value > max * 1.2) {
          status = 'slightly_critical';
          color = 'orange';
        } else {
          status = 'normal';
          color = 'green';
        }
      }
      
      return {
        test: key,
        value: value,
        unit: getUnit(key),
        status,
        color,
        reference: ranges[key] ? `${ranges[key].min}-${ranges[key].max}` : 'N/A'
      };
    }).filter(Boolean);
    
    return categorized;
  };

  const getUnit = (test: string) => {
    const units: Record<string, string> = {
      glucose: 'mg/dL',
      hba1c: '%',
      cholesterol: 'mg/dL',
      ldl: 'mg/dL',
      hdl: 'mg/dL',
      triglycerides: 'mg/dL',
      creatinine: 'mg/dL',
      bun: 'mg/dL',
      sodium: 'mmol/L',
      potassium: 'mmol/L',
    };
    return units[test] || '';
  };

  const formatTestName = (test: string) => {
    return test
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase());
  };

  const latestValues = getLatestValues();
  const filteredData = timeRange === 'all' ? labData : labData.slice(-parseInt(timeRange));

  // Chart data for selected test
  const chartData = filteredData.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
    value: item[selectedTest],
    referenceMin: getReferenceRange(selectedTest).min,
    referenceMax: getReferenceRange(selectedTest).max,
  }));

  const getReferenceRange = (test: string) => {
    const ranges: Record<string, { min: number; max: number }> = {
      glucose: { min: 70, max: 100 },
      hba1c: { min: 4.0, max: 5.6 },
      cholesterol: { min: 125, max: 200 },
      ldl: { min: 0, max: 100 },
      hdl: { min: 40, max: 60 },
      triglycerides: { min: 0, max: 150 },
    };
    return ranges[test] || { min: 0, max: 100 };
  };

  const testOptions = [
    { id: 'glucose', label: 'Glucose', color: '#3b82f6' },
    { id: 'hba1c', label: 'HbA1c', color: '#8b5cf6' },
    { id: 'cholesterol', label: 'Cholesterol', color: '#10b981' },
    { id: 'ldl', label: 'LDL', color: '#ef4444' },
    { id: 'hdl', label: 'HDL', color: '#f59e0b' },
    { id: 'triglycerides', label: 'Triglycerides', color: '#ec4899' },
  ];

  const timeRanges = [
    { id: '3m', label: '3 Months' },
    { id: '6m', label: '6 Months' },
    { id: '1y', label: '1 Year' },
    { id: 'all', label: 'All Time' },
  ];

  const handleAnalyzeWithAI = async () => {
    if (labData.length === 0) {
      toast.error('No lab data to analyze');
      return;
    }
    
    setLoading(true);
    try {
      const latestResults = labData[labData.length - 1];
      const analysis = await ApiService.analyzeLabResults(latestResults);
      setAiAnalysis(analysis);
      toast.success('AI analysis completed!');
    } catch (error) {
      toast.error('AI analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = () => {
    const csv = convertToCSV(labData);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lab-results.csv';
    a.click();
    toast.success('Data exported!');
  };

  const convertToCSV = (data: any[]) => {
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).join(','));
    return [headers, ...rows].join('\n');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'normal':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'slightly_critical':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'critical':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'bg-green-100 text-green-800';
      case 'slightly_critical':
        return 'bg-orange-100 text-orange-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="medical-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-700 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <span>Lab Results Analysis</span>
            </h1>
            <p className="text-gray-600 mt-2">
              Visualize and analyze your blood work with AI-powered insights
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleAnalyzeWithAI}
              disabled={loading}
              className="btn-primary flex items-center gap-2"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Zap className="w-4 h-4" />
              )}
              Analyze with AI
            </button>
          </div>
        </div>
      </div>

      {/* AI Analysis Summary */}
      {aiAnalysis && (
        <div className="medical-card bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-600" />
                AI Analysis Summary
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                Powered by Llama 3.2 • {new Date(aiAnalysis.analyzed_at).toLocaleDateString()}
              </p>
            </div>
            <button className="p-2 hover:bg-white rounded-lg transition-colors">
              <Share2 className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-white/80 rounded-xl border border-blue-100">
              <div className="text-gray-800 whitespace-pre-line leading-relaxed">
                {aiAnalysis.analysis?.slice(0, 300)}...
              </div>
              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-2">
                Read full analysis
              </button>
            </div>
            
            {/* Categorization */}
            {aiAnalysis.categorization && Object.keys(aiAnalysis.categorization).length > 0 && (
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Risk Categorization:</h4>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(aiAnalysis.categorization).map(([test, data]: [string, any]) => (
                    <div
                      key={test}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                        data.level === 'critical' ? 'bg-red-100 text-red-800' :
                        data.level === 'slightly_critical' ? 'bg-orange-100 text-orange-800' :
                        'bg-green-100 text-green-800'
                      }`}
                    >
                      {formatTestName(test)}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Latest Results Grid */}
      <div className="medical-card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Latest Results</h2>
          <div className="flex items-center gap-3">
            <button className="btn-secondary flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button
              onClick={handleExportData}
              className="btn-primary flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {latestValues.slice(0, 10).map((item: any, index) => (
            <div
              key={index}
              className={`p-4 rounded-xl border ${
                item.status === 'critical' ? 'border-red-200 bg-red-50' :
                item.status === 'slightly_critical' ? 'border-orange-200 bg-orange-50' :
                'border-green-200 bg-green-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-gray-700">{formatTestName(item.test)}</div>
                {getStatusIcon(item.status)}
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {item.value.toFixed(1)}
                <span className="text-sm font-normal text-gray-500 ml-1">{item.unit}</span>
              </div>
              <div className="text-xs text-gray-500">
                Ref: {item.reference} {item.unit}
              </div>
              <div className={`text-xs mt-2 px-2 py-1 rounded-full inline-block ${
                item.status === 'critical' ? 'bg-red-100 text-red-800' :
                item.status === 'slightly_critical' ? 'bg-orange-100 text-orange-800' :
                'bg-green-100 text-green-800'
              }`}>
                {item.status.replace('_', ' ')}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Test Selection */}
        <div className="medical-card">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Select Test to Visualize</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {testOptions.map((test) => (
              <button
                key={test.id}
                onClick={() => setSelectedTest(test.id)}
                className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                  selectedTest === test.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div
                  className="w-8 h-8 rounded-full mb-2"
                  style={{ backgroundColor: test.color }}
                ></div>
                <span className="text-sm font-medium text-gray-700">{test.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Time Range Selection */}
        <div className="medical-card">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Time Range</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {timeRanges.map((range) => (
              <button
                key={range.id}
                onClick={() => setTimeRange(range.id)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  timeRange === range.id
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className="font-medium">{range.label}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chart */}
      <div className="medical-card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {formatTestName(selectedTest)} Trend
          </h2>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Eye className="w-5 h-5 text-gray-500" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Download className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                label={{ 
                  value: getUnit(selectedTest), 
                  angle: -90, 
                  position: 'insideLeft',
                  offset: -10
                }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.75rem',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
                formatter={(value: number) => [
                  `${value.toFixed(1)} ${getUnit(selectedTest)}`,
                  formatTestName(selectedTest)
                ]}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6, strokeWidth: 2 }}
                name="Actual Value"
              />
              <Line
                type="monotone"
                dataKey="referenceMax"
                stroke="#ef4444"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Upper Limit"
              />
              <Line
                type="monotone"
                dataKey="referenceMin"
                stroke="#10b981"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Lower Limit"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Additional Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart for Overall Health */}
        <div className="medical-card">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Health Profile Radar</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={latestValues.slice(0, 6)}>
                <PolarGrid />
                <PolarAngleAxis dataKey="test" />
                <PolarRadiusAxis />
                <Radar
                  name="Your Levels"
                  dataKey="value"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="medical-card">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Status Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Normal', value: latestValues.filter((v: any) => v.status === 'normal').length, color: '#10b981' },
                    { name: 'Slightly Critical', value: latestValues.filter((v: any) => v.status === 'slightly_critical').length, color: '#f59e0b' },
                    { name: 'Critical', value: latestValues.filter((v: any) => v.status === 'critical').length, color: '#ef4444' },
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  <Cell fill="#10b981" />
                  <Cell fill="#f59e0b" />
                  <Cell fill="#ef4444" />
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {aiAnalysis && aiAnalysis.recommendations && (
        <div className="medical-card bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            AI Recommendations
          </h3>
          <div className="space-y-3">
            {aiAnalysis.recommendations.slice(0, 5).map((rec: string, index: number) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-white/80 rounded-xl">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 font-semibold">{index + 1}</span>
                </div>
                <div className="text-gray-700">{rec}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LabResults;