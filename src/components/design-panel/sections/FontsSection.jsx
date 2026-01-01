/**
 * FontsSection Component
 * Font weight selectors for headings and body text
 */
const FontsSection = ({
  designSystem,
  onUpdate,
}) => {
  const fontWeightOptions = [
    { value: '200', label: 'ExtraLight (200)' },
    { value: '300', label: 'Light (300)' },
    { value: '400', label: 'Regular (400)' },
    { value: '500', label: 'Medium (500)' },
    { value: '600', label: 'SemiBold (600)' },
    { value: '700', label: 'Bold (700)' },
    { value: '800', label: 'ExtraBold (800)' },
    { value: '900', label: 'Black (900)' },
  ];

  return (
    <div className="p-4 border-b border-[--border-default]">
      <h3 className="text-xs font-medium text-[--text-tertiary] uppercase tracking-wide mb-3">Brand Font: Nunito Sans</h3>
      <div className="space-y-3">
        <div>
          <label className="text-[10px] text-[--text-tertiary] font-medium block mb-1.5">Heading Weight</label>
          <select
            value={designSystem.headingWeight || '700'}
            onChange={(e) => onUpdate({ ...designSystem, headingWeight: e.target.value })}
            className="w-full bg-[--surface-raised] border border-[--border-default] rounded-[--radius-md] px-3 py-2 text-xs text-[--text-primary] hover:border-[--border-emphasis] focus:border-[--border-strong] focus:outline-none transition-colors cursor-pointer"
          >
            {fontWeightOptions.map(option => (
              <option 
                key={option.value} 
                value={option.value} 
                style={{ fontFamily: 'Nunito Sans', fontWeight: option.value }}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-[10px] text-[--text-tertiary] font-medium block mb-1.5">Body Weight</label>
          <select
            value={designSystem.bodyWeight || '400'}
            onChange={(e) => onUpdate({ ...designSystem, bodyWeight: e.target.value })}
            className="w-full bg-[--surface-raised] border border-[--border-default] rounded-[--radius-md] px-3 py-2 text-xs text-[--text-primary] hover:border-[--border-emphasis] focus:border-[--border-strong] focus:outline-none transition-colors cursor-pointer"
          >
            {fontWeightOptions.map(option => (
              <option 
                key={option.value} 
                value={option.value} 
                style={{ fontFamily: 'Nunito Sans', fontWeight: option.value }}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default FontsSection;

