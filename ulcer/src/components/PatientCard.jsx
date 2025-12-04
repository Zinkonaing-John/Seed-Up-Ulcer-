import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getRiskLevel, getRiskConfig, getActivityStatus, getSkinCondition } from '../data/patients';

function PatientCard({ patient, isSelected, onClick, onViewDetails, onDelete, delay }) {
  const { t, language } = useLanguage();
  const riskLevel = getRiskLevel(patient.riskScore);
  const config = getRiskConfig(riskLevel);
  const scorePercentage = Math.round(patient.riskScore * 100);
  const activityStatus = getActivityStatus(patient.activity);
  const skinCondition = getSkinCondition(patient);

  const handleNameClick = (e) => {
    e.stopPropagation();
    onViewDetails();
  };

  const riskLabels = {
    critical: language === 'ko' ? '위험' : 'CRITICAL',
    high: language === 'ko' ? '높음' : 'HIGH',
    moderate: language === 'ko' ? '중간' : 'MODERATE',
    low: language === 'ko' ? '낮음' : 'LOW',
  };

  return (
    <div
      onClick={onClick}
      style={{ animationDelay: `${delay}ms` }}
      className={`
        group relative p-5 rounded-xl cursor-pointer transition-all duration-300
        bg-white border ${config.border} ${config.glow}
        ${isSelected ? 'ring-2 ring-clinical-500 ring-offset-2 ring-offset-white' : ''}
        hover:scale-[1.01] hover:shadow-lg
        animate-slide-up opacity-0
      `}
    >
      {/* Risk indicator bar */}
      <div className="absolute top-0 left-0 right-0 h-1 rounded-t-xl overflow-hidden bg-slate-100">
        <div 
          className={`h-full ${config.badge} transition-all duration-500`}
          style={{ width: `${scorePercentage}%` }}
        />
      </div>

      {/* Delete Button - Shows on hover */}
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(); }}
        className="absolute top-3 right-14 p-1.5 rounded-lg bg-red-50 text-red-400 opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-600 transition-all z-10"
        title={t('delete')}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>

      <div className="flex items-start justify-between">
        {/* Patient Info */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-10 h-10 rounded-full ${config.badge} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
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

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <span className="text-xs text-slate-400 uppercase tracking-wider">
                {language === 'ko' ? '브레이든 점수' : 'Braden Score'}
              </span>
              <p className={`font-mono font-bold text-lg mt-0.5 ${config.textDark}`}>
                {patient.bradenScore}/12
              </p>
            </div>
            <div>
              <span className="text-xs text-slate-400 uppercase tracking-wider">
                {language === 'ko' ? '욕창 상태' : 'Ulcer Status'}
              </span>
              <p className={`text-sm mt-0.5 ${patient.has_ulcer ? 'text-red-600 font-medium' : 'text-emerald-600'}`}>
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
          </div>
        </div>

        {/* Risk Score Display */}
        <div className="text-right ml-4">
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${config.badge} text-white mb-2 shadow-sm`}>
            {riskLevel === 'critical' && (
              <svg className="w-3.5 h-3.5 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            )}
            {riskLabels[riskLevel]}
          </div>
          
          <div className="relative w-20 h-20 mx-auto">
            <svg className="w-20 h-20 transform -rotate-90">
              <circle
                cx="40"
                cy="40"
                r="35"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                className="text-slate-200"
              />
              <circle
                cx="40"
                cy="40"
                r="35"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${scorePercentage * 2.2} 220`}
                className={config.text}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`font-mono font-bold text-xl ${config.textDark}`}>
                {scorePercentage}
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-1">{language === 'ko' ? '위험도' : 'Risk'}</p>
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
