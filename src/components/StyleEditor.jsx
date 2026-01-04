import { useState } from 'react';

/**
 * Slider Control
 */
const SliderControl = ({ label, value, min, max, step = 1, unit = 'px', onChange }) => (
  <div className="mb-3">
    <div className="flex justify-between text-[10px] text-tertiary mb-1">
      <span>{label}</span>
      <span>
        {value}
        {unit}
      </span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-1.5 bg-surface-overlay rounded-lg appearance-none cursor-pointer accent-gray-400"
    />
  </div>
);

/**
 * Color Input
 */
const ColorInput = ({ label, value, onChange }) => (
  <div className="flex items-center justify-between mb-2">
    <span className="text-[10px] text-tertiary">{label}</span>
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value?.startsWith('#') ? value : '#ffffff'}
        onChange={(e) => onChange(e.target.value)}
        className="w-6 h-6 rounded border border-gray-600 cursor-pointer bg-transparent"
      />
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder="#000000"
        className="w-24 px-2 py-1 bg-surface-raised border border-default rounded text-[10px] text-white"
      />
    </div>
  </div>
);

/**
 * Toggle Control
 */
const ToggleControl = ({ label, value, onChange }) => (
  <div className="flex items-center justify-between mb-2">
    <span className="text-[10px] text-tertiary">{label}</span>
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`w-10 h-5 rounded-full transition-colors ${value ? 'bg-gray-500' : 'bg-surface-overlay'}`}
    >
      <div
        className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${value ? 'translate-x-5' : 'translate-x-0.5'}`}
      />
    </button>
  </div>
);

/**
 * Section Header
 */
const SectionHeader = ({ title, isOpen, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    className="w-full flex items-center justify-between py-2 text-xs font-medium text-gray-300 hover:text-white transition-colors"
  >
    {title}
    <svg
      className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  </button>
);

/**
 * Style Editor Component
 * Panel for editing mockup frame styles (corners, borders, shadows, etc.)
 */
const StyleEditor = ({ style, onChange, accentColor }) => {
  const [openSections, setOpenSections] = useState({
    corners: true,
    border: true,
    shadow: true,
    glow: false,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const updateStyle = (key, value) => {
    onChange({ ...style, [key]: value });
  };

  return (
    <div className="text-sm">
      {/* Corner Radius */}
      <div className="border-b border-gray-800 pb-3 mb-3">
        <SectionHeader title="Corner Radius" isOpen={openSections.corners} onToggle={() => toggleSection('corners')} />
        {openSections.corners && (
          <SliderControl
            label="Radius"
            value={style.cornerRadius || 12}
            min={0}
            max={48}
            onChange={(v) => updateStyle('cornerRadius', v)}
          />
        )}
      </div>

      {/* Border */}
      <div className="border-b border-gray-800 pb-3 mb-3">
        <SectionHeader title="Border" isOpen={openSections.border} onToggle={() => toggleSection('border')} />
        {openSections.border && (
          <>
            <div className="mb-3">
              <div className="text-[10px] text-tertiary mb-1.5">Style</div>
              <div className="flex gap-1">
                {['none', 'solid', 'dashed', 'dotted'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => updateStyle('borderStyle', type)}
                    className={`px-2 py-1 rounded text-[10px] capitalize ${
                      style.borderStyle === type
                        ? 'bg-gray-600 text-white'
                        : 'bg-surface-raised text-tertiary hover:bg-surface-overlay'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {style.borderStyle !== 'none' && (
              <>
                <SliderControl
                  label="Width"
                  value={style.borderWidth || 1}
                  min={0}
                  max={8}
                  onChange={(v) => updateStyle('borderWidth', v)}
                />
                <ColorInput label="Color" value={style.borderColor} onChange={(v) => updateStyle('borderColor', v)} />
              </>
            )}
          </>
        )}
      </div>

      {/* Shadow */}
      <div className="border-b border-gray-800 pb-3 mb-3">
        <SectionHeader title="Shadow" isOpen={openSections.shadow} onToggle={() => toggleSection('shadow')} />
        {openSections.shadow && (
          <>
            <ToggleControl
              label="Enable"
              value={style.shadowEnabled}
              onChange={(v) => updateStyle('shadowEnabled', v)}
            />

            {style.shadowEnabled && (
              <>
                <SliderControl
                  label="Offset X"
                  value={style.shadowX || 0}
                  min={-50}
                  max={50}
                  onChange={(v) => updateStyle('shadowX', v)}
                />
                <SliderControl
                  label="Offset Y"
                  value={style.shadowY || 24}
                  min={-50}
                  max={100}
                  onChange={(v) => updateStyle('shadowY', v)}
                />
                <SliderControl
                  label="Blur"
                  value={style.shadowBlur || 48}
                  min={0}
                  max={100}
                  onChange={(v) => updateStyle('shadowBlur', v)}
                />
                <SliderControl
                  label="Spread"
                  value={style.shadowSpread || -12}
                  min={-50}
                  max={50}
                  onChange={(v) => updateStyle('shadowSpread', v)}
                />
                <ColorInput label="Color" value={style.shadowColor} onChange={(v) => updateStyle('shadowColor', v)} />
              </>
            )}
          </>
        )}
      </div>

      {/* Glow */}
      <div className="pb-3">
        <SectionHeader title="Glow Effect" isOpen={openSections.glow} onToggle={() => toggleSection('glow')} />
        {openSections.glow && (
          <>
            <ToggleControl label="Enable" value={style.glowEnabled} onChange={(v) => updateStyle('glowEnabled', v)} />

            {style.glowEnabled && (
              <>
                <SliderControl
                  label="Blur"
                  value={style.glowBlur || 24}
                  min={0}
                  max={100}
                  onChange={(v) => updateStyle('glowBlur', v)}
                />
                <ColorInput
                  label="Color"
                  value={style.glowColor || accentColor}
                  onChange={(v) => updateStyle('glowColor', v)}
                />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StyleEditor;
