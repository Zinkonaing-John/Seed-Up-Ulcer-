import React, { useState } from 'react';
import { bradenScaleDescriptions, ulcerStages, ulcerLocations } from '../data/patients';

function AddPatientModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'M',
    room: '',
    // Braden Scale
    sensory_perception: 4,
    moisture: 4,
    activity: 4,
    mobility: 4,
    nutrition: 4,
    friction_shear: 3,
    // Ulcer status
    has_ulcer: false,
    ulcer_stage: null,
    ulcer_location: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? parseInt(value) || value : value)
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.age || parseInt(formData.age) < 1) newErrors.age = 'Valid age is required';
    if (!formData.room.trim()) newErrors.room = 'Room is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    onSave({
      ...formData,
      age: parseInt(formData.age),
      ulcer_stage: formData.has_ulcer ? formData.ulcer_stage : null,
      ulcer_location: formData.has_ulcer ? formData.ulcer_location : null,
    });

    // Reset form
    setFormData({
      name: '',
      age: '',
      gender: 'M',
      room: '',
      sensory_perception: 4,
      moisture: 4,
      activity: 4,
      mobility: 4,
      nutrition: 4,
      friction_shear: 3,
      has_ulcer: false,
      ulcer_stage: null,
      ulcer_location: '',
    });
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  // Calculate Braden Score preview
  const bradenScore = 
    formData.sensory_perception + 
    formData.moisture + 
    formData.activity + 
    formData.mobility + 
    formData.nutrition + 
    formData.friction_shear;

  const getRiskLabel = (score) => {
    if (score <= 9) return { label: 'Very High Risk', color: 'text-red-600 bg-red-100' };
    if (score <= 12) return { label: 'High Risk', color: 'text-orange-600 bg-orange-100' };
    if (score <= 14) return { label: 'Moderate Risk', color: 'text-amber-600 bg-amber-100' };
    if (score <= 18) return { label: 'Mild Risk', color: 'text-emerald-600 bg-emerald-100' };
    return { label: 'No Risk', color: 'text-emerald-600 bg-emerald-100' };
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
            <div>
              <h2 className="font-display text-xl font-semibold text-slate-800">Add New Patient</h2>
              <p className="text-sm text-slate-500">환자 등록</p>
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
            <h3 className="text-sm font-semibold text-emerald-700 uppercase tracking-wider mb-3">Basic Information / 기본 정보</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="col-span-2">
                <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1.5">Name / 이름 *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-slate-800 focus:outline-none focus:ring-2 transition-all ${
                    errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-100'
                  }`}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1.5">Age / 나이 *</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-slate-800 focus:outline-none focus:ring-2 transition-all ${
                    errors.age ? 'border-red-300' : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-100'
                  }`}
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1.5">Gender / 성별</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                >
                  <option value="M">Male / 남성</option>
                  <option value="F">Female / 여성</option>
                </select>
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1.5">Room / 병실 *</label>
                <input
                  type="text"
                  name="room"
                  value={formData.room}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-slate-800 focus:outline-none focus:ring-2 transition-all ${
                    errors.room ? 'border-red-300' : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-100'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Braden Scale */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-emerald-700 uppercase tracking-wider">Braden Scale / 브레이든 척도</h3>
              <div className={`px-3 py-1.5 rounded-lg font-bold text-sm ${riskInfo.color}`}>
                Score: {bradenScore}/23 - {riskInfo.label}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(bradenScaleDescriptions).map(([key, desc]) => (
                <div key={key} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <label className="block text-xs text-slate-600 font-medium mb-2">
                    {desc.label} / {desc.labelKr}
                  </label>
                  <select
                    name={key}
                    value={formData[key]}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 text-sm focus:outline-none focus:border-emerald-500"
                  >
                    {desc.options.map(opt => (
                      <option key={opt.value} value={opt.value}>
                        {opt.value} - {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Ulcer Status */}
          <div>
            <h3 className="text-sm font-semibold text-emerald-700 uppercase tracking-wider mb-3">Ulcer Status / 욕창 상태</h3>
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="has_ulcer"
                  checked={formData.has_ulcer}
                  onChange={handleChange}
                  className="w-5 h-5 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
                />
                <span className="text-slate-700">Patient has pressure ulcer / 욕창 있음</span>
              </label>

              {formData.has_ulcer && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-8">
                  <div>
                    <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1.5">Ulcer Stage / 욕창 단계</label>
                    <select
                      name="ulcer_stage"
                      value={formData.ulcer_stage || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="">Select stage</option>
                      {ulcerStages.filter(s => s.value).map(stage => (
                        <option key={stage.value} value={stage.value}>
                          {stage.label} / {stage.labelKr}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1.5">Location / 발생 부위</label>
                    <select
                      name="ulcer_location"
                      value={formData.ulcer_location}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="">Select location</option>
                      {ulcerLocations.map(loc => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button type="button" onClick={handleClose} className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium hover:from-emerald-400 hover:to-emerald-500 transition-all shadow-md flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Patient
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddPatientModal;
