import React, { useState } from 'react';

// Available fonts
const fontOptions = {
  sansSerif: [
    { name: 'Nunito Sans', value: '"Nunito Sans", sans-serif', category: 'Sans Serif' },
    { name: 'Inter', value: '"Inter", sans-serif', category: 'Sans Serif' },
    { name: 'DM Sans', value: '"DM Sans", sans-serif', category: 'Sans Serif' }
  ],
  serif: [
    { name: 'Playfair Display', value: '"Playfair Display", serif', category: 'Serif' },
    { name: 'Merriweather', value: '"Merriweather", serif', category: 'Serif' },
    { name: 'Lora', value: '"Lora", serif', category: 'Serif' }
  ]
};

const allFonts = [...fontOptions.sansSerif, ...fontOptions.serif];

// Default design system colors and fonts
const defaultDesignSystem = {
  primary: '#f97316',
  secondary: '#0f766e',
  accent: '#fbbf24',
  neutral1: '#0f172a',
  neutral2: '#334155',
  neutral3: '#f8fafc',
  headingFont: '"Nunito Sans", sans-serif',
  bodyFont: '"Inter", sans-serif'
};

// LinkedIn aspect ratio specs
const frameSizes = {
  story: { name: "Story", ratio: "9:16", width: 135, height: 240, spec: "1080 × 1920px", platforms: "TikTok · Reels · Shorts" },
  pin: { name: "Pin", ratio: "2:3", width: 160, height: 240, spec: "1000 × 1500px", platforms: "Pinterest · RedNote" },
  portrait: { name: "Portrait", ratio: "4:5", width: 192, height: 240, spec: "1080 × 1350px", platforms: "Instagram · Facebook" },
  square: { name: "Square", ratio: "1:1", width: 192, height: 192, spec: "1080 × 1080px", platforms: "Instagram · X · LinkedIn" },
  landscape: { name: "Landscape", ratio: "1.91:1", width: 280, height: 147, spec: "1200 × 628px", platforms: "LinkedIn · X · Ads" },
  slides: { name: "Slides", ratio: "16:9", width: 280, height: 158, spec: "1920 × 1080px", platforms: "YouTube · PowerPoint" }
};

// Layout variant names for display
const layoutNames = ["Bottom Stack", "Center Drama", "Editorial"];
const layoutVariantNames = {
  0: ["Bottom", "Top", "Center"],
  1: ["Center", "Lower", "Upper"],
  2: ["Left", "Center", "Right"]
};

