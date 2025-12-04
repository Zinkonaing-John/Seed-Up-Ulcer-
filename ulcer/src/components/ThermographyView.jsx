import React, { useState, useEffect, useRef } from 'react';

function ThermographyView({ patient }) {
  const [isLive, setIsLive] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [cameraUrl, setCameraUrl] = useState('http://192.168.10.105:8080/');
  const [currentStreamUrl, setCurrentStreamUrl] = useState(cameraUrl);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const videoRef = useRef(null);

  const BASE_CAMERA_IP = 'http://192.168.10.105:8080';

  // Generate pressure points from ulcer location
  const generatePressurePoints = (patient) => {
    const defaultPoints = [
      { area: 'Sacrum', status: 'Normal', temperature: 36.5 + Math.random() * 0.5 },
      { area: 'Left Heel', status: 'Normal', temperature: 36.3 + Math.random() * 0.4 },
      { area: 'Right Heel', status: 'Normal', temperature: 36.3 + Math.random() * 0.4 },
    ];

    if (!patient.has_ulcer) {
      // For at-risk patients without ulcers
      if (patient.bradenScore && patient.bradenScore <= 14) {
        defaultPoints[0].status = 'At Risk';
        defaultPoints[0].temperature = 37.0 + Math.random() * 0.5;
      }
      return defaultPoints;
    }

    // Parse ulcer locations and update pressure points
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
        // This is an ulcer site
        point.status = `Stage ${patient.ulcer_stage}`;
        point.temperature = 38.0 + Math.random() * 1.5; // Elevated temperature at ulcer site
      } else if (patient.bradenScore && patient.bradenScore <= 12) {
        // High risk areas
        if (Math.random() > 0.5) {
          point.status = 'At Risk';
          point.temperature = 37.0 + Math.random() * 0.8;
        }
      }
    });

    return pressurePoints.filter(p => p.status !== 'Normal' || ['Sacrum', 'Left Heel', 'Right Heel'].includes(p.area));
  };

  const pressurePoints = generatePressurePoints(patient);

  useEffect(() => {
    let interval;
    if (isLive) {
      interval = setInterval(() => {
        setLastUpdate(new Date());
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isLive]);

  useEffect(() => {
    if (isLive) {
      setIsConnecting(true);
      setConnectionError(null);
      const img = new Image();
      img.onload = () => {
        setIsConnecting(false);
        setConnectionError(null);
        setCurrentStreamUrl(cameraUrl);
      };
      img.onerror = () => {
        setIsConnecting(false);
        setConnectionError(`Failed to connect to camera at ${cameraUrl}. Check URL and CORS settings.`);
        setCurrentStreamUrl('');
      };
      img.src = cameraUrl;

      if (videoRef.current) {
        videoRef.current.src = cameraUrl;
        videoRef.current.load();
        videoRef.current.play().catch(e => {
          console.warn("Video autoplay failed:", e);
        });
      }
    } else {
      setCurrentStreamUrl('');
      setIsConnecting(false);
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
    setIsSettingsOpen(false);
    setIsLive(true);
  };

  const handleRetryConnection = () => {
    setConnectionError(null);
    setIsLive(true);
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
            <p className="text-sm text-slate-500">Thermal imaging analysis</p>
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
        {/* Camera Feed */}
        <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-300 shadow-lg min-h-[300px] flex items-center justify-center">
          {isConnecting && (
            <div className="text-white flex flex-col items-center">
              <svg className="animate-spin h-8 w-8 text-white mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Connecting to camera...</span>
            </div>
          )}

          {connectionError && !isConnecting && (
            <div className="text-red-400 flex flex-col items-center p-4 text-center">
              <svg className="w-10 h-10 mb-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="font-semibold mb-2">Camera Connection Error</p>
              <p className="text-sm mb-4">{connectionError}</p>
              <button
                onClick={handleRetryConnection}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Retry Connection
              </button>
            </div>
          )}

          {!isConnecting && !connectionError && isLive && currentStreamUrl && (
            <>
              {cameraUrl.includes('.mjpg') || cameraUrl.includes('stream') || cameraUrl.includes('action=stream') ? (
                <img 
                  src={currentStreamUrl} 
                  alt="Live Thermal Feed" 
                  className="w-full h-full object-contain" 
                  onError={(e) => {
                    if (!connectionError) setConnectionError(`Failed to load MJPEG stream from ${currentStreamUrl}.`);
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <video 
                  ref={videoRef}
                  src={currentStreamUrl} 
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                  className="w-full h-full object-contain" 
                  onError={(e) => {
                    if (!connectionError) setConnectionError(`Failed to load video stream from ${currentStreamUrl}.`);
                    e.target.style.display = 'none';
                  }}
                >
                  Your browser does not support the video tag.
                </video>
              )}
              
              {/* Body heat map overlay */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 300" preserveAspectRatio="xMidYMid meet">
                <ellipse cx="100" cy="40" rx="25" ry="30" fill="url(#headGradient)" opacity="0.7"/>
                <rect x="75" y="65" width="50" height="80" rx="10" fill="url(#bodyGradient)" opacity="0.7"/>
                <ellipse cx="100" cy="180" rx="35" ry="25" fill="url(#hipGradient)" opacity="0.8"/>
                <rect x="70" y="200" width="20" height="70" rx="5" fill="url(#legGradient)" opacity="0.6"/>
                <rect x="110" y="200" width="20" height="70" rx="5" fill="url(#legGradient)" opacity="0.6"/>
                
                {pressurePoints.map((point, index) => {
                  const positions = {
                    'Sacrum': { cx: 100, cy: 170 },
                    'Left Heel': { cx: 80, cy: 280 },
                    'Right Heel': { cx: 120, cy: 280 },
                    'Left Trochanter': { cx: 65, cy: 175 },
                    'Right Trochanter': { cx: 135, cy: 175 },
                    'Coccyx': { cx: 100, cy: 185 },
                  };
                  const pos = positions[point.area] || { cx: 100, cy: 150 };
                  const intensity = (point.temperature - 36) / 3;
                  
                  return (
                    <g key={index}>
                      <circle 
                        cx={pos.cx} 
                        cy={pos.cy} 
                        r={12 + intensity * 8}
                        fill={point.status === 'Normal' ? '#10b981' : point.status === 'At Risk' ? '#f59e0b' : '#ef4444'}
                        opacity={0.4 + intensity * 0.3}
                        className={point.status !== 'Normal' ? 'animate-pulse' : ''}
                      />
                      <circle 
                        cx={pos.cx} 
                        cy={pos.cy} 
                        r={6}
                        fill={point.status === 'Normal' ? '#10b981' : point.status === 'At Risk' ? '#f59e0b' : '#ef4444'}
                        opacity="0.9"
                      />
                    </g>
                  );
                })}
                
                <defs>
                  <radialGradient id="headGradient">
                    <stop offset="0%" stopColor="#22d3ee" />
                    <stop offset="100%" stopColor="#0e7490" />
                  </radialGradient>
                  <radialGradient id="bodyGradient">
                    <stop offset="0%" stopColor="#14b8a6" />
                    <stop offset="100%" stopColor="#0f766e" />
                  </radialGradient>
                  <radialGradient id="hipGradient">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#d97706" />
                  </radialGradient>
                  <radialGradient id="legGradient">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#0891b2" />
                  </radialGradient>
                </defs>
              </svg>
            </>
          )}

          {/* Overlay info */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-red-500 animate-pulse' : 'bg-slate-500'}`}></span>
            <span className="text-xs text-slate-300 font-mono">{isLive ? 'REC' : 'PAUSED'}</span>
          </div>

          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Camera: FLIR C5</span>
              <span>{lastUpdate.toLocaleTimeString()}</span>
            </div>
          </div>

          {/* Temperature scale */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-32 rounded-full overflow-hidden">
            <div className="w-full h-full bg-gradient-to-b from-red-500 via-yellow-500 via-green-500 to-blue-500"></div>
          </div>
          <div className="absolute right-10 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-mono space-y-6">
            <div>40°C</div>
            <div>37°C</div>
            <div>34°C</div>
          </div>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-xl font-bold mb-4 text-slate-800">Camera Settings</h3>
            <div className="mb-4">
              <label htmlFor="cameraUrlInput" className="block text-sm font-medium text-slate-700 mb-1">
                Camera Stream URL
              </label>
              <input
                type="text"
                id="cameraUrlInput"
                value={cameraUrl}
                onChange={handleUrlChange}
                className="w-full p-2 border border-slate-300 rounded-md text-slate-800 bg-slate-50"
                placeholder="e.g., http://192.168.1.100:8080/video"
              />
            </div>
            <div className="mb-4">
              <p className="text-sm font-medium text-slate-700 mb-2">Common Endpoints</p>
              <div className="grid grid-cols-2 gap-2">
                {commonEndpoints.map(endpoint => (
                  <button
                    key={endpoint}
                    onClick={() => handleTryEndpoint(endpoint)}
                    className="p-2 bg-slate-100 border border-slate-300 rounded-md text-sm text-slate-700 hover:bg-slate-200 transition-colors"
                  >
                    {endpoint === '/' ? 'Base URL' : endpoint}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setIsSettingsOpen(false);
                  setIsLive(true);
                }}
                className="px-4 py-2 bg-clinical-600 text-white rounded-md hover:bg-clinical-700 transition-colors"
              >
                Apply & Go Live
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ThermographyView;
