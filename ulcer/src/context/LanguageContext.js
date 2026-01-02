import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

// Translations
export const translations = {
  ko: {
    // Dashboard
    appTitle: '욕창 예방 시스템',
    appSubtitle: '욕창 위험도 평가 대시보드',
    liveMonitoring: '실시간 모니터링',
    lastUpdated: '마지막 업데이트',
    addPatient: '환자 등록',
    patientRiskMonitor: '환자 위험도 모니터',
    all: '전체',
    critical: '위험',
    high: '높음',
    moderate: '중간',
    low: '낮음',
    noPatients: '선택한 필터와 일치하는 환자가 없습니다',
    
    // Stats
    totalPatients: '전체 환자',
    criticalRisk: '위험 환자',
    highRisk: '높은 위험',
    moderateRisk: '중간 위험',
    lowRisk: '낮은 위험',
    
    // Patient Card
    room: '병실',
    years: '세',
    male: '남성',
    female: '여성',
    bradenScore: '브레이든 점수',
    ulcerStatus: '욕창 상태',
    none: '없음',
    stage: '단계',
    mobility: '기동력',
    skin: '피부',
    lastAssessed: '마지막 평가',
    viewDetails: '상세 보기',
    riskScore: '위험 점수',
    
    // Patient Detail
    backToDashboard: '대시보드로 돌아가기',
    edit: '수정',
    delete: '삭제',
    patientInfo: '환자 정보',
    registrationDate: '등록일',
    lastAssessment: '마지막 평가',
    mobilityStatus: '기동력',
    skinCondition: '피부 상태',
    ulcerAlert: '욕창 경고',
    
    // Thermography
    thermographyCamera: '열화상 카메라',
    liveFeed: '실시간 피드',
    live: '실시간',
    paused: '일시정지',
    cameraSettings: '카메라 설정',
    cameraStreamUrl: '카메라 스트림 URL',
    commonEndpoints: '일반 엔드포인트',
    cancel: '취소',
    applyConnect: '적용 및 연결',
    cameraConnectionFailed: '카메라 연결 실패',
    retryConnection: '다시 연결',
    changeUrl: 'URL 변경',
    cameraPaused: '카메라 일시정지됨',
    resumeLiveFeed: '실시간 피드 재개',
    
    // Care Instructions
    aiCareRecommendations: 'AI 케어 권장사항',
    generatingRecommendations: '권장사항 생성 중...',
    usingOfflineRecommendations: '오프라인 권장사항 사용 중',
    backendUnavailable: '백엔드 사용 불가',
    maxTokens: '최대 토큰',
    verifyWithClinicalJudgment: '항상 임상적 판단으로 확인하세요',
    clickRefresh: '새로고침을 클릭하여 권장사항을 생성하세요',
    
    // Modals
    addNewPatient: '새 환자 등록',
    editPatient: '환자 정보 수정',
    confirmDeletion: '삭제 확인',
    deleteConfirmMessage: '정말로 환자를 삭제하시겠습니까? 이 작업은 취소할 수 없습니다.',
    save: '저장',
    
    // Form Fields
    name: '이름',
    age: '나이',
    gender: '성별',
    diagnosis: '진단',
    weight: '체중',
    height: '키',
    allergies: '알레르기',
    
    // Braden Scale
    sensoryPerception: '감각 인지',
    moisture: '습기',
    activity: '활동',
    nutrition: '영양',
    frictionShear: '마찰/밀림',
    
    // Language
    language: '언어',
    korean: '한국어',
    english: 'English',
    
    // Dashboard & Patient List
    dashboard: '대시보드',
    patientList: '환자 목록',
    ward: '병동',
    patientsMonitoring: '모니터링 중인 환자',
    highRiskCases: '고위험 사례',
    overdueTurns: '지연된 회전',
    allPatients: '전체 환자',
    searchPlaceholder: '환자 이름, ID 또는 병실로 검색...',
    filter: '필터',
    patient: '환자',
    lastTurn: '마지막 회전',
    nextTurnDue: '다음 회전 예정',
    action: '작업',
    details: '상세',
    showing: '표시',
    to: '부터',
    of: '의',
    previous: '이전',
    next: '다음',
    loadingPatients: '환자 로딩 중...',
    retry: '다시 시도',
    noPatientsFound: '선택한 조건과 일치하는 환자가 없습니다',
    minsAgo: '분 전',
    justNow: '방금',
    hoursAgo: '시간 전',
    daysAgo: '일 전',
    requiresFrequentTurning: '자주 회전 필요 (2시간마다)',
    immediateActionNeeded: '즉시 조치 필요',
    admittedToday: '오늘 입원',
    
    // Patient Detail
    patientMonitoring: '환자 모니터링',
    pressureUlcerPrevention: '욕창 예방',
    realTimeMonitoring: '실시간 모니터링 및 위험 평가',
    history: '이력',
    updateNotes: '노트 업데이트',
    currentVitals: '현재 생체 신호',
    bloodPressure: '혈압',
    bloodSugar: '혈당',
    thermalMonitoring: '열화상 모니터링',
    signalLost: '신호 손실',
    unableToConnect: '열화상 장치와 연결을 설정할 수 없습니다.',
    configureSource: '소스 구성',
    aiCareAssistant: 'AI 케어 어시스턴트',
    realTimeAnalysis: '최근 24시간 기준 실시간 분석',
    loadingAIAnalysis: 'AI 분석 로딩 중...',
    aiError: 'AI 데이터 로딩 오류',
    noAIDataAvailable: 'AI 데이터를 사용할 수 없습니다.',
    aiDataNotAvailableYet: '이 환자에 대한 열화상 데이터가 아직 없습니다. 데이터가 수집되면 AI 분석이 표시됩니다.',
    status: '상태',
    normal: '정상',
    riskFactors: '위험 요인',
    bedsoreDevelopment: '욕창 발달',
    recommendedActions: '권장 조치',
    maintainMonitoring: '모니터링 유지',
    continueStandardProtocols: '다음 4시간 동안 표준 프로토콜 계속',
    visualInspection: '시각적 검사',
    checkLowerBack: '14:00에 하부 등 부위 확인',
    updateDietaryLog: '식이 기록 업데이트',
    verifySugarIntake: '점심 식사당 설탕 섭취 확인',
    aiRecommendationsDisclaimer: 'AI 권장사항은 임상적 판단을 지원하며 대체하지 않습니다.',
    configureCameraIP: '카메라 IP 구성',
    updateThermalCamera: '열화상 카메라 서버 주소 업데이트',
    cameraIPAddress: '카메라 IP 주소',
    enterIPAddress: '열화상 카메라 서버의 IP 주소를 입력하세요',
    bmi: 'BMI',
    bloodType: '혈액형',
  },
  en: {
    // Dashboard
    appTitle: 'Pressure Ulcer Prevention',
    appSubtitle: 'Clinical Risk Assessment Dashboard',
    liveMonitoring: 'Live Monitoring',
    lastUpdated: 'Last updated',
    addPatient: 'Add Patient',
    patientRiskMonitor: 'Patient Risk Monitor',
    all: 'All',
    critical: 'Critical',
    high: 'High',
    moderate: 'Moderate',
    low: 'Low',
    noPatients: 'No patients match the selected filter',
    
    // Stats
    totalPatients: 'Total Patients',
    criticalRisk: 'Critical Risk',
    highRisk: 'High Risk',
    moderateRisk: 'Moderate Risk',
    lowRisk: 'Low Risk',
    
    // Patient Card
    room: 'Room',
    years: 'years',
    male: 'Male',
    female: 'Female',
    bradenScore: 'Braden Score',
    ulcerStatus: 'Ulcer Status',
    none: 'None',
    stage: 'Stage',
    mobility: 'Mobility',
    skin: 'Skin',
    lastAssessed: 'Last assessed',
    viewDetails: 'View Details',
    riskScore: 'Risk Score',
    
    // Patient Detail
    backToDashboard: 'Back to Dashboard',
    edit: 'Edit',
    delete: 'Delete',
    patientInfo: 'Patient Information',
    registrationDate: 'Registration Date',
    lastAssessment: 'Last Assessment',
    mobilityStatus: 'Mobility Status',
    skinCondition: 'Skin Condition',
    ulcerAlert: 'Ulcer Alert',
    
    // Thermography
    thermographyCamera: 'Thermography Camera',
    liveFeed: 'Live feed from',
    live: 'LIVE',
    paused: 'PAUSED',
    cameraSettings: 'Camera Settings',
    cameraStreamUrl: 'Camera Stream URL',
    commonEndpoints: 'Common Endpoints',
    cancel: 'Cancel',
    applyConnect: 'Apply & Connect',
    cameraConnectionFailed: 'Camera Connection Failed',
    retryConnection: 'Retry Connection',
    changeUrl: 'Change URL',
    cameraPaused: 'Camera Paused',
    resumeLiveFeed: 'Resume Live Feed',
    
    // Care Instructions
    aiCareRecommendations: 'AI Care Recommendations',
    generatingRecommendations: 'Generating recommendations...',
    usingOfflineRecommendations: 'Using offline recommendations',
    backendUnavailable: 'Backend unavailable',
    maxTokens: 'Max tokens',
    verifyWithClinicalJudgment: 'Always verify with clinical judgment',
    clickRefresh: 'Click refresh to generate recommendations',
    
    // Modals
    addNewPatient: 'Add New Patient',
    editPatient: 'Edit Patient',
    confirmDeletion: 'Confirm Deletion',
    deleteConfirmMessage: 'Are you sure you want to delete this patient? This action cannot be undone.',
    save: 'Save',
    
    // Form Fields
    name: 'Name',
    age: 'Age',
    gender: 'Gender',
    diagnosis: 'Diagnosis',
    weight: 'Weight',
    height: 'Height',
    allergies: 'Allergies',
    
    // Braden Scale
    sensoryPerception: 'Sensory Perception',
    moisture: 'Moisture',
    activity: 'Activity',
    nutrition: 'Nutrition',
    frictionShear: 'Friction & Shear',
    
    // Language
    language: 'Language',
    korean: '한국어',
    english: 'English',
    
    // Dashboard & Patient List
    dashboard: 'Dashboard',
    patientList: 'Patient List',
    ward: 'Ward',
    patientsMonitoring: 'Patients Monitoring',
    highRiskCases: 'High Risk Cases',
    overdueTurns: 'Overdue Turns',
    allPatients: 'All Patients',
    searchPlaceholder: 'Search by patient name, ID or room...',
    filter: 'Filter',
    patient: 'Patient',
    lastTurn: 'Last Turn',
    nextTurnDue: 'Next Turn Due',
    action: 'Action',
    details: 'Details',
    showing: 'Showing',
    to: 'to',
    of: 'of',
    previous: 'Previous',
    next: 'Next',
    loadingPatients: 'Loading patients...',
    retry: 'Retry',
    noPatientsFound: 'No patients found matching your criteria',
    minsAgo: 'mins ago',
    justNow: 'Just now',
    hoursAgo: 'hours ago',
    daysAgo: 'days ago',
    requiresFrequentTurning: 'Requires frequent turning (q2h)',
    immediateActionNeeded: 'Immediate action needed',
    admittedToday: 'admitted today',
    
    // Patient Detail
    patientMonitoring: 'Patient Monitoring',
    pressureUlcerPrevention: 'Pressure Ulcer Prevention',
    realTimeMonitoring: 'Real-time monitoring and risk assessment',
    history: 'History',
    updateNotes: 'Update Notes',
    currentVitals: 'Current Vitals',
    bloodPressure: 'Blood Pressure',
    bloodSugar: 'Blood Sugar',
    thermalMonitoring: 'Thermal Monitoring',
    signalLost: 'Signal Lost',
    unableToConnect: 'Unable to establish connection with thermal unit.',
    configureSource: 'Configure Source',
    aiCareAssistant: 'AI Care Assistant',
    realTimeAnalysis: 'Real-time analysis based on last 24h',
    loadingAIAnalysis: 'Loading AI analysis...',
    aiError: 'AI Data Loading Error',
    noAIDataAvailable: 'No AI Data Available',
    aiDataNotAvailableYet: 'Thermal data is not yet available for this patient. AI analysis will appear once data is collected.',
    status: 'Status',
    normal: 'Normal',
    riskFactors: 'Risk Factors',
    bedsoreDevelopment: 'Bedsore Development',
    recommendedActions: 'Recommended Actions',
    maintainMonitoring: 'Maintain monitoring',
    continueStandardProtocols: 'Continue standard protocols for next 4h.',
    visualInspection: 'Visual Inspection',
    checkLowerBack: 'Check lower back area at 14:00.',
    updateDietaryLog: 'Update Dietary Log',
    verifySugarIntake: 'Verify sugar intake for lunch.',
    aiRecommendationsDisclaimer: 'AI recommendations support clinical judgment, not replace it.',
    configureCameraIP: 'Configure Camera IP',
    updateThermalCamera: 'Update thermal camera server address',
    cameraIPAddress: 'Camera IP Address',
    enterIPAddress: 'Enter the IP address of the thermal camera server',
    bmi: 'BMI',
    bloodType: 'Blood Type',
  },
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('ko'); // Korean as default

  const t = (key) => {
    return translations[language][key] || key;
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'ko' ? 'en' : 'ko');
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export default LanguageContext;

