import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

function CareInstructions({ patient }) {
  const { language } = useLanguage();
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const previousPredictionRef = useRef(null); // Store previous prediction for comparison


  const labels = {
    ko: {
      title: 'AI 케어 권장사항',
      room: '병실',
      generating: '권장사항 생성 중...',
      offline: '오프라인 권장사항 사용 중',
      backendError: '백엔드 사용 불가',
      verify: '항상 임상적 판단으로 확인하세요',
      clickRefresh: '새로고침을 클릭하여 권장사항을 생성하세요',
      selectPatient: '환자를 선택하여 케어 지침을 확인하세요',
    },
    en: {
      title: 'AI Care Recommendations',
      room: 'Room',
      generating: 'Generating recommendations...',
      offline: 'Using offline recommendations',
      backendError: 'Backend unavailable',
      verify: 'Always verify with clinical judgment',
      clickRefresh: 'Click refresh to generate recommendations',
      selectPatient: 'Select a patient to view care instructions',
    },
  };

  const t = labels[language] || labels.en;

  // Check if response indicates no thermal image data
  const hasNoData = useCallback((prediction) => {
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
  }, []);

  // Format prediction response for display
  const formatPredictionResponse = useCallback((prediction) => {
    // If no data from backend, return empty string
    if (hasNoData(prediction)) {
      return '';
    }
    
    let formattedResponse = '';
    
    if (language === 'ko') {
      formattedResponse = `🔍 AI 욕창 위험도 분석\n\n`;
      formattedResponse += `위험도: ${prediction.riskLevel}\n\n`;
      formattedResponse += `📋 상세 분석:\n${prediction.predictionMessage}\n\n`;
      
      // Add care recommendations based on risk level
      if (prediction.riskLevel === '위험' || prediction.riskLevel === '고위험' || prediction.riskLevel === '위급') {
        formattedResponse += `⚠️ 권장 조치:\n`;
        formattedResponse += `• 2시간마다 체위 변경 필수\n`;
        formattedResponse += `• 압력 부위 집중 관찰\n`;
        formattedResponse += `• 압력 완화 기구 적용\n`;
        formattedResponse += `• 즉시 담당 의료진에게 보고\n`;
      } else if (prediction.riskLevel === '중간' || prediction.riskLevel === '주의') {
        formattedResponse += `✓ 권장 조치:\n`;
        formattedResponse += `• 정기적인 체위 변경 유지\n`;
        formattedResponse += `• 매일 피부 상태 확인\n`;
        formattedResponse += `• 적절한 영양 및 수분 공급\n`;
      } else {
        formattedResponse += `✓ 현재 상태 양호\n`;
        formattedResponse += `• 일반적인 케어 프로토콜 유지\n`;
        formattedResponse += `• 정기적인 관찰 지속\n`;
      }
    } else {
      formattedResponse = `🔍 AI Pressure Ulcer Risk Analysis\n\n`;
      formattedResponse += `Risk Level: ${prediction.riskLevel}\n\n`;
      formattedResponse += `📋 Detailed Analysis:\n${prediction.predictionMessage}\n\n`;
      
      // Add care recommendations based on risk level
      if (prediction.riskLevel === '위험' || prediction.riskLevel === '고위험' || prediction.riskLevel === '위급') {
        formattedResponse += `⚠️ Recommended Actions:\n`;
        formattedResponse += `• Reposition patient every 2 hours\n`;
        formattedResponse += `• Monitor pressure points closely\n`;
        formattedResponse += `• Apply pressure-relieving devices\n`;
        formattedResponse += `• Report to medical staff immediately\n`;
      } else if (prediction.riskLevel === '중간' || prediction.riskLevel === '주의') {
        formattedResponse += `✓ Recommended Actions:\n`;
        formattedResponse += `• Continue regular repositioning\n`;
        formattedResponse += `• Daily skin assessments\n`;
        formattedResponse += `• Ensure adequate nutrition and hydration\n`;
      } else {
        formattedResponse += `✓ Current status is good\n`;
        formattedResponse += `• Maintain standard care protocol\n`;
        formattedResponse += `• Continue regular monitoring\n`;
      }
    }
    
    return formattedResponse;
  }, [language, hasNoData]);

  // Compare two predictions to check if data has meaningfully changed
  // Only considers risk level changes as meaningful (ignores message wording variations)
  const hasPredictionChanged = useCallback((oldPred, newPred) => {
    if (!oldPred && !newPred) return false; // Both null
    if (!oldPred || !newPred) return true; // One is null, other isn't
    
    // ONLY compare risk level - this is the primary indicator of change
    // Message variations from AI are ignored if risk level stays the same
    // This prevents false updates when AI generates slightly different wording for the same image
    const oldRisk = oldPred.riskLevel || null;
    const newRisk = newPred.riskLevel || null;
    
    if (oldRisk !== newRisk) {
      return true; // Risk level changed - definitely meaningful
    }
    
    // Risk level is the same - no meaningful change
    // Even if message wording is slightly different, we ignore it
    return false;
  }, []);

  // Fetch AI recommendations from external LLM endpoint
  const fetchAIRecommendations = useCallback(async () => {
    if (!patient) return;

    setIsLoading(true);
    setError(null);

    try {
      // Call external LLM API for pressure ulcer prediction
      const prediction = await api.llm.getPressureUlcerPrediction(patient.id);
      
      // Check if data has actually changed
      const hasChanged = hasPredictionChanged(previousPredictionRef.current, prediction);
      
      if (!hasChanged) {
        console.log('📊 No changes detected, skipping update');
        setIsLoading(false);
        return;
      }
      
      console.log('🔄 Changes detected, updating UI');
      previousPredictionRef.current = prediction; // Store for next comparison
      
      // Check if backend indicates no data
      if (hasNoData(prediction)) {
        // No thermal image data - show nothing
        setAiResponse('');
        setError(null);
      } else {
        // Valid data from backend - format and display
        const formatted = formatPredictionResponse(prediction);
        setAiResponse(formatted);
        setError(null);
      }
      
      setIsLoading(false);
    } catch (err) {
      console.error('External LLM API Error:', err);
      setError(err.message);
      setAiResponse('');
      setIsLoading(false);
    }
  }, [patient, formatPredictionResponse, hasNoData, hasPredictionChanged]);

  // Fetch AI recommendations when patient changes
  useEffect(() => {
    if (!patient) return;

    // Reset previous prediction when patient changes
    previousPredictionRef.current = null;

    // Fetch AI recommendations
    fetchAIRecommendations();
  }, [patient?.id, fetchAIRecommendations]);

  if (!patient) {
    return (
      <div className="text-center py-12 text-slate-500">{t.selectPatient}</div>
    );
  }

  // Get risk level from AI response if available
  const getRiskLevelFromAI = () => {
    if (!aiResponse) return null;
    
    // Extract risk level from AI response
    const riskMatch = aiResponse.match(/위험도:\s*([^\n]+)/) || aiResponse.match(/Risk Level:\s*([^\n]+)/);
    if (riskMatch) {
      const riskLevel = riskMatch[1].trim();
      if (language === 'ko') {
        if (riskLevel === '위험' || riskLevel === '고위험' || riskLevel === '위급') {
          return { label: riskLevel, color: 'text-red-600', bg: 'bg-red-100' };
        } else if (riskLevel === '중간' || riskLevel === '주의') {
          return { label: riskLevel, color: 'text-amber-600', bg: 'bg-amber-100' };
        } else {
          return { label: riskLevel, color: 'text-emerald-600', bg: 'bg-emerald-100' };
        }
      } else {
        if (riskLevel === '위험' || riskLevel === '고위험' || riskLevel === '위급') {
          return { label: 'HIGH', color: 'text-red-600', bg: 'bg-red-100' };
        } else if (riskLevel === '중간' || riskLevel === '주의') {
          return { label: 'MODERATE', color: 'text-amber-600', bg: 'bg-amber-100' };
        } else {
          return { label: 'LOW', color: 'text-emerald-600', bg: 'bg-emerald-100' };
        }
      }
    }
    return null;
  };

  const risk = getRiskLevelFromAI();

  return (
    <div className="h-full flex flex-col bg-white rounded-2xl shadow-lg p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-clinical-500 to-clinical-700 flex items-center justify-center shadow-md">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="font-display text-lg font-semibold text-slate-800">{t.title}</h2>
        </div>

        <button onClick={fetchAIRecommendations} disabled={isLoading}
          className="p-2 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors disabled:opacity-50"
          title={language === 'ko' ? '새로고침' : 'Refresh'}>
          <svg className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Patient Quick Info */}
      <div className="flex items-center justify-between mb-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
        <div>
          <p className="font-medium text-slate-800">{patient.name}</p>
          <p className="text-xs text-slate-500">{t.room} {patient.room_number}</p>
        </div>
        {risk && (
          <div className={`px-3 py-1.5 rounded-lg ${risk.bg} ${risk.color} font-bold text-sm`}>
            {risk.label}
          </div>
        )}
      </div>

      {/* AI Response Area */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full py-8">
            <div className="w-10 h-10 border-4 border-clinical-200 border-t-clinical-600 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500 text-sm">{t.generating}</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full py-8 text-center">
            <svg className="w-12 h-12 text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-slate-400 text-sm">{language === 'ko' ? 'AI 분석을 불러올 수 없습니다' : 'Unable to load AI analysis'}</p>
            <button 
              onClick={fetchAIRecommendations}
              className="mt-3 px-4 py-2 text-xs bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
            >
              {language === 'ko' ? '다시 시도' : 'Retry'}
            </button>
          </div>
        ) : aiResponse ? (
          <div className={`p-4 rounded-xl border ${
            risk && (risk.label === '위험' || risk.label === '고위험' || risk.label === '위급' || risk.label === 'HIGH' || patient.has_ulcer)
              ? 'bg-gradient-to-br from-red-50 to-orange-50 border-red-200' 
              : 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200'
          }`}>
            <pre className="whitespace-pre-wrap text-slate-700 text-sm font-sans leading-relaxed">
              {aiResponse}
            </pre>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full py-8 text-center">
            <svg className="w-12 h-12 text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <p className="text-slate-400 text-sm mb-2">{t.clickRefresh}</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-slate-200">
        <p className="text-xs text-slate-400 italic">
          🤖 AI 분석 • {t.verify}
        </p>
      </div>
    </div>
  );
}

export default CareInstructions;
