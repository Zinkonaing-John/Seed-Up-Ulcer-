import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { bradenScaleDescriptions, ulcerStages, ulcerLocations } from '../data/patients';

function EditPatientModal({ patient, isOpen, onClose, onSave }) {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    name: '', age: '', gender: 'M',
    height_cm: '', weight_kg: '', blood_pressure: '',
    room_number: '', diagnosis: '', notes: '',
    sensory_perception: 4, moisture: 4, activity: 4,
    has_ulcer: false, ulcer_stage: null, ulcer_location: '',
  });

  const [errors, setErrors] = useState({});

  const labels = {
    ko: {
      title: '환자 정보 수정',
      basicInfo: '기본 정보',
      physicalInfo: '신체 정보',
      wardInfo: '병동 정보',
      bradenScale: '브레이든 척도',
      ulcerStatus: '욕창 상태',
      name: '이름',
      age: '나이',
      gender: '성별',
      male: '남성',
      female: '여성',
      height: '키 (cm)',
      weight: '체중 (kg)',
      bloodPressure: '혈압',
      roomNumber: '병실 번호',
      diagnosis: '진단명',
      notes: '특이사항',
      hasUlcer: '욕창 있음',
      ulcerStage: '욕창 단계',
      ulcerLocation: '발생 부위',
      selectStage: '단계 선택',
      selectLocation: '부위 선택',
      cancel: '취소',
      saveChanges: '저장',
      required: '필수 입력 항목입니다',
    },
    en: {
      title: 'Edit Patient',
      basicInfo: 'Basic Information',
      physicalInfo: 'Physical Information',
      wardInfo: 'Ward Information',
      bradenScale: 'Braden Scale',
      ulcerStatus: 'Ulcer Status',
      name: 'Name',
      age: 'Age',
      gender: 'Gender',
      male: 'Male',
      female: 'Female',
      height: 'Height (cm)',
      weight: 'Weight (kg)',
      bloodPressure: 'Blood Pressure',
      roomNumber: 'Room Number',
      diagnosis: 'Diagnosis',
      notes: 'Notes',
      hasUlcer: 'Has Pressure Ulcer',
      ulcerStage: 'Ulcer Stage',
      ulcerLocation: 'Ulcer Location',
      selectStage: 'Select stage',
      selectLocation: 'Select location',
      cancel: 'Cancel',
      saveChanges: 'Save Changes',
      required: 'This field is required',
    },
  };

  const t = labels[language] || labels.en;

  useEffect(() => {
    if (patient) {
      setFormData({
        name: patient.name || '',
        age: patient.age || '',
        gender: patient.gender || 'M',
        height_cm: patient.height_cm || '',
        weight_kg: patient.weight_kg || '',
        blood_pressure: patient.blood_pressure || '',
        room_number: patient.room_number || '',
        diagnosis: patient.diagnosis || '',
        notes: patient.notes || '',
        sensory_perception: patient.sensory_perception || 4,
        moisture: patient.moisture || 4,
        activity: patient.activity || 4,
        has_ulcer: patient.has_ulcer || false,
        ulcer_stage: patient.ulcer_stage || null,
        ulcer_location: patient.ulcer_location || '',
      });
    }
  }, [patient]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = t.required;
    if (!formData.age || parseInt(formData.age) < 1) newErrors.age = t.required;
    if (!formData.room_number.trim()) newErrors.room_number = t.required;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    onSave({
      ...formData,
      age: parseInt(formData.age),
      height_cm: formData.height_cm ? parseFloat(formData.height_cm) : null,
      weight_kg: formData.weight_kg ? parseFloat(formData.weight_kg) : null,
      sensory_perception: parseInt(formData.sensory_perception),
      moisture: parseInt(formData.moisture),
      activity: parseInt(formData.activity),
      ulcer_stage: formData.has_ulcer ? formData.ulcer_stage : null,
      ulcer_location: formData.has_ulcer ? formData.ulcer_location : null,
    });
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  // Calculate Braden Score preview (max 12)
  const bradenScore = 
    parseInt(formData.sensory_perception) + 
    parseInt(formData.moisture) + 
    parseInt(formData.activity);

  const getRiskLabel = (score) => {
    if (score <= 4) return { label: language === 'ko' ? '매우 높은 위험' : 'Very High Risk', color: 'text-red-600 bg-red-100' };
    if (score <= 6) return { label: language === 'ko' ? '높은 위험' : 'High Risk', color: 'text-orange-600 bg-orange-100' };
    if (score <= 8) return { label: language === 'ko' ? '중간 위험' : 'Moderate Risk', color: 'text-amber-600 bg-amber-100' };
    return { label: language === 'ko' ? '낮은 위험' : 'Low Risk', color: 'text-emerald-600 bg-emerald-100' };
  };

  const riskInfo = getRiskLabel(bradenScore);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
      
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl p-6 shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-clinical-500 to-clinical-700 flex items-center justify-center shadow-md">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold text-slate-800">{t.title}</h2>
              <p className="text-sm text-slate-500">{patient?.name}</p>
            </div>
          </div>
          <button onClick={handleClose} className="p-2 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div>
            <h3 className="text-sm font-semibold text-clinical-700 uppercase tracking-wider mb-3">{t.basicInfo}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="col-span-2">
                <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1.5">{t.name} *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange}
                  className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-slate-800 focus:outline-none focus:ring-2 transition-all ${errors.name ? 'border-red-300' : 'border-slate-200 focus:border-clinical-500 focus:ring-clinical-100'}`} />
              </div>
              <div>
                <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1.5">{t.age} *</label>
                <input type="number" name="age" value={formData.age} onChange={handleChange}
                  className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-slate-800 focus:outline-none focus:ring-2 transition-all ${errors.age ? 'border-red-300' : 'border-slate-200 focus:border-clinical-500 focus:ring-clinical-100'}`} />
              </div>
              <div>
                <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1.5">{t.gender}</label>
                <select name="gender" value={formData.gender} onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-clinical-500 focus:ring-2 focus:ring-clinical-100">
                  <option value="M">{t.male}</option>
                  <option value="F">{t.female}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Physical Info */}
          <div>
            <h3 className="text-sm font-semibold text-clinical-700 uppercase tracking-wider mb-3">{t.physicalInfo}</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1.5">{t.height}</label>
                <input type="number" step="0.1" name="height_cm" value={formData.height_cm} onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-clinical-500" />
              </div>
              <div>
                <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1.5">{t.weight}</label>
                <input type="number" step="0.1" name="weight_kg" value={formData.weight_kg} onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-clinical-500" />
              </div>
              <div>
                <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1.5">{t.bloodPressure}</label>
                <input type="text" name="blood_pressure" value={formData.blood_pressure} onChange={handleChange} placeholder="120/80"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-clinical-500" />
              </div>
            </div>
          </div>

          {/* Ward Info */}
          <div>
            <h3 className="text-sm font-semibold text-clinical-700 uppercase tracking-wider mb-3">{t.wardInfo}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1.5">{t.roomNumber} *</label>
                <input type="text" name="room_number" value={formData.room_number} onChange={handleChange}
                  className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-slate-800 focus:outline-none focus:ring-2 transition-all ${errors.room_number ? 'border-red-300' : 'border-slate-200 focus:border-clinical-500 focus:ring-clinical-100'}`} />
              </div>
              <div>
                <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1.5">{t.diagnosis}</label>
                <input type="text" name="diagnosis" value={formData.diagnosis} onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-clinical-500" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1.5">{t.notes}</label>
                <textarea name="notes" value={formData.notes} onChange={handleChange} rows={2}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-clinical-500 resize-none" />
              </div>
            </div>
          </div>

          {/* Braden Scale */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-clinical-700 uppercase tracking-wider">{t.bradenScale}</h3>
              <div className={`px-3 py-1.5 rounded-lg font-bold text-sm ${riskInfo.color}`}>
                {bradenScore}/12 - {riskInfo.label}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(bradenScaleDescriptions).map(([key, desc]) => (
                <div key={key} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <label className="block text-xs text-slate-600 font-medium mb-2">
                    {language === 'ko' ? desc.labelKr : desc.label}
                  </label>
                  <select name={key} value={formData[key]} onChange={handleChange}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 text-sm focus:outline-none focus:border-clinical-500">
                    {desc.options.map(opt => (
                      <option key={opt.value} value={opt.value}>
                        {opt.value} - {language === 'ko' ? opt.labelKr : opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Ulcer Status */}
          <div>
            <h3 className="text-sm font-semibold text-clinical-700 uppercase tracking-wider mb-3">{t.ulcerStatus}</h3>
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" name="has_ulcer" checked={formData.has_ulcer} onChange={handleChange}
                  className="w-5 h-5 text-clinical-600 border-slate-300 rounded focus:ring-clinical-500" />
                <span className="text-slate-700">{t.hasUlcer}</span>
              </label>

              {formData.has_ulcer && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-8">
                  <div>
                    <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1.5">{t.ulcerStage}</label>
                    <select name="ulcer_stage" value={formData.ulcer_stage || ''} onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-clinical-500">
                      <option value="">{t.selectStage}</option>
                      {ulcerStages.filter(s => s.value).map(stage => (
                        <option key={stage.value} value={stage.value}>
                          {language === 'ko' ? stage.labelKr : stage.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1.5">{t.ulcerLocation}</label>
                    <select name="ulcer_location" value={formData.ulcer_location} onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-clinical-500">
                      <option value="">{t.selectLocation}</option>
                      {ulcerLocations.map(loc => (<option key={loc} value={loc}>{loc}</option>))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button type="button" onClick={handleClose} className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all">
              {t.cancel}
            </button>
            <button type="submit" className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-clinical-500 to-clinical-600 text-white font-medium hover:from-clinical-400 hover:to-clinical-500 transition-all shadow-md flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {t.saveChanges}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditPatientModal;