// Initial carousel data with text variations
const initialCarousels = [
  {
    id: 1,
    name: "The Deal That Got Away",
    subtitle: "Investors / Acquisitions",
    frameSize: "portrait",
    frames: [
      {
        id: 1,
        variants: [
          { headline: "A 200-unit value-add hit the market at 9am.", body: "The clock starts now.", formatting: {} },
          { headline: "The deal dropped at 9am. 200 units. Prime submarket.", body: "Everyone saw it.", formatting: {} },
          { headline: "9:00 AM: New listing alert. 200 units.", body: "Your competition just woke up too.", formatting: {} }
        ],
        currentVariant: 0,
        currentLayout: 0,
        layoutVariant: 0,
        style: "dark-single-pin"
      },
      {
        id: 2,
        variants: [
          { headline: "By 2pm, you're still pulling comps manually.", body: "Spreadsheets. Browser tabs. Guesswork.", formatting: {} },
          { headline: "Five hours later. Still no underwriting.", body: "Manual comps are killing your velocity.", formatting: {} },
          { headline: "2:00 PM: You're on your third data source.", body: "Nothing matches. Nothing's current.", formatting: {} }
        ],
        currentVariant: 0,
        currentLayout: 0,
        layoutVariant: 0,
        style: "dark-chaos"
      },
      {
        id: 3,
        variants: [
          { headline: "By 4pm, three groups have already toured.", body: "They moved faster. They had better data.", formatting: {} },
          { headline: "The property manager says you're fourth in line.", body: "Three offers already on the table.", formatting: {} },
          { headline: "4:00 PM: Your competitors aren't guessing.", body: "They're already submitting LOIs.", formatting: {} }
        ],
        currentVariant: 0,
        currentLayout: 0,
        layoutVariant: 0,
        style: "dark-competition"
      },
      {
        id: 4,
        variants: [
          { headline: "What if you had comps, expenses, and NOI in 60 seconds?", body: "Rent comps. Expense benchmarks. Similarity scores. Instantly.", formatting: {} },
          { headline: "Same deal. Different outcome.", body: "AI-powered underwriting from just an address.", formatting: {} },
          { headline: "One address. Complete analysis.", body: "97% accuracy. 60 seconds. No manual work.", formatting: {} }
        ],
        currentVariant: 0,
        currentLayout: 0,
        layoutVariant: 0,
        style: "reveal-product"
      },
      {
        id: 5,
        variants: [
          { headline: "Screen faster. Bid smarter. Win more.", body: "Join 25,000+ multifamily professionals →", formatting: {} },
          { headline: "Stop losing deals to slower data.", body: "Get a demo of HelloData →", formatting: {} },
          { headline: "The fastest teams win the best deals.", body: "See HelloData in action →", formatting: {} }
        ],
        currentVariant: 0,
        currentLayout: 0,
        layoutVariant: 0,
        style: "cta-win"
      }
    ]
  },
  {
    id: 2,
    name: "Where Rents Are Heading",
    subtitle: "Rent Forecast Launch",
    frameSize: "portrait",
    frames: [
      {
        id: 1,
        variants: [
          { headline: "Your rent projections are 90 days old.", body: "The moment you get them.", formatting: {} },
          { headline: "Q3 forecast in Q4. Sound familiar?", body: "Static reports can't keep pace.", formatting: {} },
          { headline: "That rent growth assumption in your model?", body: "It's already outdated.", formatting: {} }
        ],
        currentVariant: 0,
        currentLayout: 0,
        layoutVariant: 0,
        style: "static-gray"
      },
      {
        id: 2,
        variants: [
          { headline: "Markets move daily. Static forecasts can't.", body: "Concessions shift. Demand spikes. Rents adjust.", formatting: {} },
          { headline: "Last quarter's data. Today's decisions.", body: "That's the problem with traditional forecasts.", formatting: {} },
          { headline: "The market moved 47 times since your last report.", body: "Your forecast didn't.", formatting: {} }
        ],
        currentVariant: 0,
        currentLayout: 0,
        layoutVariant: 0,
        style: "cracking"
      },
      {
        id: 3,
        variants: [
          { headline: "What if your forecast updated every single day?", body: "Real-time market signals. Daily projections.", formatting: {} },
          { headline: "Imagine seeing rent movement as it happens.", body: "Not quarterly. Daily.", formatting: {} },
          { headline: "Live rent intelligence. Continuous updates.", body: "The forecast that never gets stale.", formatting: {} }
        ],
        currentVariant: 0,
        currentLayout: 0,
        layoutVariant: 0,
        style: "heatmap-transform"
      },
      {
        id: 4,
        variants: [
          { headline: "Introducing Rent Forecast", body: "12-month projections powered by real-time market data.", formatting: {} },
          { headline: "NEW: Rent Forecast by HelloData", body: "Forward-looking projections. Updated daily.", formatting: {} },
          { headline: "Rent Forecast: See the next 12 months.", body: "Property, submarket, and market-level predictions.", formatting: {} }
        ],
        currentVariant: 0,
        currentLayout: 0,
        layoutVariant: 0,
        style: "product-forecast"
      },
      {
        id: 5,
        variants: [
          { headline: "See where your market is heading.", body: "Get early access to Rent Forecast →", formatting: {} },
          { headline: "Stop guessing. Start forecasting.", body: "Request your demo →", formatting: {} },
          { headline: "The future of rent projections is here.", body: "Be first to see it →", formatting: {} }
        ],
        currentVariant: 0,
        currentLayout: 0,
        layoutVariant: 0,
        style: "cta-forecast"
      }
    ]
  },
  {
    id: 3,
    name: "5 Hours You'll Never Get Back",
    subtitle: "Property Managers",
    frameSize: "portrait",
    frames: [
      {
        id: 1,
        variants: [
          { headline: "Monday: Call Oakwood Apartments.", body: "Wait on hold. Get voicemail.", formatting: {} },
          { headline: "Monday 9am: Start your comp calls.", body: "First three go straight to voicemail.", formatting: {} },
          { headline: "Another Monday. Another round of phone surveys.", body: "Let's see who actually picks up.", formatting: {} }
        ],
        currentVariant: 0,
        currentLayout: 0,
        layoutVariant: 0,
        style: "monday"
      },
      {
        id: 2,
        variants: [
          { headline: "Tuesday: Finally reach The Meridian.", body: "'We don't give out pricing over the phone.'", formatting: {} },
          { headline: "Tuesday 2pm: Success! Someone answered.", body: "'That information is confidential.'", formatting: {} },
          { headline: "Tuesday: Three callbacks. One useful number.", body: "And it might already be wrong.", formatting: {} }
        ],
        currentVariant: 0,
        currentLayout: 0,
        layoutVariant: 0,
        style: "tuesday"
      },
      {
        id: 3,
        variants: [
          { headline: "Wednesday: Check 12 competitor websites.", body: "Pricing already changed on half of them.", formatting: {} },
          { headline: "Wednesday: Manual website audits.", body: "Copy. Paste. Repeat. Repeat. Repeat.", formatting: {} },
          { headline: "Wednesday: The spreadsheet grows.", body: "But is any of this data still accurate?", formatting: {} }
        ],
        currentVariant: 0,
        currentLayout: 0,
        layoutVariant: 0,
        style: "wednesday"
      },
      {
        id: 4,
        variants: [
          { headline: "Thursday: Enter everything into Excel.", body: "Friday: Half the data is already stale.", formatting: {} },
          { headline: "Thursday-Friday: Format the report.", body: "Monday: Start over. Prices changed.", formatting: {} },
          { headline: "End of week: Finally done.", body: "Just in time for the data to be outdated.", formatting: {} }
        ],
        currentVariant: 0,
        currentLayout: 0,
        layoutVariant: 0,
        style: "thursday-friday"
      },
      {
        id: 5,
        variants: [
          { headline: "Or get it all delivered to your inbox.", body: "Automatically. Every week. Try it free →", formatting: {} },
          { headline: "5 hours back. Every single week.", body: "Automate your market surveys →", formatting: {} },
          { headline: "Stop calling. Start automating.", body: "Free trial — no card required →", formatting: {} }
        ],
        currentVariant: 0,
        currentLayout: 0,
        layoutVariant: 0,
        style: "cta-automated"
      }
    ]
  }
];

// Frame background styles
const getFrameStyle = (carouselId, frameStyle, ds) => {
  const styles = {
    "dark-single-pin": { background: `linear-gradient(135deg, ${ds.neutral1} 0%, ${ds.neutral2} 100%)`, accent: ds.primary },
    "dark-chaos": { background: `linear-gradient(135deg, ${ds.neutral2} 0%, ${ds.neutral1} 100%)`, accent: '#ef4444' },
    "dark-competition": { background: `linear-gradient(135deg, ${ds.neutral1} 0%, ${ds.neutral2} 100%)`, accent: ds.accent },
    "reveal-product": { background: `linear-gradient(135deg, ${ds.neutral1} 0%, ${ds.secondary} 100%)`, accent: ds.primary },
    "cta-win": { background: `linear-gradient(135deg, ${ds.secondary} 0%, ${ds.primary} 100%)`, accent: ds.neutral3 },
    "static-gray": { background: `linear-gradient(135deg, ${ds.neutral2} 0%, ${ds.neutral1} 100%)`, accent: '#9ca3af' },
    "cracking": { background: `linear-gradient(135deg, ${ds.neutral2} 0%, ${ds.neutral1} 100%)`, accent: ds.accent },
    "heatmap-transform": { background: `linear-gradient(135deg, ${ds.secondary} 0%, ${ds.primary} 100%)`, accent: ds.accent },
    "product-forecast": { background: `linear-gradient(135deg, ${ds.neutral1} 0%, ${ds.secondary} 100%)`, accent: ds.primary },
    "cta-forecast": { background: `linear-gradient(135deg, ${ds.primary} 0%, ${ds.secondary} 100%)`, accent: ds.neutral3 },
    "monday": { background: `linear-gradient(135deg, ${ds.neutral1} 0%, ${ds.neutral2} 100%)`, accent: ds.primary },
    "tuesday": { background: `linear-gradient(135deg, ${ds.neutral1} 0%, ${ds.neutral2} 100%)`, accent: ds.accent },
    "wednesday": { background: `linear-gradient(135deg, ${ds.neutral2} 0%, ${ds.neutral1} 100%)`, accent: ds.primary },
    "thursday-friday": { background: `linear-gradient(135deg, ${ds.neutral2} 0%, ${ds.neutral1} 100%)`, accent: '#f87171' },
    "cta-automated": { background: `linear-gradient(135deg, ${ds.secondary} 0%, ${ds.primary} 100%)`, accent: ds.neutral3 },
  };
  return styles[frameStyle] || styles["dark-single-pin"];
};

