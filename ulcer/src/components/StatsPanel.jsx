import React from 'react';

function StatsPanel({ stats }) {
  const statCards = [
    {
      label: 'Total Patients',
      value: stats.total,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: 'clinical',
      bgGradient: 'from-clinical-50 to-clinical-100',
      borderColor: 'border-clinical-200',
    },
    {
      label: 'Critical Risk',
      value: stats.critical,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      color: 'red',
      bgGradient: 'from-red-50 to-red-100',
      borderColor: 'border-red-200',
      pulse: stats.critical > 0,
    },
    {
      label: 'High Risk',
      value: stats.high,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      color: 'orange',
      bgGradient: 'from-orange-50 to-orange-100',
      borderColor: 'border-orange-200',
    },
    {
      label: 'Moderate Risk',
      value: stats.moderate,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'amber',
      bgGradient: 'from-amber-50 to-amber-100',
      borderColor: 'border-amber-200',
    },
    {
      label: 'Low Risk',
      value: stats.low,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'emerald',
      bgGradient: 'from-emerald-50 to-emerald-100',
      borderColor: 'border-emerald-200',
    },
  ];

  const getTextColor = (color) => {
    const colors = {
      clinical: 'text-clinical-600',
      red: 'text-red-500',
      orange: 'text-orange-500',
      amber: 'text-amber-500',
      emerald: 'text-emerald-500',
    };
    return colors[color];
  };

  const getValueColor = (color) => {
    const colors = {
      clinical: 'text-clinical-700',
      red: 'text-red-600',
      orange: 'text-orange-600',
      amber: 'text-amber-600',
      emerald: 'text-emerald-600',
    };
    return colors[color];
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 animate-slide-up delay-100">
      {statCards.map((stat, index) => (
        <div
          key={stat.label}
          className={`
            relative bg-white rounded-xl p-5 border ${stat.borderColor}
            shadow-sm hover:shadow-md
            transition-all duration-300 hover:scale-[1.02]
          `}
          style={{ animationDelay: `${index * 50}ms` }}
        >
          {stat.pulse && (
            <div className="absolute top-3 right-3">
              <span className="flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            </div>
          )}
          
          <div className={`${getTextColor(stat.color)} mb-3`}>
            {stat.icon}
          </div>
          
          <div className={`font-display font-bold text-3xl ${getValueColor(stat.color)} mb-1`}>
            {stat.value}
          </div>
          
          <div className="text-sm text-slate-500">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}

export default StatsPanel;
