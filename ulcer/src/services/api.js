// API Service for connecting to Spring Boot backend

const API_BASE_URL = 'http://localhost:8080/api';

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
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API Error: ${response.status}`);
    }

    // Handle empty response (e.g., DELETE)
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
};

// ==================== Patient API ====================

export const patientAPI = {
  // GET /api/patients - Get all patients
  getAll: async () => {
    return fetchAPI('/patients');
  },

  // GET /api/patients/{id} - Get single patient by ID
  getById: async (id) => {
    return fetchAPI(`/patients/${id}`);
  },

  // POST /api/patients - Create new patient
  create: async (patientData) => {
    return fetchAPI('/patients', {
      method: 'POST',
      body: JSON.stringify(patientData),
    });
  },

  // PUT /api/patients/{id} - Update patient
  update: async (id, patientData) => {
    return fetchAPI(`/patients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(patientData),
    });
  },

  // DELETE /api/patients/{id} - Delete patient
  delete: async (id) => {
    return fetchAPI(`/patients/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==================== LLM API ====================

export const llmAPI = {
  // POST /api/care-recommendations - Get AI care recommendations
  getCareRecommendations: async (prompt, patientData, maxTokens = 200, language = 'ko') => {
    return fetchAPI('/care-recommendations', {
      method: 'POST',
      body: JSON.stringify({
        prompt,
        patient_data: patientData,
        max_tokens: maxTokens,
        language,
      }),
    });
  },
};

export default {
  patient: patientAPI,
  llm: llmAPI,
};

