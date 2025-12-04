// Patient data layer - connects to Spring Boot backend with offline fallback
import { patientAPI } from '../services/api';
import config from '../config';

// ==================== Configuration ====================
// Track offline mode status
let USE_OFFLINE_MODE = false;
let backendConnectionAttempted = false;

// ==================== Braden Scale Descriptions ====================
export const bradenScaleDescriptions = {
  sensory_perception: {
    label: 'Sensory Perception',
    labelKr: '감각 인지',
    options: [
      { value: 1, label: 'Completely Limited', labelKr: '전혀 없음' },
      { value: 2, label: 'Very Limited', labelKr: '매우 제한적' },
      { value: 3, label: 'Slightly Limited', labelKr: '약간 제한적' },
      { value: 4, label: 'No Impairment', labelKr: '정상' },
    ],
  },
  moisture: {
    label: 'Moisture',
    labelKr: '습기',
    options: [
      { value: 1, label: 'Constantly Moist', labelKr: '항상 축축함' },
      { value: 2, label: 'Often Moist', labelKr: '자주 축축함' },
      { value: 3, label: 'Occasionally Moist', labelKr: '때때로 축축함' },
      { value: 4, label: 'Rarely Moist', labelKr: '거의 건조함' },
    ],
  },
  activity: {
    label: 'Activity',
    labelKr: '활동 정도',
    options: [
      { value: 1, label: 'Bedfast', labelKr: '침대 생활' },
      { value: 2, label: 'Chairfast', labelKr: '의자 생활' },
      { value: 3, label: 'Walks Occasionally', labelKr: '가끔 보행' },
      { value: 4, label: 'Walks Frequently', labelKr: '자주 보행' },
    ],
  },
};

// ==================== Ulcer Constants ====================
export const ulcerStages = [
  { value: null, label: 'None', labelKr: '없음' },
  { value: '1', label: 'Stage 1', labelKr: '1단계' },
  { value: '2', label: 'Stage 2', labelKr: '2단계' },
  { value: '3', label: 'Stage 3', labelKr: '3단계' },
  { value: '4', label: 'Stage 4', labelKr: '4단계' },
  { value: 'DTI', label: 'Deep Tissue Injury', labelKr: '심부조직 손상' },
  { value: 'Unstageable', label: 'Unstageable', labelKr: '단계 미분류' },
];

export const ulcerLocations = [
  'Sacrum', 'Left Heel', 'Right Heel', 'Left Trochanter', 'Right Trochanter',
  'Coccyx', 'Left Ischium', 'Right Ischium', 'Left Elbow', 'Right Elbow', 'Occiput', 'Other',
];

