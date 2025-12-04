// Centralized patient data store
export const patientsData = [
  {
    id: 'PT-001',
    name: 'Eleanor Mitchell',
    room: '204A',
    age: 78,
    gender: 'Female',
    admissionDate: '2024-11-28',
    riskScore: 0.89,
    lastAssessment: '2 hours ago',
    mobilityStatus: 'Bedbound',
    skinCondition: 'Stage 1 on sacrum',
    bradenScore: 12,
    weight: 58,
    height: 162,
    diagnosis: 'Hip fracture post-surgery',
    allergies: ['Penicillin'],
    pressurePoints: [
      { area: 'Sacrum', status: 'Stage 1', temperature: 38.2 },
      { area: 'Left Heel', status: 'At Risk', temperature: 36.8 },
      { area: 'Right Heel', status: 'Normal', temperature: 36.5 },
      { area: 'Left Trochanter', status: 'At Risk', temperature: 37.1 },
      { area: 'Right Trochanter', status: 'Normal', temperature: 36.4 },
    ],
    vitalSigns: {
      bloodPressure: '128/82',
      heartRate: 76,
      temperature: 37.1,
      oxygenSaturation: 96,
    },
    lastRepositioned: '1 hour ago',
    nextRepositioning: 'In 1 hour',
  },
  {
    id: 'PT-002',
    name: 'Robert Chen',
    room: '118B',
    age: 65,
    gender: 'Male',
    admissionDate: '2024-12-01',
    riskScore: 0.72,
    lastAssessment: '4 hours ago',
    mobilityStatus: 'Limited mobility',
    skinCondition: 'Redness on heels',
    bradenScore: 14,
    weight: 75,
    height: 175,
    diagnosis: 'Stroke recovery',
    allergies: [],
    pressurePoints: [
      { area: 'Sacrum', status: 'Normal', temperature: 36.6 },
      { area: 'Left Heel', status: 'At Risk', temperature: 37.4 },
      { area: 'Right Heel', status: 'At Risk', temperature: 37.2 },
      { area: 'Left Trochanter', status: 'Normal', temperature: 36.3 },
      { area: 'Right Trochanter', status: 'Normal', temperature: 36.4 },
    ],
    vitalSigns: {
      bloodPressure: '142/88',
      heartRate: 82,
      temperature: 36.8,
      oxygenSaturation: 94,
    },
    lastRepositioned: '2 hours ago',
    nextRepositioning: 'In 1 hour',
  },
  {
    id: 'PT-003',
    name: 'Maria Santos',
    room: '305',
    age: 82,
    gender: 'Female',
    admissionDate: '2024-11-25',
    riskScore: 0.95,
    lastAssessment: '1 hour ago',
    mobilityStatus: 'Bedbound',
    skinCondition: 'Multiple areas of concern',
    bradenScore: 10,
    weight: 52,
    height: 155,
    diagnosis: 'End-stage heart failure',
    allergies: ['Sulfa', 'Latex'],
    pressurePoints: [
      { area: 'Sacrum', status: 'Stage 2', temperature: 39.1 },
      { area: 'Left Heel', status: 'Stage 1', temperature: 38.4 },
      { area: 'Right Heel', status: 'At Risk', temperature: 37.6 },
      { area: 'Left Trochanter', status: 'At Risk', temperature: 37.8 },
      { area: 'Right Trochanter', status: 'Stage 1', temperature: 38.2 },
    ],
    vitalSigns: {
      bloodPressure: '98/62',
      heartRate: 92,
      temperature: 37.4,
      oxygenSaturation: 91,
    },
    lastRepositioned: '30 minutes ago',
    nextRepositioning: 'In 1.5 hours',
  },
  {
    id: 'PT-004',
    name: 'James Wilson',
    room: '112A',
    age: 71,
    gender: 'Male',
    admissionDate: '2024-12-02',
    riskScore: 0.45,
    lastAssessment: '3 hours ago',
    mobilityStatus: 'Chair-bound',
    skinCondition: 'Intact',
    bradenScore: 16,
    weight: 82,
    height: 180,
    diagnosis: 'Pneumonia recovery',
    allergies: ['Aspirin'],
    pressurePoints: [
      { area: 'Sacrum', status: 'Normal', temperature: 36.4 },
      { area: 'Left Heel', status: 'Normal', temperature: 36.2 },
      { area: 'Right Heel', status: 'Normal', temperature: 36.3 },
      { area: 'Left Trochanter', status: 'Normal', temperature: 36.1 },
      { area: 'Right Trochanter', status: 'Normal', temperature: 36.2 },
    ],
    vitalSigns: {
      bloodPressure: '135/85',
      heartRate: 78,
      temperature: 36.9,
      oxygenSaturation: 95,
    },
    lastRepositioned: '2 hours ago',
    nextRepositioning: 'In 2 hours',
  },
  {
    id: 'PT-005',
    name: 'Dorothy Nguyen',
    room: '220',
    age: 88,
    gender: 'Female',
    admissionDate: '2024-11-30',
    riskScore: 0.61,
    lastAssessment: '5 hours ago',
    mobilityStatus: 'Limited mobility',
    skinCondition: 'Dry skin',
    bradenScore: 15,
    weight: 48,
    height: 152,
    diagnosis: 'Diabetes management',
    allergies: [],
    pressurePoints: [
      { area: 'Sacrum', status: 'At Risk', temperature: 37.0 },
      { area: 'Left Heel', status: 'Normal', temperature: 36.5 },
      { area: 'Right Heel', status: 'Normal', temperature: 36.4 },
      { area: 'Left Trochanter', status: 'At Risk', temperature: 36.9 },
      { area: 'Right Trochanter', status: 'Normal', temperature: 36.3 },
    ],
    vitalSigns: {
      bloodPressure: '148/92',
      heartRate: 72,
      temperature: 36.6,
      oxygenSaturation: 97,
    },
    lastRepositioned: '3 hours ago',
    nextRepositioning: 'In 30 minutes',
  },
  {
    id: 'PT-006',
    name: 'William Brown',
    room: '301B',
    age: 69,
    gender: 'Male',
    admissionDate: '2024-12-03',
    riskScore: 0.28,
    lastAssessment: '2 hours ago',
    mobilityStatus: 'Ambulatory with assistance',
    skinCondition: 'Intact',
    bradenScore: 18,
    weight: 78,
    height: 178,
    diagnosis: 'Knee replacement recovery',
    allergies: [],
    pressurePoints: [
      { area: 'Sacrum', status: 'Normal', temperature: 36.3 },
      { area: 'Left Heel', status: 'Normal', temperature: 36.1 },
      { area: 'Right Heel', status: 'Normal', temperature: 36.2 },
      { area: 'Left Trochanter', status: 'Normal', temperature: 36.0 },
      { area: 'Right Trochanter', status: 'Normal', temperature: 36.1 },
    ],
    vitalSigns: {
      bloodPressure: '122/78',
      heartRate: 68,
      temperature: 36.5,
      oxygenSaturation: 98,
    },
    lastRepositioned: '4 hours ago',
    nextRepositioning: 'Standard schedule',
  },
];

