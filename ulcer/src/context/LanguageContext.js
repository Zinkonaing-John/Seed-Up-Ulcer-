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

