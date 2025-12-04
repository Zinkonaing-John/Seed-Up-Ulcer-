// Patient data layer - connects to Spring Boot backend
import { patientAPI } from '../services/api';

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

// ==================== Calculation Helpers ====================

// Calculate Braden Score from 3 items (max 12)
export const calculateBradenScore = (patient) => {
  return (
    (patient.sensory_perception || 0) +
    (patient.moisture || 0) +
    (patient.activity || 0)
  );
};

// Calculate risk score (0-1) based on Braden Score
// Braden Score: 3-12, lower = higher risk
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
  if (!patient.has_ulcer) return 'Intact';
  if (patient.ulcer_stage) {
    return `Stage ${patient.ulcer_stage} - ${patient.ulcer_location || 'Location not specified'}`;
  }
  return 'At Risk';
};

// Calculate BMI
export const calculateBMI = (height_cm, weight_kg) => {
  if (!height_cm || !weight_kg) return null;
  const heightM = height_cm / 100;
  return (weight_kg / (heightM * heightM)).toFixed(1);
};

// Add computed fields to patient data from backend
const enrichPatientData = (patient) => {
  const bradenScore = calculateBradenScore(patient);
  const riskScore = calculateRiskScore(bradenScore);
  return {
    ...patient,
    bradenScore,
    riskScore,
    // Map snake_case from backend to expected fields if needed
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

// ==================== API Functions ====================

// Get all patients from backend
export const getAllPatients = async () => {
  try {
    const patients = await patientAPI.getAll();
    return patients.map(enrichPatientData);
  } catch (error) {
    console.error('Failed to fetch patients:', error);
    throw error;
  }
};

// Get patient by ID from backend
export const getPatientById = async (id) => {
  try {
    const patient = await patientAPI.getById(id);
    return enrichPatientData(patient);
  } catch (error) {
    console.error(`Failed to fetch patient ${id}:`, error);
    throw error;
  }
};

// Create new patient
export const createPatient = async (patientData) => {
  try {
    // Map to backend expected format (camelCase for Spring Boot)
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
    console.error('Failed to create patient:', error);
    throw error;
  }
};

// Update patient
export const updatePatient = async (id, patientData) => {
  try {
    // Map to backend expected format
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
    console.error(`Failed to update patient ${id}:`, error);
    throw error;
  }
};

// Delete patient
export const deletePatient = async (id) => {
  try {
    await patientAPI.delete(id);
    return true;
  } catch (error) {
    console.error(`Failed to delete patient ${id}:`, error);
    throw error;
  }
};
