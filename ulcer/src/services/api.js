// API Service for connecting to Spring Boot backend
import config from '../config';

const API_BASE_URL = config.API_BASE_URL;

// Track backend connection status
let backendStatus = {
  isOnline: true,
  lastChecked: null,
  error: null,
};

// Generic fetch wrapper with error handling
const fetchAPI = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    signal: AbortSignal.timeout(5000), // 5 second timeout
  };

  try {
    console.log(`🌐 API Request: ${options.method || 'GET'} ${url}`);
    
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    // Handle empty response (e.g., DELETE)
    const text = await response.text();
    const data = text ? JSON.parse(text) : null;
    
    // Update backend status to online
    backendStatus.isOnline = true;
    backendStatus.lastChecked = new Date();
    backendStatus.error = null;
    
    console.log(`✅ API Response: ${endpoint}`, data);
    return data;
    
  } catch (error) {
    // Update backend status to offline
    backendStatus.isOnline = false;
    backendStatus.lastChecked = new Date();
    backendStatus.error = error.message;
    
    console.error(`❌ API Error [${endpoint}]:`, error.message);
    
    // Provide helpful error messages
    if (error.name === 'AbortError' || error.message.includes('fetch')) {
      throw new Error('Backend server is not responding. Please check if Spring Boot is running on http://localhost:8080');
    }
    
    throw error;
  }
};

// ==================== Patient API ====================

export const patientAPI = {
  // GET /api/patients - Get all patients
  getAll: async () => {
    try {
      return await fetchAPI('/patients');
    } catch (error) {
      console.error('Failed to fetch patients from backend:', error.message);
      throw error;
    }
  },

  // GET /api/patients/{id} - Get single patient by ID
  getById: async (id) => {
    try {
      return await fetchAPI(`/patients/${id}`);
    } catch (error) {
      console.error(`Failed to fetch patient ${id} from backend:`, error.message);
      throw error;
    }
  },

  // POST /api/patients - Create new patient
  create: async (patientData) => {
    try {
      return await fetchAPI('/patients', {
        method: 'POST',
        body: JSON.stringify(patientData),
      });
    } catch (error) {
      console.error('Failed to create patient on backend:', error.message);
      throw error;
    }
  },

  // PUT /api/patients/{id} - Update patient
  update: async (id, patientData) => {
    try {
      return await fetchAPI(`/patients/${id}`, {
        method: 'PUT',
        body: JSON.stringify(patientData),
      });
    } catch (error) {
      console.error(`Failed to update patient ${id} on backend:`, error.message);
      throw error;
    }
  },

  // DELETE /api/patients/{id} - Delete patient
  delete: async (id) => {
    try {
      return await fetchAPI(`/patients/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error(`Failed to delete patient ${id} on backend:`, error.message);
      throw error;
    }
  },

  // Health check
  healthCheck: async () => {
    try {
      await fetchAPI('/patients');
      return { online: true, error: null };
    } catch (error) {
      return { online: false, error: error.message };
    }
  },
};

// ==================== LLM API ====================

export const llmAPI = {
  // POST /api/care-recommendations - Get AI care recommendations
  getCareRecommendations: async (prompt, patientData, maxTokens = 200, language = 'ko') => {
    try {
      return await fetchAPI('/care-recommendations', {
        method: 'POST',
        body: JSON.stringify({
          prompt,
          patient_data: patientData,
          max_tokens: maxTokens,
          language,
        }),
      });
    } catch (error) {
      console.error('Failed to get care recommendations from backend:', error.message);
      throw error;
    }
  },

  // GET external LLM pressure ulcer prediction (DIRECT - Simple fetch)
  getPressureUlcerPrediction: async (patientId) => {
    // Direct call to external API - simple fetch
    const API_URL = `http://jvision.s2x.kr:8030/api/ai/pressure-ulcer/predict/latest/${patientId}`;
    
    try {
      console.log(`🌐 Fetching AI prediction for patient ${patientId}...`);
      console.log(`📍 URL: ${API_URL}`);
      
      const response = await fetch(API_URL);

      console.log(`📡 Response status: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ AI Prediction received:', data);
      console.log(`📊 Risk Level: ${data.riskLevel}`);
      console.log(`📝 Message: ${data.predictionMessage}`);
      
      return {
        patientId: data.patientId,
        riskLevel: data.riskLevel,
        predictionMessage: data.predictionMessage,
      };
    } catch (error) {
      console.error(`❌ Failed to get AI prediction for patient ${patientId}:`, error);
      throw error;
    }
  },
};

// Get backend status
export const getBackendStatus = () => backendStatus;

// Test backend connection
export const testBackendConnection = async () => {
  console.log('🔍 Testing backend connection...');
  const status = await patientAPI.healthCheck();
  if (status.online) {
    console.log('✅ Backend is online');
  } else {
    console.log('❌ Backend is offline:', status.error);
  }
  return status;
};

const api = {
  patient: patientAPI,
  llm: llmAPI,
  getBackendStatus,
  testBackendConnection,
};

export default api;
