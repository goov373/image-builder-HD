import { useState } from 'react';

/**
 * Dashboard Placeholder Content
 * Renders a realistic-looking dashboard preview
 */
const DashboardPlaceholder = ({ type = 'analytics', accentColor = '#6466e9' }) => {
  const placeholders = {
    analytics: (
      <div className="w-full h-full bg-[#18191A] p-4 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: accentColor }} />
            <div className="w-24 h-3 bg-surface-overlay rounded" />
          </div>
          <div className="flex gap-2">
            <div className="w-20 h-6 bg-surface-raised rounded" />
            <div className="w-8 h-8 bg-surface-raised rounded-full" />
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-surface-raised/50 rounded-lg p-3">
              <div className="w-12 h-2 bg-surface-overlay rounded mb-2" />
              <div className="w-16 h-4 bg-surface-elevated rounded mb-1" />
              <div className="w-8 h-2 rounded" style={{ backgroundColor: i === 1 ? '#10b981' : '#ef4444' }} />
            </div>
          ))}
        </div>

        {/* Chart Area */}
        <div className="flex-1 bg-surface-raised/30 rounded-lg p-4 mb-4">
          <div className="flex items-end justify-around h-full gap-2">
            {[40, 65, 45, 80, 55, 70, 90, 60, 75, 85, 50, 95].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t"
                style={{
                  height: `${h}%`,
                  backgroundColor: i === 11 ? accentColor : 'rgba(255,255,255,0.1)',
                }}
              />
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-surface-raised/30 rounded-lg p-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 py-2 border-b border-default last:border-0">
              <div className="w-6 h-6 bg-surface-overlay rounded-full" />
              <div className="flex-1">
                <div className="w-32 h-2 bg-surface-overlay rounded mb-1" />
                <div className="w-20 h-2 bg-surface-raised rounded" />
              </div>
              <div className="w-16 h-3 bg-surface-overlay rounded" />
            </div>
          ))}
        </div>
      </div>
    ),
    settings: (
      <div className="w-full h-full bg-[#18191A] p-4 flex">
        {/* Sidebar */}
        <div className="w-48 bg-surface-raised/50 rounded-lg p-3 mr-4">
          {['General', 'Security', 'Billing', 'Team', 'API'].map((item, i) => (
            <div key={item} className={`px-3 py-2 rounded-lg mb-1 ${i === 0 ? 'bg-surface-overlay' : ''}`}>
              <div className={`w-16 h-2 rounded ${i === 0 ? 'bg-white/80' : 'bg-surface-elevated'}`} />
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="w-32 h-4 bg-surface-overlay rounded mb-6" />

          {/* Form fields */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="mb-4">
              <div className="w-20 h-2 bg-surface-overlay rounded mb-2" />
              <div className="w-full h-10 bg-surface-raised rounded-lg border border-default" />
            </div>
          ))}

          <div className="flex gap-2 mt-6">
            <div className="w-24 h-9 rounded-lg" style={{ backgroundColor: accentColor }} />
            <div className="w-20 h-9 bg-surface-raised rounded-lg border border-default" />
          </div>
        </div>
      </div>
    ),
    table: (
      <div className="w-full h-full bg-[#18191A] p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="w-32 h-4 bg-surface-overlay rounded" />
          <div className="flex gap-2">
            <div className="w-32 h-8 bg-surface-raised rounded-lg border border-default" />
            <div className="w-24 h-8 rounded-lg" style={{ backgroundColor: accentColor }} />
          </div>
        </div>

        {/* Table */}
        <div className="bg-surface-raised/30 rounded-lg overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-4 px-4 py-3 bg-surface-raised/50">
            {['20%', '30%', '20%', '15%', '15%'].map((w, i) => (
              <div key={i} className="h-2 bg-surface-elevated rounded" style={{ width: w }} />
            ))}
          </div>

          {/* Rows */}
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-3 border-t border-default">
              <div className="w-6 h-6 bg-surface-overlay rounded-full" style={{ width: '20%' }} />
              <div className="h-2 bg-surface-overlay rounded" style={{ width: '30%' }} />
              <div className="h-2 bg-surface-overlay rounded" style={{ width: '20%' }} />
              <div
                className="h-5 w-12 rounded"
                style={{ backgroundColor: i === 2 ? '#10b981' : '#3b82f6', width: '15%' }}
              />
              <div className="h-2 bg-surface-overlay rounded" style={{ width: '15%' }} />
            </div>
          ))}
        </div>
      </div>
    ),
    chart: (
      <div className="w-full h-full bg-[#18191A] p-4 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="w-24 h-3 bg-surface-overlay rounded mb-1" />
            <div className="w-16 h-2 bg-surface-raised rounded" />
          </div>
          <div className="flex gap-2">
            {['7D', '30D', '90D', '1Y'].map((p, i) => (
              <div
                key={p}
                className={`px-3 py-1 rounded text-[10px] ${i === 1 ? 'text-white' : 'bg-surface-raised text-quaternary'}`}
                style={{ backgroundColor: i === 1 ? accentColor : undefined }}
              >
                {p}
              </div>
            ))}
          </div>
        </div>

        {/* Large Chart */}
        <div className="flex-1 relative">
          <svg className="w-full h-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={accentColor} stopOpacity="0.3" />
                <stop offset="100%" stopColor={accentColor} stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M 0 80 Q 50 60 100 70 T 200 50 T 300 65 T 400 40 T 500 55 T 600 30 L 600 100 L 0 100 Z"
              fill="url(#chartGradient)"
              transform="scale(1, 1)"
            />
            <path
              d="M 0 80 Q 50 60 100 70 T 200 50 T 300 65 T 400 40 T 500 55 T 600 30"
              fill="none"
              stroke={accentColor}
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>
    ),
  };

  return placeholders[type] || placeholders.analytics;
};