// Generate unique patient ID
let patientCounter = 7; // Starting after PT-006

export const generatePatientId = () => {
  const id = `PT-${String(patientCounter).padStart(3, '0')}`;
  patientCounter++;
  return id;
};

// Get all patients
export const getAllPatients = () => {
  return [...patientsData];
};

// Get patient by ID
export const getPatientById = (id) => {
  return patientsData.find(patient => patient.id === id);
};

// Create new patient
export const createPatient = (patientData) => {
  const newPatient = {
    id: generatePatientId(),
    admissionDate: new Date().toISOString().split('T')[0],
    lastAssessment: 'Just now',
    lastRepositioned: 'Not yet',
    nextRepositioning: 'In 2 hours',
    pressurePoints: [
      { area: 'Sacrum', status: 'Normal', temperature: 36.5 },
      { area: 'Left Heel', status: 'Normal', temperature: 36.3 },
      { area: 'Right Heel', status: 'Normal', temperature: 36.4 },
      { area: 'Left Trochanter', status: 'Normal', temperature: 36.2 },
      { area: 'Right Trochanter', status: 'Normal', temperature: 36.3 },
    ],
    ...patientData,
  };
  patientsData.unshift(newPatient); // Add to beginning of array
  return newPatient;
};

// Update patient
export const updatePatient = (id, updatedData) => {
  const index = patientsData.findIndex(patient => patient.id === id);
  if (index !== -1) {
    patientsData[index] = { ...patientsData[index], ...updatedData };
    return patientsData[index];
  }
  return null;
};

// Delete patient
export const deletePatient = (id) => {
  const index = patientsData.findIndex(patient => patient.id === id);
  if (index !== -1) {
    const deleted = patientsData.splice(index, 1);
    return deleted[0];
  }
  return null;
};

export const getRiskLevel = (score) => {
  if (score >= 0.8) return 'critical';
  if (score >= 0.6) return 'high';
  if (score >= 0.4) return 'moderate';
  return 'low';
};

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
    },
    high: {
      bg: 'bg-gradient-to-r from-orange-50 to-amber-100',
      border: 'border-orange-300',
      badge: 'bg-orange-500',
      text: 'text-orange-500',
      textDark: 'text-orange-600',
      glow: 'shadow-md shadow-orange-100',
      label: 'HIGH',
    },
    moderate: {
      bg: 'bg-gradient-to-r from-amber-50 to-yellow-100',
      border: 'border-amber-300',
      badge: 'bg-amber-500',
      text: 'text-amber-500',
      textDark: 'text-amber-600',
      glow: 'shadow-sm',
      label: 'MODERATE',
    },
    low: {
      bg: 'bg-gradient-to-r from-emerald-50 to-green-100',
      border: 'border-emerald-300',
      badge: 'bg-emerald-500',
      text: 'text-emerald-500',
      textDark: 'text-emerald-600',
      glow: 'shadow-sm',
      label: 'LOW',
    },
  };
  return configs[level];
};

