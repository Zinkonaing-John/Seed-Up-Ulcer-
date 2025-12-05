import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

function PatientHistoryModal({ isOpen, onClose, patient }) {
  const { language } = useLanguage();
  const [imageHistory, setImageHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const previousPredictionRef = useRef(null); // Store previous prediction for comparison

  const labels = {
    ko: {
      title: '열화상 이미지 비교',
      patientId: '환자 ID',
      riskLevel: '위험도',
      before: '이전 이미지',
      now: '현재 이미지',
      aiResponse: 'AI 분석 결과',
      date: '촬영일시',
      close: '닫기',
      noHistory: '이미지 이력이 없습니다',
      loading: '로딩 중...',
      current: '현재',
      previous: '이전',
      none: '없음',
    },
    en: {
      title: 'Thermal Image Comparison',
      patientId: 'Patient ID',
      riskLevel: 'Risk Level',
      before: 'Previous Image',
      now: 'Current Image',
      aiResponse: 'AI Analysis Result',
      date: 'Captured At',
      close: 'Close',
      noHistory: 'No image history available',
      loading: 'Loading...',
      current: 'Current',
      previous: 'Previous',
      none: 'None',
    },
  };

  const t = labels[language] || labels.en;

  // Compare two predictions to check if data has meaningfully changed
  // Only compares risk level - ignores message wording variations
  const hasPredictionChanged = (oldPred, newPred) => {
    if (!oldPred && !newPred) return false; // Both null
    if (!oldPred || !newPred) return true; // One is null, other isn't
    
    // ONLY compare risk level - this is the primary indicator of change
    // Message variations from AI are ignored if risk level stays the same
    // This prevents false updates when AI generates slightly different wording for the same image
    const oldRisk = oldPred.riskLevel || null;
    const newRisk = newPred.riskLevel || null;
    
    // Risk level changed - definitely meaningful
    return oldRisk !== newRisk;
  };

  // Fetch image history and AI predictions when modal opens or patient changes
  useEffect(() => {
    if (!isOpen || !patient) return;

    // Reset previous prediction when modal opens or patient changes
    previousPredictionRef.current = null;

    // Check if response indicates no thermal image data
    const hasNoData = (prediction) => {
      if (!prediction || !prediction.predictionMessage) return true;
      
      const noDataIndicators = [
        '열화상 데이터가 없어',
        '아직 열화상 데이터가 없어',
        '데이터가 없어',
        '평가할 수 없습니다',
        'no thermal image',
        'no data available',
        'cannot be assessed'
      ];
      
      const message = prediction.predictionMessage.toLowerCase();
      return noDataIndicators.some(indicator => message.includes(indicator.toLowerCase()));
    };

    const fetchImageHistory = async () => {
      setIsLoading(true);
      
      try {
        // Fetch latest AI prediction (current) from backend
        const currentPrediction = await api.llm.getPressureUlcerPrediction(patient.id);
        
        // Check if data has actually changed
        const hasChanged = hasPredictionChanged(previousPredictionRef.current, currentPrediction);
        
        if (!hasChanged) {
          console.log(`📊 No changes detected for patient ${patient.id}, skipping update`);
          setIsLoading(false);
          return; // No update needed
        }
        
        console.log(`🔄 Changes detected for patient ${patient.id}, updating UI`);
        previousPredictionRef.current = currentPrediction; // Store for next comparison
        
        // Check if backend indicates no thermal image data
        if (hasNoData(currentPrediction)) {
          // No data from backend - show nothing
          setImageHistory([]);
          return;
        }
        
        // Only use data from backend - no mock data
        const history = [
          {
            id: 'current',
            date: new Date().toISOString(),
            riskLevel: currentPrediction.riskLevel, // From AI response
            predictionMessage: currentPrediction.predictionMessage, // From AI response
            isCurrent: true,
          },
        ];

        // TODO: Fetch previous prediction from backend API when available
        // For now, only show current if we have data
        setImageHistory(history);
      } catch (error) {
        console.error('Failed to fetch image history:', error);
        // Set empty array on error - show nothing
        setImageHistory([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Fetch image history
    fetchImageHistory();
  }, [isOpen, patient?.id]);

  if (!isOpen) return null;

  // Only use data from backend - no default/mock values
  const currentImage = imageHistory.find(img => img.isCurrent) || null;
  const previousImage = imageHistory.find(img => !img.isCurrent) || null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative w-full max-w-7xl max-h-[90vh] bg-white rounded-2xl shadow-2xl animate-slide-up overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-clinical-50 to-clinical-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-clinical-500 to-clinical-700 flex items-center justify-center shadow-md">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold text-slate-800">{t.title}</h2>
              <div className="flex items-center gap-4 mt-1">
                <p className="text-sm text-slate-600">
                  <span className="font-medium">{t.patientId}:</span> #{patient?.id}
                </p>
                {currentImage && (
                  <p className="text-sm text-slate-600">
                    <span className="font-medium">{t.riskLevel}:</span>{' '}
                    {currentImage.riskLevel ? (
                      <span className={`font-bold ${
                        currentImage.riskLevel === '위험' || currentImage.riskLevel === '고위험' || currentImage.riskLevel === '위급'
                          ? 'text-red-600'
                          : currentImage.riskLevel === '중간' || currentImage.riskLevel === '주의'
                          ? 'text-amber-600'
                          : 'text-emerald-600'
                      }`}>
                        {currentImage.riskLevel}
                      </span>
                    ) : (
                      <span className="text-slate-400">{t.none}</span>
                    )}
                  </p>
                )}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-clinical-200 text-slate-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-clinical-200 border-t-clinical-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-500">{t.loading}</p>
              </div>
            </div>
          ) : currentImage ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Previous Image Card - Only show if we have previous data from backend */}
              {previousImage ? (
                <div className="bg-slate-50 rounded-xl border-2 border-slate-200 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                      <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {t.before}
                    </h3>
                    <span className="px-2 py-1 bg-slate-200 text-slate-600 text-xs rounded-full font-medium">
                      {t.previous}
                    </span>
                  </div>

                  {/* Date */}
                  <p className="text-xs text-slate-500 mb-3">
                    {t.date}: {previousImage.date 
                      ? new Date(previousImage.date).toLocaleString(language === 'ko' ? 'ko-KR' : 'en-US')
                      : t.none
                    }
                  </p>

                  {/* Risk Level - Always show, display "없음" if no data */}
                  <div className="mb-3">
                    <p className="text-xs text-slate-500 mb-1">{t.riskLevel}</p>
                    {previousImage.riskLevel ? (
                      <span className={`inline-block px-3 py-1.5 rounded-lg font-bold text-sm ${
                        previousImage.riskLevel === '위험' || previousImage.riskLevel === '고위험' || previousImage.riskLevel === '위급'
                          ? 'bg-red-100 text-red-700'
                          : previousImage.riskLevel === '중간' || previousImage.riskLevel === '주의'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {previousImage.riskLevel}
                      </span>
                    ) : (
                      <span className="inline-block px-3 py-1.5 rounded-lg font-medium text-sm bg-slate-100 text-slate-500">
                        {t.none}
                      </span>
                    )}
                  </div>

                  {/* AI Response - Always show, display "없음" if no data */}
                  <div>
                    <p className="text-xs text-slate-500 mb-2">{t.aiResponse}</p>
                    <div className="bg-white rounded-lg p-3 border border-slate-200">
                      <p className="text-sm text-slate-700 leading-relaxed">
                        {previousImage.predictionMessage || t.none}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 rounded-xl border-2 border-slate-200 p-5 flex items-center justify-center">
                  <p className="text-slate-400 text-sm">
                    {language === 'ko' ? '이전 데이터 없음' : 'No previous data'}
                  </p>
                </div>
              )}

              {/* Current Image Card - Only show if we have current data from backend */}
              <div className="bg-clinical-50 rounded-xl border-2 border-clinical-300 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                    <svg className="w-5 h-5 text-clinical-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    {t.now}
                  </h3>
                  <span className="px-2 py-1 bg-clinical-500 text-white text-xs rounded-full font-bold">
                    {t.current}
                  </span>
                </div>

                {/* Date */}
                <p className="text-xs text-slate-500 mb-3">
                  {t.date}: {currentImage.date 
                    ? new Date(currentImage.date).toLocaleString(language === 'ko' ? 'ko-KR' : 'en-US')
                    : t.none
                  }
                </p>

                {/* Risk Level - Always show, display "없음" if no data */}
                <div className="mb-3">
                  <p className="text-xs text-slate-500 mb-1">{t.riskLevel}</p>
                  {currentImage.riskLevel ? (
                    <span className={`inline-block px-3 py-1.5 rounded-lg font-bold text-sm ${
                      currentImage.riskLevel === '위험' || currentImage.riskLevel === '고위험' || currentImage.riskLevel === '위급'
                        ? 'bg-red-100 text-red-700'
                        : currentImage.riskLevel === '중간' || currentImage.riskLevel === '주의'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {currentImage.riskLevel}
                    </span>
                  ) : (
                    <span className="inline-block px-3 py-1.5 rounded-lg font-medium text-sm bg-slate-100 text-slate-500">
                      {t.none}
                    </span>
                  )}
                </div>

                {/* AI Response - Always show, display "없음" if no data */}
                <div>
                  <p className="text-xs text-slate-500 mb-2">{t.aiResponse}</p>
                  <div className="bg-white rounded-lg p-3 border border-clinical-200">
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {currentImage.predictionMessage || t.none}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500">
              {t.noHistory}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-clinical-600 text-white font-medium hover:bg-clinical-700 transition-colors"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PatientHistoryModal;