// ==================== Mock Data for Offline Mode ====================
let mockPatientCounter = 7;
let mockPatientsData = [
  {
    id: 1,
    name: '김영희',
    age: 78,
    gender: 'F',
    height_cm: 162.5,
    weight_kg: 58.0,
    blood_pressure: '128/82',
    room_number: '204A',
    diagnosis: '고관절 골절 수술 후',
    notes: '페니실린 알레르기. 이동 시 도움 필요.',
    sensory_perception: 2,
    moisture: 2,
    activity: 1,
    has_ulcer: true,
    ulcer_stage: '1',
    ulcer_location: 'Sacrum',
    created_at: '2024-11-28T08:30:00',
  },
  {
    id: 2,
    name: '이철수',
    age: 65,
    gender: 'M',
    height_cm: 175.0,
    weight_kg: 75.5,
    blood_pressure: '135/85',
    room_number: '118B',
    diagnosis: '폐렴 회복 중',
    notes: '',
    sensory_perception: 3,
    moisture: 2,
    activity: 2,
    has_ulcer: false,
    ulcer_stage: null,
    ulcer_location: null,
    created_at: '2024-12-01T10:15:00',
  },
  {
    id: 3,
    name: '박순자',
    age: 82,
    gender: 'F',
    height_cm: 158.0,
    weight_kg: 60.0,
    blood_pressure: '140/90',
    room_number: '305',
    diagnosis: '뇌졸중, 좌측 편마비',
    notes: '라텍스 알레르기. 낙상 고위험.',
    sensory_perception: 1,
    moisture: 1,
    activity: 1,
    has_ulcer: true,
    ulcer_stage: '2',
    ulcer_location: 'Sacrum, Left Heel',
    created_at: '2024-11-25T14:00:00',
  },
  {
    id: 4,
    name: '정민수',
    age: 71,
    gender: 'M',
    height_cm: 180.0,
    weight_kg: 80.0,
    blood_pressure: '130/80',
    room_number: '112A',
    diagnosis: '당뇨병',
    notes: '',
    sensory_perception: 4,
    moisture: 3,
    activity: 2,
    has_ulcer: false,
    ulcer_stage: null,
    ulcer_location: null,
    created_at: '2024-12-02T09:45:00',
  },
  {
    id: 5,
    name: '최정숙',
    age: 88,
    gender: 'F',
    height_cm: 155.0,
    weight_kg: 55.0,
    blood_pressure: '120/78',
    room_number: '220',
    diagnosis: '경도 치매',
    notes: '자주 방향 감각 상실. 야간 배회.',
    sensory_perception: 3,
    moisture: 2,
    activity: 2,
    has_ulcer: false,
    ulcer_stage: null,
    ulcer_location: null,
    created_at: '2024-11-30T11:20:00',
  },
  {
    id: 6,
    name: '강동호',
    age: 69,
    gender: 'M',
    height_cm: 170.0,
    weight_kg: 90.0,
    blood_pressure: '125/80',
    room_number: '301B',
    diagnosis: '무릎 인공관절 수술 후',
    notes: '',
    sensory_perception: 4,
    moisture: 4,
    activity: 3,
    has_ulcer: false,
    ulcer_stage: null,
    ulcer_location: null,
    created_at: '2024-12-03T07:30:00',
  },
];

// ==================== Calculation Helpers ====================

// Calculate Braden Score from 3 items (max 12)
export const calculateBradenScore = (patient) => {
  return (
    (patient.sensory_perception || patient.sensoryPerception || 0) +
    (patient.moisture || 0) +
    (patient.activity || 0)
  );
};

// Calculate risk score (0-1) based on Braden Score
export const calculateRiskScore = (bradenScore) => {
  const risk = Math.max(0, Math.min(1, (12 - bradenScore) / 9));
  return Math.round(risk * 100) / 100;
};

// Get risk level from risk score
export const getRiskLevel = (riskScore) => {
  if (riskScore >= 0.7) return 'critical';
  if (riskScore >= 0.5) return 'high';
  if (riskScore >= 0.3) return 'moderate';
  return 'low';
};

// Get risk level from Braden Score directly (3 items, max 12)
export const getRiskLevelFromBraden = (bradenScore) => {
  if (bradenScore <= 4) return 'critical';
  if (bradenScore <= 6) return 'high';
  if (bradenScore <= 8) return 'moderate';
  return 'low';
};

// Risk config for styling
export const getRiskConfig = (level) => {
  const configs = {
    critical: {
      bg: 'bg-gradient-to-r from-red-50 to-red-100',
      border: 'border-red-300',
      badge: 'bg-red-500',
      text: 'text-red-500',
      textDark: 'text-red-600',
      glow: 'shadow-md shadow-red-100',
      label: 'CRITICAL',
      labelKr: '위험',
    },
    high: {
      bg: 'bg-gradient-to-r from-orange-50 to-amber-100',
      border: 'border-orange-300',
      badge: 'bg-orange-500',
      text: 'text-orange-500',
      textDark: 'text-orange-600',
      glow: 'shadow-md shadow-orange-100',
      label: 'HIGH',
      labelKr: '높음',
    },
    moderate: {
      bg: 'bg-gradient-to-r from-amber-50 to-yellow-100',
      border: 'border-amber-300',
      badge: 'bg-amber-500',
      text: 'text-amber-500',
      textDark: 'text-amber-600',
      glow: 'shadow-sm',
      label: 'MODERATE',
      labelKr: '중간',
    },
    low: {
      bg: 'bg-gradient-to-r from-emerald-50 to-green-100',
      border: 'border-emerald-300',
      badge: 'bg-emerald-500',
      text: 'text-emerald-500',
      textDark: 'text-emerald-600',
      glow: 'shadow-sm',
      label: 'LOW',
      labelKr: '낮음',
    },
  };
  return configs[level] || configs.low;
};

