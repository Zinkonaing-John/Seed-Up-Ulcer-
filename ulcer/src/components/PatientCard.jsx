import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getActivityStatus } from '../data/patients';
import api from '../services/api';

function PatientCard({ patient, isSelected, onClick, onViewDetails, onDelete, delay }) {
  const { t, language } = useLanguage();
  const [aiRiskLevel, setAiRiskLevel] = useState(null);
  const [isLoadingRisk, setIsLoadingRisk] = useState(false);
  const previousPredictionRef = useRef(null); // Store previous prediction for comparison
  const activityStatus = getActivityStatus(patient.activity);

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

  // Compare two predictions to check if risk level has meaningfully changed
  // Only compares risk level - ignores message wording variations
  const hasRiskLevelChanged = (oldPred, newPred) => {
    if (!oldPred && !newPred) return false; // Both null
    if (!oldPred || !newPred) return true; // One is null, other isn't
    
    // ONLY compare risk level - this is the primary indicator of change
    // Message variations from AI are ignored if risk level stays the same
    const oldRisk = hasNoData(oldPred) ? null : (oldPred.riskLevel || null);
    const newRisk = hasNoData(newPred) ? null : (newPred.riskLevel || null);
    
    // Risk level changed - definitely meaningful
    return oldRisk !== newRisk;
  };

  // Fetch AI risk level from backend when patient changes
  useEffect(() => {
    if (!patient) return;

    // Reset previous prediction when patient changes
    previousPredictionRef.current = null;

    const fetchAiRiskLevel = async () => {
      setIsLoadingRisk(true);
      
      try {
        const prediction = await api.llm.getPressureUlcerPrediction(patient.id);
        
        // Check if risk level has actually changed
        const hasChanged = hasRiskLevelChanged(previousPredictionRef.current, prediction);
        
        if (!hasChanged) {
          console.log(`📊 No risk level change for patient ${patient.id}, skipping update`);
          setIsLoadingRisk(false);
          return; // No update needed
        }
        
        console.log(`🔄 Risk level changed for patient ${patient.id}, updating UI`);
        previousPredictionRef.current = prediction; // Store for next comparison
        
        // Only set risk level if we have actual data (not "no data" response)
        if (!hasNoData(prediction) && prediction.riskLevel) {
          setAiRiskLevel(prediction.riskLevel);
        } else {
          setAiRiskLevel(null); // No data - show "없음"
        }
      } catch (error) {
        console.error(`Failed to fetch AI risk for patient ${patient.id}:`, error);
        setAiRiskLevel(null); // Error - show "없음"
      } finally {
        setIsLoadingRisk(false);
      }
    };

    // Fetch AI risk level
    fetchAiRiskLevel();
  }, [patient?.id]);

  // Get risk level config based on AI response
  const getRiskConfig = (riskLevel) => {
    if (!riskLevel) {
      return {
        badge: 'bg-slate-100 text-slate-500',
        border: 'border-slate-200',
        glow: '',
      };
    }
    
    if (riskLevel === '위험' || riskLevel === '고위험' || riskLevel === '위급') {
      return {
        badge: 'bg-red-500',
        border: 'border-red-300',
        glow: 'shadow-red-200',
      };
    } else if (riskLevel === '중간' || riskLevel === '주의') {
      return {
        badge: 'bg-amber-500',
        border: 'border-amber-300',
        glow: 'shadow-amber-200',
      };
    } else {
      return {
        badge: 'bg-emerald-500',
        border: 'border-emerald-300',
        glow: 'shadow-emerald-200',
      };
    }
  };

  const config = getRiskConfig(aiRiskLevel);

  const handleNameClick = (e) => {
    e.stopPropagation();
    onViewDetails();
  };

  return (
    <div
      onClick={onClick}
      style={{ animationDelay: `${delay}ms` }}
      className={`
        group relative p-5 rounded-xl cursor-pointer transition-all duration-300
        bg-white border ${aiRiskLevel ? config.border : 'border-slate-200'} ${aiRiskLevel ? config.glow : ''}
        ${isSelected ? 'ring-2 ring-clinical-500 ring-offset-2 ring-offset-white' : ''}
        hover:scale-[1.01] hover:shadow-lg
        animate-slide-up opacity-0
      `}
    >
      {/* Risk indicator bar - Only show if we have AI risk level */}
      {aiRiskLevel && (
        <div className="absolute top-0 left-0 right-0 h-1 rounded-t-xl overflow-hidden bg-slate-100">
          <div 
            className={`h-full ${config.badge} transition-all duration-500`}
            style={{ width: '100%' }}
          />
        </div>
      )}

      <div className="flex items-start justify-between">
        {/* Patient Info */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-10 h-10 rounded-full ${
              aiRiskLevel 
                ? config.badge 
                : 'bg-slate-400'
            } flex items-center justify-center text-white font-bold text-sm shadow-md`}>
              {patient.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h3 
                onClick={handleNameClick}
                className="font-display font-semibold text-slate-800 text-lg hover:text-clinical-600 hover:underline cursor-pointer transition-colors"
              >
                {patient.name}
                <svg className="w-4 h-4 inline-block ml-1 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </h3>
              <p className="text-slate-500 text-sm">
                {language === 'ko' ? '병실' : 'Room'} {patient.room_number} • {patient.age}{language === 'ko' ? '세' : ' yrs'} • {patient.gender === 'M' ? (language === 'ko' ? '남' : 'M') : (language === 'ko' ? '여' : 'F')}
              </p>
            </div>
          </div>

          <div className="mt-4">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-xs text-slate-400 uppercase tracking-wider">
                {language === 'ko' ? '욕창 상태' : 'Ulcer Status'}
              </span>
              <p className={`text-base font-semibold mt-1 ${patient.has_ulcer ? 'text-red-600' : 'text-emerald-600'}`}>
                {patient.has_ulcer ? `Stage ${patient.ulcer_stage}` : (language === 'ko' ? '없음' : 'None')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-3">
            <div>
              <span className="text-xs text-slate-400 uppercase tracking-wider">
                {language === 'ko' ? '활동' : 'Activity'}
              </span>
              <p className="text-slate-700 text-sm mt-0.5">{activityStatus}</p>
            </div>
            <div>
              <span className="text-xs text-slate-400 uppercase tracking-wider">
                {language === 'ko' ? '진단' : 'Diagnosis'}
              </span>
              <p className="text-slate-700 text-sm mt-0.5 truncate" title={patient.diagnosis}>{patient.diagnosis || '-'}</p>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-4 text-xs text-slate-400">
              {patient.blood_pressure && (
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {patient.blood_pressure}
                </span>
              )}
              {patient.weight_kg && (
                <span>{patient.weight_kg}kg</span>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {/* View Details Button */}
              <button
                onClick={handleNameClick}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-clinical-50 border border-clinical-200 text-clinical-700 text-xs font-medium hover:bg-clinical-100 hover:border-clinical-300 transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {t('viewDetails')}
              </button>
              
              {/* Delete Button */}
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-medium hover:bg-red-100 hover:border-red-300 transition-all"
                title={t('delete')}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                {language === 'ko' ? '삭제' : 'Delete'}
              </button>
            </div>
          </div>
        </div>

        {/* Risk Level Display - Only from AI response */}
        <div className="ml-4">
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">
            {language === 'ko' ? '위험도' : 'Risk Level'}
          </p>
          {isLoadingRisk ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm bg-slate-100 text-slate-400">
              <div className="w-3 h-3 border-2 border-slate-300 border-t-slate-500 rounded-full animate-spin"></div>
              <span className="text-xs">{language === 'ko' ? '로딩...' : 'Loading...'}</span>
            </div>
          ) : aiRiskLevel ? (
            <div className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-bold ${config.badge} text-white shadow-md`}>
              {(aiRiskLevel === '위험' || aiRiskLevel === '고위험' || aiRiskLevel === '위급') && (
                <svg className="w-4 h-4 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              )}
              {aiRiskLevel}
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-slate-100 text-slate-500">
              {language === 'ko' ? '없음' : 'None'}
            </div>
          )}
        </div>
      </div>

      {/* ID Badge */}
      <div className="absolute top-4 right-4 text-xs font-mono text-slate-400">
        #{patient.id}
      </div>
    </div>
  );
}

export default PatientCard;