// Format Button with hover tooltip
const FormatButton = ({ formatKey, size, isSelected, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div className="relative" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <button
        onClick={onClick}
        className={`flex items-center justify-center gap-1 py-1 rounded text-[10px] font-medium transition-colors ${
          isSelected ? 'bg-orange-500 text-white' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
        }`}
        style={{ width: formatKey === 'landscape' ? 56 : 46 }}
      >
        {formatKey === 'portrait' && <svg className="w-3 h-4" viewBox="0 0 12 16" fill="currentColor"><rect x="1" y="1" width="10" height="14" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/></svg>}
        {formatKey === 'square' && <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="currentColor"><rect x="1" y="1" width="12" height="12" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/></svg>}
        {formatKey === 'landscape' && <svg className="w-4 h-3" viewBox="0 0 16 12" fill="currentColor"><rect x="1" y="1" width="14" height="10" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/></svg>}
        {formatKey === 'story' && <svg className="w-2.5 h-4" viewBox="0 0 9 16" fill="currentColor"><rect x="1" y="1" width="7" height="14" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/></svg>}
        {formatKey === 'pin' && <svg className="w-3 h-4" viewBox="0 0 10 16" fill="currentColor"><rect x="1" y="1" width="8" height="14" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/></svg>}
        {formatKey === 'slides' && <svg className="w-4 h-2.5" viewBox="0 0 16 9" fill="currentColor"><rect x="1" y="1" width="14" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/></svg>}
        <span>{size.ratio}</span>
      </button>
      
      <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-gray-800 border border-gray-700 rounded-lg shadow-xl pointer-events-none transition-opacity whitespace-nowrap z-50 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-px"><div className="border-4 border-transparent border-b-gray-700" /></div>
        <div className="text-[10px] font-medium text-white">{size.name}</div>
        <div className="text-[9px] text-gray-400">{size.platforms}</div>
      </div>
    </div>
  );
};

// Editable Text Field Component
const EditableTextField = ({ children, field, isFrameSelected, isActive, onActivate, onUpdateText, formatting = {}, className = '', style = {} }) => {
  const isHighlight = formatting.underline && formatting.underlineStyle === 'highlight';
  
  const getUnderlineStyles = () => {
    if (!formatting.underline) return {};
    const underlineColor = formatting.underlineColor || formatting.color || '#fff';
    if (formatting.underlineStyle === 'highlight') return {};
    return {
      textDecorationLine: 'underline',
      textDecorationStyle: formatting.underlineStyle || 'solid',
      textDecorationColor: underlineColor,
      textDecorationThickness: formatting.underlineStyle === 'wavy' ? '2px' : '1.5px',
      textUnderlineOffset: '2px',
    };
  };

  const displayStyle = {
    ...style,
    fontWeight: formatting.bold ? 'bold' : style.fontWeight,
    fontStyle: formatting.italic ? 'italic' : style.fontStyle,
    color: formatting.color || style.color,
    transform: formatting.fontSize ? `scale(${formatting.fontSize})` : undefined,
    transformOrigin: 'left center',
    ...getUnderlineStyles(),
  };
  
  const outlineStyle = !isFrameSelected ? {} : isActive 
    ? { outline: '2px solid rgb(249 115 22)', outlineOffset: '2px' }
    : { outline: '1px dashed rgb(249 115 22 / 0.4)', outlineOffset: '2px' };
  
  const highlightColor = formatting.underlineColor || formatting.color || '#fbbf24';
  const highlightStyle = isHighlight ? {
    backgroundColor: `${highlightColor}40`,
    paddingLeft: '0.15em',
    paddingRight: '0.15em',
    marginLeft: '-0.15em',
    marginRight: '-0.15em',
    boxDecorationBreak: 'clone',
    WebkitBoxDecorationBreak: 'clone',
  } : {};
  
  return (
    <span
      className={`${className} ${isFrameSelected && !isActive ? 'cursor-pointer' : ''}`}
      style={{ ...displayStyle, ...outlineStyle }}
      contentEditable={isActive}
      suppressContentEditableWarning
      onClick={(e) => { if (isFrameSelected) { e.stopPropagation(); onActivate?.(field); } }}
      onBlur={(e) => { if (isActive) onUpdateText?.(field, e.target.innerText); }}
    >
      {isHighlight ? <span style={highlightStyle}>{children}</span> : children}
    </span>
  );
};

// Layout Component - Bottom Stack
const LayoutBottomStack = ({ headline, body, accent, isLandscape, headingFont, bodyFont, variant = 0, isFrameSelected, onUpdateText, activeField, onActivateField, formatting = {} }) => {
  const getAlignment = () => {
    switch (variant) {
      case 1: return 'justify-start pt-6';
      case 2: return 'justify-center';
      default: return 'justify-end';
    }
  };
  
  const getGradient = () => {
    switch (variant) {
      case 1: return 'bg-gradient-to-b from-black/70 via-black/20 to-transparent';
      case 2: return 'bg-black/40';
      default: return 'bg-gradient-to-t from-black/70 via-black/20 to-transparent';
    }
  };
  
  const commonProps = { isFrameSelected, onActivate: onActivateField, onUpdateText };
  
  if (isLandscape) {
    return (
      <div className={`absolute inset-0 flex items-end p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent`}>
        <div className="flex items-end justify-between w-full gap-4">
          <EditableTextField {...commonProps} field="headline" isActive={activeField === 'headline'} formatting={formatting.headline || {}} className="text-xs font-bold leading-tight block flex-1" style={{ color: accent, fontFamily: headingFont }}>{headline}</EditableTextField>
          <EditableTextField {...commonProps} field="body" isActive={activeField === 'body'} formatting={formatting.body || {}} className="text-[10px] text-gray-200 leading-snug text-right block max-w-[40%]" style={{ fontFamily: bodyFont }}>{body}</EditableTextField>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`absolute inset-0 flex flex-col ${getAlignment()} p-4 ${getGradient()}`}>
      <div className="relative mb-1.5">
        <EditableTextField {...commonProps} field="headline" isActive={activeField === 'headline'} formatting={formatting.headline || {}} className="text-sm font-bold leading-tight block" style={{ color: accent, fontFamily: headingFont }}>{headline}</EditableTextField>
      </div>
      <div className="relative">
        <EditableTextField {...commonProps} field="body" isActive={activeField === 'body'} formatting={formatting.body || {}} className="text-xs text-gray-200 leading-snug block" style={{ fontFamily: bodyFont }}>{body}</EditableTextField>
      </div>
    </div>
  );
};

