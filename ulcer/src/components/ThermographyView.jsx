import React, { useState, useEffect } from 'react';

function ThermographyView({ patient }) {
  const [isLive, setIsLive] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [cameraUrl, setCameraUrl] = useState('http://192.168.10.105:8080/');
  const [imageError, setImageError] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const BASE_CAMERA_IP = 'http://192.168.10.105:8080';

  // Generate pressure points from ulcer location
  const generatePressurePoints = (patient) => {
    const defaultPoints = [
      { area: 'Sacrum', status: 'Normal', temperature: 36.5 + Math.random() * 0.5 },
      { area: 'Left Heel', status: 'Normal', temperature: 36.3 + Math.random() * 0.4 },
      { area: 'Right Heel', status: 'Normal', temperature: 36.3 + Math.random() * 0.4 },
    ];

    if (!patient.has_ulcer) {
      if (patient.bradenScore && patient.bradenScore <= 14) {
        defaultPoints[0].status = 'At Risk';
        defaultPoints[0].temperature = 37.0 + Math.random() * 0.5;
      }
      return defaultPoints;
    }

    const ulcerLocations = (patient.ulcer_location || '').split(',').map(l => l.trim().toLowerCase());
    
    const pressurePoints = [
      { area: 'Sacrum', status: 'Normal', temperature: 36.5 },
      { area: 'Left Heel', status: 'Normal', temperature: 36.3 },
      { area: 'Right Heel', status: 'Normal', temperature: 36.3 },
      { area: 'Left Trochanter', status: 'Normal', temperature: 36.4 },
      { area: 'Right Trochanter', status: 'Normal', temperature: 36.4 },
      { area: 'Coccyx', status: 'Normal', temperature: 36.5 },
    ];

    pressurePoints.forEach(point => {
      const areaLower = point.area.toLowerCase();
      if (ulcerLocations.some(loc => areaLower.includes(loc) || loc.includes(areaLower))) {
        point.status = `Stage ${patient.ulcer_stage}`;
        point.temperature = 38.0 + Math.random() * 1.5;
      } else if (patient.bradenScore && patient.bradenScore <= 12) {
        if (Math.random() > 0.5) {
          point.status = 'At Risk';
          point.temperature = 37.0 + Math.random() * 0.8;
        }
      }
    });

    return pressurePoints.filter(p => p.status !== 'Normal' || ['Sacrum', 'Left Heel', 'Right Heel'].includes(p.area));
  };

  const pressurePoints = generatePressurePoints(patient);

  // Update timestamp every second when live
  useEffect(() => {
    let interval;
    if (isLive) {
      interval = setInterval(() => {
        setLastUpdate(new Date());
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isLive]);

  // Reset error state when URL changes or going live
  useEffect(() => {
    if (isLive) {
      setImageError(false);
    }
  }, [isLive, cameraUrl]);

  const getTemperatureColor = (temp) => {
    if (temp >= 38.5) return { bg: 'bg-red-500', text: 'text-red-600', label: 'Hot Spot' };
    if (temp >= 37.5) return { bg: 'bg-orange-500', text: 'text-orange-600', label: 'Elevated' };
    if (temp >= 37.0) return { bg: 'bg-amber-500', text: 'text-amber-600', label: 'Warm' };
    return { bg: 'bg-emerald-500', text: 'text-emerald-600', label: 'Normal' };
  };

  const getStatusColor = (status) => {
    if (status.includes('Stage')) return 'bg-red-500 text-white';
    if (status === 'At Risk') return 'bg-amber-500 text-white';
    return 'bg-emerald-500 text-white';
  };

  const commonEndpoints = [
    '/', '/video', '/stream', '/mjpg/video.mjpg', '/video.mjpg', '/mjpeg', '/videostream.cgi', '/?action=stream'
  ];

  const handleUrlChange = (e) => {
    setCameraUrl(e.target.value);
  };

  const handleTryEndpoint = (endpoint) => {
    const fullUrl = `${BASE_CAMERA_IP}${endpoint}`;
    setCameraUrl(fullUrl);
    setImageError(false);
    setIsSettingsOpen(false);
  };

  const handleRetry = () => {
    setImageError(false);
    // Force re-render by toggling live off/on
    setIsLive(false);
    setTimeout(() => setIsLive(true), 100);
  };

  return (
    <div className="glass rounded-2xl p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center shadow-md">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          <div>
            <h3 className="font-display text-xl font-semibold text-slate-800">
              Thermography Camera / 열화상 카메라
            </h3>
            <p className="text-sm text-slate-500">Live feed from {cameraUrl}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsLive(!isLive)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              isLive 
                ? 'bg-emerald-100 border border-emerald-300 text-emerald-700' 
                : 'bg-slate-100 border border-slate-300 text-slate-500'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
            {isLive ? 'LIVE' : 'PAUSED'}
          </button>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 rounded-lg bg-slate-100 border border-slate-300 text-slate-500 hover:bg-slate-200 transition-colors"
            title="Camera Settings"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Camera Feed - Direct img tag for MJPEG stream */}
        <div className="relative rounded-xl overflow-hidden bg-slate-900 border border-slate-300 shadow-lg min-h-[350px]">
          {isLive && !imageError ? (
            <>
              {/* Live Camera Feed */}
              <img 
                src={cameraUrl}
                alt="Live Camera Feed"
                className="w-full h-full object-contain"
                onError={() => setImageError(true)}
                onLoad={() => setImageError(false)}
              />
              
              {/* Live indicator overlay */}
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/50 px-3 py-1.5 rounded-lg">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                <span className="text-xs text-white font-mono">LIVE</span>
              </div>

              {/* Timestamp overlay */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-center justify-between text-xs text-white/80 font-mono bg-black/50 px-3 py-1.5 rounded-lg">
                  <span>Camera: {cameraUrl}</span>
                  <span>{lastUpdate.toLocaleTimeString()}</span>
                </div>
              </div>
            </>
          ) : imageError ? (
            /* Error State */
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
              <svg className="w-16 h-16 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h4 className="text-white font-semibold mb-2">Camera Connection Failed</h4>
              <p className="text-slate-400 text-sm mb-4">
                Could not connect to camera at:<br/>
                <code className="text-amber-400">{cameraUrl}</code>
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleRetry}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm"
                >
                  Retry Connection
                </button>
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm"
                >
                  Change URL
                </button>
              </div>
            </div>
          ) : (
            /* Paused State */
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <svg className="w-16 h-16 text-slate-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-slate-400">Camera Paused</p>
              <button
                onClick={() => setIsLive(true)}
                className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm"
              >
                Resume Live Feed
              </button>
            </div>
          )}
        </div>

        {/* Pressure Points Analysis */}
        <div className="space-y-4">
          <h4 className="font-display font-semibold text-slate-800 flex items-center gap-2">
            <svg className="w-5 h-5 text-clinical-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Pressure Point Analysis / 압력 부위 분석
          </h4>

          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {pressurePoints.map((point, index) => {
              const tempInfo = getTemperatureColor(point.temperature);
              return (
                <div 
                  key={index}
                  className={`p-4 rounded-xl border transition-all hover:scale-[1.01] hover:shadow-md ${
                    point.status !== 'Normal' 
                      ? 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200' 
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className={`w-3 h-3 rounded-full ${tempInfo.bg}`}></span>
                      <span className="font-medium text-slate-800">{point.area}</span>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getStatusColor(point.status)}`}>
                      {point.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <span className={`font-mono font-bold text-lg ${tempInfo.text}`}>
                        {point.temperature.toFixed(1)}°C
                      </span>
                    </div>
                    <span className={`text-xs ${tempInfo.text}`}>{tempInfo.label}</span>
                  </div>

                  <div className="mt-2 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${tempInfo.bg} transition-all duration-500`}
                      style={{ width: `${Math.min(100, ((point.temperature - 35) / 5) * 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Alert Summary */}
          {pressurePoints.some(p => p.status !== 'Normal') && (
            <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-orange-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-orange-700 font-medium text-sm">
                    {pressurePoints.filter(p => p.status !== 'Normal').length} area(s) need attention
                  </p>
                  <p className="text-slate-500 text-xs mt-1">
                    Check marked pressure points and reposition patient as needed.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-800">Camera Settings</h3>
              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Camera Stream URL
              </label>
              <input
                type="text"
                value={cameraUrl}
                onChange={handleUrlChange}
                className="w-full p-3 border border-slate-300 rounded-xl text-slate-800 bg-slate-50 focus:outline-none focus:border-clinical-500 focus:ring-2 focus:ring-clinical-100"
                placeholder="http://192.168.10.105:8080/"
              />
            </div>
            
            <div className="mb-6">
              <p className="text-sm font-medium text-slate-700 mb-2">Common Endpoints</p>
              <div className="grid grid-cols-2 gap-2">
                {commonEndpoints.map(endpoint => (
                  <button
                    key={endpoint}
                    onClick={() => handleTryEndpoint(endpoint)}
                    className="p-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-200 hover:border-slate-300 transition-colors"
                  >
                    {endpoint === '/' ? 'Base URL (/)' : endpoint}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setImageError(false);
                  setIsSettingsOpen(false);
                  setIsLive(true);
                }}
                className="px-4 py-2 bg-clinical-600 text-white rounded-xl hover:bg-clinical-700 transition-colors"
              >
                Apply & Connect
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ThermographyView;