// Get activity status text from activity score
export const getActivityStatus = (activityScore) => {
  const statuses = { 1: 'Bedfast', 2: 'Chairfast', 3: 'Walks Occasionally', 4: 'Walks Frequently' };
  return statuses[activityScore] || 'Unknown';
};

// Get skin condition based on ulcer data
export const getSkinCondition = (patient) => {
  if (!patient.has_ulcer && !patient.hasUlcer) return 'Intact';
  const stage = patient.ulcer_stage || patient.ulcerStage;
  const location = patient.ulcer_location || patient.ulcerLocation;
  if (stage) {
    return `Stage ${stage} - ${location || 'Location not specified'}`;
  }
  return 'At Risk';
};

// Calculate BMI
export const calculateBMI = (height_cm, weight_kg) => {
  if (!height_cm || !weight_kg) return null;
  const heightM = height_cm / 100;
  return (weight_kg / (heightM * heightM)).toFixed(1);
};

// Add computed fields to patient data
const enrichPatientData = (patient) => {
  const bradenScore = calculateBradenScore(patient);
  const riskScore = calculateRiskScore(bradenScore);
  return {
    ...patient,
    bradenScore,
    riskScore,
    // Normalize field names (handle both snake_case and camelCase from backend)
    room_number: patient.room_number || patient.roomNumber,
    height_cm: patient.height_cm || patient.heightCm,
    weight_kg: patient.weight_kg || patient.weightKg,
    blood_pressure: patient.blood_pressure || patient.bloodPressure,
    sensory_perception: patient.sensory_perception || patient.sensoryPerception,
    has_ulcer: patient.has_ulcer ?? patient.hasUlcer ?? false,
    ulcer_stage: patient.ulcer_stage || patient.ulcerStage,
    ulcer_location: patient.ulcer_location || patient.ulcerLocation,
    created_at: patient.created_at || patient.createdAt,
  };
};

// ==================== Offline Mode Functions ====================

const offlineGetAll = () => {
  return mockPatientsData.map(enrichPatientData);
};

const offlineGetById = (id) => {
  const patient = mockPatientsData.find(p => p.id === parseInt(id) || p.id === id);
  return patient ? enrichPatientData(patient) : null;
};

const offlineCreate = (patientData) => {
  const newPatient = {
    id: mockPatientCounter++,
    ...patientData,
    created_at: new Date().toISOString(),
  };
  mockPatientsData.unshift(newPatient);
  return enrichPatientData(newPatient);
};

const offlineUpdate = (id, patientData) => {
  const index = mockPatientsData.findIndex(p => p.id === parseInt(id) || p.id === id);
  if (index !== -1) {
    mockPatientsData[index] = { ...mockPatientsData[index], ...patientData };
    return enrichPatientData(mockPatientsData[index]);
  }
  return null;
};

const offlineDelete = (id) => {
  const index = mockPatientsData.findIndex(p => p.id === parseInt(id) || p.id === id);
  if (index !== -1) {
    mockPatientsData.splice(index, 1);
    return true;
  }
  return false;
};

// ==================== API Functions with Fallback ====================

// Get all patients
export const getAllPatients = async () => {
  // Try API first, fallback to offline mode only if enabled
  if (!USE_OFFLINE_MODE) {
    try {
      console.log('🌐 Fetching patients from backend API...');
      const patients = await patientAPI.getAll();
      backendConnectionAttempted = true;
      console.log('✅ Successfully fetched patients from backend:', patients.length);
      return patients.map(enrichPatientData);
    } catch (error) {
      backendConnectionAttempted = true;
      console.error('❌ Backend connection failed:', error.message);
      
      if (config.USE_OFFLINE_FALLBACK) {
        console.warn('⚠️ Switching to offline mode with demo data');
        console.warn('💡 To use real data, start Spring Boot backend at http://localhost:8080');
        USE_OFFLINE_MODE = true;
      } else {
        throw error; // Don't use fallback, throw error instead
      }
    }
  }
  
  // Offline mode
  if (!backendConnectionAttempted) {
    console.log('📴 Backend not attempted yet, using offline mode');
  }
  console.log('📴 Using offline mode with mock data (6 demo patients)');
  return offlineGetAll();
};