// Layout Component - Center Drama
const LayoutCenterDrama = ({ headline, body, accent, isLandscape, headingFont, bodyFont, variant = 0, isFrameSelected, onUpdateText, activeField, onActivateField, formatting = {} }) => {
  const getAlignment = () => {
    switch (variant) {
      case 1: return 'justify-end pb-6';
      case 2: return 'justify-start pt-8';
      default: return 'justify-center';
    }
  };
  
  const commonProps = { isFrameSelected, onActivate: onActivateField, onUpdateText };
  
  if (isLandscape) {
    return (
      <div className="absolute inset-0 flex items-center justify-center p-3 bg-black/50">
        <div className="flex items-center gap-4 max-w-[95%]">
          <EditableTextField {...commonProps} field="headline" isActive={activeField === 'headline'} formatting={formatting.headline || {}} className="text-xs font-black leading-tight tracking-tight block flex-1" style={{ color: accent, fontFamily: headingFont }}>{headline}</EditableTextField>
          <div className="w-0.5 h-8 rounded-full flex-shrink-0" style={{ background: accent, opacity: 0.6 }} />
          <EditableTextField {...commonProps} field="body" isActive={activeField === 'body'} formatting={formatting.body || {}} className="text-[10px] text-gray-300 leading-snug font-medium block max-w-[35%]" style={{ fontFamily: bodyFont }}>{body}</EditableTextField>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`absolute inset-0 flex flex-col items-center ${getAlignment()} p-4 text-center bg-black/40`}>
      <div className="max-w-[90%]">
        <div className="relative inline-block mb-3">
          <EditableTextField {...commonProps} field="headline" isActive={activeField === 'headline'} formatting={formatting.headline || {}} className="text-base font-black leading-tight tracking-tight block" style={{ color: accent, fontFamily: headingFont }}>{headline}</EditableTextField>
        </div>
        <div className="w-12 h-0.5 mx-auto mb-3 rounded-full" style={{ background: accent, opacity: 0.6 }} />
        <div className="relative inline-block">
          <EditableTextField {...commonProps} field="body" isActive={activeField === 'body'} formatting={formatting.body || {}} className="text-xs text-gray-300 leading-relaxed font-medium block" style={{ fontFamily: bodyFont }}>{body}</EditableTextField>
        </div>
      </div>
    </div>
  );
};

// Layout Component - Editorial
const LayoutEditorialLeft = ({ headline, body, accent, isLandscape, headingFont, bodyFont, variant = 0, isFrameSelected, onUpdateText, activeField, onActivateField, formatting = {} }) => {
  const getHeadlineAlign = () => {
    switch (variant) {
      case 1: return 'items-center text-center';
      case 2: return 'items-end text-right';
      default: return 'items-start text-left';
    }
  };
  
  const getAccentAlign = () => {
    switch (variant) {
      case 1: return 'mx-auto';
      case 2: return 'ml-auto';
      default: return '';
    }
  };
  
  const getBodyAlign = () => {
    switch (variant) {
      case 1: return 'self-center text-center';
      case 2: return 'self-start text-left';
      default: return 'self-end text-right';
    }
  };
  
  const commonProps = { isFrameSelected, onActivate: onActivateField, onUpdateText };
  
  if (isLandscape) {
    return (
      <div className="absolute inset-0 flex items-center p-3 pt-6 gap-3">
        <div className="w-1 h-10 rounded-full flex-shrink-0" style={{ background: accent }} />
        <EditableTextField {...commonProps} field="headline" isActive={activeField === 'headline'} formatting={formatting.headline || {}} className="text-xs font-bold leading-tight block flex-1" style={{ color: accent, fontFamily: headingFont }}>{headline}</EditableTextField>
        <div className="relative bg-black/40 backdrop-blur-sm rounded px-2 py-1 max-w-[35%]">
          <EditableTextField {...commonProps} field="body" isActive={activeField === 'body'} formatting={formatting.body || {}} className="text-[10px] text-gray-200 leading-snug italic block" style={{ fontFamily: bodyFont }}>{body}</EditableTextField>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`absolute inset-0 flex flex-col ${getHeadlineAlign()} p-4 pt-8`}>
      <div className={`w-8 h-1 rounded-full mb-3 ${getAccentAlign()}`} style={{ background: accent }} />
      <div className="relative max-w-[85%] mb-auto">
        <EditableTextField {...commonProps} field="headline" isActive={activeField === 'headline'} formatting={formatting.headline || {}} className="text-sm font-bold leading-tight block" style={{ color: accent, fontFamily: headingFont }}>{headline}</EditableTextField>
      </div>
      <div className={`relative ${getBodyAlign()} max-w-[75%] bg-black/30 backdrop-blur-sm rounded-lg p-2`}>
        <EditableTextField {...commonProps} field="body" isActive={activeField === 'body'} formatting={formatting.body || {}} className="text-xs text-gray-200 leading-snug italic block" style={{ fontFamily: bodyFont }}>{body}</EditableTextField>
      </div>
    </div>
  );
};

