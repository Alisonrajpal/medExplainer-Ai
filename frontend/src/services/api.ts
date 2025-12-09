// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";
const API_PREFIX = process.env.REACT_APP_API_PREFIX || "";

export const API_URL = `${API_BASE_URL}${API_PREFIX}`;

console.log("API Configuration:", { API_BASE_URL, API_PREFIX, API_URL });

// Headers configuration
const getHeaders = (contentType: string = "application/json"): HeadersInit => {
  const headers: HeadersInit = {
    "Content-Type": contentType,
  };

  // Add authorization token if available
  const token = localStorage.getItem("mediclinic_access_token");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};

// Error handler
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    try {
      const errorData = await response.json();
      throw {
        status: response.status,
        message:
          errorData.detail ||
          errorData.message ||
          errorData.error ||
          "API request failed",
        data: errorData,
      };
    } catch {
      throw {
        status: response.status,
        message: response.statusText || "Unknown error",
      };
    }
  }

  // Handle empty responses
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  } else {
    return response.text();
  }
};

// API Client
class ApiClient {
  // Generic request method
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = endpoint.startsWith("http")
      ? endpoint
      : `${API_URL}${endpoint}`;

    console.log("API Request:", { url, method: options.method || "GET" });

    const defaultOptions: RequestInit = {
      headers: getHeaders(),
      credentials: "include",
    };

    const config = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await handleResponse(response);
      console.log("API Response:", { url, status: response.status, data });
      return data as T;
    } catch (error: any) {
      console.error("API Request Error:", { url, error });

      // Enhanced error handling
      const enhancedError = {
        ...error,
        url,
        timestamp: new Date().toISOString(),
      };

      throw enhancedError;
    }
  }

  // GET request
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const queryString = params
      ? `?${new URLSearchParams(params).toString()}`
      : "";
    return this.request<T>(`${endpoint}${queryString}`, {
      method: "GET",
    });
  }

  // POST request
  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: "DELETE",
    });
  }

  // File upload
  async upload<T>(
    endpoint: string,
    file: File,
    additionalData: Record<string, any> = {}
  ): Promise<T> {
    const formData = new FormData();
    formData.append("file", file);

    // Append additional data
    Object.entries(additionalData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    return this.request<T>(endpoint, {
      method: "POST",
      body: formData,
      headers: {
        // Don't set Content-Type for FormData, browser will set it with boundary
        Authorization: `Bearer ${localStorage.getItem(
          "mediclinic_access_token"
        )}`,
      },
    });
  }
}

// Create singleton instance
export const api = new ApiClient();

// Health check
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/health`);
    return response.ok;
  } catch (error) {
    console.error("API Health Check Failed:", error);
    return false;
  }
};

// API Endpoints
export const API_ENDPOINTS = {
  // Basic
  ROOT: "/",
  HEALTH: "/health",
  API_HEALTH: "/api/health",

  // Demo
  DEMO_DATA: "/demo/data",
  DEMO_ANALYZE: "/demo/analyze",

  // Medical AI
  EXPLAIN: "/api/explain",
  ANALYZE_LABS: "/api/analyze/labs",

  // Documents
  UPLOAD: "/api/upload",
  GET_DOCUMENTS: (patientId: string) => `/api/documents/${patientId}`,

  // Charts & Analysis
  GENERATE_CHART: "/api/chart",
  PATIENT_SUMMARY: (patientId: string) => `/api/patient/${patientId}/summary`,
};

// Test API connection
export const testApiConnection = async (): Promise<{
  success: boolean;
  message: string;
  data?: any;
}> => {
  try {
    const response = await api.get(API_ENDPOINTS.ROOT);
    return {
      success: true,
      message: "API connection successful",
      data: response,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to connect to API",
      data: error,
    };
  }
};