// Get patient by ID
export const getPatientById = async (id) => {
  if (!USE_OFFLINE_MODE) {
    try {
      const patient = await patientAPI.getById(id);
      return enrichPatientData(patient);
    } catch (error) {
      console.warn('Backend unavailable, switching to offline mode:', error.message);
      USE_OFFLINE_MODE = true;
    }
  }
  
  return offlineGetById(id);
};

// Create new patient
export const createPatient = async (patientData) => {
  if (!USE_OFFLINE_MODE) {
    try {
      const payload = {
        name: patientData.name,
        age: parseInt(patientData.age),
        gender: patientData.gender || 'M',
        heightCm: patientData.height_cm ? parseFloat(patientData.height_cm) : null,
        weightKg: patientData.weight_kg ? parseFloat(patientData.weight_kg) : null,
        bloodPressure: patientData.blood_pressure || '',
        roomNumber: patientData.room_number || '',
        diagnosis: patientData.diagnosis || '',
        notes: patientData.notes || '',
        sensoryPerception: parseInt(patientData.sensory_perception) || 4,
        moisture: parseInt(patientData.moisture) || 4,
        activity: parseInt(patientData.activity) || 4,
        hasUlcer: patientData.has_ulcer || false,
        ulcerStage: patientData.has_ulcer ? patientData.ulcer_stage : null,
        ulcerLocation: patientData.has_ulcer ? patientData.ulcer_location : null,
      };
      const created = await patientAPI.create(payload);
      return enrichPatientData(created);
    } catch (error) {
      console.warn('Backend unavailable, using offline mode:', error.message);
      USE_OFFLINE_MODE = true;
    }
  }
  
  return offlineCreate(patientData);
};

// Update patient
export const updatePatient = async (id, patientData) => {
  if (!USE_OFFLINE_MODE) {
    try {
      const payload = {
        name: patientData.name,
        age: parseInt(patientData.age),
        gender: patientData.gender || 'M',
        heightCm: patientData.height_cm ? parseFloat(patientData.height_cm) : null,
        weightKg: patientData.weight_kg ? parseFloat(patientData.weight_kg) : null,
        bloodPressure: patientData.blood_pressure || '',
        roomNumber: patientData.room_number || '',
        diagnosis: patientData.diagnosis || '',
        notes: patientData.notes || '',
        sensoryPerception: parseInt(patientData.sensory_perception) || 4,
        moisture: parseInt(patientData.moisture) || 4,
        activity: parseInt(patientData.activity) || 4,
        hasUlcer: patientData.has_ulcer || false,
        ulcerStage: patientData.has_ulcer ? patientData.ulcer_stage : null,
        ulcerLocation: patientData.has_ulcer ? patientData.ulcer_location : null,
      };
      const updated = await patientAPI.update(id, payload);
      return enrichPatientData(updated);
    } catch (error) {
      console.warn('Backend unavailable, using offline mode:', error.message);
      USE_OFFLINE_MODE = true;
    }
  }
  
  return offlineUpdate(id, patientData);
};

// Delete patient
export const deletePatient = async (id) => {
  if (!USE_OFFLINE_MODE) {
    try {
      await patientAPI.delete(id);
      return true;
    } catch (error) {
      console.warn('Backend unavailable, using offline mode:', error.message);
      USE_OFFLINE_MODE = true;
    }
  }
  
  return offlineDelete(id);
};

// Check if using offline mode
export const isOfflineMode = () => USE_OFFLINE_MODE;

// Force offline mode (for testing)
export const setOfflineMode = (offline) => {
  USE_OFFLINE_MODE = offline;
};
