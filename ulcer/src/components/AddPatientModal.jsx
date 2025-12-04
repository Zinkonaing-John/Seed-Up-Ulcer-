import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { bradenScaleDescriptions, ulcerStages, ulcerLocations } from '../data/patients';

function AddPatientModal({ isOpen, onClose, onSave }) {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'M',
    // Physical info
    height_cm: '',
    weight_kg: '',
    blood_pressure: '',
    // Ward related
    room_number: '',
    diagnosis: '',
    notes: '',
    // Braden Scale (3 items)
    sensory_perception: 4,
    moisture: 4,
    activity: 4,
    // Ulcer status
    has_ulcer: false,
    ulcer_stage: null,
    ulcer_location: '',
  });

  const [errors, setErrors] = useState({});

  const labels = {
    ko: {
      title: '새 환자 등록',
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
      addPatient: '환자 등록',
      required: '필수 입력 항목입니다',
      riskLevel: '위험도',
    },
    en: {
      title: 'Add New Patient',
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
      addPatient: 'Add Patient',
      required: 'This field is required',
      riskLevel: 'Risk Level',
    },
  };

  const t = labels[language] || labels.en;

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

    // Reset form
    setFormData({
      name: '', age: '', gender: 'M',
      height_cm: '', weight_kg: '', blood_pressure: '',
      room_number: '', diagnosis: '', notes: '',
      sensory_perception: 4, moisture: 4, activity: 4,
      has_ulcer: false, ulcer_stage: null, ulcer_location: '',
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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-md">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h2 className="font-display text-xl font-semibold text-slate-800">{t.title}</h2>
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
            <h3 className="text-sm font-semibold text-emerald-700 uppercase tracking-wider mb-3">{t.basicInfo}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="col-span-2">
                <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1.5">{t.name} *</label>
                <input
                  type="text" name="name" value={formData.name} onChange={handleChange}
                  className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-slate-800 focus:outline-none focus:ring-2 transition-all ${errors.name ? 'border-red-300' : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-100'}`}
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1.5">{t.age} *</label>
                <input
                  type="number" name="age" value={formData.age} onChange={handleChange}
                  className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-slate-800 focus:outline-none focus:ring-2 transition-all ${errors.age ? 'border-red-300' : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-100'}`}
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1.5">{t.gender}</label>
                <select name="gender" value={formData.gender} onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100">
                  <option value="M">{t.male}</option>
                  <option value="F">{t.female}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Physical Info */}
          <div>
            <h3 className="text-sm font-semibold text-emerald-700 uppercase tracking-wider mb-3">{t.physicalInfo}</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1.5">{t.height}</label>
                <input type="number" step="0.1" name="height_cm" value={formData.height_cm} onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1.5">{t.weight}</label>
                <input type="number" step="0.1" name="weight_kg" value={formData.weight_kg} onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1.5">{t.bloodPressure}</label>
                <input type="text" name="blood_pressure" value={formData.blood_pressure} onChange={handleChange} placeholder="120/80"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-emerald-500" />
              </div>
            </div>
          </div>

          {/* Ward Info */}
          <div>
            <h3 className="text-sm font-semibold text-emerald-700 uppercase tracking-wider mb-3">{t.wardInfo}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1.5">{t.roomNumber} *</label>
                <input type="text" name="room_number" value={formData.room_number} onChange={handleChange}
                  className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-slate-800 focus:outline-none focus:ring-2 transition-all ${errors.room_number ? 'border-red-300' : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-100'}`} />
              </div>
              <div>
                <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1.5">{t.diagnosis}</label>
                <input type="text" name="diagnosis" value={formData.diagnosis} onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-emerald-500" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1.5">{t.notes}</label>
                <textarea name="notes" value={formData.notes} onChange={handleChange} rows={2}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-emerald-500 resize-none" />
              </div>
            </div>
          </div>

          {/* Ulcer Status */}
          <div>
            <h3 className="text-sm font-semibold text-emerald-700 uppercase tracking-wider mb-3">{t.ulcerStatus}</h3>
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" name="has_ulcer" checked={formData.has_ulcer} onChange={handleChange}
                  className="w-5 h-5 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500" />
                <span className="text-slate-700">{t.hasUlcer}</span>
              </label>

              {formData.has_ulcer && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-8">
                  <div>
                    <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1.5">{t.ulcerStage}</label>
                    <select name="ulcer_stage" value={formData.ulcer_stage || ''} onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-emerald-500">
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
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-emerald-500">
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
            <button type="submit" className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium hover:from-emerald-400 hover:to-emerald-500 transition-all shadow-md flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {t.addPatient}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddPatientModal;
