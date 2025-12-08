import React, { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Download,
  Filter,
  RefreshCw,
  Zap,
  PieChart,
  LineChart as LineChartIcon,
  Activity,
  Clock,
} from "lucide-react";
import Header from "../components/layout/Header";
import MobileNav from "../components/layout/MobileNav";
import LabResults from "../components/medical/LabResults";

const Analysis: React.FC = () => {
  const [activeTab, setActiveTab] = useState("lab");
  const [loading, setLoading] = useState(false);

  const tabs = [
    { id: "lab", label: "Lab Analysis", icon: BarChart3 },
    { id: "trends", label: "Trends", icon: TrendingUp },
    { id: "insights", label: "AI Insights", icon: Zap },
    { id: "reports", label: "Reports", icon: PieChart },
  ];

  const healthMetrics = [
    {
      name: "Overall Health Score",
      value: 85,
      unit: "/100",
      trend: "+2%",
      color: "text-green-600",
    },
    {
      name: "Cardiovascular Risk",
      value: 12,
      unit: "%",
      trend: "-1%",
      color: "text-blue-600",
    },
    {
      name: "Diabetes Control",
      value: 78,
      unit: "/100",
      trend: "+5%",
      color: "text-purple-600",
    },
    {
      name: "Medication Adherence",
      value: 95,
      unit: "%",
      trend: "+3%",
      color: "text-teal-600",
    },
  ];

  const recentAlerts = [
    {
      id: 1,
      type: "warning",
      title: "Elevated LDL Cholesterol",
      time: "2 days ago",
      test: "LDL: 135 mg/dL",
    },
    {
      id: 2,
      type: "info",
      title: "HbA1c Improving",
      time: "1 week ago",
      test: "HbA1c: 5.4%",
    },
    {
      id: 3,
      type: "success",
      title: "Blood Pressure Normalized",
      time: "2 weeks ago",
      test: "BP: 122/78 mmHg",
    },
  ];

  const handleRefreshData = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleExportReport = () => {
    // Export functionality
    alert("Exporting comprehensive health report...");
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">
                  Health Analysis
                </h1>
                <p className="text-teal-100 opacity-90">
                  Comprehensive analysis of your health metrics and trends
                </p>
              </div>
              <div className="mt-4 md:mt-0 flex items-center gap-3">
                <button
                  onClick={handleRefreshData}
                  disabled={loading}
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2">
                  {loading ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <RefreshCw className="w-5 h-5" />
                  )}
                  Refresh Data
                </button>
                <button
                  onClick={handleExportReport}
                  className="bg-white text-teal-600 hover:bg-teal-50 px-4 py-2 rounded-xl font-semibold flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Export Report
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex overflow-x-auto scrollbar-hide space-x-1 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all ${
                    activeTab === tab.id
                      ? "bg-teal-50 text-teal-700 border border-teal-200"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}>
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {healthMetrics.map((metric, index) => (
            <div key={index} className="medical-card">
              <div className="flex items-start justify-between">
                <div className={`p-2.5 rounded-lg bg-gray-50`}>
                  <Activity className={`w-6 h-6 ${metric.color}`} />
                </div>
                <span
                  className={`text-sm font-medium ${
                    metric.trend.startsWith("+")
                      ? "text-green-600"
                      : "text-red-600"
                  }`}>
                  {metric.trend}
                </span>
              </div>
              <div className="mt-4">
                <div className="text-2xl font-bold text-gray-900">
                  {metric.value}
                  <span className="text-lg text-gray-500">{metric.unit}</span>
                </div>
                <div className="text-sm text-gray-500 mt-1">{metric.name}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "lab" && <LabResults />}

        {activeTab === "trends" && (
          <div className="medical-card">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Health Trends
            </h2>
            <div className="text-center py-12">
              <LineChartIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Trend Analysis
              </h3>
              <p className="text-gray-600">
                Comprehensive trend analysis coming soon
              </p>
            </div>
          </div>
        )}

        {activeTab === "insights" && (
          <div className="medical-card">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              AI Health Insights
            </h2>
            <div className="text-center py-12">
              <Zap className="w-16 h-16 text-yellow-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                AI-Powered Insights
              </h3>
              <p className="text-gray-600 mb-4">
                Personalized health insights powered by Llama 3.2
              </p>
              <button className="btn-primary">Generate AI Insights</button>
            </div>
          </div>
        )}

        {activeTab === "reports" && (
          <div className="medical-card">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Health Reports
            </h2>
            <div className="text-center py-12">
              <PieChart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Comprehensive Reports
              </h3>
              <p className="text-gray-600">
                Detailed health reports and summaries
              </p>
            </div>
          </div>
        )}

        {/* Recent Alerts */}
        <div className="medical-card mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Recent Health Alerts
          </h2>
          <div className="space-y-4">
            {recentAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-xl border ${
                  alert.type === "warning"
                    ? "border-yellow-200 bg-yellow-50"
                    : alert.type === "info"
                    ? "border-blue-200 bg-blue-50"
                    : "border-green-200 bg-green-50"
                }`}>
                <div className="flex items-start gap-4">
                  <div
                    className={`p-2 rounded-lg ${
                      alert.type === "warning"
                        ? "bg-yellow-100 text-yellow-600"
                        : alert.type === "info"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-green-100 text-green-600"
                    }`}>
                    {alert.type === "warning" ? (
                      <AlertTriangle className="w-5 h-5" />
                    ) : alert.type === "info" ? (
                      <Activity className="w-5 h-5" />
                    ) : (
                      <CheckCircle className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {alert.title}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {alert.test}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    {alert.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <MobileNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Analysis;
