import React from 'react';
import { useLanguage } from '../context/LanguageContext';

function PatientHistoryModal({ isOpen, onClose, patient }) {
  const { language } = useLanguage();

  const labels = {
    ko: {
      title: '환자 평가 이력',
      date: '날짜',
      sensoryPerception: '감각 인지',
      moisture: '습기',
      activity: '활동',
      bradenScore: '브레이든 점수',
      ulcerStatus: '욕창 상태',
      location: '발생 부위',
      bloodPressure: '혈압',
      weight: '체중',
      notes: '비고',
      close: '닫기',
      noHistory: '평가 이력이 없습니다',
      currentStatus: '현재 상태',
      stage: '단계',
      noUlcer: '욕창 없음',
    },
    en: {
      title: 'Patient Assessment History',
      date: 'Date',
      sensoryPerception: 'Sensory',
      moisture: 'Moisture',
      activity: 'Activity',
      bradenScore: 'Braden',
      ulcerStatus: 'Ulcer',
      location: 'Location',
      bloodPressure: 'BP',
      weight: 'Weight',
      notes: 'Notes',
      close: 'Close',
      noHistory: 'No assessment history available',
      currentStatus: 'Current Status',
      stage: 'Stage',
      noUlcer: 'No ulcer',
    },
  };

  const t = labels[language] || labels.en;

  // Generate sample history data (in real app, fetch from backend)
  const generateHistory = (patient) => {
    if (!patient) return [];

    // Create current record
    const current = {
      date: new Date().toISOString(),
      sensory_perception: patient.sensory_perception,
      moisture: patient.moisture,
      activity: patient.activity,
      bradenScore: patient.bradenScore,
      blood_pressure: patient.blood_pressure,
      weight_kg: patient.weight_kg,
      has_ulcer: patient.has_ulcer,
      ulcer_stage: patient.ulcer_stage,
      ulcer_location: patient.ulcer_location,
      notes: t.currentStatus,
      isCurrent: true,
    };

    // Generate some historical data (mock)
    const history = [current];
    
    // Add 3-5 historical records going back in time
    for (let i = 1; i <= 4; i++) {
      const daysAgo = i * 7; // weekly assessments
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      
      history.push({
        date: date.toISOString(),
        sensory_perception: Math.max(1, Math.min(4, patient.sensory_perception + Math.floor(Math.random() * 2 - 1))),
        moisture: Math.max(1, Math.min(4, patient.moisture + Math.floor(Math.random() * 2 - 1))),
        activity: Math.max(1, Math.min(4, patient.activity + Math.floor(Math.random() * 2 - 1))),
        bradenScore: patient.bradenScore + Math.floor(Math.random() * 3 - 1),
        blood_pressure: patient.blood_pressure || '-',
        weight_kg: patient.weight_kg ? patient.weight_kg + (Math.random() * 2 - 1) : null,
        has_ulcer: i === 1 ? patient.has_ulcer : (i > 2 ? false : patient.has_ulcer),
        ulcer_stage: i === 1 ? patient.ulcer_stage : (i > 2 ? null : patient.ulcer_stage),
        ulcer_location: i === 1 ? patient.ulcer_location : (i > 2 ? null : patient.ulcer_location),
        notes: i === 1 ? 'Previous assessment' : '',
        isCurrent: false,
      });
    }

    return history;
  };

  if (!isOpen) return null;

  const history = generateHistory(patient);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative w-full max-w-6xl max-h-[90vh] bg-white rounded-2xl shadow-2xl animate-slide-up overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-clinical-50 to-clinical-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-clinical-500 to-clinical-700 flex items-center justify-center shadow-md">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold text-slate-800">{t.title}</h2>
              <p className="text-sm text-slate-500">{patient?.name} (#{patient?.id})</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-clinical-200 text-slate-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto p-6">
          {history.length > 0 ? (
            <table className="w-full text-sm">
              <thead className="bg-slate-100 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">{t.date}</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">{t.sensoryPerception}</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">{t.moisture}</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">{t.activity}</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">{t.bradenScore}</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">{t.ulcerStatus}</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">{t.bloodPressure}</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">{t.weight}</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">{t.notes}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {history.map((record, index) => (
                  <tr key={index} className={`${record.isCurrent ? 'bg-clinical-50 border-l-4 border-clinical-500' : 'hover:bg-slate-50'} transition-colors`}>
                    <td className="px-4 py-3 text-slate-700 whitespace-nowrap">
                      {new Date(record.date).toLocaleDateString()}
                      {record.isCurrent && (
                        <span className="ml-2 px-2 py-0.5 bg-clinical-500 text-white text-xs rounded-full font-bold">
                          {language === 'ko' ? '현재' : 'CURRENT'}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block px-2 py-1 rounded ${record.sensory_perception <= 2 ? 'bg-orange-100 text-orange-700' : 'bg-emerald-100 text-emerald-700'} font-mono font-bold`}>
                        {record.sensory_perception}/4
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block px-2 py-1 rounded ${record.moisture <= 2 ? 'bg-orange-100 text-orange-700' : 'bg-emerald-100 text-emerald-700'} font-mono font-bold`}>
                        {record.moisture}/4
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block px-2 py-1 rounded ${record.activity <= 2 ? 'bg-orange-100 text-orange-700' : 'bg-emerald-100 text-emerald-700'} font-mono font-bold`}>
                        {record.activity}/4
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block px-2.5 py-1 rounded font-mono font-bold ${
                        record.bradenScore <= 6 ? 'bg-red-100 text-red-700' : 
                        record.bradenScore <= 8 ? 'bg-orange-100 text-orange-700' : 
                        'bg-emerald-100 text-emerald-700'
                      }`}>
                        {record.bradenScore}/12
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {record.has_ulcer ? (
                        <div className="text-red-600 font-medium">
                          <div>{t.stage} {record.ulcer_stage}</div>
                          {record.ulcer_location && (
                            <div className="text-xs text-red-500">{record.ulcer_location}</div>
                          )}
                        </div>
                      ) : (
                        <span className="text-emerald-600 font-medium">✓ {t.noUlcer}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center font-mono text-slate-700">
                      {record.blood_pressure || '-'}
                    </td>
                    <td className="px-4 py-3 text-center font-mono text-slate-700">
                      {record.weight_kg ? `${record.weight_kg.toFixed(1)}kg` : '-'}
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-xs">
                      {record.notes || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12 text-slate-500">
              {t.noHistory}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
          <p className="text-xs text-slate-500 italic">
            {language === 'ko' 
              ? '※ 평가 이력은 실제 데이터베이스에서 가져옵니다. 현재는 데모 데이터를 표시합니다.' 
              : '※ Assessment history is fetched from database. Currently showing demo data.'}
          </p>
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

