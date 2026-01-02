import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  getPatientById, 
  getRiskLevel, 
  updatePatient,
  calculateBMI,
  calculateBradenScore
} from '../data/patients';
import { llmAPI } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import EditPatientModal from '../components/EditPatientModal';
import PatientHistoryModal from '../components/PatientHistoryModal';

function PatientDetail() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const [patient, setPatient] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [aiResponse, setAiResponse] = useState(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiError, setAiError] = useState(null);
  const [cameraIP, setCameraIP] = useState(() => {
    // Load from localStorage or use default
    return localStorage.getItem('thermalCameraIP') || '192.168.10.108';
  });
  const [isCameraConfigOpen, setIsCameraConfigOpen] = useState(false);
  const [cameraIPInput, setCameraIPInput] = useState('');

  // Fetch patient data
  const fetchPatient = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getPatientById(patientId);
      setPatient(data);
    } catch (err) {
      console.error('Failed to fetch patient:', err);
      setError(err.message || 'Failed to load patient data');
    } finally {
      setIsLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    fetchPatient();
  }, [fetchPatient]);

  // Fetch AI recommendations
  const fetchAIRecommendations = useCallback(async () => {
    if (!patient?.id) return;
    
    setIsLoadingAI(true);
    setAiError(null);
    
    try {
      const prediction = await llmAPI.getPressureUlcerPrediction(patient.id);
      setAiResponse(prediction);
    } catch (err) {
      console.error('Failed to fetch AI recommendations:', err);
      setAiError(err.message || 'Failed to load AI recommendations');
      setAiResponse(null);
    } finally {
      setIsLoadingAI(false);
    }
  }, [patient?.id]);

  // Fetch AI recommendations when patient loads
  useEffect(() => {
    if (patient?.id) {
      fetchAIRecommendations();
    }
  }, [patient?.id, fetchAIRecommendations]);

  const handleSavePatient = async (updatedData) => {
    try {
      const saved = await updatePatient(patientId, updatedData);
      setPatient(saved);
      setIsEditModalOpen(false);
    } catch (err) {
      console.error('Failed to update patient:', err);
      alert('Failed to save changes');
    }
  };

  // Handle camera IP configuration
  const handleOpenCameraConfig = () => {
    setCameraIPInput(cameraIP);
    setIsCameraConfigOpen(true);
  };

  const handleSaveCameraIP = () => {
    // Validate IP format (basic validation)
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipRegex.test(cameraIPInput)) {
      alert('Please enter a valid IP address (e.g., 192.168.1.1)');
      return;
    }
    
    setCameraIP(cameraIPInput);
    localStorage.setItem('thermalCameraIP', cameraIPInput);
    setIsCameraConfigOpen(false);
  };

  // Get patient initials
  const getInitials = (name) => {
    if (!name) return '??';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 1).toUpperCase();
  };

  // Get risk level label
  const getRiskLabel = (riskScore) => {
    const riskLevel = getRiskLevel(riskScore || 0);
    if (riskLevel === 'critical' || riskLevel === 'high') {
      return t('highRisk');
    } else if (riskLevel === 'moderate') {
      return t('moderateRisk');
    }
    return t('lowRisk');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500">{language === 'ko' ? '로딩 중...' : 'Loading...'}</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !patient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">{language === 'ko' ? '환자를 찾을 수 없습니다' : 'Patient Not Found'}</h1>
          <button onClick={() => navigate('/')}
            className="px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-500 transition-all shadow-md">
            {t('backToDashboard')}
          </button>
        </div>
      </div>
    );
  }

  const initials = getInitials(patient.name);
  const bmi = calculateBMI(patient.height_cm, patient.weight_kg);
  const riskLevel = getRiskLevel(patient.riskScore || 0);
  const riskLabel = getRiskLabel(patient.riskScore || 0);
  const bradenScore = patient.bradenScore || calculateBradenScore(patient);

  return (
    <div className="bg-slate-50 text-slate-600 font-sans min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-[1600px] mx-auto px-6 py-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white shadow-lg shadow-teal-500/20">
                <span className="font-bold text-lg">{initials}</span>
            </div>
            <div>
                <h1 className="text-lg font-bold text-slate-800 leading-tight">{t('patientMonitoring')}</h1>
                <nav className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                  <a 
                    onClick={() => navigate('/')} 
                    className="hover:text-teal-600 transition-colors cursor-pointer"
                  >
                    {t('dashboard')}
                  </a>
                  <span className="material-symbols-outlined text-[10px]">chevron_right</span>
                  <span className="text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">
                    {patient.room_number || 'N/A'}
                  </span>
                </nav>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsHistoryModalOpen(true)}
                className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-600 rounded-lg text-sm font-medium transition-all hover:bg-slate-50"
              >
                <span className="material-symbols-outlined text-[18px]">history</span>
                <span>{t('history')}</span>
            </button>
              <div className="h-6 w-px bg-slate-200 mx-1"></div>
              <button 
                onClick={() => setIsEditModalOpen(true)}
                className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-all shadow-lg shadow-slate-200"
              >
                <span className="material-symbols-outlined text-[18px]">edit_note</span>
                <span>{t('updateNotes')}</span>
            </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Sidebar - Patient Info */}
          <section className="lg:col-span-3 space-y-6">
            {/* Patient Card */}
            <div className="bg-white rounded-2xl shadow-card border border-slate-200 overflow-hidden">
              <div className="p-6 text-center border-b border-slate-100 relative">
                <div className="absolute top-4 right-4">
                  <span className={`inline-flex items-center justify-center px-2 py-1 rounded-md text-xs font-bold border ${
                    riskLevel === 'high' || riskLevel === 'critical' 
                      ? 'bg-rose-50 text-rose-600 border-rose-100'
                      : riskLevel === 'moderate'
                      ? 'bg-orange-50 text-orange-600 border-orange-100'
                      : 'bg-teal-50 text-teal-600 border-teal-100'
                  }`}>
                    {riskLabel}
                  </span>
                </div>
                <div className="w-24 h-24 mx-auto bg-slate-100 rounded-full mb-4 flex items-center justify-center text-3xl font-bold text-slate-400 border-4 border-white shadow-sm">
                  {initials}
                </div>
                <h2 className="text-xl font-bold text-slate-900">{patient.name}</h2>
                <p className="text-sm text-slate-500 mt-1">
                  {patient.gender === 'M' ? t('male') : t('female')}, {patient.age} {t('years')}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">ID: #{patient.id}</p>
              </div>
              <div className="grid grid-cols-2 divide-x divide-slate-100 border-b border-slate-100">
                <div className="p-4 text-center">
                  <span className="block text-xs font-medium text-slate-400 uppercase tracking-wider">{t('height')}</span>
                  <span className="block text-lg font-bold text-slate-700 mt-1">
                    {patient.height_cm || '--'} <span className="text-xs font-normal text-slate-400">cm</span>
                  </span>
                </div>
                <div className="p-4 text-center">
                  <span className="block text-xs font-medium text-slate-400 uppercase tracking-wider">{t('weight')}</span>
                  <span className="block text-lg font-bold text-slate-700 mt-1">
                    {patient.weight_kg || '--'} <span className="text-xs font-normal text-slate-400">kg</span>
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 divide-x divide-slate-100">
                <div className="p-4 text-center">
                  <span className="block text-xs font-medium text-slate-400 uppercase tracking-wider">{t('bmi')}</span>
                  <span className="block text-lg font-bold text-teal-600 mt-1">{bmi || '--'}</span>
                </div>
                <div className="p-4 text-center">
                  <span className="block text-xs font-medium text-slate-400 uppercase tracking-wider">{t('bloodType')}</span>
                  <span className="block text-lg font-bold text-slate-700 mt-1">--</span>
                </div>
              </div>
              </div>

            {/* Current Vitals */}
            <div className="bg-white rounded-2xl shadow-card border border-slate-200 p-5">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-teal-500">ecg_heart</span>
                {t('currentVitals')}
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-rose-500 shadow-sm">
                      <span className="material-symbols-outlined text-[18px]">favorite</span>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">{t('bloodPressure')}</p>
                      <p className="text-sm font-bold text-slate-700">
                        {patient.blood_pressure || '--/--'} mmHg
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-blue-500 shadow-sm">
                      <span className="material-symbols-outlined text-[18px]">water_drop</span>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">{t('bloodSugar')}</p>
                      <p className="text-sm font-bold text-slate-700">-- mg/dL</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-800 mb-3">{t('diagnosis')}</h3>
                <div className="flex flex-wrap gap-2">
                  {patient.diagnosis && (
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium border border-slate-200">
                      {patient.diagnosis}
                    </span>
                  )}
                  {patient.has_ulcer && patient.ulcer_stage && (
                    <span className="px-3 py-1 bg-rose-50 text-rose-600 rounded-lg text-xs font-medium border border-rose-100">
                      Bedsore Stage {patient.ulcer_stage}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Center - Thermal Monitoring */}
          <section className="lg:col-span-5 h-full flex flex-col">
            <div className="bg-white rounded-2xl shadow-card border border-slate-200 flex flex-col h-full overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
                    <span className="material-symbols-outlined text-[20px]">videocam</span>
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-800 text-sm">{t('thermalMonitoring')}</h2>
                    <p className="text-xs text-slate-400 font-mono">IP: {cameraIP}</p>
                </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-teal-50 text-teal-600 border border-teal-100 uppercase tracking-wide">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                    </span>
                    {t('liveFeed')}
                  </span>
                  <button 
                    onClick={handleOpenCameraConfig}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                    title={t('configureCameraIP')}
                  >
                    <span className="material-symbols-outlined text-[20px]">settings</span>
                  </button>
                </div>
              </div>
              <div className="flex-1 bg-slate-900 relative group overflow-hidden flex flex-col items-center justify-center min-h-[500px]">
                <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px'}}></div>
                <div className="relative z-10 text-center p-8 backdrop-blur-sm bg-slate-800/50 rounded-2xl border border-slate-700/50 max-w-sm w-full mx-4">
                  <div className="w-16 h-16 mx-auto bg-slate-800 rounded-full flex items-center justify-center mb-4 border border-slate-700 shadow-xl">
                    <span className="material-symbols-outlined text-3xl text-slate-500">wifi_off</span>
                  </div>
                  <h3 className="text-white font-medium mb-1">{t('signalLost')}</h3>
                  <p className="text-slate-400 text-xs mb-6">{t('unableToConnect')}</p>
                  <div className="flex flex-col gap-2">
                    <button className="w-full bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-teal-900/20">
                      {t('retryConnection')}
                    </button>
                    <button 
                      onClick={handleOpenCameraConfig}
                      className="w-full bg-transparent hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-slate-600"
                    >
                      {t('configureSource')}
                    </button>
                  </div>
                </div>
                <div className="absolute top-4 left-4 text-[10px] text-teal-400 font-mono bg-black/40 px-2 py-1 rounded backdrop-blur-md">
                  TEMP: --.-°C
                </div>
                <div className="absolute bottom-4 right-4 text-[10px] text-slate-500 font-mono">
                  CAM_ID_02
                </div>
              </div>
            </div>
          </section>

          {/* Right Sidebar - AI Care Assistant */}
          <section className="lg:col-span-4 h-full">
            <div className="bg-white rounded-2xl shadow-card border border-slate-200 h-full flex flex-col">
              <div className="p-6 border-b border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20">
                      <span className="material-symbols-outlined text-[22px]">smart_toy</span>
                    </div>
                    <div>
                      <h2 className="font-bold text-slate-800">{t('aiCareAssistant')}</h2>
                      <p className="text-xs text-slate-400">{t('realTimeAnalysis')}</p>
                    </div>
                  </div>
                  <button 
                    onClick={fetchAIRecommendations}
                    disabled={isLoadingAI}
                    className="p-2 hover:bg-slate-50 rounded-full text-slate-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className={`material-symbols-outlined text-[20px] ${isLoadingAI ? 'animate-spin' : ''}`}>
                      {isLoadingAI ? 'sync' : 'refresh'}
                    </span>
                  </button>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col gap-6 overflow-y-auto">
                {isLoadingAI ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-2 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
                      <p className="text-xs text-slate-400">{t('loadingAIAnalysis')}</p>
                    </div>
                  </div>
                ) : aiError ? (
                  <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-red-500">error</span>
                      <div className="flex-1">
                        <h4 className="font-bold text-red-800 text-sm">{t('aiError')}</h4>
                        <p className="text-xs text-red-600 mt-1 leading-relaxed">{aiError}</p>
                        {aiError.includes('404') || aiError.includes('not found') ? (
                          <p className="text-xs text-red-500 mt-2 italic">
                            {t('aiDataNotAvailableYet')}
                          </p>
                        ) : null}
                        <button
                          onClick={fetchAIRecommendations}
                          disabled={isLoadingAI}
                          className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className={`material-symbols-outlined text-[16px] ${isLoadingAI ? 'animate-spin' : ''}`}>
                            {isLoadingAI ? 'sync' : 'refresh'}
                          </span>
                          <span>{t('retry')}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : aiResponse ? (
                  <div className={`bg-gradient-to-r rounded-xl p-4 flex items-start gap-4 border ${
                    aiResponse.riskLevel === '위험' || aiResponse.riskLevel === '고위험' || aiResponse.riskLevel === '위급'
                      ? 'from-red-50 to-white border-red-100'
                      : aiResponse.riskLevel === '중간' || aiResponse.riskLevel === '주의'
                      ? 'from-orange-50 to-white border-orange-100'
                      : 'from-teal-50 to-white border-teal-100'
                  }`}>
                    <div className={`bg-white p-2 rounded-full shadow-sm border ${
                      aiResponse.riskLevel === '위험' || aiResponse.riskLevel === '고위험' || aiResponse.riskLevel === '위급'
                        ? 'border-red-50'
                        : aiResponse.riskLevel === '중간' || aiResponse.riskLevel === '주의'
                        ? 'border-orange-50'
                        : 'border-teal-50'
                    }`}>
                      <span className={`material-symbols-outlined ${
                        aiResponse.riskLevel === '위험' || aiResponse.riskLevel === '고위험' || aiResponse.riskLevel === '위급'
                          ? 'text-red-500'
                          : aiResponse.riskLevel === '중간' || aiResponse.riskLevel === '주의'
                          ? 'text-orange-500'
                          : 'text-teal-500'
                      }`}>
                        {aiResponse.riskLevel === '위험' || aiResponse.riskLevel === '고위험' || aiResponse.riskLevel === '위급'
                          ? 'warning'
                          : 'check_circle'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-800 text-sm">
                        {t('status')}: {aiResponse.riskLevel || t('normal')}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {aiResponse.predictionMessage || (language === 'ko' ? '특정 분석을 사용할 수 없습니다.' : 'No specific analysis available.')}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-slate-400">info</span>
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">{t('noAIDataAvailable')}</h4>
                        <p className="text-xs text-slate-500 mt-1">{t('aiDataNotAvailableYet')}</p>
                      </div>
                    </div>
                  </div>
                )}
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                    {t('riskFactors')}
                  </h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-semibold text-slate-700">{t('bedsoreDevelopment')}</span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                          riskLevel === 'high' || riskLevel === 'critical'
                            ? 'text-red-500 bg-red-50'
                            : riskLevel === 'moderate'
                            ? 'text-orange-500 bg-orange-50'
                            : 'text-teal-500 bg-teal-50'
                        }`}>
                          {riskLabel}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
                        <div 
                          className={`h-1.5 rounded-full ${
                            riskLevel === 'high' || riskLevel === 'critical'
                              ? 'bg-red-400'
                              : riskLevel === 'moderate'
                              ? 'bg-orange-400'
                              : 'bg-teal-400'
                          }`}
                          style={{width: `${Math.min(100, (patient.riskScore || 0) * 100)}%`}}
                        ></div>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-2">
                        {language === 'ko' ? '브레이든 점수' : 'Braden Score'}: {bradenScore}/12
                      </p>
                    </div>
                  </div>
                </div>
                {aiResponse && (
                  <div className="flex-1">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                      {t('recommendedActions')}
                    </h4>
                    <ul className="space-y-2">
                      {(() => {
                        const recommendations = [];
                        const riskLevel = aiResponse.riskLevel;
                        
                        if (riskLevel === '위험' || riskLevel === '고위험' || riskLevel === '위급') {
                          recommendations.push(
                            { title: language === 'ko' ? '즉시 재배치' : 'Immediate Repositioning', desc: language === 'ko' ? '2시간마다 환자 재배치' : 'Reposition patient every 2 hours' },
                            { title: language === 'ko' ? '압력 지점 모니터링' : 'Monitor Pressure Points', desc: language === 'ko' ? '압력 지점을 면밀히 확인' : 'Check pressure points closely' },
                            { title: language === 'ko' ? '압력 완화 적용' : 'Apply Pressure Relief', desc: language === 'ko' ? '압력 완화 장치 사용' : 'Use pressure-relieving devices' },
                            { title: language === 'ko' ? '의료진 보고' : 'Report to Medical Staff', desc: language === 'ko' ? '즉시 의료진에 알림' : 'Notify healthcare team immediately' }
                          );
                        } else if (riskLevel === '중간' || riskLevel === '주의') {
                          recommendations.push(
                            { title: language === 'ko' ? '정기적 재배치' : 'Regular Repositioning', desc: language === 'ko' ? '표준 재배치 일정 계속' : 'Continue standard repositioning schedule' },
                            { title: language === 'ko' ? '일일 피부 평가' : 'Daily Skin Assessment', desc: language === 'ko' ? '일일 피부 검사 수행' : 'Perform daily skin inspections' },
                            { title: language === 'ko' ? '영양 및 수분 공급' : 'Nutrition & Hydration', desc: language === 'ko' ? '충분한 영양 및 수분 공급 보장' : 'Ensure adequate nutrition and hydration' }
                          );
                        } else {
                          recommendations.push(
                            { title: t('maintainMonitoring'), desc: t('continueStandardProtocols') },
                            { title: language === 'ko' ? '정기적 평가' : 'Regular Assessment', desc: language === 'ko' ? '정기적 모니터링 일정 계속' : 'Continue regular monitoring schedule' }
                          );
                        }
                        
                        return recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors cursor-pointer group">
                            <div className="mt-0.5 w-5 h-5 rounded border-2 border-slate-300 group-hover:border-teal-500 flex items-center justify-center transition-colors">
                              <div className="w-2.5 h-2.5 rounded-sm bg-teal-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-700 group-hover:text-slate-900">{rec.title}</p>
                              <p className="text-xs text-slate-400 mt-0.5">{rec.desc}</p>
                            </div>
                          </li>
                        ));
                      })()}
                    </ul>
                </div>
              )}
            </div>
              <div className="p-4 bg-slate-50 border-t border-slate-100 text-center rounded-b-2xl">
                <p className="text-[10px] text-slate-400 italic">
                  {t('aiRecommendationsDisclaimer')}
                </p>
          </div>
        </div>
          </section>
        </div>
      </main>

      {/* Modals */}
      <EditPatientModal 
        patient={patient} 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)} 
        onSave={handleSavePatient} 
      />
      <PatientHistoryModal 
        patient={patient} 
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)} 
      />

      {/* Camera IP Configuration Modal */}
      {isCameraConfigOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsCameraConfigOpen(false)}></div>
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
                  <span className="material-symbols-outlined text-[24px]">videocam</span>
                </div>
                <div>
                  <h2 className="font-bold text-slate-800">{t('configureCameraIP')}</h2>
                  <p className="text-xs text-slate-400">{t('updateThermalCamera')}</p>
                </div>
              </div>
              <button 
                onClick={() => setIsCameraConfigOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {t('cameraIPAddress')}
                </label>
                <input
                  type="text"
                  value={cameraIPInput}
                  onChange={(e) => setCameraIPInput(e.target.value)}
                  placeholder="192.168.1.1"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
                <p className="text-xs text-slate-400 mt-1.5">
                  {t('enterIPAddress')}
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
                <button
                  onClick={() => setIsCameraConfigOpen(false)}
                  className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-600 rounded-lg font-medium hover:bg-slate-200 transition-colors"
                >
                  {t('cancel')}
                </button>
                <button
                  onClick={handleSaveCameraIP}
                  className="flex-1 px-4 py-2.5 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors shadow-lg shadow-teal-900/20"
                >
                  {t('save')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PatientDetail;
