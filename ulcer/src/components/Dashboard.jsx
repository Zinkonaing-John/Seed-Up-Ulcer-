import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import PatientCard from './PatientCard';
import StatsPanel from './StatsPanel';
import CareInstructions from './CareInstructions';
import AddPatientModal from './AddPatientModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import LanguageToggle from './LanguageToggle';
import { getAllPatients, getRiskLevel, createPatient, deletePatient } from '../data/patients';
import config from '../config';

function Dashboard() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [filterRisk, setFilterRisk] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const labels = {
    ko: {
      title: '욕창 예방',
      subtitle: '임상 위험 평가 대시보드',
      liveMonitoring: '실시간 모니터링',
      lastUpdated: '최종 업데이트',
      addPatient: '환자 추가',
      patientRiskMonitor: '환자 위험 모니터',
      noPatients: '선택된 필터와 일치하는 환자가 없습니다',
      loading: '환자 데이터 로딩 중...',
      error: '백엔드 서버에 연결할 수 없습니다',
      errorDetails: 'Spring Boot 서버가 실행 중인지 확인하세요',
      retry: '다시 연결',
      startBackend: '백엔드 시작 방법',
      all: '전체',
      critical: '위험',
      high: '높음',
      moderate: '중간',
      low: '낮음',
    },
    en: {
      title: 'Pressure Ulcer Prevention',
      subtitle: 'Clinical Risk Assessment Dashboard',
      liveMonitoring: 'Live Monitoring',
      lastUpdated: 'Last updated',
      addPatient: 'Add Patient',
      patientRiskMonitor: 'Patient Risk Monitor',
      noPatients: 'No patients match the selected filter',
      loading: 'Loading patient data...',
      error: 'Cannot connect to backend server',
      errorDetails: 'Please ensure Spring Boot server is running',
      retry: 'Retry Connection',
      startBackend: 'How to start backend',
      all: 'All',
      critical: 'Critical',
      high: 'High',
      moderate: 'Moderate',
      low: 'Low',
    },
  };

  const t = labels[language] || labels.en;

  // Fetch patients from backend
  const fetchPatients = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAllPatients();
      setPatients(data);
      if (data.length > 0 && !selectedPatient) {
        setSelectedPatient(data[0]);
      }
    } catch (err) {
      console.error('Failed to fetch patients:', err);
      setError(err.message || t.error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedPatient, t.error]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  // Filter patients by risk level
  const filteredPatients = patients.filter(patient => {
    if (filterRisk === 'all') return true;
    return getRiskLevel(patient.riskScore) === filterRisk;
  });

  // Calculate stats
  const stats = {
    total: patients.length,
    critical: patients.filter(p => getRiskLevel(p.riskScore) === 'critical').length,
    high: patients.filter(p => getRiskLevel(p.riskScore) === 'high').length,
    moderate: patients.filter(p => getRiskLevel(p.riskScore) === 'moderate').length,
    low: patients.filter(p => getRiskLevel(p.riskScore) === 'low').length,
  };

  const handlePatientClick = (patient) => {
    setSelectedPatient(patient);
  };

  const handleViewDetails = (patientId) => {
    navigate(`/patient/${patientId}`);
  };

  const handleAddPatient = async (newPatientData) => {
    try {
      const newPatient = await createPatient(newPatientData);
      setPatients(prev => [newPatient, ...prev]);
      setSelectedPatient(newPatient);
      setIsAddModalOpen(false);
    } catch (err) {
      console.error('Failed to create patient:', err);
      alert(language === 'ko' ? '환자 등록에 실패했습니다.' : 'Failed to create patient.');
    }
  };

  const handleDeleteClick = (patientId) => {
    const patient = patients.find(p => p.id === patientId);
    setPatientToDelete(patient);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!patientToDelete) return;

    try {
      await deletePatient(patientToDelete.id);
      const updatedPatients = patients.filter(p => p.id !== patientToDelete.id);
      setPatients(updatedPatients);
      if (selectedPatient?.id === patientToDelete.id) {
        setSelectedPatient(updatedPatients[0] || null);
      }
      setPatientToDelete(null);
      setIsDeleteModalOpen(false);
    } catch (err) {
      console.error('Failed to delete patient:', err);
      alert(language === 'ko' ? '환자 삭제에 실패했습니다.' : 'Failed to delete patient.');
    }
  };

  return (
    <div className="min-h-screen p-6 lg:p-8 bg-gradient-to-br from-gray-50 to-gray-100 text-slate-800">
      {/* Header */}
      <header className="mb-8 animate-fade-in">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-clinical-500 to-clinical-700 flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold text-slate-800 tracking-tight">{t.title}</h1>
              <p className="text-slate-500 font-body">{t.subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg shadow-emerald-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              {t.addPatient}
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4 flex-wrap">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-clinical-100 border border-clinical-200">
            <span className="w-2 h-2 rounded-full bg-clinical-500 animate-pulse"></span>
            <span className="text-sm text-clinical-700 font-medium">{t.liveMonitoring}</span>
          </span>
          <span className="text-slate-500 text-sm">
            {t.lastUpdated}: {new Date().toLocaleTimeString()}
          </span>
        </div>
      </header>

      {/* Stats Panel */}
      <StatsPanel stats={stats} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
        {/* Patient List */}
        <div className="xl:col-span-2 glass rounded-2xl p-6 animate-slide-up delay-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-semibold text-slate-800">{t.patientRiskMonitor}</h2>
            <div className="flex gap-2">
              {['all', 'critical', 'high', 'moderate', 'low'].map((level) => (
                <button
                  key={level}
                  onClick={() => setFilterRisk(level)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    filterRisk === level
                      ? 'bg-clinical-600 text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {t[level]}
                </button>
              ))}
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-12 h-12 border-4 border-clinical-200 border-t-clinical-600 rounded-full animate-spin mb-4"></div>
              <p className="text-slate-500">{t.loading}</p>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="text-center py-12 px-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-red-600 mb-2">{t.error}</h3>
              <p className="text-slate-600 mb-4">{t.errorDetails}</p>
              
              <div className="max-w-md mx-auto mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-left">
                <p className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {t.startBackend}
                </p>
                <div className="space-y-2 text-sm text-blue-800">
                  <p className="font-mono bg-slate-800 text-emerald-400 p-2 rounded text-xs">
                    cd your-spring-boot-project<br/>
                    ./mvnw spring-boot:run
                  </p>
                  <p className="text-xs">
                    <strong>{language === 'ko' ? 'API URL:' : 'API URL:'}</strong>{' '}
                    <code className="bg-blue-100 px-1 py-0.5 rounded">{config.API_BASE_URL}</code>
                  </p>
                </div>
              </div>

              <button
                onClick={fetchPatients}
                className="px-6 py-3 bg-clinical-600 text-white rounded-lg hover:bg-clinical-700 transition-colors font-medium flex items-center gap-2 mx-auto"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {t.retry}
              </button>
            </div>
          )}

          {/* Patient List */}
          {!isLoading && !error && (
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {filteredPatients.map((patient, index) => (
                <PatientCard
                  key={patient.id}
                  patient={patient}
                  isSelected={selectedPatient?.id === patient.id}
                  onClick={() => handlePatientClick(patient)}
                  onViewDetails={() => handleViewDetails(patient.id)}
                  onDelete={() => handleDeleteClick(patient.id)}
                  delay={index * 100}
                />
              ))}
              {filteredPatients.length === 0 && (
                <div className="text-center py-12 text-slate-500">{t.noPatients}</div>
              )}
            </div>
          )}
        </div>

        {/* Care Instructions Panel */}
        <div className="glass rounded-2xl p-6 animate-slide-up delay-300">
          <CareInstructions patient={selectedPatient} />
        </div>
      </div>

      {/* Modals */}
      <AddPatientModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddPatient}
      />
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => { setIsDeleteModalOpen(false); setPatientToDelete(null); }}
        onConfirm={handleConfirmDelete}
        patientName={patientToDelete?.name || ''}
      />
    </div>
  );
}

export default Dashboard;
