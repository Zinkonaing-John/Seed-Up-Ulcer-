import React, { useState, useEffect, useRef } from 'react';

// Camera stream URL - common endpoints to try:
// /video, /stream, /mjpg/video.mjpg, /video.mjpg, /videostream.cgi, /mjpeg
const CAMERA_BASE_URL = 'http://192.168.10.105:8080';

function ThermographyView({ patient }) {
  const [isLive, setIsLive] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [streamError, setStreamError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [streamUrl, setStreamUrl] = useState(CAMERA_BASE_URL);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const videoRef = useRef(null);
  const imgRef = useRef(null);

  // Common stream endpoints to try
  const streamEndpoints = [
    '',
    '/video',
    '/stream', 
    '/mjpg/video.mjpg',
    '/video.mjpg',
    '/mjpeg',
    '/videostream.cgi',
    '/?action=stream',
  ];

  // Update timestamp
  useEffect(() => {
    if (isLive) {
      const interval = setInterval(() => {
        setLastUpdate(new Date());
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isLive]);

  // Handle stream load/error
  const handleStreamLoad = () => {
    setIsLoading(false);
    setStreamError(false);
  };

  const handleStreamError = () => {
    setIsLoading(false);
    setStreamError(true);
  };

  // Try to connect with current URL
  const tryConnect = (url) => {
    setStreamUrl(url || CAMERA_BASE_URL);
    setIsLoading(true);
    setStreamError(false);
  };

  const getTemperatureColor = (temp) => {
    if (temp >= 38.5) return { bg: 'bg-red-500', text: 'text-red-600', label: 'Hot Spot' };
    if (temp >= 37.5) return { bg: 'bg-orange-500', text: 'text-orange-600', label: 'Elevated' };
    if (temp >= 37.0) return { bg: 'bg-amber-500', text: 'text-amber-600', label: 'Warm' };
    return { bg: 'bg-emerald-500', text: 'text-emerald-600', label: 'Normal' };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Stage 2': return 'bg-red-500 text-white';
      case 'Stage 1': return 'bg-orange-500 text-white';
      case 'At Risk': return 'bg-amber-500 text-white';
      default: return 'bg-emerald-500 text-white';
    }
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
              Thermography Camera
            </h3>
            <p className="text-sm text-slate-500">Live thermal imaging</p>
          </div>
        </div>
        
        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Settings Button */}
          <button
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="p-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 hover:bg-slate-200 transition-all"
            title="Camera Settings"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>

          {/* Live Toggle */}
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
        </div>
      </div>

      {/* URL Settings Panel */}
      {showUrlInput && (
        <div className="mb-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
          <label className="block text-sm font-medium text-slate-700 mb-2">Camera Stream URL</label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={streamUrl}
              onChange={(e) => setStreamUrl(e.target.value)}
              placeholder="http://192.168.10.105:8080/video"
              className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 text-sm focus:outline-none focus:border-clinical-500"
            />
            <button
              onClick={() => tryConnect(streamUrl)}
              className="px-4 py-2 bg-clinical-600 text-white rounded-lg hover:bg-clinical-500 transition-all text-sm"
            >
              Connect
            </button>
          </div>
          <div className="text-xs text-slate-500 mb-2">Try these endpoints:</div>
          <div className="flex flex-wrap gap-2">
            {streamEndpoints.map((endpoint, idx) => (
              <button
                key={idx}
                onClick={() => tryConnect(`${CAMERA_BASE_URL}${endpoint}`)}
                className="px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-600 hover:bg-slate-100 transition-all"
              >
                {endpoint || '/'}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Thermal View */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Camera Feed */}
        <div className="relative rounded-xl overflow-hidden bg-slate-900 border border-slate-300 shadow-lg min-h-[300px]">
          {/* Loading State */}
          {isLoading && isLive && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900 z-10">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-clinical-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-slate-400 text-sm">Connecting to camera...</p>
                <p className="text-slate-600 text-xs mt-1">{streamUrl}</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {streamError && !isLoading && isLive && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900 z-10">
              <div className="text-center p-6">
                <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <p className="text-red-400 font-medium mb-2">Camera Unavailable</p>
                <p className="text-slate-500 text-sm mb-2">Unable to connect to:</p>
                <p className="text-slate-400 text-xs mb-4 font-mono bg-slate-800 px-3 py-1 rounded">{streamUrl}</p>
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => tryConnect(streamUrl)}
                    className="px-4 py-2 bg-clinical-600 text-white rounded-lg hover:bg-clinical-500 transition-all text-sm"
                  >
                    Retry
                  </button>
                  <button
                    onClick={() => setShowUrlInput(true)}
                    className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-all text-sm"
                  >
                    Settings
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Camera Stream - Try both img (MJPEG) and iframe approaches */}
          {isLive && (
            <>
              {/* Primary: img tag for MJPEG streams */}
              <img
                ref={imgRef}
                src={`${streamUrl}${streamUrl.includes('?') ? '&' : '?'}t=${Date.now()}`}
                alt="Thermal Camera Feed"
                className="w-full h-full object-contain"
                onLoad={handleStreamLoad}
                onError={handleStreamError}
                style={{ display: streamError ? 'none' : 'block' }}
              />
            </>
          )}

          {/* Paused State */}
          {!isLive && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
              <div className="text-center">
                <svg className="w-16 h-16 text-slate-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-slate-500">Stream Paused</p>
                <p className="text-slate-600 text-sm mt-1">Click LIVE to resume</p>
              </div>
            </div>
          )}

          {/* Overlay info */}
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/50 px-3 py-1.5 rounded-lg">
            <span className={`w-2 h-2 rounded-full ${isLive && !streamError ? 'bg-red-500 animate-pulse' : 'bg-slate-500'}`}></span>
            <span className="text-xs text-white font-mono">
              {isLive && !streamError ? 'LIVE' : 'OFFLINE'}
            </span>
          </div>

          {/* Camera info overlay */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center justify-between text-xs text-white font-mono bg-black/50 px-3 py-2 rounded-lg">
              <span className="truncate max-w-[60%]">{streamUrl.replace('http://', '')}</span>
              <span>{lastUpdate.toLocaleTimeString()}</span>
            </div>
          </div>

          {/* Temperature scale */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <div className="text-xs text-white font-mono space-y-5 text-right">
              <div>40°C</div>
              <div>37°C</div>
              <div>34°C</div>
            </div>
            <div className="w-3 h-28 rounded-full overflow-hidden shadow-lg">
              <div className="w-full h-full bg-gradient-to-b from-red-500 via-yellow-500 via-green-500 to-blue-500"></div>
            </div>
          </div>
        </div>

        {/* Pressure Points Analysis */}
        <div className="space-y-4">
          <h4 className="font-display font-semibold text-slate-800 flex items-center gap-2">
            <svg className="w-5 h-5 text-clinical-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Pressure Point Analysis
          </h4>

          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {patient.pressurePoints.map((point, index) => {
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

                  {/* Temperature bar */}
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

          {/* Summary Alert */}
          {patient.pressurePoints.some(p => p.status !== 'Normal') && (
            <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-orange-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-orange-700 font-medium text-sm">
                    {patient.pressurePoints.filter(p => p.status !== 'Normal').length} area(s) need attention
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
    </div>
  );
}

export default ThermographyView;
