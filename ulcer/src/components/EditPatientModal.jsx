import React, { useState, useEffect } from 'react';

function EditPatientModal({ patient, isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    room: '',
    age: '',
    gender: '',
    diagnosis: '',
    weight: '',
    height: '',
    mobilityStatus: '',
    skinCondition: '',
    bradenScore: '',
    riskScore: '',
    allergies: '',
    bloodPressure: '',
    heartRate: '',
    temperature: '',
    oxygenSaturation: '',
  });

  useEffect(() => {
    if (patient) {
      setFormData({
        name: patient.name || '',
        room: patient.room || '',
        age: patient.age || '',
        gender: patient.gender || '',
        diagnosis: patient.diagnosis || '',
        weight: patient.weight || '',
        height: patient.height || '',
        mobilityStatus: patient.mobilityStatus || '',
        skinCondition: patient.skinCondition || '',
        bradenScore: patient.bradenScore || '',
        riskScore: Math.round((patient.riskScore || 0) * 100),
        allergies: (patient.allergies || []).join(', '),
        bloodPressure: patient.vitalSigns?.bloodPressure || '',
        heartRate: patient.vitalSigns?.heartRate || '',
        temperature: patient.vitalSigns?.temperature || '',
        oxygenSaturation: patient.vitalSigns?.oxygenSaturation || '',
      });
    }
  }, [patient]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedPatient = {
      ...patient,
      name: formData.name,
      room: formData.room,
      age: parseInt(formData.age),
      gender: formData.gender,
      diagnosis: formData.diagnosis,
      weight: parseInt(formData.weight),
      height: parseInt(formData.height),
      mobilityStatus: formData.mobilityStatus,
      skinCondition: formData.skinCondition,
      bradenScore: parseInt(formData.bradenScore),
      riskScore: parseInt(formData.riskScore) / 100,
      allergies: formData.allergies.split(',').map(a => a.trim()).filter(a => a),
      vitalSigns: {
        bloodPressure: formData.bloodPressure,
        heartRate: parseInt(formData.heartRate),
        temperature: parseFloat(formData.temperature),
        oxygenSaturation: parseInt(formData.oxygenSaturation),
      },
    };
    onSave(updatedPatient);
  };

  if (!isOpen) return null;

  const mobilityOptions = [
    'Bedbound',
    'Limited mobility',
    'Chair-bound',
    'Ambulatory with assistance',
    'Fully ambulatory',
  ];

  const skinOptions = [
    'Intact',
    'Dry skin',
    'Redness on heels',
    'Stage 1 on sacrum',
    'Stage 2 on sacrum',
    'Multiple areas of concern',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl p-6 shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-clinical-500 to-clinical-700 flex items-center justify-center shadow-md">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold text-slate-800">Edit Patient</h2>
              <p className="text-sm text-slate-500">{patient?.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div>
            <h3 className="text-sm font-semibold text-clinical-700 uppercase tracking-wider mb-3">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1.5">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-clinical-500 focus:ring-2 focus:ring-clinical-100 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1.5">Room</label>
                <input
                  type="text"
                  name="room"
                  value={formData.room}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-clinical-500 focus:ring-2 focus:ring-clinical-100 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1.5">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-clinical-500 focus:ring-2 focus:ring-clinical-100 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1.5">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-clinical-500 focus:ring-2 focus:ring-clinical-100 transition-all"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Medical Info */}
          <div>
            <h3 className="text-sm font-semibold text-clinical-700 uppercase tracking-wider mb-3">Medical Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1.5">Diagnosis</label>
                <input
                  type="text"
                  name="diagnosis"
                  value={formData.diagnosis}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-clinical-500 focus:ring-2 focus:ring-clinical-100 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1.5">Weight (kg)</label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-clinical-500 focus:ring-2 focus:ring-clinical-100 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1.5">Height (cm)</label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-clinical-500 focus:ring-2 focus:ring-clinical-100 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1.5">Mobility Status</label>
                <select
                  name="mobilityStatus"
                  value={formData.mobilityStatus}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-clinical-500 focus:ring-2 focus:ring-clinical-100 transition-all"
                >
                  {mobilityOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1.5">Skin Condition</label>
                <select
                  name="skinCondition"
                  value={formData.skinCondition}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-clinical-500 focus:ring-2 focus:ring-clinical-100 transition-all"
                >
                  {skinOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1.5">Allergies (comma separated)</label>
                <input
                  type="text"
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleChange}
                  placeholder="e.g., Penicillin, Sulfa, Latex"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-clinical-500 focus:ring-2 focus:ring-clinical-100 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Risk Assessment */}
          <div>
            <h3 className="text-sm font-semibold text-clinical-700 uppercase tracking-wider mb-3">Risk Assessment</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1.5">Braden Score</label>
                <input
                  type="number"
                  name="bradenScore"
                  value={formData.bradenScore}
                  onChange={handleChange}
                  min="6"
                  max="23"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-clinical-500 focus:ring-2 focus:ring-clinical-100 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1.5">Risk Score (%)</label>
                <input
                  type="number"
                  name="riskScore"
                  value={formData.riskScore}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-clinical-500 focus:ring-2 focus:ring-clinical-100 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Vital Signs */}
          <div>
            <h3 className="text-sm font-semibold text-clinical-700 uppercase tracking-wider mb-3">Vital Signs</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1.5">Blood Pressure</label>
                <input
                  type="text"
                  name="bloodPressure"
                  value={formData.bloodPressure}
                  onChange={handleChange}
                  placeholder="e.g., 120/80"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-clinical-500 focus:ring-2 focus:ring-clinical-100 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1.5">Heart Rate (bpm)</label>
                <input
                  type="number"
                  name="heartRate"
                  value={formData.heartRate}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-clinical-500 focus:ring-2 focus:ring-clinical-100 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1.5">Temperature (°C)</label>
                <input
                  type="number"
                  name="temperature"
                  value={formData.temperature}
                  onChange={handleChange}
                  step="0.1"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-clinical-500 focus:ring-2 focus:ring-clinical-100 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1.5">SpO2 (%)</label>
                <input
                  type="number"
                  name="oxygenSaturation"
                  value={formData.oxygenSaturation}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-clinical-500 focus:ring-2 focus:ring-clinical-100 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-clinical-500 to-clinical-600 text-white font-medium hover:from-clinical-400 hover:to-clinical-500 transition-all shadow-md shadow-clinical-200 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditPatientModal;