/**
 * Mockup Frame Component
 * Renders a styled dashboard/modal frame with all styling options
 */
const MockupFrame = ({
  template = 'dashboard-full',
  style = {},
  placeholderType = 'analytics',
  accentColor = '#6466e9',
  imageUrl,
  isSelected = false,
  onClick,
  children,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Build box-shadow string
  const buildShadow = () => {
    const shadows = [];

    if (style.shadowEnabled) {
      shadows.push(
        `${style.shadowX || 0}px ${style.shadowY || 24}px ${style.shadowBlur || 48}px ${style.shadowSpread || -12}px ${style.shadowColor || 'rgba(0,0,0,0.25)'}`
      );
    }

    if (style.glowEnabled) {
      shadows.push(`0 0 ${style.glowBlur || 24}px ${style.glowColor || '#3b82f6'}40`);
    }

    if (style.innerShadowEnabled) {
      shadows.push(`inset 0 0 ${style.innerShadowBlur || 12}px ${style.innerShadowColor || 'rgba(0,0,0,0.1)'}`);
    }

    return shadows.length > 0 ? shadows.join(', ') : 'none';
  };

  // Build border string
  const buildBorder = () => {
    if (style.borderStyle === 'none' || !style.borderWidth) return 'none';

    if (style.borderStyle === 'gradient' && style.borderGradient) {
      return 'none'; // Handle gradient border differently
    }

    return `${style.borderWidth || 1}px ${style.borderStyle || 'solid'} ${style.borderColor || 'rgba(255,255,255,0.1)'}`;
  };

  // Browser window chrome for browser-window template
  const renderBrowserChrome = () => (
    <div className="bg-surface-raised px-3 py-2 flex items-center gap-2 border-b border-default">
      <div className="flex gap-1.5">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
      </div>
      <div className="flex-1 mx-4">
        <div className="bg-surface-canvas rounded-lg px-3 py-1 text-[10px] text-quaternary flex items-center gap-2">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          app.hellodata.ai
        </div>
      </div>
    </div>
  );

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        overflow-hidden transition-all duration-200
        ${isSelected ? 'ring-2 ring-strong' : ''}
        ${isHovered && !isSelected ? 'ring-1 ring-white/20' : ''}
        cursor-pointer
      `}
      style={{
        borderRadius: style.cornerRadius || 12,
        border: buildBorder(),
        boxShadow: buildShadow(),
        transform: style.perspective
          ? `perspective(${style.perspective}px) rotateX(${style.rotateX || 0}deg) rotateY(${style.rotateY || 0}deg)`
          : undefined,
      }}
    >
      {/* Browser chrome for browser-window template */}
      {template === 'browser-window' && renderBrowserChrome()}

      {/* Content */}
      <div className="w-full h-full overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt="Dashboard screenshot" className="w-full h-full object-cover" />
        ) : (
          <DashboardPlaceholder type={placeholderType} accentColor={accentColor} />
        )}
        {children}
      </div>
    </div>
  );
};

export default MockupFrame;