// Single Frame Component
const CarouselFrame = ({ frame, carouselId, frameSize, designSystem, frameIndex, totalFrames, isFrameSelected, onSelectFrame, onRemove, onUpdateText, activeTextField, onActivateTextField }) => {
  const [isHovered, setIsHovered] = useState(false);
  const style = getFrameStyle(carouselId, frame.style, designSystem);
  const content = frame.variants[frame.currentVariant];
  const layoutIndex = frame.currentLayout || 0;
  const size = frameSizes[frameSize] || frameSizes.portrait;
  const isLandscape = frameSize === 'landscape' || frameSize === 'slides';
  const formatting = frame.variants[frame.currentVariant]?.formatting || {};
  const layoutVariant = frame.layoutVariant || 0;
  
  const handleUpdateText = (field, value) => onUpdateText?.(carouselId, frame.id, field, value);
  const handleActivateField = (field) => onActivateTextField?.(field);
  
  const renderLayout = () => {
    const props = { 
      headline: content.headline, body: content.body, accent: style.accent, isLandscape,
      headingFont: designSystem.headingFont, bodyFont: designSystem.bodyFont, variant: layoutVariant,
      isFrameSelected, onUpdateText: handleUpdateText, activeField: activeTextField,
      onActivateField: handleActivateField, formatting,
    };
    switch (layoutIndex) {
      case 1: return <LayoutCenterDrama {...props} />;
      case 2: return <LayoutEditorialLeft {...props} />;
      default: return <LayoutBottomStack {...props} />;
    }
  };
  
  return (
    <div className="flex flex-col" style={{ width: size.width }}>
      <div className="flex items-center justify-between mb-1">
        <span className={`text-xs font-medium transition-colors ${isFrameSelected ? 'text-orange-400' : 'text-gray-500'}`}>Page {frame.id}</span>
        <span className={`text-[10px] px-1.5 py-0.5 rounded transition-colors ${isFrameSelected ? 'text-orange-300 bg-orange-500/20' : 'text-gray-600 bg-gray-800'}`}>
          {layoutVariantNames[layoutIndex]?.[layoutVariant] || layoutNames[layoutIndex]}
        </span>
      </div>
      
      <div 
        className={`relative rounded-lg overflow-hidden shadow-lg cursor-pointer transition-all border ${isFrameSelected ? 'ring-2 ring-orange-500 border-orange-500' : 'border-gray-700 hover:border-gray-500'}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ background: style.background, width: size.width, height: size.height }}
        onClick={(e) => { e.stopPropagation(); onSelectFrame(frame.id); }}
      >
        {renderLayout()}
        
        <div className="absolute top-2 right-2 flex gap-1 z-10">
          {[1,2,3,4,5].map(i => <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === frame.id ? 'bg-white' : 'bg-white/30'}`} />)}
        </div>
        
        {totalFrames > 1 && (
          <button onClick={(e) => { e.stopPropagation(); onRemove(frame.id); }} className={`absolute top-2 left-2 z-20 w-6 h-6 bg-black/70 hover:bg-red-500 rounded-full flex items-center justify-center transition-opacity duration-150 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        )}
      </div>
    </div>
  );
};

// Carousel Row Component
const CarouselRow = ({ carousel, designSystem, isSelected, hasAnySelection, selectedFrameId, onSelect, onSelectFrame, onAddFrame, onRemoveFrame, onUpdateText, activeTextField, onActivateTextField }) => {
  const totalFrames = carousel.frames.length;
  const isFaded = hasAnySelection && !isSelected;
  
  return (
    <div 
      className={`mb-10 rounded-xl transition-all duration-300 cursor-pointer ${isSelected ? 'bg-orange-500/5 ring-2 ring-orange-500/30 -mx-4 px-4 py-4' : 'hover:bg-gray-800/30 -mx-4 px-4 py-4'} ${isFaded ? 'opacity-20 hover:opacity-50' : 'opacity-100'}`}
      onClick={() => onSelect(carousel.id)}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={(e) => { e.stopPropagation(); onSelect(isSelected ? null : carousel.id); }} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isSelected ? 'bg-orange-500 hover:bg-orange-600' : 'bg-gray-700 hover:bg-gray-600'}`}>
            {isSelected ? (
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
            )}
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className={`text-lg font-bold transition-colors ${isSelected ? 'text-orange-400' : 'text-white'}`}>{carousel.name}</h2>
              {isSelected && <span className="text-[9px] bg-orange-500/20 text-orange-400 px-1.5 py-0.5 rounded font-medium">EDITING</span>}
            </div>
            <p className="text-sm text-gray-400">{carousel.subtitle}</p>
          </div>
        </div>
      </div>
      
      <div className="flex items-start gap-4" style={{ minHeight: 300 }}>
        <div className="flex gap-4 items-start">
          {carousel.frames.map((frame, index) => (
            <CarouselFrame
              key={frame.id}
              frame={frame}
              carouselId={carousel.id}
              frameSize={carousel.frameSize}
              designSystem={designSystem}
              frameIndex={index}
              totalFrames={totalFrames}
              isFrameSelected={isSelected && selectedFrameId === frame.id}
              onSelectFrame={(frameId) => onSelectFrame(carousel.id, frameId)}
              onRemove={(frameId) => onRemoveFrame(carousel.id, frameId)}
              onUpdateText={onUpdateText}
              activeTextField={isSelected && selectedFrameId === frame.id ? activeTextField : null}
              onActivateTextField={onActivateTextField}
            />
          ))}
          
          <div className="flex items-center self-stretch" style={{ width: 50, paddingTop: 24 }}>
            <button onClick={(e) => { e.stopPropagation(); onAddFrame(carousel.id); }} className="w-10 h-10 rounded-full border-2 border-dashed border-gray-600 hover:border-orange-500 hover:bg-orange-500/10 flex items-center justify-center transition-all">
              <svg className="w-5 h-5 text-gray-500 hover:text-orange-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
export default function CarouselDesignTool() {
  const [carousels, setCarousels] = useState(initialCarousels);
  const [zoom, setZoom] = useState(100);
  const [designSystem, setDesignSystem] = useState(defaultDesignSystem);
  const [selectedCarouselId, setSelectedCarouselId] = useState(1);
  const [selectedFrameId, setSelectedFrameId] = useState(null);
  const [activeTextField, setActiveTextField] = useState(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFontSize, setShowFontSize] = useState(false);
  const [showUnderlinePicker, setShowUnderlinePicker] = useState(false);
  
  const selectedCarousel = carousels.find(c => c.id === selectedCarouselId) || carousels[0];
  const selectedFrame = selectedCarousel?.frames?.find(f => f.id === selectedFrameId);
  
  const handleSelectFrame = (carouselId, frameId) => {
    setShowColorPicker(false); setShowFontSize(false); setShowUnderlinePicker(false);
    setActiveTextField(null);
    if (carouselId !== selectedCarouselId) setSelectedCarouselId(carouselId);
    setSelectedFrameId(prev => (prev === frameId && carouselId === selectedCarouselId) ? null : frameId);
  };
  
  const handleSelectCarousel = (carouselId) => {
    setShowColorPicker(false); setShowFontSize(false); setShowUnderlinePicker(false);
    setActiveTextField(null);
    if (carouselId !== selectedCarouselId) setSelectedFrameId(null);
    setSelectedCarouselId(carouselId);
  };
  
  const handleSetVariant = (carouselId, frameId, variantIndex) => {
    setCarousels(prev => prev.map(carousel => {
      if (carousel.id !== carouselId) return carousel;
      return { ...carousel, frames: carousel.frames.map(frame => frame.id !== frameId ? frame : { ...frame, currentVariant: variantIndex }) };
    }));
  };
  
  const handleSetLayout = (carouselId, frameId, layoutIndex) => {
    setCarousels(prev => prev.map(carousel => {
      if (carousel.id !== carouselId) return carousel;
      return { ...carousel, frames: carousel.frames.map(frame => frame.id !== frameId ? frame : { ...frame, currentLayout: layoutIndex, layoutVariant: 0 }) };
    }));
  };
  
  const handleShuffleLayoutVariant = (carouselId, frameId) => {
    setCarousels(prev => prev.map(carousel => {
      if (carousel.id !== carouselId) return carousel;
      return { ...carousel, frames: carousel.frames.map(frame => frame.id !== frameId ? frame : { ...frame, layoutVariant: ((frame.layoutVariant || 0) + 1) % 3 }) };
    }));
  };
  
  const handleUpdateText = (carouselId, frameId, field, value) => {
    setCarousels(prev => prev.map(carousel => {
      if (carousel.id !== carouselId) return carousel;
      return {
        ...carousel,
        frames: carousel.frames.map(frame => {
          if (frame.id !== frameId) return frame;
          const updatedVariants = [...frame.variants];
          updatedVariants[frame.currentVariant] = { ...updatedVariants[frame.currentVariant], [field]: value };
          return { ...frame, variants: updatedVariants };
        })
      };
    }));
  };
  
  const handleUpdateFormatting = (carouselId, frameId, field, key, value) => {
    setCarousels(prev => prev.map(carousel => {
      if (carousel.id !== carouselId) return carousel;
      return {
        ...carousel,
        frames: carousel.frames.map(frame => {
          if (frame.id !== frameId) return frame;
          const updatedVariants = [...frame.variants];
          const currentVariant = updatedVariants[frame.currentVariant];
          const currentFormatting = currentVariant.formatting || {};
          const fieldFormatting = currentFormatting[field] || {};
          updatedVariants[frame.currentVariant] = { ...currentVariant, formatting: { ...currentFormatting, [field]: { ...fieldFormatting, [key]: value } } };
          return { ...frame, variants: updatedVariants };
        })
      };
    }));
  };
  
  const handleAddFrame = (carouselId) => {
    setCarousels(prev => prev.map(carousel => {
      if (carousel.id !== carouselId) return carousel;
      const newId = carousel.frames.length + 1;
      const lastFrame = carousel.frames[carousel.frames.length - 1];
      const newFrame = {
        id: newId,
        variants: [
          { headline: `Slide ${newId}: Add your headline`, body: "Add your supporting copy here.", formatting: {} },
          { headline: `Alternative headline ${newId}`, body: "Alternative supporting copy.", formatting: {} },
          { headline: `Third option for slide ${newId}`, body: "Third copy variation.", formatting: {} }
        ],
        currentVariant: 0, currentLayout: 0, layoutVariant: 0,
        style: lastFrame?.style || "dark-single-pin"
      };
      return { ...carousel, frames: [...carousel.frames, newFrame] };
    }));
  };
  
  const handleChangeFrameSize = (carouselId, newSize) => {
    setCarousels(prev => prev.map(carousel => carousel.id === carouselId ? { ...carousel, frameSize: newSize } : carousel));
  };
  
  const handleRemoveFrame = (carouselId, frameId) => {
    if (selectedCarouselId === carouselId && selectedFrameId === frameId) setSelectedFrameId(null);
    setCarousels(prev => prev.map(carousel => {
      if (carousel.id !== carouselId) return carousel;
      if (carousel.frames.length <= 1) return carousel;
      const newFrames = carousel.frames.filter(f => f.id !== frameId).map((f, idx) => ({ ...f, id: idx + 1 }));
      return { ...carousel, frames: newFrames };
    }));
  };
  
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur border-b border-gray-800 px-6 py-3">
        <div className="flex items-center justify-between max-w-full">
          <div>
            <h1 className="text-xl font-bold">LinkedIn Carousel Designer</h1>
            <p className="text-sm text-gray-400">HelloData Campaign Tool</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
              <span className="text-sm font-medium text-gray-300">Design System</span>
              <div className="flex gap-0.5 ml-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: designSystem.primary }} />
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: designSystem.secondary }} />
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: designSystem.accent }} />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Toolbar */}
      <div className="sticky top-[72px] z-40 bg-gray-900 border-b border-gray-800 px-6 py-1.5">
        <div className="flex items-start justify-between text-xs text-gray-400">
          <div className="flex items-start gap-4">
            {/* Format section */}
            <div className={`flex flex-col gap-0.5 transition-opacity ${selectedCarouselId ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-medium text-gray-500">Format</span>
                <span className="text-gray-600 text-[8px]">{frameSizes[selectedCarousel?.frameSize]?.spec || '1080 × 1350px'}</span>
              </div>
              <div className="flex items-center bg-gray-800 rounded-lg p-0.5 gap-0.5">
                {Object.entries(frameSizes).map(([key, size]) => (
                  <FormatButton key={key} formatKey={key} size={size} isSelected={selectedCarousel?.frameSize === key} onClick={() => handleChangeFrameSize(selectedCarouselId, key)} />
                ))}
              </div>
            </div>
            
            <div className="w-px h-10 bg-gray-700 self-center" />
            
            {/* Layout section */}
            <div className={`flex flex-col gap-0.5 transition-opacity ${selectedFrame ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
              <span className="text-[9px] font-medium text-gray-500">Layout</span>
              <div className="flex items-center gap-1">
                <div className="flex items-center bg-gray-800 rounded p-0.5 gap-0.5">
                  <button onClick={() => selectedFrame && handleSetLayout(selectedCarouselId, selectedFrameId, 0)} className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium transition-all ${selectedFrame && (selectedFrame.currentLayout || 0) === 0 ? 'bg-orange-500 text-white' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'}`} title="Bottom Stack">
                    <div className="w-3 h-3.5 bg-gray-700 rounded flex items-end p-0.5"><div className={`w-full h-0.5 rounded-sm ${selectedFrame && (selectedFrame.currentLayout || 0) === 0 ? 'bg-white/80' : 'bg-orange-500/60'}`} /></div>
                  </button>
                  <button onClick={() => selectedFrame && handleSetLayout(selectedCarouselId, selectedFrameId, 1)} className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium transition-all ${selectedFrame?.currentLayout === 1 ? 'bg-orange-500 text-white' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'}`} title="Center Drama">
                    <div className="w-3 h-3.5 bg-gray-700 rounded flex items-center justify-center"><div className={`w-1.5 h-1.5 rounded-sm ${selectedFrame?.currentLayout === 1 ? 'bg-white/80' : 'bg-orange-500/60'}`} /></div>
                  </button>
                  <button onClick={() => selectedFrame && handleSetLayout(selectedCarouselId, selectedFrameId, 2)} className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium transition-all ${selectedFrame?.currentLayout === 2 ? 'bg-orange-500 text-white' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'}`} title="Editorial">
                    <div className="w-3 h-3.5 bg-gray-700 rounded flex flex-col justify-between p-0.5">
                      <div className={`w-1.5 h-0.5 rounded-sm ${selectedFrame?.currentLayout === 2 ? 'bg-white/80' : 'bg-orange-500/60'}`} />
                      <div className="w-1 h-0.5 bg-gray-500/60 rounded-sm self-end" />
                    </div>
                  </button>
                </div>
                <button onClick={() => selectedFrame && handleShuffleLayoutVariant(selectedCarouselId, selectedFrameId)} className="p-1 rounded text-gray-400 hover:text-gray-200 hover:bg-gray-700 transition-all" title="Shuffle variant">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" /></svg>
                </button>
              </div>
            </div>
            
            <div className="w-px h-10 bg-gray-700 self-center" />
            
            {/* Snippets section */}
            <div className={`flex flex-col gap-0.5 transition-opacity ${activeTextField ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
              <span className="text-[9px] font-medium text-gray-500">Snippets</span>
              <div className="flex items-center gap-1">
                <div className="flex items-center bg-gray-800 rounded p-0.5 gap-0.5">
                  {[0, 1, 2].map((variantIndex) => (
                    <button key={variantIndex} onClick={() => activeTextField && handleSetVariant(selectedCarouselId, selectedFrameId, variantIndex)} className={`flex items-center justify-center w-6 py-0.5 rounded text-[10px] font-medium transition-all ${selectedFrame?.currentVariant === variantIndex ? 'bg-orange-500 text-white' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'}`}>
                      {variantIndex + 1}
                    </button>
                  ))}
                </div>
                <button className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-medium text-orange-400 hover:bg-orange-500/20 transition-colors" title="Rewrite with AI">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L14.09 8.26L20 9.27L15.55 13.97L16.91 20L12 16.9L7.09 20L8.45 13.97L4 9.27L9.91 8.26L12 2Z" /></svg>
                </button>
              </div>
            </div>
            
            <div className="w-px h-10 bg-gray-700 self-center" />
            
            {/* Text Style section */}
            <div className={`flex flex-col gap-0.5 transition-opacity ${activeTextField ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
              <span className="text-[9px] font-medium text-gray-500">Text Style</span>
              <div className="flex items-center gap-1">
                {/* Color picker */}
                <div className="relative">
                  <button onClick={() => activeTextField && setShowColorPicker(!showColorPicker)} className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-medium text-gray-300 hover:bg-gray-700 transition-colors" title="Text color">
                    <div className="w-3 h-3 rounded-sm border border-gray-600" style={{ backgroundColor: selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.color || '#ffffff' }} />
                  </button>
                  {showColorPicker && activeTextField && (
                    <div className="absolute top-full left-0 mt-1 p-1.5 bg-gray-800 border border-gray-700 rounded shadow-xl z-50">
                      <div className="flex gap-1">
                        {[{ name: 'Primary', value: designSystem.primary }, { name: 'Secondary', value: designSystem.secondary }, { name: 'Accent', value: designSystem.accent }, { name: 'Light', value: designSystem.neutral3 }, { name: 'White', value: '#ffffff' }].map(c => (
                          <button key={c.value} onClick={() => { handleUpdateFormatting(selectedCarouselId, selectedFrameId, activeTextField, 'color', c.value); setShowColorPicker(false); }} className="w-5 h-5 rounded border border-gray-600 hover:scale-110 transition-transform" style={{ backgroundColor: c.value }} title={c.name} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Bold */}
                <button onClick={() => { if (!activeTextField) return; const formatting = selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField] || {}; handleUpdateFormatting(selectedCarouselId, selectedFrameId, activeTextField, 'bold', !formatting.bold); }} className={`px-1.5 py-0.5 rounded text-[9px] font-bold transition-colors ${selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.bold ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`} title="Bold">B</button>
                
                {/* Italic */}
                <button onClick={() => { if (!activeTextField) return; const formatting = selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField] || {}; handleUpdateFormatting(selectedCarouselId, selectedFrameId, activeTextField, 'italic', !formatting.italic); }} className={`px-1.5 py-0.5 rounded text-[9px] italic transition-colors ${selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.italic ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`} title="Italic">I</button>
                
                {/* Font Size */}
                <div className="relative">
                  <button onClick={() => activeTextField && setShowFontSize(!showFontSize)} className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-medium text-gray-300 hover:bg-gray-700 transition-colors" title="Font size">
                    <span>Aa</span>
                    <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  {showFontSize && activeTextField && (
                    <div className="absolute top-full left-0 mt-1 p-1 bg-gray-800 border border-gray-700 rounded shadow-xl z-50">
                      <div className="flex gap-0.5">
                        {[{ name: 'S', value: 0.85 }, { name: 'M', value: 1 }, { name: 'L', value: 1.2 }].map(s => (
                          <button key={s.name} onClick={() => { handleUpdateFormatting(selectedCarouselId, selectedFrameId, activeTextField, 'fontSize', s.value); setShowFontSize(false); }} className={`px-2 py-0.5 rounded text-[9px] font-medium transition-colors ${selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.fontSize === s.value ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>{s.name}</button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Underline */}
                <div className="relative flex">
                  <button onClick={() => { if (!activeTextField) return; const currentUnderline = selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.underline; handleUpdateFormatting(selectedCarouselId, selectedFrameId, activeTextField, 'underline', !currentUnderline); if (!currentUnderline) handleUpdateFormatting(selectedCarouselId, selectedFrameId, activeTextField, 'underlineStyle', 'solid'); }} className={`px-1.5 py-0.5 rounded-l text-[9px] transition-colors ${selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.underline ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`} title="Underline" style={{ textDecoration: 'underline' }}>U</button>
                  <button onClick={() => activeTextField && setShowUnderlinePicker(!showUnderlinePicker)} className="px-0.5 py-0.5 rounded-r text-gray-400 hover:text-gray-200 hover:bg-gray-700 transition-colors border-l border-gray-600">
                    <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  {showUnderlinePicker && activeTextField && (
                    <div className="absolute top-full right-0 mt-1 p-2 bg-gray-800 border border-gray-700 rounded shadow-xl z-50 min-w-[140px]">
                      <div className="text-[8px] text-gray-500 mb-1.5 uppercase tracking-wide">Style</div>
                      <div className="flex gap-1 mb-3">
                        {[{ name: 'Solid', value: 'solid' }, { name: 'Dotted', value: 'dotted' }, { name: 'Wavy', value: 'wavy' }, { name: 'Highlight', value: 'highlight' }].map(s => (
                          <button key={s.value} onClick={() => { handleUpdateFormatting(selectedCarouselId, selectedFrameId, activeTextField, 'underlineStyle', s.value); handleUpdateFormatting(selectedCarouselId, selectedFrameId, activeTextField, 'underline', true); }} className={`px-2 py-1 rounded text-[9px] transition-colors ${selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.underlineStyle === s.value ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`} title={s.name}>
                            {s.value === 'solid' && <span style={{ textDecoration: 'underline', textDecorationStyle: 'solid' }}>S</span>}
                            {s.value === 'dotted' && <span style={{ textDecoration: 'underline', textDecorationStyle: 'dotted' }}>D</span>}
                            {s.value === 'wavy' && <span style={{ textDecoration: 'underline', textDecorationStyle: 'wavy' }}>W</span>}
                            {s.value === 'highlight' && <span style={{ backgroundImage: 'linear-gradient(to top, rgba(251,191,36,0.5) 30%, transparent 30%)' }}>H</span>}
                          </button>
                        ))}
                      </div>
                      <div className="text-[8px] text-gray-500 mb-1.5 uppercase tracking-wide">Color</div>
                      <div className="flex gap-1.5">
                        {[{ name: 'Primary', value: designSystem.primary }, { name: 'Secondary', value: designSystem.secondary }, { name: 'Accent', value: designSystem.accent }, { name: 'Light', value: designSystem.neutral3 }, { name: 'White', value: '#ffffff' }].map(c => (
                          <button key={c.value} onClick={() => { handleUpdateFormatting(selectedCarouselId, selectedFrameId, activeTextField, 'underlineColor', c.value); handleUpdateFormatting(selectedCarouselId, selectedFrameId, activeTextField, 'underline', true); if (!selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.underlineStyle) handleUpdateFormatting(selectedCarouselId, selectedFrameId, activeTextField, 'underlineStyle', 'solid'); }} className={`w-5 h-5 rounded border-2 hover:scale-110 transition-transform ${selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.underlineColor === c.value ? 'border-orange-500' : 'border-gray-600'}`} style={{ backgroundColor: c.value }} title={c.name} />
                        ))}
                      </div>
                      <button onClick={() => { handleUpdateFormatting(selectedCarouselId, selectedFrameId, activeTextField, 'underline', false); setShowUnderlinePicker(false); }} className="w-full mt-2 px-2 py-1 rounded text-[9px] text-gray-400 hover:text-white hover:bg-gray-700 transition-colors border border-gray-700">Remove Underline</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Right side stats */}
          <div className="flex items-center gap-4 self-center">
            <span className="text-gray-400"><span className="text-white font-medium">{carousels.length}</span> / 5 Carousels</span>
            <span className="text-gray-600">•</span>
            <span className="text-gray-400"><span className="text-white font-medium">{carousels.reduce((acc, c) => acc + c.frames.length, 0)}</span> Total Frames</span>
            <button onClick={() => { setSelectedCarouselId(null); setSelectedFrameId(null); setActiveTextField(null); }} disabled={!selectedCarouselId && !selectedFrameId} className={`px-2.5 py-1 text-[10px] font-medium rounded transition-colors ${selectedCarouselId || selectedFrameId ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-800 text-gray-600 cursor-not-allowed'}`}>Deselect</button>
          </div>
        </div>
      </div>
      
      {/* Canvas workspace */}
      <div className="p-6 pb-24" onClick={() => { setSelectedFrameId(null); setActiveTextField(null); }}>
        <div style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left', width: `${100 / (zoom / 100)}%` }}>
          {carousels.map((carousel) => (
            <CarouselRow
              key={carousel.id}
              carousel={carousel}
              designSystem={designSystem}
              isSelected={selectedCarouselId === carousel.id}
              hasAnySelection={selectedCarouselId !== null}
              selectedFrameId={selectedCarouselId === carousel.id ? selectedFrameId : null}
              onSelect={handleSelectCarousel}
              onSelectFrame={handleSelectFrame}
              onAddFrame={handleAddFrame}
              onRemoveFrame={handleRemoveFrame}
              onUpdateText={handleUpdateText}
              activeTextField={activeTextField}
              onActivateTextField={setActiveTextField}
            />
          ))}
        </div>
      </div>
      
      {/* Footer with zoom */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur border-t border-gray-800 px-6 py-3 z-30">
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-3 bg-gray-800 rounded-lg px-3 py-1.5">
            <button onClick={() => setZoom(z => Math.max(50, z - 10))} className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-700 transition-colors text-gray-400 hover:text-white" title="Zoom out">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
            </button>
            <input type="range" min="50" max="150" value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="w-24 h-1.5 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-orange-500" />
            <span className="text-xs font-mono font-medium text-gray-300 w-10 text-center">{zoom}%</span>
            <button onClick={() => setZoom(z => Math.min(150, z + 10))} className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-700 transition-colors text-gray-400 hover:text-white" title="Zoom in">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            </button>
            <div className="w-px h-5 bg-gray-600 mx-1" />
            <button onClick={() => setZoom(100)} className="px-2 py-1 text-[10px] bg-gray-700 hover:bg-gray-600 rounded transition-colors font-medium text-gray-300">Reset</button>
          </div>
        </div>
      </div>
    </div>
  );
}
