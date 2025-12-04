import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getMobilityStatus, getSkinCondition } from '../data/patients';

// Backend LLM API Configuration
const LLM_API_URL = 'http://localhost:5000/api/care-recommendations';
const MAX_TOKENS = 200;

function CareInstructions({ patient }) {
  const { t, language } = useLanguage();
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Build prompt for LLM
  const buildPrompt = useCallback((patient) => {
    const lang = language === 'ko' ? 'Korean' : 'English';
    return `You are a clinical assistant AI for pressure ulcer prevention. Provide a brief, actionable care summary for nursing staff in ${lang}.

Patient: ${patient.name}, ${patient.age}${language === 'ko' ? '세' : ' years'}, ${patient.gender === 'M' ? (language === 'ko' ? '남성' : 'Male') : (language === 'ko' ? '여성' : 'Female')}
Room: ${patient.room}
Braden Score: ${patient.bradenScore}/23
Risk Level: ${patient.riskScore >= 0.8 ? 'Critical' : patient.riskScore >= 0.6 ? 'High' : patient.riskScore >= 0.4 ? 'Moderate' : 'Low'}
Mobility: ${getMobilityStatus(patient.mobility)}
Skin Condition: ${getSkinCondition(patient)}
Has Ulcer: ${patient.has_ulcer ? `Yes - Stage ${patient.ulcer_stage} at ${patient.ulcer_location}` : 'No'}

Provide concise care recommendations in ${lang}. Focus on immediate actionable steps for nursing staff. Be specific and urgent if risk is high.`;
  }, [language]);

  // Fetch AI recommendations from backend
  const fetchAIRecommendations = useCallback(async () => {
    if (!patient) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(LLM_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: buildPrompt(patient),
          max_tokens: MAX_TOKENS,
          language: language,
          patient_data: {
            id: patient.id,
            name: patient.name,
            age: patient.age,
            gender: patient.gender,
            room: patient.room,
            bradenScore: patient.bradenScore,
            riskScore: patient.riskScore,
            mobility: patient.mobility,
            has_ulcer: patient.has_ulcer,
            ulcer_stage: patient.ulcer_stage,
            ulcer_location: patient.ulcer_location,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      setAiResponse(data.recommendation || data.response || data.message || (language === 'ko' ? 'AI 응답이 없습니다.' : 'No response from AI.'));
    } catch (err) {
      console.error('LLM API Error:', err);
      setError(err.message);
      generateLocalFallback();
    } finally {
      setIsLoading(false);
    }
  }, [patient, buildPrompt, language]);

  // Local fallback if backend is unavailable
  const generateLocalFallback = useCallback(() => {
    const bradenScore = patient?.bradenScore || 23;
    
    let response = '';
    
    if (language === 'ko') {
      if (bradenScore <= 12 || patient?.has_ulcer) {
        response = `⚠️ 고위험 환자 - 즉각적인 조치 필요\n\n`;
        response += `• 2시간마다 체위 변경 필수\n`;
        response += `• 모든 압력 부위 피부 상태 확인\n`;
        response += `• 압력 완화 기구 적용\n`;
        if (patient?.has_ulcer) {
          response += `• 욕창 상태 기록 및 상처 관리팀 보고\n`;
        }
        response += `• 피부를 깨끗하고 건조하게 유지\n`;
        response += `• 영양 및 수분 섭취 모니터링\n`;
      } else {
        response = `✓ 저위험 환자 - 표준 케어 프로토콜\n\n`;
        response += `• 정기적인 체위 변경 유지\n`;
        response += `• 매일 피부 검사 실시\n`;
        response += `• 적절한 영양 및 수분 공급 확인\n`;
        response += `• 활동 및 이동성 격려\n`;
      }
    } else {
      if (bradenScore <= 12 || patient?.has_ulcer) {
        response = `⚠️ HIGH RISK - Immediate attention required\n\n`;
        response += `• Reposition patient every 2 hours\n`;
        response += `• Check all pressure points for skin changes\n`;
        response += `• Apply pressure-relieving devices\n`;
        if (patient?.has_ulcer) {
          response += `• Document ulcer status and notify wound care team\n`;
        }
        response += `• Keep skin clean and dry\n`;
        response += `• Monitor nutrition and hydration\n`;
      } else {
        response = `✓ LOW RISK - Standard care protocol\n\n`;
        response += `• Continue regular repositioning schedule\n`;
        response += `• Maintain daily skin inspections\n`;
        response += `• Ensure adequate nutrition and hydration\n`;
        response += `• Encourage activity and mobility\n`;
      }
    }
    
    setAiResponse(response);
  }, [patient, language]);

  // Fetch on patient or language change
  useEffect(() => {
    if (patient) {
      fetchAIRecommendations();
    }
  }, [patient?.id, language, fetchAIRecommendations]);

  if (!patient) {
    return (
      <div className="text-center py-12 text-slate-500">
        {language === 'ko' ? '환자를 선택하여 케어 지침을 확인하세요' : 'Select a patient to view care instructions'}
      </div>
    );
  }

  const getRiskLevel = (bradenScore) => {
    if (language === 'ko') {
      if (bradenScore <= 9) return { label: '위험', color: 'text-red-600', bg: 'bg-red-100' };
      if (bradenScore <= 12) return { label: '높음', color: 'text-orange-600', bg: 'bg-orange-100' };
      if (bradenScore <= 14) return { label: '중간', color: 'text-amber-600', bg: 'bg-amber-100' };
      return { label: '낮음', color: 'text-emerald-600', bg: 'bg-emerald-100' };
    }
    if (bradenScore <= 9) return { label: 'CRITICAL', color: 'text-red-600', bg: 'bg-red-100' };
    if (bradenScore <= 12) return { label: 'HIGH', color: 'text-orange-600', bg: 'bg-orange-100' };
    if (bradenScore <= 14) return { label: 'MODERATE', color: 'text-amber-600', bg: 'bg-amber-100' };
    return { label: 'LOW', color: 'text-emerald-600', bg: 'bg-emerald-100' };
  };

  const risk = getRiskLevel(patient.bradenScore);

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
          <div>
            <h2 className="font-display text-lg font-semibold text-slate-800">
              {t('aiCareRecommendations')}
            </h2>
          </div>
        </div>
        
        {/* Refresh button */}
        <button
          onClick={fetchAIRecommendations}
          disabled={isLoading}
          className="p-2 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors disabled:opacity-50"
          title={language === 'ko' ? '새로고침' : 'Refresh'}
        >
          <svg className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Patient Quick Info */}
      <div className="flex items-center justify-between mb-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
        <div>
          <p className="font-medium text-slate-800">{patient.name}</p>
          <p className="text-xs text-slate-500">{t('room')} {patient.room} • {t('bradenScore')}: {patient.bradenScore}/23</p>
        </div>
        <div className={`px-3 py-1.5 rounded-lg ${risk.bg} ${risk.color} font-bold text-sm`}>
          {risk.label}
        </div>
      </div>

      {/* AI Response Area */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full py-8">
            <div className="w-10 h-10 border-4 border-clinical-200 border-t-clinical-600 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500 text-sm">{t('generatingRecommendations')}</p>
          </div>
        ) : error ? (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-amber-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-amber-700 font-medium text-sm">{t('usingOfflineRecommendations')}</p>
                <p className="text-amber-600 text-xs mt-1">{t('backendUnavailable')}: {error}</p>
              </div>
            </div>
            {aiResponse && (
              <div className="mt-4 p-4 bg-white rounded-lg border border-slate-200">
                <pre className="whitespace-pre-wrap text-slate-700 text-sm font-sans leading-relaxed">
                  {aiResponse}
                </pre>
              </div>
            )}
          </div>
        ) : (
          <div className={`p-4 rounded-xl border ${
            patient.bradenScore <= 12 || patient.has_ulcer 
              ? 'bg-gradient-to-br from-red-50 to-orange-50 border-red-200' 
              : 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200'
          }`}>
            <pre className="whitespace-pre-wrap text-slate-700 text-sm font-sans leading-relaxed">
              {aiResponse || t('clickRefresh')}
            </pre>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-slate-200">
        <p className="text-xs text-slate-400 italic">
          {t('maxTokens')}: {MAX_TOKENS} • {t('verifyWithClinicalJudgment')}
        </p>
      </div>
    </div>
  );
}

export default CareInstructions;
