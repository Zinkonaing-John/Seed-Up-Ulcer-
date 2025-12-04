import React from 'react';
import { getMobilityStatus, getSkinCondition } from '../data/patients';

function CareInstructions({ patient }) {
  if (!patient) {
    return (
      <div className="text-center py-12 text-slate-500">
        Select a patient to view care instructions
      </div>
    );
  }

  // Generate care instructions based on Braden Score and ulcer status
  const generateInstructions = (patient) => {
    const instructions = [];
    const bradenScore = patient.bradenScore || 23;

    // VERY HIGH RISK (Braden ≤9) or has ulcer
    if (bradenScore <= 9 || patient.has_ulcer) {
      instructions.push({
        priority: 'URGENT',
        priorityKr: '긴급',
        action: 'Reposition patient immediately and every 2 hours.',
        actionKr: '즉시 체위 변경하고 2시간마다 반복하세요.',
        icon: '🔴',
        type: 'critical',
      });
      instructions.push({
        priority: 'URGENT',
        priorityKr: '긴급',
        action: 'Check all pressure points for skin changes now.',
        actionKr: '모든 압력 부위의 피부 변화를 즉시 확인하세요.',
        icon: '🔴',
        type: 'critical',
      });
      instructions.push({
        priority: 'REQUIRED',
        priorityKr: '필수',
        action: 'Place pressure-relieving cushions under heels and sacrum.',
        actionKr: '발뒤꿈치와 천골 아래에 압력 완화 쿠션을 배치하세요.',
        icon: '🟠',
        type: 'high',
      });
    }
    // HIGH RISK (Braden 10-12)
    else if (bradenScore <= 12) {
      instructions.push({
        priority: 'IMPORTANT',
        priorityKr: '중요',
        action: 'Reposition patient every 2-3 hours.',
        actionKr: '2-3시간마다 체위를 변경하세요.',
        icon: '🟠',
        type: 'high',
      });
      instructions.push({
        priority: 'IMPORTANT',
        priorityKr: '중요',
        action: 'Inspect heels, sacrum, and bony areas each shift.',
        actionKr: '매 근무 시 발뒤꿈치, 천골, 뼈 돌출 부위를 검사하세요.',
        icon: '🟠',
        type: 'high',
      });
      instructions.push({
        priority: 'STANDARD',
        priorityKr: '표준',
        action: 'Ensure adequate nutrition and fluid intake.',
        actionKr: '적절한 영양 섭취와 수분 공급을 확인하세요.',
        icon: '🟡',
        type: 'moderate',
      });
    }
    // MODERATE RISK (Braden 13-14)
    else if (bradenScore <= 14) {
      instructions.push({
        priority: 'STANDARD',
        priorityKr: '표준',
        action: 'Reposition every 3-4 hours.',
        actionKr: '3-4시간마다 체위를 변경하세요.',
        icon: '🟡',
        type: 'moderate',
      });
      instructions.push({
        priority: 'STANDARD',
        priorityKr: '표준',
        action: 'Daily skin inspection during personal care.',
        actionKr: '개인 위생 시 매일 피부를 검사하세요.',
        icon: '🟡',
        type: 'moderate',
      });
    }
    // LOW/MILD RISK (Braden 15-18)
    else if (bradenScore <= 18) {
      instructions.push({
        priority: 'ROUTINE',
        priorityKr: '일상',
        action: 'Continue standard repositioning schedule.',
        actionKr: '표준 체위 변경 일정을 계속하세요.',
        icon: '🟢',
        type: 'low',
      });
      instructions.push({
        priority: 'ROUTINE',
        priorityKr: '일상',
        action: 'Maintain regular skin checks.',
        actionKr: '정기적인 피부 검사를 유지하세요.',
        icon: '🟢',
        type: 'low',
      });
    }
    // NO RISK (Braden >18)
    else {
      instructions.push({
        priority: 'ROUTINE',
        priorityKr: '일상',
        action: 'Standard care protocol - low risk patient.',
        actionKr: '표준 케어 프로토콜 - 저위험 환자.',
        icon: '🟢',
        type: 'low',
      });
    }

    // Additional instructions based on Braden subscores
    if (patient.mobility <= 2) {
      instructions.push({
        priority: 'REQUIRED',
        priorityKr: '필수',
        action: 'Use pillows to offload pressure between knees and ankles.',
        actionKr: '무릎과 발목 사이에 베개를 사용하여 압력을 분산하세요.',
        icon: '🟠',
        type: 'high',
      });
    }

    if (patient.moisture <= 2) {
      instructions.push({
        priority: 'IMPORTANT',
        priorityKr: '중요',
        action: 'Keep skin clean and dry; apply barrier cream.',
        actionKr: '피부를 깨끗하고 건조하게 유지하고 보호 크림을 바르세요.',
        icon: '🟠',
        type: 'high',
      });
    }

    if (patient.nutrition <= 2) {
      instructions.push({
        priority: 'IMPORTANT',
        priorityKr: '중요',
        action: 'Consult dietitian for nutritional assessment.',
        actionKr: '영양사와 상담하여 영양 평가를 받으세요.',
        icon: '🟠',
        type: 'high',
      });
    }

    if (patient.has_ulcer) {
      instructions.push({
        priority: 'URGENT',
        priorityKr: '긴급',
        action: 'Document ulcer status and notify wound care team.',
        actionKr: '욕창 상태를 기록하고 상처 관리팀에 알리세요.',
        icon: '🔴',
        type: 'critical',
      });
    }

    return instructions;
  };

  const instructions = generateInstructions(patient);

  const getRiskLevel = (bradenScore) => {
    if (bradenScore <= 9) return { label: 'VERY HIGH', labelKr: '매우 높음', color: 'text-red-600', bg: 'bg-red-100' };
    if (bradenScore <= 12) return { label: 'HIGH', labelKr: '높음', color: 'text-orange-600', bg: 'bg-orange-100' };
    if (bradenScore <= 14) return { label: 'MODERATE', labelKr: '중간', color: 'text-amber-600', bg: 'bg-amber-100' };
    if (bradenScore <= 18) return { label: 'MILD', labelKr: '낮음', color: 'text-emerald-600', bg: 'bg-emerald-100' };
    return { label: 'NO RISK', labelKr: '위험 없음', color: 'text-emerald-600', bg: 'bg-emerald-100' };
  };

  const risk = getRiskLevel(patient.bradenScore);
  const scorePercentage = patient.bradenScore ? Math.round((patient.bradenScore / 23) * 100) : 0;

  const getTypeStyles = (type) => {
    const styles = {
      critical: 'bg-red-50 border-red-200 text-red-700',
      high: 'bg-orange-50 border-orange-200 text-orange-700',
      moderate: 'bg-amber-50 border-amber-200 text-amber-700',
      low: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    };
    return styles[type];
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-2xl shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-5 h-5 text-clinical-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h2 className="font-display text-xl font-semibold text-slate-800">
          Care Instructions / 케어 지침
        </h2>
      </div>

      {/* Patient Summary */}
      <div className="bg-slate-50 rounded-xl p-4 mb-4 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-semibold text-slate-800">{patient.name}</h3>
            <p className="text-sm text-slate-500">Room {patient.room} • #{patient.id}</p>
          </div>
          <div className={`px-3 py-1.5 rounded-lg ${risk.bg} ${risk.color} font-bold text-sm`}>
            {risk.label}
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <p className="text-xs text-slate-500 mb-1">Braden Score: {patient.bradenScore}/23</p>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${
                  patient.bradenScore <= 9 ? 'bg-red-500' :
                  patient.bradenScore <= 12 ? 'bg-orange-500' :
                  patient.bradenScore <= 14 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${scorePercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Quick Status */}
        <div className="grid grid-cols-2 gap-2 mt-3">
          <div className="text-xs">
            <span className="text-slate-500">Mobility: </span>
            <span className="text-slate-700">{getMobilityStatus(patient.mobility)}</span>
          </div>
          <div className="text-xs">
            <span className="text-slate-500">Skin: </span>
            <span className={patient.has_ulcer ? 'text-red-600 font-medium' : 'text-emerald-600'}>
              {getSkinCondition(patient)}
            </span>
          </div>
        </div>
      </div>

      {/* AI Assistant Label */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-clinical-500 to-clinical-700 flex items-center justify-center shadow-md">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <span className="text-sm text-clinical-700 font-medium">AI Care Recommendations / AI 케어 권장사항</span>
      </div>

      {/* Instructions List */}
      <div className="flex-1 space-y-3 overflow-y-auto">
        {instructions.map((instruction, index) => (
          <div
            key={index}
            className={`p-4 rounded-xl border ${getTypeStyles(instruction.type)} transition-all hover:scale-[1.01] shadow-sm`}
          >
            <div className="flex items-start gap-3">
              <span className="text-lg">{instruction.icon}</span>
              <div className="flex-1">
                <span className={`text-xs font-bold tracking-wider ${
                  instruction.type === 'critical' ? 'text-red-600' :
                  instruction.type === 'high' ? 'text-orange-600' :
                  instruction.type === 'moderate' ? 'text-amber-600' : 'text-emerald-600'
                }`}>
                  {instruction.priority} / {instruction.priorityKr}
                </span>
                <p className="text-slate-700 mt-1 text-sm leading-relaxed">
                  {instruction.action}
                </p>
                <p className="text-slate-500 mt-0.5 text-xs">
                  {instruction.actionKr}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Note */}
      <div className="mt-4 pt-4 border-t border-slate-200">
        <p className="text-xs text-slate-500 italic">
          These recommendations are generated based on Braden Scale assessment. 
          Always follow your facility's protocols and clinical judgment.
        </p>
        <p className="text-xs text-slate-400 italic mt-1">
          브레이든 척도 평가를 기반으로 생성된 권장사항입니다. 항상 시설 프로토콜과 임상 판단을 따르세요.
        </p>
      </div>
    </div>
  );
}

export default CareInstructions;
