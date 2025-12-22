import React, { useState, useRef, useEffect } from 'react';

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
    fontFamily: formatting.fontFamily || style.fontFamily,
    textAlign: formatting.textAlign || style.textAlign,
    lineHeight: formatting.lineHeight !== undefined ? formatting.lineHeight : style.lineHeight,
    letterSpacing: formatting.letterSpacing !== undefined ? `${formatting.letterSpacing}px` : style.letterSpacing,
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
        className={`relative rounded-lg overflow-hidden shadow-lg cursor-pointer transition-all ${isFrameSelected ? 'border border-orange-500/70' : 'border border-transparent hover:border-gray-600'}`}
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

// New Project View Component
const NewProjectView = ({ onCreateProject }) => {
  const [projectName, setProjectName] = useState('');
  const [selectedType, setSelectedType] = useState(null);
  
  const projectTypes = [
    { 
      id: 'carousel', 
      name: 'Carousel', 
      description: 'Multi-slide social media carousel',
      icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm0 8a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zm12 0a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z'
    },
    { 
      id: 'single', 
      name: 'Single Post', 
      description: 'Single image or graphic post',
      icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
    },
    { 
      id: 'story', 
      name: 'Story', 
      description: 'Vertical story format',
      icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z'
    },
    { 
      id: 'video', 
      name: 'Video Cover', 
      description: 'Thumbnail for video content',
      icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z'
    }
  ];

  const handleCreate = () => {
    if (selectedType) {
      onCreateProject(selectedType, projectName || 'Untitled Project');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] p-8">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-white mb-3">Create New Project</h1>
          <p className="text-gray-400 text-lg">Choose a format to get started</p>
        </div>
        
        {/* Project Name Input */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-400 mb-2">Project Name</label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Enter project name..."
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
          />
        </div>
        
        {/* Project Type Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {projectTypes.map(type => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`p-6 rounded-2xl border-2 text-left transition-all duration-200 ${
                selectedType === type.id
                  ? 'border-orange-500 bg-orange-500/10'
                  : 'border-gray-700 bg-gray-800/50 hover:border-gray-600 hover:bg-gray-800'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                selectedType === type.id ? 'bg-orange-500' : 'bg-gray-700'
              }`}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={type.icon} />
                </svg>
              </div>
              <h3 className={`text-lg font-semibold mb-1 ${selectedType === type.id ? 'text-orange-400' : 'text-white'}`}>
                {type.name}
              </h3>
              <p className="text-sm text-gray-500">{type.description}</p>
            </button>
          ))}
        </div>
        
        {/* Create Button */}
        <button
          onClick={handleCreate}
          disabled={!selectedType}
          className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-200 ${
            selectedType
              ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/25'
              : 'bg-gray-800 text-gray-500 cursor-not-allowed'
          }`}
        >
          {selectedType ? 'Create Project' : 'Select a format to continue'}
        </button>
        
        {/* Quick Start Templates */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Or start from a template</h2>
          <div className="flex gap-3">
            {['Product Launch', 'Brand Story', 'Tutorial Series', 'Announcement'].map(template => (
              <button
                key={template}
                onClick={() => {
                  setSelectedType('carousel');
                  setProjectName(template);
                }}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-sm text-gray-300 hover:text-white transition-all"
              >
                {template}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Sidebar Component
const Sidebar = ({ activePanel, onPanelChange }) => {
  const panels = [
    { id: 'design', icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01', label: 'Design System' },
    { id: 'files', icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z', label: 'Files' },
    { id: 'background', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', label: 'Background' },
    { id: 'export', icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12', label: 'Export' },
  ];

  return (
    <div className="fixed left-0 top-[56px] h-[calc(100%-56px)] w-16 bg-gray-900 border-r border-gray-800 flex flex-col items-center py-4 z-50">
      {/* Panel Buttons */}
      <div className="flex flex-col gap-3">
        {panels.map(panel => (
          <button
            key={panel.id}
            onClick={() => onPanelChange(activePanel === panel.id ? null : panel.id)}
            className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${activePanel === panel.id ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}
            title={panel.label}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d={panel.icon} />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
};

// Design System Panel
const DesignSystemPanel = ({ designSystem, onUpdate, onClose }) => {
  const colorFields = [
    { key: 'primary', label: 'Primary' },
    { key: 'secondary', label: 'Secondary' },
    { key: 'accent', label: 'Accent' },
    { key: 'neutral1', label: 'Dark' },
    { key: 'neutral2', label: 'Mid' },
    { key: 'neutral3', label: 'Light' },
  ];

  return (
    <div className="fixed left-16 top-[56px] h-[calc(100%-56px)] w-72 bg-gray-900 border-r border-gray-800 z-40 overflow-y-auto">
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white">Design System</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="p-4">
        <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Colors</h3>
        <div className="grid grid-cols-3 gap-2 mb-6">
          {colorFields.map(field => (
            <div key={field.key} className="flex flex-col items-center gap-1">
              <input
                type="color"
                value={designSystem[field.key]}
                onChange={(e) => onUpdate({ ...designSystem, [field.key]: e.target.value })}
                className="w-10 h-10 rounded-lg cursor-pointer border-2 border-gray-700 bg-transparent"
              />
              <span className="text-[10px] text-gray-500">{field.label}</span>
            </div>
          ))}
        </div>
        <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Fonts</h3>
        <div className="space-y-3">
          <div>
            <label className="text-[10px] text-gray-500 block mb-1">Heading Font</label>
            <select
              value={designSystem.headingFont}
              onChange={(e) => onUpdate({ ...designSystem, headingFont: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1.5 text-xs text-white"
            >
              {allFonts.map(font => (
                <option key={font.value} value={font.value}>{font.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[10px] text-gray-500 block mb-1">Body Font</label>
            <select
              value={designSystem.bodyFont}
              onChange={(e) => onUpdate({ ...designSystem, bodyFont: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1.5 text-xs text-white"
            >
              {allFonts.map(font => (
                <option key={font.value} value={font.value}>{font.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

// File Browser Panel
const FileBrowserPanel = ({ onClose }) => {
  return (
    <div className="fixed left-16 top-[56px] h-[calc(100%-56px)] w-72 bg-gray-900 border-r border-gray-800 z-40 overflow-y-auto">
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white">Files</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="p-4">
        <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center">
          <svg className="w-8 h-8 mx-auto mb-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-xs text-gray-500 mb-2">Drop images here</p>
          <button className="text-xs text-orange-400 hover:text-orange-300">Browse files</button>
        </div>
        <div className="mt-4">
          <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Recent</h3>
          <p className="text-xs text-gray-600">No recent files</p>
        </div>
      </div>
    </div>
  );
};

// Background Panel
const BackgroundPanel = ({ onClose }) => {
  const gradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
  ];

  return (
    <div className="fixed left-16 top-[56px] h-[calc(100%-56px)] w-72 bg-gray-900 border-r border-gray-800 z-40 overflow-y-auto">
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white">Background</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="p-4">
        <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Gradients</h3>
        <div className="grid grid-cols-3 gap-2">
          {gradients.map((gradient, idx) => (
            <button
              key={idx}
              className="w-full aspect-square rounded-lg border-2 border-gray-700 hover:border-orange-500 transition-colors"
              style={{ background: gradient }}
            />
          ))}
        </div>
        <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3 mt-4">Solid Colors</h3>
        <div className="grid grid-cols-6 gap-2">
          {['#0f172a', '#1e293b', '#334155', '#475569', '#64748b', '#94a3b8'].map(color => (
            <button
              key={color}
              className="w-full aspect-square rounded border-2 border-gray-700 hover:border-orange-500 transition-colors"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Export Panel
const ExportPanel = ({ onClose }) => {
  return (
    <div className="fixed left-16 top-[56px] h-[calc(100%-56px)] w-72 bg-gray-900 border-r border-gray-800 z-40 overflow-y-auto">
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white">Export</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="p-4 space-y-4">
        <div>
          <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Format</h3>
          <div className="flex gap-2">
            <button className="flex-1 px-3 py-2 bg-orange-500 text-white rounded text-xs font-medium">PNG</button>
            <button className="flex-1 px-3 py-2 bg-gray-800 text-gray-300 rounded text-xs font-medium hover:bg-gray-700">JPG</button>
            <button className="flex-1 px-3 py-2 bg-gray-800 text-gray-300 rounded text-xs font-medium hover:bg-gray-700">PDF</button>
          </div>
        </div>
        <div>
          <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Quality</h3>
          <select className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1.5 text-xs text-white">
            <option>High (2x)</option>
            <option>Medium (1x)</option>
            <option>Low (0.5x)</option>
          </select>
        </div>
        <button className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors">
          Export All Frames
        </button>
        <button className="w-full py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-xs font-medium transition-colors">
          Export Selected Only
        </button>
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
      className={`mb-10 rounded-xl transition-all duration-150 cursor-pointer overflow-x-auto hide-scrollbar ${isSelected ? 'bg-orange-500/5 border border-orange-500/20 py-4' : 'hover:bg-gray-800/30 border border-transparent py-4'} ${isFaded ? 'opacity-20 hover:opacity-50' : 'opacity-100'}`}
      style={{ marginLeft: '10px', marginRight: '10px', width: 'calc(100% - 20px)', maxWidth: 'calc(100% - 20px)' }}
      onClick={() => onSelect(carousel.id)}
    >
      <div className="mb-4 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <button onClick={(e) => { e.stopPropagation(); onSelect(isSelected ? null : carousel.id); }} className={`w-11 h-11 rounded-xl border-2 flex items-center justify-center transition-all duration-150 ${isSelected ? 'border-orange-500 bg-orange-500/10 hover:bg-orange-500/20' : 'border-gray-600 hover:border-gray-500 hover:bg-gray-800'}`}>
            {isSelected ? (
              <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
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
      
      <div className="px-4" style={{ minHeight: 300 }}>
        <div className={`flex items-start transition-all duration-150 ease-out`} style={{ width: 'auto', minWidth: 'fit-content', gap: isSelected ? '12px' : '10px' }}>
          {carousel.frames.map((frame, index) => (
            <React.Fragment key={frame.id}>
              <CarouselFrame
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
              
              {/* Add Button After Each Frame */}
              <div 
                className={`flex items-center justify-center self-stretch transition-all duration-150 ease-out ${isSelected ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                style={{ width: isSelected ? 32 : 0, paddingTop: 24, overflow: 'hidden' }}
              >
                <button 
                  onClick={(e) => { e.stopPropagation(); onAddFrame(carousel.id, index + 1); }} 
                  className="w-8 h-8 rounded-xl border-2 border-dashed border-gray-600 hover:border-orange-500 hover:bg-orange-500/10 flex items-center justify-center transition-all duration-150"
                >
                  <svg className="w-4 h-4 text-gray-500 hover:text-orange-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                </button>
              </div>
            </React.Fragment>
          ))}
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
  const [activePanel, setActivePanel] = useState(null);
  const [selectedCarouselId, setSelectedCarouselId] = useState(null);
  
  // Browser-style tabs for projects
  const [tabs, setTabs] = useState([
    { id: 1, name: 'HelloData Campaign', active: true, hasContent: true },
    { id: 2, name: 'Untitled Project', active: false, hasContent: false }
  ]);
  const [activeTabId, setActiveTabId] = useState(1);
  
  const activeTab = tabs.find(t => t.id === activeTabId);
  
  const handleTabClick = (tabId) => {
    setActiveTabId(tabId);
    setTabs(prev => prev.map(tab => ({ ...tab, active: tab.id === tabId })));
  };
  
  const handleCloseTab = (tabId, e) => {
    e.stopPropagation();
    if (tabs.length <= 1) return;
    const newTabs = tabs.filter(t => t.id !== tabId);
    if (activeTabId === tabId) {
      setActiveTabId(newTabs[0].id);
      newTabs[0].active = true;
    }
    setTabs(newTabs);
  };
  
  const MAX_TABS = 10;
  
  const handleAddTab = () => {
    if (tabs.length >= MAX_TABS) return;
    const newId = Math.max(...tabs.map(t => t.id)) + 1;
    setTabs(prev => [...prev.map(t => ({ ...t, active: false })), { id: newId, name: 'Untitled Project', active: true, hasContent: false }]);
    setActiveTabId(newId);
  };
  
  const handleCreateProject = (projectType, projectName) => {
    setTabs(prev => prev.map(t => 
      t.id === activeTabId 
        ? { ...t, name: projectName || 'New Project', hasContent: true }
        : t
    ));
  };
  const [selectedFrameId, setSelectedFrameId] = useState(null);
  const [activeTextField, setActiveTextField] = useState(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFontSize, setShowFontSize] = useState(false);
  const [showUnderlinePicker, setShowUnderlinePicker] = useState(false);
  const [showFontPicker, setShowFontPicker] = useState(false);
  const [showTextAlign, setShowTextAlign] = useState(false);
  const [showLineSpacing, setShowLineSpacing] = useState(false);
  const [showLetterSpacing, setShowLetterSpacing] = useState(false);
  const [showListPicker, setShowListPicker] = useState(false);
  const [showFormatPicker, setShowFormatPicker] = useState(false);
  const [showLayoutPicker, setShowLayoutPicker] = useState(false);
  const [showSnippetsPicker, setShowSnippetsPicker] = useState(false);
  
  // Refs for click outside handling
  const colorPickerRef = useRef(null);
  const fontSizeRef = useRef(null);
  const underlineRef = useRef(null);
  const fontPickerRef = useRef(null);
  const textAlignRef = useRef(null);
  const lineSpacingRef = useRef(null);
  const letterSpacingRef = useRef(null);
  const listPickerRef = useRef(null);
  const formatPickerRef = useRef(null);
  const layoutPickerRef = useRef(null);
  const snippetsPickerRef = useRef(null);
  
  // Helper to close all dropdowns
  const closeAllDropdowns = () => {
    setShowColorPicker(false);
    setShowFontSize(false);
    setShowUnderlinePicker(false);
    setShowFontPicker(false);
    setShowTextAlign(false);
    setShowLineSpacing(false);
    setShowLetterSpacing(false);
    setShowListPicker(false);
    setShowFormatPicker(false);
    setShowLayoutPicker(false);
    setShowSnippetsPicker(false);
  };
  
  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target)) setShowColorPicker(false);
      if (fontSizeRef.current && !fontSizeRef.current.contains(event.target)) setShowFontSize(false);
      if (underlineRef.current && !underlineRef.current.contains(event.target)) setShowUnderlinePicker(false);
      if (fontPickerRef.current && !fontPickerRef.current.contains(event.target)) setShowFontPicker(false);
      if (textAlignRef.current && !textAlignRef.current.contains(event.target)) setShowTextAlign(false);
      if (lineSpacingRef.current && !lineSpacingRef.current.contains(event.target)) setShowLineSpacing(false);
      if (letterSpacingRef.current && !letterSpacingRef.current.contains(event.target)) setShowLetterSpacing(false);
      if (listPickerRef.current && !listPickerRef.current.contains(event.target)) setShowListPicker(false);
      if (formatPickerRef.current && !formatPickerRef.current.contains(event.target)) setShowFormatPicker(false);
      if (layoutPickerRef.current && !layoutPickerRef.current.contains(event.target)) setShowLayoutPicker(false);
      if (snippetsPickerRef.current && !snippetsPickerRef.current.contains(event.target)) setShowSnippetsPicker(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const selectedCarousel = carousels.find(c => c.id === selectedCarouselId) || carousels[0];
  const selectedFrame = selectedCarousel?.frames?.find(f => f.id === selectedFrameId);
  
  const handleSelectFrame = (carouselId, frameId) => {
    closeAllDropdowns();
    setActiveTextField(null);
    if (carouselId !== selectedCarouselId) setSelectedCarouselId(carouselId);
    setSelectedFrameId(prev => (prev === frameId && carouselId === selectedCarouselId) ? null : frameId);
  };
  
  const handleSelectCarousel = (carouselId) => {
    closeAllDropdowns();
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
  
  const handleAddFrame = (carouselId, position = null) => {
    setCarousels(prev => prev.map(carousel => {
      if (carousel.id !== carouselId) return carousel;
      const insertIndex = position !== null ? position : carousel.frames.length;
      const adjacentFrame = carousel.frames[Math.max(0, insertIndex - 1)] || carousel.frames[0];
      const newFrame = {
        id: Date.now(), // Use timestamp for unique ID
        variants: [
          { headline: "Add your headline", body: "Add your supporting copy here.", formatting: {} },
          { headline: "Alternative headline", body: "Alternative supporting copy.", formatting: {} },
          { headline: "Third option", body: "Third copy variation.", formatting: {} }
        ],
        currentVariant: 0, currentLayout: 0, layoutVariant: 0,
        style: adjacentFrame?.style || "dark-single-pin"
      };
      const newFrames = [...carousel.frames];
      newFrames.splice(insertIndex, 0, newFrame);
      // Re-number the frames
      const renumberedFrames = newFrames.map((f, idx) => ({ ...f, id: idx + 1 }));
      return { ...carousel, frames: renumberedFrames };
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
  
  const panelWidth = activePanel ? 288 : 0; // w-72 = 288px
  const sidebarWidth = 64; // w-16 = 64px
  const totalOffset = sidebarWidth + panelWidth;

  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-x-hidden">
      {/* Browser-style Tab Bar - Full Width */}
      <div className="fixed top-0 left-0 right-0 z-[60] bg-gray-950 border-b border-gray-700" style={{ height: 56 }}>
        <div className="flex items-end h-full">
          {/* Home Button */}
          <div className="flex items-center px-3 pb-2">
            <button className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </button>
          </div>
          {/* Tabs */}
          <div className="flex items-end">
            {tabs.map((tab, index) => (
              <div key={tab.id} className="flex items-end">
                {/* Vertical separator - show before inactive tabs (except first) */}
                {index > 0 && !tab.active && !tabs[index - 1]?.active && (
                  <div className="w-px h-5 bg-gray-700 self-center" />
                )}
                <div 
                  onClick={() => handleTabClick(tab.id)}
                  className={`group flex items-center gap-2 px-4 h-10 rounded-t-lg cursor-pointer transition-colors duration-150 ${
                    tab.active 
                      ? 'bg-gray-900 text-white' 
                      : 'bg-transparent text-gray-500 hover:text-gray-300'
                  }`}
                  style={{ minWidth: 140, maxWidth: 220 }}
                >
                  <svg className={`w-4 h-4 flex-shrink-0 transition-colors ${tab.active ? 'text-gray-400' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-sm font-medium truncate flex-1">{tab.name}</span>
                  <button 
                    onClick={(e) => handleCloseTab(tab.id, e)}
                    className={`w-5 h-5 rounded flex items-center justify-center transition-opacity ${
                      tab.active 
                        ? 'hover:bg-gray-700 text-gray-400 hover:text-white opacity-100' 
                        : 'opacity-0 group-hover:opacity-100 hover:bg-gray-700 text-gray-500 hover:text-white'
                    }`}
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
            {/* Separator before add button */}
            <div className="w-px h-5 bg-gray-700 self-center mx-1" />
            {/* Add Tab Button */}
            <button 
              onClick={handleAddTab}
              disabled={tabs.length >= MAX_TABS}
              className={`w-8 h-8 mb-1 rounded-lg flex items-center justify-center transition-all ${
                tabs.length >= MAX_TABS 
                  ? 'text-gray-600 cursor-not-allowed' 
                  : 'text-gray-500 hover:text-white hover:bg-gray-800'
              }`}
              title={tabs.length >= MAX_TABS ? 'Maximum tabs reached' : 'New tab'}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
          
          {/* Tab Counter */}
          <div className="flex items-center px-4 pb-2 ml-auto">
            <span className="text-xs text-gray-500">
              <span className={tabs.length >= MAX_TABS ? 'text-orange-400' : 'text-gray-400'}>{tabs.length}</span>
              <span className="mx-0.5">/</span>
              <span>{MAX_TABS}</span>
            </span>
          </div>
        </div>
      </div>
      
      {/* Sidebar */}
      <Sidebar activePanel={activePanel} onPanelChange={setActivePanel} />
      
      {/* Panels */}
      {activePanel === 'design' && (
        <DesignSystemPanel designSystem={designSystem} onUpdate={setDesignSystem} onClose={() => setActivePanel(null)} />
      )}
      {activePanel === 'files' && (
        <FileBrowserPanel onClose={() => setActivePanel(null)} />
      )}
      {activePanel === 'background' && (
        <BackgroundPanel onClose={() => setActivePanel(null)} />
      )}
      {activePanel === 'export' && (
        <ExportPanel onClose={() => setActivePanel(null)} />
      )}

      {/* Main Content */}
      <div style={{ marginLeft: totalOffset, marginTop: 56, width: `calc(100vw - ${totalOffset}px)`, transition: 'margin-left 0.3s, width 0.3s' }}>
      {/* Toolbar - Only show for projects with content */}
      {activeTab?.hasContent && (
      <div className="sticky top-[56px] z-[100] bg-gray-900 border-b border-gray-800 px-6 py-2 overflow-visible">
        <div className="flex items-center justify-between text-xs text-gray-400 min-w-max">
          <div className="flex items-center gap-4">
            {/* Format dropdown */}
            <div ref={formatPickerRef} className={`relative transition-opacity ${selectedCarouselId ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
              <button onClick={() => { const wasOpen = showFormatPicker; closeAllDropdowns(); if (!wasOpen) setShowFormatPicker(true); }} className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                <span className="text-[10px] font-medium text-gray-300">Format</span>
                <span className="text-[9px] text-gray-500">{frameSizes[selectedCarousel?.frameSize]?.name || 'Portrait'}</span>
                <svg className={`w-3 h-3 text-gray-400 transition-transform ${showFormatPicker ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              {showFormatPicker && (
                <div className="absolute top-full left-0 mt-1 p-1 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-[200] min-w-[160px]">
                  {Object.entries(frameSizes).filter(([key]) => key !== 'landscape').map(([key, size]) => (
                    <button key={key} onClick={() => { handleChangeFrameSize(selectedCarouselId, key); setShowFormatPicker(false); }} className={`w-full flex items-center gap-2 px-3 py-1.5 rounded text-left text-[10px] transition-colors ${selectedCarousel?.frameSize === key ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>
                      <span className="font-medium">{size.name}</span>
                      <span className="text-gray-500 ml-auto">{size.ratio}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="w-px h-6 bg-gray-700" />

            {/* Layout dropdown */}
            <div ref={layoutPickerRef} className={`relative transition-opacity ${selectedFrame ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
              <button onClick={() => { const wasOpen = showLayoutPicker; closeAllDropdowns(); if (!wasOpen) setShowLayoutPicker(true); }} className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                <span className="text-[10px] font-medium text-gray-300">Layout</span>
                <span className="text-[9px] text-gray-500">{layoutNames[selectedFrame?.currentLayout || 0]}</span>
                <svg className={`w-3 h-3 text-gray-400 transition-transform ${showLayoutPicker ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              {showLayoutPicker && (
                <div className="absolute top-full left-0 mt-1 p-1 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-[200] min-w-[140px]">
                  {layoutNames.map((name, idx) => (
                    <button key={idx} onClick={() => { handleSetLayout(selectedCarouselId, selectedFrameId, idx); setShowLayoutPicker(false); }} className={`w-full flex items-center gap-2 px-3 py-1.5 rounded text-left text-[10px] transition-colors ${(selectedFrame?.currentLayout || 0) === idx ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>
                      {idx === 0 && <div className="w-3 h-3.5 bg-gray-600 rounded flex items-end p-0.5"><div className="w-full h-0.5 rounded-sm bg-orange-400" /></div>}
                      {idx === 1 && <div className="w-3 h-3.5 bg-gray-600 rounded flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-sm bg-orange-400" /></div>}
                      {idx === 2 && <div className="w-3 h-3.5 bg-gray-600 rounded flex flex-col justify-between p-0.5"><div className="w-1.5 h-0.5 rounded-sm bg-orange-400" /><div className="w-1 h-0.5 bg-gray-500 rounded-sm self-end" /></div>}
                      <span className="font-medium">{name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button onClick={() => { closeAllDropdowns(); selectedFrame && handleShuffleLayoutVariant(selectedCarouselId, selectedFrameId); }} className={`p-1.5 rounded hover:bg-gray-700 transition-all ${selectedFrame ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 pointer-events-none'}`} title="Shuffle variant">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" /></svg>
            </button>

            <div className="w-px h-6 bg-gray-700" />

            {/* Snippets dropdown */}
            <div ref={snippetsPickerRef} className={`relative transition-opacity ${activeTextField ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
              <button onClick={() => { const wasOpen = showSnippetsPicker; closeAllDropdowns(); if (!wasOpen) setShowSnippetsPicker(true); }} className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                <span className="text-[10px] font-medium text-gray-300">Snippets</span>
                <span className="text-[9px] text-orange-400 font-medium">S{(selectedFrame?.currentVariant || 0) + 1}</span>
                <svg className={`w-3 h-3 text-gray-400 transition-transform ${showSnippetsPicker ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              {showSnippetsPicker && (
                <div className="absolute top-full left-0 mt-1 p-1 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-[200] min-w-[80px]">
                  {[0, 1, 2].map((idx) => (
                    <button key={idx} onClick={() => { handleSetVariant(selectedCarouselId, selectedFrameId, idx); setShowSnippetsPicker(false); }} className={`w-full flex items-center justify-center gap-1 px-3 py-1.5 rounded text-[10px] font-medium transition-colors ${selectedFrame?.currentVariant === idx ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>
                      <span className="text-orange-400">S{idx + 1}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button className={`flex items-center gap-1 px-1.5 py-1 rounded text-[9px] font-medium transition-colors ${activeTextField ? 'text-orange-400 hover:bg-orange-500/20' : 'text-gray-600 pointer-events-none'}`} title="Rewrite with AI">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L14.09 8.26L20 9.27L15.55 13.97L16.91 20L12 16.9L7.09 20L8.45 13.97L4 9.27L9.91 8.26L12 2Z" /></svg>
            </button>

            <div className="w-px h-6 bg-gray-700" />

            {/* Text section */}
            <div className={`flex items-center gap-2 transition-opacity ${activeTextField ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
              <span className="text-[9px] font-medium text-gray-500 flex-shrink-0">Text</span>
              <div className="w-px h-6 bg-gray-700 flex-shrink-0" />
              <div className="flex items-center gap-1 flex-shrink-0">
              
              {/* Font Type dropdown */}
              <div ref={fontPickerRef} className="relative flex-shrink-0">
                <button onClick={() => { if (!activeTextField) return; const wasOpen = showFontPicker; closeAllDropdowns(); if (!wasOpen) setShowFontPicker(true); }} className="flex items-center gap-1 px-2 py-1 rounded text-[9px] font-medium text-gray-300 hover:bg-gray-700 transition-colors">
                  <span>Font Type</span>
                  <svg className={`w-2 h-2 transition-transform ${showFontPicker ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                {showFontPicker && activeTextField && (
                  <div className="absolute top-full left-0 mt-1 p-1 bg-gray-800 border border-gray-700 rounded shadow-xl z-[200] max-h-48 overflow-y-auto min-w-[140px]">
                    {allFonts.map(font => (
                      <button key={font.value} onClick={() => { handleUpdateFormatting(selectedCarouselId, selectedFrameId, activeTextField, 'fontFamily', font.value); setShowFontPicker(false); }} className={`w-full px-2 py-1 rounded text-[9px] text-left transition-colors ${selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.fontFamily === font.value ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`} style={{ fontFamily: font.value }}>
                        {font.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Font Size dropdown */}
              <div ref={fontSizeRef} className="relative flex-shrink-0">
                <button onClick={() => { if (!activeTextField) return; const wasOpen = showFontSize; closeAllDropdowns(); if (!wasOpen) setShowFontSize(true); }} className="flex items-center gap-1 px-2 py-1 rounded text-[9px] font-medium text-gray-300 hover:bg-gray-700 transition-colors">
                  <span>Font Size</span>
                  <svg className={`w-2 h-2 transition-transform ${showFontSize ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                {showFontSize && activeTextField && (
                  <div className="absolute top-full left-0 mt-1 p-1 bg-gray-800 border border-gray-700 rounded shadow-xl z-[200]">
                    <div className="flex gap-0.5">
                      {[{ name: 'S', value: 0.85 }, { name: 'M', value: 1 }, { name: 'L', value: 1.2 }].map(s => (
                        <button key={s.name} onClick={() => { handleUpdateFormatting(selectedCarouselId, selectedFrameId, activeTextField, 'fontSize', s.value); setShowFontSize(false); }} className={`px-2 py-0.5 rounded text-[9px] font-medium transition-colors ${selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.fontSize === s.value ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>{s.name}</button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Color picker */}
              <div ref={colorPickerRef} className="relative flex-shrink-0">
                <button onClick={() => { if (!activeTextField) return; const wasOpen = showColorPicker; closeAllDropdowns(); if (!wasOpen) setShowColorPicker(true); }} className="flex items-center gap-1 px-1.5 py-1 rounded text-[9px] font-medium text-gray-300 hover:bg-gray-700 transition-colors" title="Text color">
                  <div className="w-3 h-3 rounded-sm border border-gray-600" style={{ backgroundColor: selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.color || '#ffffff' }} />
                </button>
                {showColorPicker && activeTextField && (
                  <div className="absolute top-full left-0 mt-1 p-1.5 bg-gray-800 border border-gray-700 rounded shadow-xl z-[200]">
                    <div className="flex gap-1">
                      {[{ name: 'Primary', value: designSystem.primary }, { name: 'Secondary', value: designSystem.secondary }, { name: 'Accent', value: designSystem.accent }, { name: 'Light', value: designSystem.neutral3 }, { name: 'White', value: '#ffffff' }].map(c => (
                        <button key={c.value} onClick={() => { handleUpdateFormatting(selectedCarouselId, selectedFrameId, activeTextField, 'color', c.value); setShowColorPicker(false); }} className="w-5 h-5 rounded border border-gray-600 hover:scale-110 transition-transform" style={{ backgroundColor: c.value }} title={c.name} />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Bold */}
              <button onClick={() => { if (!activeTextField) return; closeAllDropdowns(); const formatting = selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField] || {}; handleUpdateFormatting(selectedCarouselId, selectedFrameId, activeTextField, 'bold', !formatting.bold); }} className={`px-1.5 py-1 rounded text-[9px] font-bold transition-colors ${selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.bold ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`} title="Bold">B</button>

              {/* Italic */}
              <button onClick={() => { if (!activeTextField) return; closeAllDropdowns(); const formatting = selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField] || {}; handleUpdateFormatting(selectedCarouselId, selectedFrameId, activeTextField, 'italic', !formatting.italic); }} className={`px-1.5 py-1 rounded text-[9px] italic transition-colors ${selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.italic ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`} title="Italic">I</button>

              {/* Underline */}
              <div ref={underlineRef} className="relative flex flex-shrink-0">
                <button onClick={() => { if (!activeTextField) return; const wasOpen = showUnderlinePicker; closeAllDropdowns(); if (!wasOpen) setShowUnderlinePicker(true); }} className={`flex items-center gap-1 px-2 py-1 rounded text-[9px] transition-colors ${selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.underline ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`} title="Underline">
                  <span style={{ textDecoration: 'underline' }}>U</span>
                  <svg className={`w-2 h-2 transition-transform ${showUnderlinePicker ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                {showUnderlinePicker && activeTextField && (
                  <div className="absolute top-full right-0 mt-1 p-2 bg-gray-800 border border-gray-700 rounded shadow-xl z-[200] min-w-[140px]">
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

              {/* Text Alignment */}
              <div ref={textAlignRef} className="relative flex-shrink-0">
                <button onClick={() => { if (!activeTextField) return; const wasOpen = showTextAlign; closeAllDropdowns(); if (!wasOpen) setShowTextAlign(true); }} className={`flex items-center gap-1 px-1.5 py-1 rounded text-[9px] font-medium transition-colors ${selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.textAlign && selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.textAlign !== 'left' ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`} title="Text alignment">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h16" /></svg>
                  <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                {showTextAlign && activeTextField && (
                  <div className="absolute top-full left-0 mt-1 p-1 bg-gray-800 border border-gray-700 rounded shadow-xl z-[200]">
                    <div className="flex gap-0.5">
                      {[{ name: 'Left', value: 'left', icon: 'M4 6h16M4 12h10M4 18h16' }, { name: 'Center', value: 'center', icon: 'M4 6h16M7 12h10M4 18h16' }, { name: 'Right', value: 'right', icon: 'M4 6h16M10 12h10M4 18h16' }, { name: 'Justify', value: 'justify', icon: 'M4 6h16M4 12h16M4 18h16' }].map(a => (
                        <button key={a.value} onClick={() => { handleUpdateFormatting(selectedCarouselId, selectedFrameId, activeTextField, 'textAlign', a.value); setShowTextAlign(false); }} className={`p-1.5 rounded transition-colors ${selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.textAlign === a.value ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`} title={a.name}>
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={a.icon} /></svg>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Line Spacing */}
              <div ref={lineSpacingRef} className="relative flex-shrink-0">
                <button onClick={() => { if (!activeTextField) return; const wasOpen = showLineSpacing; closeAllDropdowns(); if (!wasOpen) setShowLineSpacing(true); }} className={`flex items-center gap-1 px-1.5 py-1 rounded text-[9px] font-medium transition-colors ${selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.lineHeight && selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.lineHeight !== 1.4 ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`} title="Line spacing">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 3v18M12 3l-3 3M12 3l3 3M12 21l-3-3M12 21l3-3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                {showLineSpacing && activeTextField && (
                  <div className="absolute top-full left-0 mt-1 p-1 bg-gray-800 border border-gray-700 rounded shadow-xl z-[200] min-w-[100px]">
                    {[{ name: 'Tight', value: 1.1 }, { name: 'Normal', value: 1.4 }, { name: 'Relaxed', value: 1.7 }, { name: 'Loose', value: 2 }].map(s => (
                      <button key={s.name} onClick={() => { handleUpdateFormatting(selectedCarouselId, selectedFrameId, activeTextField, 'lineHeight', s.value); setShowLineSpacing(false); }} className={`w-full px-2 py-1 rounded text-[9px] text-left transition-colors ${selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.lineHeight === s.value ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>{s.name}</button>
                    ))}
                  </div>
                )}
              </div>

              {/* Letter Spacing */}
              <div ref={letterSpacingRef} className="relative flex-shrink-0">
                <button onClick={() => { if (!activeTextField) return; const wasOpen = showLetterSpacing; closeAllDropdowns(); if (!wasOpen) setShowLetterSpacing(true); }} className={`flex items-center gap-1 px-1.5 py-1 rounded text-[9px] font-medium transition-colors ${selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.letterSpacing && selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.letterSpacing !== 0 ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`} title="Letter spacing">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M3 12h18M3 12l3-3M3 12l3 3M21 12l-3-3M21 12l-3 3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                {showLetterSpacing && activeTextField && (
                  <div className="absolute top-full left-0 mt-1 p-1 bg-gray-800 border border-gray-700 rounded shadow-xl z-[200] min-w-[100px]">
                    {[{ name: 'Tight', value: -0.5 }, { name: 'Normal', value: 0 }, { name: 'Wide', value: 1 }, { name: 'Wider', value: 2 }].map(s => (
                      <button key={s.name} onClick={() => { handleUpdateFormatting(selectedCarouselId, selectedFrameId, activeTextField, 'letterSpacing', s.value); setShowLetterSpacing(false); }} className={`w-full px-2 py-1 rounded text-[9px] text-left transition-colors ${selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.letterSpacing === s.value ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>{s.name}</button>
                    ))}
                  </div>
                )}
              </div>

              {/* List Type */}
              <div ref={listPickerRef} className="relative flex-shrink-0">
                <button onClick={() => { if (!activeTextField) return; const wasOpen = showListPicker; closeAllDropdowns(); if (!wasOpen) setShowListPicker(true); }} className={`flex items-center gap-1 px-1.5 py-1 rounded text-[9px] font-medium transition-colors ${selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.listType ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`} title="List type">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /><circle cx="2" cy="6" r="1" fill="currentColor" /><circle cx="2" cy="10" r="1" fill="currentColor" /><circle cx="2" cy="14" r="1" fill="currentColor" /><circle cx="2" cy="18" r="1" fill="currentColor" /></svg>
                  <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                {showListPicker && activeTextField && (
                  <div className="absolute top-full left-0 mt-1 p-1 bg-gray-800 border border-gray-700 rounded shadow-xl z-[200] min-w-[100px]">
                    {[{ name: 'None', value: null }, { name: 'Bullet', value: 'bullet' }, { name: 'ABC', value: 'abc' }, { name: 'Numbered', value: 'numbered' }].map(l => (
                      <button key={l.name} onClick={() => { handleUpdateFormatting(selectedCarouselId, selectedFrameId, activeTextField, 'listType', l.value); setShowListPicker(false); }} className={`w-full px-2 py-1 rounded text-[9px] text-left transition-colors ${selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.listType === l.value ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>{l.name}</button>
                    ))}
                  </div>
                )}
              </div>
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <span className="text-gray-400"><span className="text-white font-medium">{carousels.length}</span> / 5</span>
            <button onClick={() => { closeAllDropdowns(); setSelectedCarouselId(null); setSelectedFrameId(null); setActiveTextField(null); }} disabled={!selectedCarouselId && !selectedFrameId} className={`px-2.5 py-1 text-[10px] font-medium rounded transition-colors ${selectedCarouselId || selectedFrameId ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-800 text-gray-600 cursor-not-allowed'}`}>Deselect Row</button>
          </div>
        </div>
      </div>
      )}
      
      {/* Content Area - Either New Project View or Canvas */}
      {activeTab && !activeTab.hasContent ? (
        <NewProjectView onCreateProject={handleCreateProject} />
      ) : (
        <>
          {/* Canvas workspace */}
          <div className="p-6 pb-24" onClick={() => { closeAllDropdowns(); setSelectedFrameId(null); setActiveTextField(null); }}>
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
        </>
      )}
      </div>
      
      {/* Footer with zoom */}
      <div className="fixed bottom-0 bg-gray-900/95 backdrop-blur border-t border-gray-800 px-6 py-3 z-30" style={{ left: totalOffset, right: 0, transition: 'left 0.3s' }}>
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
