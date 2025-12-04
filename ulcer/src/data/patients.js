// Patient data matching MySQL database schema

// Generate unique patient ID
let patientCounter = 7;

export const generatePatientId = () => {
  const id = patientCounter;
  patientCounter++;
  return id;
};

// Braden Scale descriptions (3 items now)
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

// Ulcer stages
export const ulcerStages = [
  { value: null, label: 'None', labelKr: '없음' },
  { value: '1', label: 'Stage 1', labelKr: '1단계' },
  { value: '2', label: 'Stage 2', labelKr: '2단계' },
  { value: '3', label: 'Stage 3', labelKr: '3단계' },
  { value: '4', label: 'Stage 4', labelKr: '4단계' },
  { value: 'DTI', label: 'Deep Tissue Injury', labelKr: '심부조직 손상' },
  { value: 'Unstageable', label: 'Unstageable', labelKr: '단계 미분류' },
];

// Common ulcer locations
export const ulcerLocations = [
  'Sacrum',
  'Left Heel',
  'Right Heel',
  'Left Trochanter',
  'Right Trochanter',
  'Coccyx',
  'Left Ischium',
  'Right Ischium',
  'Left Elbow',
  'Right Elbow',
  'Occiput',
  'Other',
];

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
  // Convert Braden Score to risk percentage (inverted)
  // Score 3 = 100% risk, Score 12 = 0% risk
  const risk = Math.max(0, Math.min(1, (12 - bradenScore) / 9));
  return Math.round(risk * 100) / 100;
};

// Sample patient data matching DB schema
export let patientsData = [
  {
    id: 1,
    name: 'Eleanor Mitchell',
    age: 78,
    gender: 'F',
    // Physical info
    height_cm: 162.5,
    weight_kg: 58.0,
    blood_pressure: '128/82',
    // Ward related
    room_number: '204A',
    diagnosis: 'Hip fracture post-surgery',
    notes: 'Allergic to Penicillin. Requires assistance with mobility.',
    // Braden Scale (3 items)
    sensory_perception: 2,
    moisture: 2,
    activity: 1,
    // Ulcer status
    has_ulcer: true,
    ulcer_stage: '1',
    ulcer_location: 'Sacrum',
    created_at: '2024-11-28T08:30:00',
  },
  {
    id: 2,
    name: 'Robert Chen',
    age: 65,
    gender: 'M',
    height_cm: 175.0,
    weight_kg: 75.5,
    blood_pressure: '135/85',
    room_number: '118B',
    diagnosis: 'Pneumonia, recovering',
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
    name: 'Maria Santos',
    age: 82,
    gender: 'F',
    height_cm: 158.0,
    weight_kg: 60.0,
    blood_pressure: '140/90',
    room_number: '305',
    diagnosis: 'Stroke, left hemiplegia',
    notes: 'Allergic to Latex. High fall risk.',
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
    name: 'James Wilson',
    age: 71,
    gender: 'M',
    height_cm: 180.0,
    weight_kg: 80.0,
    blood_pressure: '130/80',
    room_number: '112A',
    diagnosis: 'Diabetes Mellitus',
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
    name: 'Dorothy Nguyen',
    age: 88,
    gender: 'F',
    height_cm: 155.0,
    weight_kg: 55.0,
    blood_pressure: '120/78',
    room_number: '220',
    diagnosis: 'Dementia, mild',
    notes: 'Needs frequent orientation. Wanders at night.',
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
    name: 'William Brown',
    age: 69,
    gender: 'M',
    height_cm: 170.0,
    weight_kg: 90.0,
    blood_pressure: '125/80',
    room_number: '301B',
    diagnosis: 'Post-op knee replacement',
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

// Get all patients with computed fields
export const getAllPatients = () => {
  return patientsData.map(patient => ({
    ...patient,
    bradenScore: calculateBradenScore(patient),
    riskScore: calculateRiskScore(calculateBradenScore(patient)),
  }));
};

// Get patient by ID with computed fields
export const getPatientById = (id) => {
  const patient = patientsData.find(p => p.id === parseInt(id) || p.id === id);
  if (!patient) return null;
  return {
    ...patient,
    bradenScore: calculateBradenScore(patient),
    riskScore: calculateRiskScore(calculateBradenScore(patient)),
  };
};

// Create new patient
export const createPatient = (patientData) => {
  const newPatient = {
    id: generatePatientId(),
    name: patientData.name,
    age: patientData.age,
    gender: patientData.gender || 'M',
    // Physical info
    height_cm: patientData.height_cm || null,
    weight_kg: patientData.weight_kg || null,
    blood_pressure: patientData.blood_pressure || '',
    // Ward related
    room_number: patientData.room_number || '',
    diagnosis: patientData.diagnosis || '',
    notes: patientData.notes || '',
    // Braden Scale
    sensory_perception: patientData.sensory_perception || 4,
    moisture: patientData.moisture || 4,
    activity: patientData.activity || 4,
    // Ulcer status
    has_ulcer: patientData.has_ulcer || false,
    ulcer_stage: patientData.ulcer_stage || null,
    ulcer_location: patientData.ulcer_location || null,
    created_at: new Date().toISOString(),
  };
  patientsData.unshift(newPatient);
  return {
    ...newPatient,
    bradenScore: calculateBradenScore(newPatient),
    riskScore: calculateRiskScore(calculateBradenScore(newPatient)),
  };
};

// Update patient
export const updatePatient = (id, updatedData) => {
  const index = patientsData.findIndex(p => p.id === parseInt(id) || p.id === id);
  if (index !== -1) {
    patientsData[index] = { ...patientsData[index], ...updatedData };
    const patient = patientsData[index];
    return {
      ...patient,
      bradenScore: calculateBradenScore(patient),
      riskScore: calculateRiskScore(calculateBradenScore(patient)),
    };
  }
  return null;
};

// Delete patient
export const deletePatient = (id) => {
  const index = patientsData.findIndex(p => p.id === parseInt(id) || p.id === id);
  if (index !== -1) {
    const deleted = patientsData.splice(index, 1);
    return deleted[0];
  }
  return null;
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
  if (bradenScore <= 4) return 'critical';   // Very High Risk
  if (bradenScore <= 6) return 'high';       // High Risk
  if (bradenScore <= 8) return 'moderate';   // Moderate Risk
  return 'low';                               // Low Risk
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
  return configs[level];
};

// Get activity status text from activity score
export const getActivityStatus = (activityScore) => {
  const statuses = {
    1: 'Bedfast',
    2: 'Chairfast',
    3: 'Walks Occasionally',
    4: 'Walks Frequently',
  };
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
