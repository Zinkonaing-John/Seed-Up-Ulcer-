import React, { useState, useEffect } from 'react';

function ThermographyView({ patient, children }) {
  const [isLive, setIsLive] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [cameraUrl, setCameraUrl] = useState('http://192.168.10.105:8080/');
  const [imageError, setImageError] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const BASE_CAMERA_IP = 'http://192.168.10.105:8080';

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
        {/* Camera Feed */}
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

        {/* Right Side Content - Care Instructions passed as children */}
        <div className="flex flex-col min-h-[350px]">
          {children}
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
