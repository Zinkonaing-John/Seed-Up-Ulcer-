// Patient data matching MySQL database schema

// Generate unique patient ID
let patientCounter = 7;

export const generatePatientId = () => {
  const id = patientCounter;
  patientCounter++;
  return id;
};

// Braden Scale descriptions
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
  mobility: {
    label: 'Mobility',
    labelKr: '기동력',
    options: [
      { value: 1, label: 'Completely Immobile', labelKr: '전혀 움직이지 못함' },
      { value: 2, label: 'Very Limited', labelKr: '매우 제한적' },
      { value: 3, label: 'Slightly Limited', labelKr: '약간 제한적' },
      { value: 4, label: 'No Limitations', labelKr: '제한 없음' },
    ],
  },
  nutrition: {
    label: 'Nutrition',
    labelKr: '영양 상태',
    options: [
      { value: 1, label: 'Very Poor', labelKr: '매우 불량' },
      { value: 2, label: 'Probably Inadequate', labelKr: '불충분' },
      { value: 3, label: 'Adequate', labelKr: '적절함' },
      { value: 4, label: 'Excellent', labelKr: '우수함' },
    ],
  },
  friction_shear: {
    label: 'Friction & Shear',
    labelKr: '마찰/밀림',
    options: [
      { value: 1, label: 'Problem', labelKr: '문제 있음' },
      { value: 2, label: 'Potential Problem', labelKr: '잠재적 문제' },
      { value: 3, label: 'No Apparent Problem', labelKr: '문제 없음' },
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

// Calculate Braden Score from individual items
export const calculateBradenScore = (patient) => {
  return (
    (patient.sensory_perception || 0) +
    (patient.moisture || 0) +
    (patient.activity || 0) +
    (patient.mobility || 0) +
    (patient.nutrition || 0) +
    (patient.friction_shear || 0)
  );
};

// Calculate risk score (0-1) based on Braden Score
// Braden Score: 6-23, lower = higher risk
export const calculateRiskScore = (bradenScore) => {
  // Convert Braden Score to risk percentage (inverted)
  // Score 6 = 100% risk, Score 23 = 0% risk
  const risk = Math.max(0, Math.min(1, (23 - bradenScore) / 17));
  return Math.round(risk * 100) / 100;
};

// Sample patient data matching DB schema
export const patientsData = [
  {
    id: 1,
    name: 'Eleanor Mitchell',
    age: 78,
    gender: 'F',
    // Braden Scale
    sensory_perception: 2,
    moisture: 2,
    activity: 1,
    mobility: 1,
    nutrition: 2,
    friction_shear: 1,
    // Ulcer status
    has_ulcer: true,
    ulcer_stage: '1',
    ulcer_location: 'Sacrum',
    created_at: '2024-11-28T08:30:00',
    // Additional display fields
    room: '204A',
    lastAssessment: '2 hours ago',
  },
  {
    id: 2,
    name: 'Robert Chen',
    age: 65,
    gender: 'M',
    sensory_perception: 3,
    moisture: 2,
    activity: 2,
    mobility: 2,
    nutrition: 3,
    friction_shear: 2,
    has_ulcer: false,
    ulcer_stage: null,
    ulcer_location: null,
    created_at: '2024-12-01T10:15:00',
    room: '118B',
    lastAssessment: '4 hours ago',
  },
  {
    id: 3,
    name: 'Maria Santos',
    age: 82,
    gender: 'F',
    sensory_perception: 1,
    moisture: 1,
    activity: 1,
    mobility: 1,
    nutrition: 2,
    friction_shear: 1,
    has_ulcer: true,
    ulcer_stage: '2',
    ulcer_location: 'Sacrum, Left Heel',
    created_at: '2024-11-25T14:00:00',
    room: '305',
    lastAssessment: '1 hour ago',
  },
  {
    id: 4,
    name: 'James Wilson',
    age: 71,
    gender: 'M',
    sensory_perception: 4,
    moisture: 3,
    activity: 2,
    mobility: 3,
    nutrition: 3,
    friction_shear: 2,
    has_ulcer: false,
    ulcer_stage: null,
    ulcer_location: null,
    created_at: '2024-12-02T09:45:00',
    room: '112A',
    lastAssessment: '3 hours ago',
  },
  {
    id: 5,
    name: 'Dorothy Nguyen',
    age: 88,
    gender: 'F',
    sensory_perception: 3,
    moisture: 2,
    activity: 2,
    mobility: 2,
    nutrition: 2,
    friction_shear: 2,
    has_ulcer: false,
    ulcer_stage: null,
    ulcer_location: null,
    created_at: '2024-11-30T11:20:00',
    room: '220',
    lastAssessment: '5 hours ago',
  },
  {
    id: 6,
    name: 'William Brown',
    age: 69,
    gender: 'M',
    sensory_perception: 4,
    moisture: 4,
    activity: 3,
    mobility: 4,
    nutrition: 4,
    friction_shear: 3,
    has_ulcer: false,
    ulcer_stage: null,
    ulcer_location: null,
    created_at: '2024-12-03T07:30:00',
    room: '301B',
    lastAssessment: '2 hours ago',
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
    sensory_perception: patientData.sensory_perception || 4,
    moisture: patientData.moisture || 4,
    activity: patientData.activity || 4,
    mobility: patientData.mobility || 4,
    nutrition: patientData.nutrition || 4,
    friction_shear: patientData.friction_shear || 3,
    has_ulcer: patientData.has_ulcer || false,
    ulcer_stage: patientData.ulcer_stage || null,
    ulcer_location: patientData.ulcer_location || null,
    created_at: new Date().toISOString(),
    room: patientData.room || '',
    lastAssessment: 'Just now',
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
  if (riskScore >= 0.8) return 'critical';
  if (riskScore >= 0.6) return 'high';
  if (riskScore >= 0.4) return 'moderate';
  return 'low';
};

// Get risk level from Braden Score directly
export const getRiskLevelFromBraden = (bradenScore) => {
  if (bradenScore <= 9) return 'critical';   // Very High Risk
  if (bradenScore <= 12) return 'high';      // High Risk
  if (bradenScore <= 14) return 'moderate';  // Moderate Risk
  if (bradenScore <= 18) return 'low';       // Mild Risk
  return 'low';                               // No Risk
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

// Get mobility status text from mobility score
export const getMobilityStatus = (mobilityScore) => {
  const statuses = {
    1: 'Completely Immobile',
    2: 'Very Limited',
    3: 'Slightly Limited',
    4: 'No Limitations',
  };
  return statuses[mobilityScore] || 'Unknown';
};

// Get skin condition based on ulcer data
export const getSkinCondition = (patient) => {
  if (!patient.has_ulcer) return 'Intact';
  if (patient.ulcer_stage) {
    return `Stage ${patient.ulcer_stage} - ${patient.ulcer_location || 'Location not specified'}`;
  }
  return 'At Risk';
};
