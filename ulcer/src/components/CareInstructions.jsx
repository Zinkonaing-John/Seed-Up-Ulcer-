import React from 'react';

function CareInstructions({ patient }) {
  if (!patient) {
    return (
      <div className="text-center py-12 text-slate-400">
        Select a patient to view care instructions
      </div>
    );
  }

  // Generate care instructions based on risk score
  const generateInstructions = (riskScore, mobilityStatus, skinCondition) => {
    const instructions = [];

    // CRITICAL RISK (≥80%)
    if (riskScore >= 0.8) {
      instructions.push({
        priority: 'URGENT',
        action: 'Reposition patient immediately and every 2 hours.',
        icon: '🔴',
        type: 'critical',
      });
      instructions.push({
        priority: 'URGENT',
        action: 'Check all pressure points for skin changes now.',
        icon: '🔴',
        type: 'critical',
      });
      instructions.push({
        priority: 'REQUIRED',
        action: 'Place pressure-relieving cushions under heels and sacrum.',
        icon: '🟠',
        type: 'high',
      });
      instructions.push({
        priority: 'REQUIRED',
        action: 'Keep skin clean and dry; apply barrier cream.',
        icon: '🟠',
        type: 'high',
      });
    }
    // HIGH RISK (60-79%)
    else if (riskScore >= 0.6) {
      instructions.push({
        priority: 'IMPORTANT',
        action: 'Reposition patient every 2-3 hours.',
        icon: '🟠',
        type: 'high',
      });
      instructions.push({
        priority: 'IMPORTANT',
        action: 'Inspect heels, sacrum, and bony areas each shift.',
        icon: '🟠',
        type: 'high',
      });
      instructions.push({
        priority: 'STANDARD',
        action: 'Ensure adequate nutrition and fluid intake.',
        icon: '🟡',
        type: 'moderate',
      });
    }
    // MODERATE RISK (40-59%)
    else if (riskScore >= 0.4) {
      instructions.push({
        priority: 'STANDARD',
        action: 'Reposition every 3-4 hours.',
        icon: '🟡',
        type: 'moderate',
      });
      instructions.push({
        priority: 'STANDARD',
        action: 'Daily skin inspection during personal care.',
        icon: '🟡',
        type: 'moderate',
      });
      instructions.push({
        priority: 'ROUTINE',
        action: 'Encourage movement and activity when possible.',
        icon: '🟢',
        type: 'low',
      });
    }
    // LOW RISK (<40%)
    else {
      instructions.push({
        priority: 'ROUTINE',
        action: 'Continue standard repositioning schedule.',
        icon: '🟢',
        type: 'low',
      });
      instructions.push({
        priority: 'ROUTINE',
        action: 'Maintain regular skin checks.',
        icon: '🟢',
        type: 'low',
      });
    }

    // Additional instructions based on mobility
    if (mobilityStatus.toLowerCase().includes('bedbound')) {
      instructions.push({
        priority: 'REQUIRED',
        action: 'Use pillows to offload pressure between knees and ankles.',
        icon: '🟠',
        type: 'high',
      });
    }

    // Additional instructions based on skin condition
    if (skinCondition.toLowerCase().includes('stage') || skinCondition.toLowerCase().includes('redness')) {
      instructions.push({
        priority: 'URGENT',
        action: 'Document any skin changes and notify charge nurse.',
        icon: '🔴',
        type: 'critical',
      });
    }

    return instructions;
  };

  const instructions = generateInstructions(
    patient.riskScore,
    patient.mobilityStatus,
    patient.skinCondition
  );

  const getRiskLevel = (score) => {
    if (score >= 0.8) return { label: 'CRITICAL', color: 'text-red-600', bg: 'bg-red-100' };
    if (score >= 0.6) return { label: 'HIGH', color: 'text-orange-600', bg: 'bg-orange-100' };
    if (score >= 0.4) return { label: 'MODERATE', color: 'text-amber-600', bg: 'bg-amber-100' };
    return { label: 'LOW', color: 'text-emerald-600', bg: 'bg-emerald-100' };
  };

  const risk = getRiskLevel(patient.riskScore);
  const scorePercentage = Math.round(patient.riskScore * 100);

  const getTypeStyles = (type) => {
    const styles = {
      critical: 'bg-red-50 border-red-200 text-red-800',
      high: 'bg-orange-50 border-orange-200 text-orange-800',
      moderate: 'bg-amber-50 border-amber-200 text-amber-800',
      low: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    };
    return styles[type];
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-5 h-5 text-clinical-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h2 className="font-display text-xl font-semibold text-slate-800">
          Care Instructions
        </h2>
      </div>

      {/* Patient Summary */}
      <div className="bg-slate-50 rounded-xl p-4 mb-4 border border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-semibold text-slate-800">{patient.name}</h3>
            <p className="text-sm text-slate-500">Room {patient.room} • ID: {patient.id}</p>
          </div>
          <div className={`px-3 py-1.5 rounded-lg ${risk.bg} ${risk.color} font-bold text-sm`}>
            {risk.label}
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${
                  scorePercentage >= 80 ? 'bg-red-500' :
                  scorePercentage >= 60 ? 'bg-orange-500' :
                  scorePercentage >= 40 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${scorePercentage}%` }}
              />
            </div>
          </div>
          <span className={`font-mono font-bold ${risk.color}`}>{scorePercentage}%</span>
        </div>
      </div>

      {/* AI Assistant Label */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-clinical-500 to-clinical-700 flex items-center justify-center shadow-sm">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <span className="text-sm text-clinical-700 font-medium">AI Care Recommendations</span>
      </div>

      {/* Instructions List */}
      <div className="flex-1 space-y-3 overflow-y-auto">
        {instructions.map((instruction, index) => (
          <div
            key={index}
            className={`p-4 rounded-xl border ${getTypeStyles(instruction.type)} transition-all hover:scale-[1.01] hover:shadow-sm`}
          >
            <div className="flex items-start gap-3">
              <span className="text-lg">{instruction.icon}</span>
              <div className="flex-1">
                <span className={`text-xs font-bold tracking-wider ${
                  instruction.type === 'critical' ? 'text-red-600' :
                  instruction.type === 'high' ? 'text-orange-600' :
                  instruction.type === 'moderate' ? 'text-amber-600' : 'text-emerald-600'
                }`}>
                  {instruction.priority}
                </span>
                <p className="text-slate-700 mt-1 text-sm leading-relaxed">
                  {instruction.action}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Note */}
      <div className="mt-4 pt-4 border-t border-slate-200">
        <p className="text-xs text-slate-400 italic">
          These recommendations are generated by AI based on risk assessment scores. 
          Always follow your facility's protocols and clinical judgment.
        </p>
      </div>
    </div>
  );
}

export default CareInstructions;
