import React, { useState, useRef, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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

// Font size calculator based on frame dimensions
const getFontSizes = (frameSize) => {
  const size = frameSizes[frameSize] || frameSizes.portrait;
  const isLandscape = frameSize === 'landscape' || frameSize === 'slides';
  
  // Base sizes for portrait (192px wide) - scaled proportionally to width
  const baseWidth = 192;
  const scale = size.width / baseWidth;
  
  if (isLandscape) {
    // Landscape: shorter height, so use smaller fonts
    return {
      headline: Math.round(11 * scale * 0.7), // ~11px for landscape
      body: Math.round(9 * scale * 0.7),      // ~9px for landscape
      lineHeight: 1.3
    };
  }
  
  // Portrait/Square/Story/Pin - scale based on width
  return {
    headline: Math.max(12, Math.round(14 * (size.width / baseWidth))), // 12-16px
    body: Math.max(10, Math.round(12 * (size.width / baseWidth))),     // 10-14px
    lineHeight: 1.4
  };
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
    fontWeight: formatting.bold === true ? 'bold' : formatting.bold === false ? 'normal' : style.fontWeight,
    fontStyle: formatting.italic === true ? 'italic' : formatting.italic === false ? 'normal' : style.fontStyle,
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
const LayoutBottomStack = ({ headline, body, accent, isLandscape, headingFont, bodyFont, variant = 0, isFrameSelected, onUpdateText, activeField, onActivateField, formatting = {}, fontSizes = {} }) => {
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
  
  const getLandscapeAlignment = () => {
    switch (variant) {
      case 1: return 'items-start pt-8'; // Top - extra padding for progress indicator
      case 2: return 'items-center'; // Center
      default: return 'items-end'; // Bottom
    }
  };
  
  const getLandscapeGradient = () => {
    switch (variant) {
      case 1: return 'bg-gradient-to-b from-black/80 via-black/40 to-transparent';
      case 2: return 'bg-black/50';
      default: return 'bg-gradient-to-t from-black/80 via-black/40 to-transparent';
    }
  };

  const headlineStyle = { color: accent, fontFamily: headingFont, fontSize: fontSizes.headline || 14, lineHeight: fontSizes.lineHeight || 1.3 };
  const bodyStyle = { fontFamily: bodyFont, fontSize: fontSizes.body || 12, lineHeight: fontSizes.lineHeight || 1.4 };

  if (isLandscape) {
    return (
      <div className={`absolute inset-0 flex ${getLandscapeAlignment()} px-3 py-3 ${getLandscapeGradient()}`}>
        <div className="flex items-center justify-between w-full gap-4">
          <EditableTextField {...commonProps} field="headline" isActive={activeField === 'headline'} formatting={formatting.headline || {}} className="font-bold leading-tight block flex-1" style={headlineStyle}>{headline}</EditableTextField>
          <EditableTextField {...commonProps} field="body" isActive={activeField === 'body'} formatting={formatting.body || {}} className="text-gray-200 leading-snug text-right block max-w-[40%]" style={bodyStyle}>{body}</EditableTextField>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`absolute inset-0 flex flex-col ${getAlignment()} p-4 ${getGradient()}`}>
      <div className="relative mb-1.5">
        <EditableTextField {...commonProps} field="headline" isActive={activeField === 'headline'} formatting={formatting.headline || {}} className="font-bold leading-tight block" style={headlineStyle}>{headline}</EditableTextField>
      </div>
      <div className="relative">
        <EditableTextField {...commonProps} field="body" isActive={activeField === 'body'} formatting={formatting.body || {}} className="text-gray-200 leading-snug block" style={bodyStyle}>{body}</EditableTextField>
      </div>
    </div>
  );
};

// Layout Component - Center Drama
const LayoutCenterDrama = ({ headline, body, accent, isLandscape, headingFont, bodyFont, variant = 0, isFrameSelected, onUpdateText, activeField, onActivateField, formatting = {}, fontSizes = {} }) => {
  const getAlignment = () => {
    switch (variant) {
      case 1: return 'justify-end pb-6';
      case 2: return 'justify-start pt-8';
      default: return 'justify-center';
    }
  };
  
  const commonProps = { isFrameSelected, onActivate: onActivateField, onUpdateText };
  
  const getLandscapeAlignment = () => {
    switch (variant) {
      case 1: return 'items-end'; // Bottom
      case 2: return 'items-start pt-8'; // Top - extra padding for progress indicator
      default: return 'items-center'; // Center
    }
  };
  
  const getLandscapeGradient = () => {
    switch (variant) {
      case 1: return 'bg-gradient-to-t from-black/80 via-black/40 to-transparent';
      case 2: return 'bg-gradient-to-b from-black/80 via-black/40 to-transparent';
      default: return 'bg-black/50';
    }
  };

  const headlineStyle = { color: accent, fontFamily: headingFont, fontSize: (fontSizes.headline || 14) + 2, lineHeight: fontSizes.lineHeight || 1.3 };
  const bodyStyle = { fontFamily: bodyFont, fontSize: fontSizes.body || 12, lineHeight: (fontSizes.lineHeight || 1.4) + 0.1 };

  if (isLandscape) {
    return (
      <div className={`absolute inset-0 flex ${getLandscapeAlignment()} justify-center px-3 py-3 ${getLandscapeGradient()}`}>
        <div className="flex items-center gap-4 max-w-[95%]">
          <EditableTextField {...commonProps} field="headline" isActive={activeField === 'headline'} formatting={formatting.headline || {}} className="font-black leading-tight tracking-tight block flex-1" style={headlineStyle}>{headline}</EditableTextField>
          <div className="w-0.5 h-8 rounded-full flex-shrink-0" style={{ background: accent, opacity: 0.6 }} />
          <EditableTextField {...commonProps} field="body" isActive={activeField === 'body'} formatting={formatting.body || {}} className="text-gray-300 leading-snug font-medium block max-w-[35%]" style={bodyStyle}>{body}</EditableTextField>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`absolute inset-0 flex flex-col items-center ${getAlignment()} p-4 text-center bg-black/40`}>
      <div className="max-w-[90%]">
        <div className="relative inline-block mb-3">
          <EditableTextField {...commonProps} field="headline" isActive={activeField === 'headline'} formatting={formatting.headline || {}} className="font-black leading-tight tracking-tight block" style={headlineStyle}>{headline}</EditableTextField>
        </div>
        <div className="w-12 h-0.5 mx-auto mb-3 rounded-full" style={{ background: accent, opacity: 0.6 }} />
        <div className="relative inline-block">
          <EditableTextField {...commonProps} field="body" isActive={activeField === 'body'} formatting={formatting.body || {}} className="text-gray-300 leading-relaxed font-medium block" style={bodyStyle}>{body}</EditableTextField>
        </div>
      </div>
    </div>
  );
};

// Layout Component - Editorial
const LayoutEditorialLeft = ({ headline, body, accent, isLandscape, headingFont, bodyFont, variant = 0, isFrameSelected, onUpdateText, activeField, onActivateField, formatting = {}, fontSizes = {} }) => {
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
  
  const getLandscapeContentAlign = () => {
    switch (variant) {
      case 1: return 'justify-center'; // Center
      case 2: return 'justify-end'; // Right
      default: return 'justify-start'; // Left
    }
  };

  const headlineStyle = { color: accent, fontFamily: headingFont, fontSize: fontSizes.headline || 14, lineHeight: fontSizes.lineHeight || 1.3 };
  const bodyStyle = { fontFamily: bodyFont, fontSize: fontSizes.body || 12, lineHeight: fontSizes.lineHeight || 1.4 };

  if (isLandscape) {
    return (
      <div className={`absolute inset-0 flex items-center ${getLandscapeContentAlign()} p-3 gap-3`}>
        <div className="w-1 h-10 rounded-full flex-shrink-0" style={{ background: accent }} />
        <EditableTextField {...commonProps} field="headline" isActive={activeField === 'headline'} formatting={formatting.headline || {}} className={`font-bold leading-tight block ${variant === 1 ? 'text-center' : variant === 2 ? 'text-right' : 'text-left'}`} style={headlineStyle}>{headline}</EditableTextField>
        <div className="relative bg-black/40 backdrop-blur-sm rounded px-2 py-1 max-w-[35%]">
          <EditableTextField {...commonProps} field="body" isActive={activeField === 'body'} formatting={formatting.body || {}} className={`text-gray-200 leading-snug italic block ${variant === 1 ? 'text-center' : variant === 2 ? 'text-left' : 'text-right'}`} style={bodyStyle}>{body}</EditableTextField>
        </div>
        {variant === 2 && <div className="w-1 h-10 rounded-full flex-shrink-0" style={{ background: accent }} />}
      </div>
    );
  }
  
  return (
    <div className={`absolute inset-0 flex flex-col ${getHeadlineAlign()} p-4 pt-8`}>
      <div className={`w-8 h-1 rounded-full mb-3 ${getAccentAlign()}`} style={{ background: accent }} />
      <div className="relative max-w-[85%] mb-auto">
        <EditableTextField {...commonProps} field="headline" isActive={activeField === 'headline'} formatting={formatting.headline || {}} className="font-bold leading-tight block" style={headlineStyle}>{headline}</EditableTextField>
      </div>
      <div className={`relative ${getBodyAlign()} max-w-[75%] bg-black/30 backdrop-blur-sm rounded-lg p-2`}>
        <EditableTextField {...commonProps} field="body" isActive={activeField === 'body'} formatting={formatting.body || {}} className="text-gray-200 leading-snug italic block" style={bodyStyle}>{body}</EditableTextField>
      </div>
    </div>
  );
};

// Single Frame Component
const CarouselFrame = ({ frame, carouselId, frameSize, designSystem, frameIndex, totalFrames, isFrameSelected, onSelectFrame, onRemove, onUpdateText, activeTextField, onActivateTextField }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isProgressHovered, setIsProgressHovered] = useState(false);
  const [isProgressHidden, setIsProgressHidden] = useState(false);
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
    const fontSizes = getFontSizes(frameSize);
    const props = { 
      headline: content.headline, body: content.body, accent: style.accent, isLandscape,
      headingFont: designSystem.headingFont, bodyFont: designSystem.bodyFont, variant: layoutVariant,
      isFrameSelected, onUpdateText: handleUpdateText, activeField: activeTextField,
      onActivateField: handleActivateField, formatting, fontSizes,
    };
    switch (layoutIndex) {
      case 1: return <LayoutCenterDrama {...props} />;
      case 2: return <LayoutEditorialLeft {...props} />;
      default: return <LayoutBottomStack {...props} />;
    }
  };
  
  return (
    <div className="flex flex-col" style={{ width: size.width }}>
      <div 
        className={`relative overflow-hidden shadow-lg cursor-pointer transition-all border border-gray-600 ${isFrameSelected ? 'ring-2 ring-orange-500/70' : 'hover:border-gray-500'}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ background: style.background, width: size.width, height: size.height }}
        onClick={(e) => { e.stopPropagation(); onSelectFrame(frame.id); }}
      >
        {renderLayout()}
        
          <div 
          className="absolute top-2 right-2 z-10 flex items-center gap-1 cursor-pointer min-w-[40px] min-h-[20px] justify-end"
            onMouseEnter={() => setIsProgressHovered(true)}
            onMouseLeave={() => setIsProgressHovered(false)}
          onClick={(e) => { if (isFrameSelected) { e.stopPropagation(); setIsProgressHidden(!isProgressHidden); } }}
        >
          {isFrameSelected && (isProgressHovered || (isProgressHidden && isHovered)) ? (
            <div className="flex items-center justify-center w-5 h-5 bg-black/50 rounded-full hover:bg-black/70 transition-colors">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isProgressHidden ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                )}
                  </svg>
              </div>
          ) : !isProgressHidden ? (
            [1,2,3,4,5].map(i => <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === frame.id ? 'bg-white' : 'bg-white/30'}`} />)
          ) : null}
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

// Sortable Frame Wrapper
const SortableFrame = ({ id, frame, carouselId, frameSize, designSystem, frameIndex, totalFrames, isFrameSelected, onSelectFrame, onRemove, onUpdateText, activeTextField, onActivateTextField, isRowSelected, cardWidth }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id,
    disabled: !isRowSelected,
  });

  // Calculate transform - non-dragged items move by exactly one card slot
  const getTransform = () => {
    if (!transform) return undefined;
    if (isDragging) {
      return `translate3d(${Math.round(transform.x)}px, 0, 0)`;
    } else {
      // Non-dragged: move by card width + gap (12px) + add button container (32px)
      const moveDistance = cardWidth + 12 + 32; // card + gap + add button
      if (Math.abs(transform.x) > 10) {
        const direction = transform.x > 0 ? 1 : -1;
        return `translate3d(${direction * moveDistance}px, 0, 0)`;
      }
      return undefined;
    }
  };

  // Only apply transition while actively being pushed aside (transform exists and is significant)
  const isBeingPushed = transform && Math.abs(transform.x) > 10 && !isDragging;
  
  const style = {
    transform: getTransform(),
    transition: isBeingPushed ? 'transform 120ms ease-out' : 'none',
    zIndex: isDragging ? 100 : 1,
    cursor: isRowSelected ? (isDragging ? 'grabbing' : 'grab') : 'pointer',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
                <CarouselFrame
                  frame={frame}
        carouselId={carouselId}
        frameSize={frameSize}
                  designSystem={designSystem}
        frameIndex={frameIndex}
                  totalFrames={totalFrames}
        isFrameSelected={isFrameSelected}
        onSelectFrame={onSelectFrame}
        onRemove={onRemove}
                  onUpdateText={onUpdateText}
        activeTextField={activeTextField}
                  onActivateTextField={onActivateTextField}
      />
    </div>
  );
};

// Homepage Component - Project Browser
const Homepage = ({ projects, onOpenProject, onCreateNew }) => {
  return (
    <div className="w-full h-full p-8 overflow-y-auto">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-12">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm0 8a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zm12 0a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Carousel Studio</h1>
            <p className="text-gray-500 text-sm">Design beautiful social media carousels</p>
          </div>
        </div>
      </div>
      
      {/* Projects Section */}
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Your Projects</h2>
          <button 
            onClick={onCreateNew}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors border border-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Project
          </button>
        </div>
        
        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <div 
              key={project.id}
              onClick={() => onOpenProject(project.id)}
              className="group bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-600 hover:bg-gray-800/50 transition-all cursor-pointer"
            >
              {/* Thumbnail */}
              <div className="h-40 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative overflow-hidden">
                {project.hasContent ? (
                  <div className="flex gap-2 transform group-hover:scale-105 transition-transform">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-16 h-20 bg-gray-700/50 rounded-lg border border-gray-600 flex items-center justify-center">
                        <div className="w-8 h-1 bg-gray-500 rounded" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-600">
                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                )}
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gray-700/0 group-hover:bg-gray-700/20 transition-colors flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="px-4 py-2 bg-gray-700 border border-gray-500 rounded-lg text-white text-sm font-medium">
                      Open Project
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Info */}
              <div className="p-4">
                <h3 className="text-white font-semibold mb-1 group-hover:text-gray-300 transition-colors">
                  {project.name}
                </h3>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span>{project.hasContent ? `${project.frameCount || 5} frames` : 'Empty'}</span>
                  <span>•</span>
                  <span>Updated {project.updatedAt}</span>
                </div>
              </div>
            </div>
          ))}
          
          {/* Create New Project Card */}
          <div 
            onClick={onCreateNew}
            className="group bg-gray-900/50 border-2 border-dashed border-gray-700 rounded-xl overflow-hidden hover:border-gray-500 hover:bg-gray-800/30 transition-all cursor-pointer flex flex-col items-center justify-center min-h-[240px]"
          >
            <div className="w-16 h-16 rounded-full bg-gray-800 group-hover:bg-gray-700 flex items-center justify-center transition-colors mb-3">
              <svg className="w-8 h-8 text-gray-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="text-gray-500 group-hover:text-orange-400 font-medium transition-colors">Create New Project</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Project Header Component - Editable project name at top of canvas
const ProjectHeader = ({ projectName, onUpdateName }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(projectName);
  const inputRef = useRef(null);
  
  useEffect(() => {
    setEditValue(projectName);
  }, [projectName]);
  
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);
  
  const handleSave = () => {
    if (editValue.trim()) {
      onUpdateName(editValue.trim());
    } else {
      setEditValue(projectName);
    }
    setIsEditing(false);
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditValue(projectName);
      setIsEditing(false);
    }
  };
  
  return (
    <div className="mb-6 flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="text-2xl font-bold text-white bg-transparent border-b-2 border-orange-500 outline-none px-1 py-0.5 min-w-[200px]"
          style={{ fontFamily: 'inherit' }}
        />
      ) : (
        <h1 
          className="text-2xl font-bold text-white hover:text-orange-400 cursor-pointer transition-colors group flex items-center gap-2"
          onClick={() => setIsEditing(true)}
        >
          {projectName}
          <svg className="w-4 h-4 text-gray-600 group-hover:text-orange-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </h1>
      )}
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
      id: 'eblast', 
      name: 'Eblast Images', 
      description: 'Email blast graphics',
      icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
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
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)] p-6">
      <div className="max-w-xl w-full">
        {/* Project Name Input */}
        <div className="mb-5">
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Project Name</label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Enter project name..."
            className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
          />
        </div>
        
        {/* Project Type Grid - 2 columns */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {/* Carousel */}
          <button
            onClick={() => setSelectedType('carousel')}
            className={`p-3 rounded-xl border text-left transition-all duration-200 flex items-center gap-3 ${
              selectedType === 'carousel'
                ? 'border-gray-500 bg-gray-800'
                : 'border-gray-700/50 bg-gray-800/30 hover:border-gray-600 hover:bg-gray-800/50'
            }`}
          >
            <div className="w-[104px] flex-shrink-0 flex gap-1 justify-center">
              {[0, 1, 2].map(i => (
                <div key={i} className={`w-8 h-11 rounded bg-gray-700 border border-gray-600 ${i > 0 ? 'opacity-50' : ''}`} />
              ))}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className={`text-xs font-semibold ${selectedType === 'carousel' ? 'text-white' : 'text-gray-300'}`}>Carousel</h3>
              <p className="text-[10px] text-gray-500 leading-relaxed">Multi-slide posts for LinkedIn & Instagram. Ideal for storytelling.</p>
            </div>
          </button>

          {/* Single Post */}
          <button
            onClick={() => setSelectedType('single')}
            className={`p-3 rounded-xl border text-left transition-all duration-200 flex items-center gap-3 ${
              selectedType === 'single'
                ? 'border-gray-500 bg-gray-800'
                : 'border-gray-700/50 bg-gray-800/30 hover:border-gray-600 hover:bg-gray-800/50'
            }`}
          >
            <div className="w-[104px] flex-shrink-0 flex justify-center">
              <div className="w-14 h-14 rounded-lg bg-gray-700 border border-gray-600 flex items-center justify-center">
                <svg className="w-7 h-7 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
                </svg>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className={`text-xs font-semibold ${selectedType === 'single' ? 'text-white' : 'text-gray-300'}`}>Single Post</h3>
              <p className="text-[10px] text-gray-500 leading-relaxed">Single graphics for announcements, quotes, or promos.</p>
            </div>
          </button>

          {/* Eblast Images */}
          <button
            onClick={() => setSelectedType('eblast')}
            className={`p-3 rounded-xl border text-left transition-all duration-200 flex items-center gap-3 ${
              selectedType === 'eblast'
                ? 'border-gray-500 bg-gray-800'
                : 'border-gray-700/50 bg-gray-800/30 hover:border-gray-600 hover:bg-gray-800/50'
            }`}
          >
            <div className="w-[104px] flex-shrink-0 flex justify-center">
              <div className="w-16 h-12 rounded-lg bg-gray-700 border border-gray-600 p-2 flex flex-col gap-1">
                <div className="h-1.5 rounded-full bg-gray-500 w-1/2" />
                <div className="flex-1 rounded bg-gray-600" />
                <div className="h-1 rounded-full bg-gray-600 w-2/3" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className={`text-xs font-semibold ${selectedType === 'eblast' ? 'text-white' : 'text-gray-300'}`}>Eblast Images</h3>
              <p className="text-[10px] text-gray-500 leading-relaxed">Graphics for email campaigns. Optimized for all clients.</p>
            </div>
          </button>

          {/* Video Cover */}
          <button
            onClick={() => setSelectedType('video')}
            className={`p-3 rounded-xl border text-left transition-all duration-200 flex items-center gap-3 ${
              selectedType === 'video'
                ? 'border-gray-500 bg-gray-800'
                : 'border-gray-700/50 bg-gray-800/30 hover:border-gray-600 hover:bg-gray-800/50'
            }`}
          >
            <div className="w-[104px] flex-shrink-0 flex justify-center">
              <div className="w-16 h-11 rounded-lg bg-gray-700 border border-gray-600 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-gray-500 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className={`text-xs font-semibold ${selectedType === 'video' ? 'text-white' : 'text-gray-300'}`}>Video Cover</h3>
              <p className="text-[10px] text-gray-500 leading-relaxed">Thumbnails for YouTube, Vimeo, and social video.</p>
            </div>
          </button>
          
          {/* Website Sections - Spans 2 columns */}
          <button
            onClick={() => setSelectedType('website')}
            className={`col-span-2 p-4 rounded-xl border text-left transition-all duration-200 flex items-center gap-4 ${
              selectedType === 'website'
                ? 'border-gray-500 bg-gray-800'
                : 'border-gray-700/50 bg-gray-800/30 hover:border-gray-600 hover:bg-gray-800/50'
            }`}
          >
            {/* Multiple wireframe illustrations - Much bigger */}
            <div className="flex gap-2.5 flex-shrink-0">
              {/* Hero layout */}
              <div className="w-[85px] h-[74px] rounded-lg border border-gray-600 bg-gray-900/50 p-1.5 flex flex-col gap-1">
                <div className="h-6 rounded bg-gray-700" />
                <div className="flex-1 rounded bg-gray-800" />
              </div>
              {/* 3-column layout */}
              <div className="w-[85px] h-[74px] rounded-lg border border-gray-600 bg-gray-900/50 p-1.5 flex flex-col gap-1">
                <div className="h-2.5 rounded bg-gray-700" />
                <div className="flex gap-1 flex-1">
                  <div className="flex-1 rounded bg-gray-800" />
                  <div className="flex-1 rounded bg-gray-800" />
                  <div className="flex-1 rounded bg-gray-800" />
                </div>
              </div>
              {/* CTA layout */}
              <div className="w-[85px] h-[74px] rounded-lg border border-gray-600 bg-gray-900/50 p-1.5 flex flex-col justify-center items-center gap-1">
                <div className="w-10 h-2 rounded bg-gray-700" />
                <div className="w-12 h-4 rounded bg-gray-600" />
              </div>
              {/* Split layout */}
              <div className="w-[85px] h-[74px] rounded-lg border border-gray-600 bg-gray-900/50 p-1.5 flex gap-1">
                <div className="flex-1 rounded bg-gray-800" />
                <div className="flex-1 flex flex-col gap-1">
                  <div className="h-2 rounded bg-gray-700" />
                  <div className="h-1.5 rounded bg-gray-700/50" />
                  <div className="flex-1" />
                  <div className="h-3 w-10 rounded bg-gray-600" />
                </div>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className={`text-xs font-semibold ${selectedType === 'website' ? 'text-white' : 'text-gray-300'}`}>Website Sections</h3>
              <p className="text-[10px] text-gray-500 leading-relaxed">Banners, CTAs, and graphics for websites and landing pages.</p>
            </div>
          </button>
        </div>
        
        {/* Create Button */}
        <button
          onClick={handleCreate}
          disabled={!selectedType}
          className={`w-full py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
            selectedType
              ? 'bg-gray-700 hover:bg-gray-600 text-white border border-gray-600'
              : 'bg-gray-800/50 text-gray-600 cursor-not-allowed border border-gray-700/50'
          }`}
        >
          {selectedType ? 'Create Project' : 'Select a format'}
        </button>
        
      </div>
    </div>
  );
};

// Sidebar Component
const Sidebar = ({ activePanel, onPanelChange, zoom, onZoomChange, isHomePage, onAccountClick, isAccountOpen, onCloseAccount }) => {
  const panels = [
    { id: 'design', icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01', label: 'Design & Assets' },
    { id: 'export', icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12', label: 'Export' },
  ];
  
  const handlePanelClick = (panelId) => {
    if (onCloseAccount) onCloseAccount();
    onPanelChange(activePanel === panelId ? null : panelId);
  };
  
  return (
    <div className="fixed left-0 top-[56px] h-[calc(100%-56px)] w-16 bg-gray-900 border-r border-gray-800 flex flex-col items-center py-4 z-50">
      {/* Panel Buttons */}
      <div className="flex flex-col gap-3">
        {panels.map(panel => (
            <button
            key={panel.id}
            onClick={() => handlePanelClick(panel.id)}
            className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${activePanel === panel.id ? 'bg-orange-500 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}
            title={panel.label}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d={panel.icon} />
              </svg>
            </button>
        ))}
          </div>
          
      {/* Bottom Section - Zoom Controls or Profile Icon */}
      <div className="mt-auto flex flex-col items-center gap-1.5 pb-2">
        {isHomePage ? (
          /* Profile Icon on Homepage */
          <button 
            onClick={onAccountClick}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors border ${isAccountOpen ? 'text-white bg-gray-700 border-gray-600' : 'text-gray-400 hover:text-white hover:bg-gray-700 border-gray-700'}`}
            title="Profile & Settings"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>
        ) : (
          /* Zoom Controls in Editor */
          <>
            <button 
              onClick={() => onZoomChange(Math.min(250, zoom + 10))} 
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
              title="Zoom in"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <span className="text-[10px] font-mono font-medium text-gray-400">
              {zoom}%
            </span>
            <button 
              onClick={() => onZoomChange(Math.max(50, zoom - 10))} 
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
              title="Zoom out"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <button 
              onClick={() => onZoomChange(100)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
              title="Reset to 100%"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

// Design & Assets Panel (Combined Design System + Files + Backgrounds)
const DesignSystemPanel = ({ designSystem, onUpdate, onClose, isOpen }) => {
  const [activeTab, setActiveTab] = useState('design'); // 'design' or 'assets'
  const [uploadedFiles, setUploadedFiles] = useState([]); // Mock uploaded files
  const MAX_FILES = 50;
  
  const colorFields = [
    { key: 'primary', label: 'Primary' },
    { key: 'secondary', label: 'Secondary' },
    { key: 'accent', label: 'Accent' },
    { key: 'neutral1', label: 'Dark' },
    { key: 'neutral2', label: 'Mid' },
    { key: 'neutral3', label: 'Light' },
  ];

  const gradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
  ];

  const solidColors = ['#0f172a', '#1e293b', '#334155', '#475569', '#64748b', '#94a3b8'];
  
  return (
    <div 
      className={`fixed top-[56px] h-[calc(100%-56px)] w-72 bg-gray-900 border-r border-gray-800 z-40 flex flex-col ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
      style={{ left: isOpen ? 64 : -224, transition: 'left 0.3s ease-out' }}
    >
      {/* Fixed Header */}
      <div className="flex-shrink-0 px-4 border-b border-gray-800 flex items-center justify-between" style={{ height: 64 }}>
        <h2 className="text-sm font-semibold text-white">Design & Assets</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {/* Fixed Tab Navigation */}
      <div className="flex-shrink-0 flex border-b border-gray-800">
        <button 
          onClick={() => setActiveTab('design')}
          className={`flex-1 py-3 text-xs font-medium transition-colors ${activeTab === 'design' ? 'text-orange-400 border-b-2 border-orange-400' : 'text-gray-500 hover:text-gray-300'}`}
        >
          Design
        </button>
        <button 
          onClick={() => setActiveTab('assets')}
          className={`flex-1 py-3 text-xs font-medium transition-colors ${activeTab === 'assets' ? 'text-orange-400 border-b-2 border-orange-400' : 'text-gray-500 hover:text-gray-300'}`}
        >
          Assets
          {uploadedFiles.length > 0 && (
            <span className="ml-1.5 px-1.5 py-0.5 bg-gray-700 rounded text-[10px]">{uploadedFiles.length}</span>
          )}
        </button>
      </div>
      
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
      {activeTab === 'assets' ? (
        <>
          {/* Upload Section */}
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide">Upload Images</h3>
              <span className="text-[10px] text-gray-500">{uploadedFiles.length}/{MAX_FILES}</span>
            </div>
            <div className="border-2 border-dashed border-gray-700 rounded-lg p-4 text-center hover:border-gray-600 transition-colors cursor-pointer">
              <svg className="w-8 h-8 mx-auto mb-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-xs text-gray-400 mb-1">Drop images here</p>
              <p className="text-[10px] text-gray-600 mb-2">or</p>
              <button className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-xs text-white rounded-lg transition-colors">
                Browse files
              </button>
              <p className="text-[10px] text-gray-600 mt-2">PNG, JPG up to 10MB each</p>
            </div>
          </div>
          
          {/* File Browser */}
          <div className="p-4">
            <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Your Images</h3>
            {uploadedFiles.length === 0 ? (
              <div className="text-center py-8">
                <svg className="w-12 h-12 mx-auto mb-3 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-xs text-gray-500">No images uploaded yet</p>
                <p className="text-[10px] text-gray-600 mt-1">Upload images to use in your designs</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {uploadedFiles.map((file, idx) => (
                  <div key={idx} className="relative aspect-square bg-gray-800 rounded-lg overflow-hidden group cursor-pointer hover:ring-2 hover:ring-orange-500 transition-all">
                    <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button className="p-1.5 bg-red-500 rounded-full hover:bg-red-600 transition-colors">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-1.5 bg-gradient-to-t from-black/70 to-transparent">
                      <p className="text-[9px] text-white truncate">{file.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <>
      
{/* Colors Section */}
      <div className="p-4 border-b border-gray-800">
        <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Brand Colors</h3>
        <div className="bg-gray-800/60 rounded-xl p-3">
          <div className="grid grid-cols-3 gap-3">
            {colorFields.map(field => (
              <div key={field.key} className="flex flex-col items-center gap-1.5">
                  <input
                    type="color"
                  value={designSystem[field.key]}
                  onChange={(e) => onUpdate({ ...designSystem, [field.key]: e.target.value })}
                  className="w-12 h-12 rounded-lg cursor-pointer border-2 border-gray-600 hover:border-orange-500 transition-colors"
                />
                <span className="text-[10px] text-gray-400 font-medium">{field.label}</span>
              </div>
            ))}
          </div>
          </div>
        </div>
        
      {/* Fonts Section */}
      <div className="p-4 border-b border-gray-800">
        <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Fonts</h3>
        <div className="bg-gray-800/60 rounded-xl p-3 space-y-3">
        <div>
            <label className="text-[10px] text-gray-400 font-medium block mb-1.5">Heading Font</label>
              <select
              value={designSystem.headingFont}
              onChange={(e) => onUpdate({ ...designSystem, headingFont: e.target.value })}
              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-xs text-white hover:border-orange-500 focus:border-orange-500 focus:outline-none transition-colors cursor-pointer"
              >
                {allFonts.map(font => (
                  <option key={font.value} value={font.value}>{font.name}</option>
                ))}
              </select>
            </div>
            <div>
            <label className="text-[10px] text-gray-400 font-medium block mb-1.5">Body Font</label>
              <select
              value={designSystem.bodyFont}
              onChange={(e) => onUpdate({ ...designSystem, bodyFont: e.target.value })}
              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-xs text-white hover:border-orange-500 focus:border-orange-500 focus:outline-none transition-colors cursor-pointer"
              >
                {allFonts.map(font => (
                  <option key={font.value} value={font.value}>{font.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      
      {/* Backgrounds Section */}
      <div className="p-4">
        <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Backgrounds</h3>
        <div className="grid grid-cols-3 gap-2 mb-3">
          {gradients.map((gradient, idx) => (
            <button
              key={idx}
              className="w-full aspect-square rounded-lg border-2 border-gray-700 hover:border-orange-500 transition-colors"
              style={{ background: gradient }}
            />
          ))}
        </div>
        <div className="grid grid-cols-6 gap-1.5">
          {solidColors.map(color => (
            <button
              key={color}
              className="w-full aspect-square rounded border-2 border-gray-700 hover:border-orange-500 transition-colors"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
      </>
      )}
      </div>
    </div>
  );
};

// Export Panel
const ExportPanel = ({ onClose, isOpen, carousels = [] }) => {
  const [format, setFormat] = useState('png');
  const [resolution, setResolution] = useState('2x');
  const [background, setBackground] = useState('original');
  const [customBgColor, setCustomBgColor] = useState('#000000');
  const [selectedItems, setSelectedItems] = useState({});
  const [expandedRows, setExpandedRows] = useState({});

  const formats = [
    { id: 'png', name: 'PNG', supportsTransparent: true },
    { id: 'jpg', name: 'JPG', supportsTransparent: false },
    { id: 'webp', name: 'WebP', supportsTransparent: true },
    { id: 'pdf', name: 'PDF', supportsTransparent: false },
  ];

  const resolutions = [
    { id: '1x', name: '1x', desc: 'Standard' },
    { id: '2x', name: '2x', desc: 'High DPI' },
    { id: '3x', name: '3x', desc: 'Ultra' },
  ];

  const backgroundOptions = [
    { id: 'original', name: 'Original', desc: 'Keep background' },
    { id: 'transparent', name: 'Transparent', desc: 'PNG/WebP only' },
    { id: 'custom', name: 'Custom Color', desc: 'Solid fill' },
  ];

  // Count total selected frames
  const getSelectedCount = () => {
    let count = 0;
    Object.values(selectedItems).forEach(row => {
      if (typeof row === 'object') {
        count += Object.values(row).filter(Boolean).length;
      }
    });
    return count;
  };

  // Toggle entire row selection
  const toggleRow = (carouselId, frameCount) => {
    const currentRow = selectedItems[carouselId] || {};
    const allSelected = Object.keys(currentRow).length === frameCount && Object.values(currentRow).every(Boolean);
    
    if (allSelected) {
      setSelectedItems(prev => ({ ...prev, [carouselId]: {} }));
    } else {
      const newSelection = {};
      for (let i = 1; i <= frameCount; i++) {
        newSelection[i] = true;
      }
      setSelectedItems(prev => ({ ...prev, [carouselId]: newSelection }));
    }
  };

  // Toggle individual frame
  const toggleFrame = (carouselId, frameId) => {
    setSelectedItems(prev => ({
      ...prev,
      [carouselId]: {
        ...(prev[carouselId] || {}),
        [frameId]: !(prev[carouselId]?.[frameId])
      }
    }));
  };

  // Check if row is fully selected
  const isRowFullySelected = (carouselId, frameCount) => {
    const row = selectedItems[carouselId] || {};
    return Object.keys(row).length === frameCount && Object.values(row).every(Boolean);
  };

  // Check if row is partially selected
  const isRowPartiallySelected = (carouselId) => {
    const row = selectedItems[carouselId] || {};
    const selectedCount = Object.values(row).filter(Boolean).length;
    return selectedCount > 0;
  };

  // Select all frames
  const selectAll = () => {
    const newSelection = {};
    carousels.forEach(carousel => {
      newSelection[carousel.id] = {};
      carousel.frames.forEach(frame => {
        newSelection[carousel.id][frame.id] = true;
      });
    });
    setSelectedItems(newSelection);
  };

  // Deselect all
  const deselectAll = () => {
    setSelectedItems({});
  };

  const selectedCount = getSelectedCount();
  const totalFrames = carousels.reduce((acc, c) => acc + c.frames.length, 0);
  const supportsTransparent = formats.find(f => f.id === format)?.supportsTransparent;

  return (
    <div 
      className={`fixed top-[56px] h-[calc(100%-56px)] w-72 bg-gray-900 border-r border-gray-800 z-40 flex flex-col ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
      style={{ left: isOpen ? 64 : -224, transition: 'left 0.3s ease-out' }}
    >
      {/* Fixed Header */}
      <div className="flex-shrink-0 px-4 border-b border-gray-800 flex items-center justify-between" style={{ height: 64 }}>
        <h2 className="text-sm font-semibold text-white">Export</h2>
        <button type="button" onClick={onClose} className="text-gray-400 hover:text-white">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="p-4 space-y-5">
          
          {/* Selection Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide">Select Frames</h3>
              <div className="flex gap-2">
                <button type="button" onClick={selectAll} className="text-[10px] text-orange-400 hover:text-orange-300">All</button>
                <span className="text-gray-600">|</span>
                <button type="button" onClick={deselectAll} className="text-[10px] text-gray-500 hover:text-gray-400">None</button>
              </div>
            </div>
            <div className="bg-gray-800/50 rounded-lg border border-gray-700/50 max-h-48 overflow-y-auto">
              {carousels.map((carousel) => (
                <div key={carousel.id} className="border-b border-gray-700/50 last:border-b-0">
                  <div 
                    className="flex items-center gap-2 px-3 py-2 hover:bg-gray-700/30 cursor-pointer"
                    onClick={() => setExpandedRows(prev => ({ ...prev, [carousel.id]: !prev[carousel.id] }))}
                  >
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); toggleRow(carousel.id, carousel.frames.length); }}
                      className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                        isRowFullySelected(carousel.id, carousel.frames.length)
                          ? 'bg-orange-500 border-orange-500'
                          : isRowPartiallySelected(carousel.id)
                          ? 'bg-orange-500/50 border-orange-500'
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                    >
                      {(isRowFullySelected(carousel.id, carousel.frames.length) || isRowPartiallySelected(carousel.id)) && (
                        <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                    <span className="text-xs text-white flex-1 truncate">{carousel.name}</span>
                    <span className="text-[10px] text-gray-500">{carousel.frames.length} frames</span>
                    <svg className={`w-3 h-3 text-gray-500 transition-transform ${expandedRows[carousel.id] ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  {expandedRows[carousel.id] && (
                    <div className="bg-gray-800/30 px-3 py-1.5">
                      <div className="flex flex-wrap gap-1.5">
                        {carousel.frames.map((frame) => (
                          <button
                            type="button"
                            key={frame.id}
                            onClick={() => toggleFrame(carousel.id, frame.id)}
                            className={`px-2 py-1 rounded text-[10px] font-medium transition-colors ${
                              selectedItems[carousel.id]?.[frame.id]
                                ? 'bg-orange-500 text-white'
                                : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                            }`}
                          >
                            Frame {frame.id}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <p className="text-[10px] text-gray-500 mt-1.5">{selectedCount} of {totalFrames} frames selected</p>
          </div>

          {/* Format Section */}
          <div>
            <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Format</h3>
            <div className="grid grid-cols-4 gap-1.5">
              {formats.map(f => (
                <button
                  type="button"
                  key={f.id}
                  onClick={() => {
                    setFormat(f.id);
                    if (!f.supportsTransparent && background === 'transparent') {
                      setBackground('original');
                    }
                  }}
                  className={`px-2 py-2 rounded text-xs font-medium transition-colors ${
                    format === f.id
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {f.name}
                </button>
              ))}
            </div>
          </div>

          {/* Resolution Section */}
          <div>
            <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Resolution</h3>
            <div className="grid grid-cols-3 gap-1.5">
              {resolutions.map(r => (
                <button
                  type="button"
                  key={r.id}
                  onClick={() => setResolution(r.id)}
                  className={`px-2 py-2 rounded text-center transition-colors ${
                    resolution === r.id
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  <div className="text-xs font-medium">{r.name}</div>
                  <div className="text-[9px] opacity-70">{r.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Background Section */}
          <div>
            <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Background</h3>
            <div className="space-y-1.5">
              {backgroundOptions.map(bg => (
                <button
                  type="button"
                  key={bg.id}
                  onClick={() => bg.id !== 'transparent' || supportsTransparent ? setBackground(bg.id) : null}
                  disabled={bg.id === 'transparent' && !supportsTransparent}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded text-left transition-colors ${
                    background === bg.id
                      ? 'bg-orange-500/20 border border-orange-500/50'
                      : bg.id === 'transparent' && !supportsTransparent
                      ? 'bg-gray-800/50 border border-gray-700/50 opacity-40 cursor-not-allowed'
                      : 'bg-gray-800 border border-gray-700/50 hover:bg-gray-700'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    background === bg.id ? 'border-orange-500' : 'border-gray-600'
                  }`}>
                    {background === bg.id && <div className="w-2 h-2 rounded-full bg-orange-500" />}
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-white">{bg.name}</div>
                    <div className="text-[10px] text-gray-500">{bg.desc}</div>
                  </div>
                  {bg.id === 'custom' && background === 'custom' && (
                    <input
                      type="color"
                      value={customBgColor}
                      onChange={(e) => setCustomBgColor(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-6 h-6 rounded cursor-pointer"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Fixed Footer - Export Button */}
      <div className="flex-shrink-0 p-4 border-t border-gray-800 bg-gray-900">
        <button
          type="button"
          disabled={selectedCount === 0}
          className={`w-full py-3 rounded-lg text-sm font-medium transition-colors ${
            selectedCount > 0
              ? 'bg-orange-500 hover:bg-orange-600 text-white'
              : 'bg-gray-800 text-gray-600 cursor-not-allowed'
          }`}
        >
          {selectedCount > 0 ? `Export ${selectedCount} Frame${selectedCount > 1 ? 's' : ''}` : 'Select frames to export'}
        </button>
      </div>
    </div>
  );
};

// Account Management Panel
const AccountPanel = ({ onClose, isOpen }) => {
  const [activeTab, setActiveTab] = useState('team'); // 'team', 'invites', 'settings'
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('editor');
  
  // Mock team members data
  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: 'You', email: 'gavin@company.com', role: 'owner', status: 'active', avatar: null },
    { id: 2, name: 'Sarah Chen', email: 'sarah@company.com', role: 'admin', status: 'active', avatar: null },
    { id: 3, name: 'Mike Johnson', email: 'mike@company.com', role: 'editor', status: 'active', avatar: null },
  ]);
  
  // Mock pending invites
  const [pendingInvites, setPendingInvites] = useState([
    { id: 1, email: 'alex@company.com', role: 'editor', sentAt: '2024-12-20', expiresAt: '2024-12-27' },
    { id: 2, email: 'jordan@company.com', role: 'viewer', sentAt: '2024-12-21', expiresAt: '2024-12-28' },
  ]);

  const roles = [
    { id: 'owner', name: 'Owner', desc: 'Full access, billing, team management' },
    { id: 'admin', name: 'Admin', desc: 'Full access, team management' },
    { id: 'editor', name: 'Editor', desc: 'Create and edit projects' },
    { id: 'viewer', name: 'Viewer', desc: 'View only access' },
  ];

  const handleInvite = () => {
    if (!inviteEmail.trim()) return;
    const newInvite = {
      id: Date.now(),
      email: inviteEmail.trim(),
      role: inviteRole,
      sentAt: new Date().toISOString().split('T')[0],
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    };
    setPendingInvites(prev => [...prev, newInvite]);
    setInviteEmail('');
    setShowInviteForm(false);
  };

  const handleResendInvite = (inviteId) => {
    setPendingInvites(prev => prev.map(inv => 
      inv.id === inviteId 
        ? { ...inv, sentAt: new Date().toISOString().split('T')[0], expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] }
        : inv
    ));
  };

  const handleCancelInvite = (inviteId) => {
    setPendingInvites(prev => prev.filter(inv => inv.id !== inviteId));
  };

  const handleRemoveMember = (memberId) => {
    if (teamMembers.find(m => m.id === memberId)?.role === 'owner') return;
    setTeamMembers(prev => prev.filter(m => m.id !== memberId));
  };

  const handleChangeRole = (memberId, newRole) => {
    if (teamMembers.find(m => m.id === memberId)?.role === 'owner') return;
    setTeamMembers(prev => prev.map(m => m.id === memberId ? { ...m, role: newRole } : m));
  };

  return (
    <div 
      className={`fixed top-[56px] h-[calc(100%-56px)] w-80 bg-gray-900 border-r border-gray-800 z-40 flex flex-col ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
      style={{ left: isOpen ? 64 : -256, transition: 'left 0.3s ease-out' }}
    >
      {/* Fixed Header */}
      <div className="flex-shrink-0 p-4 border-b border-gray-800 flex items-center justify-between" style={{ height: 64 }}>
        <h2 className="text-base font-semibold text-white">Account</h2>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {/* Tab Navigation */}
      <div className="flex-shrink-0 flex border-b border-gray-800">
        <button 
          onClick={() => setActiveTab('team')}
          className={`flex-1 py-3 text-xs font-medium transition-colors ${activeTab === 'team' ? 'text-white border-b-2 border-gray-500' : 'text-gray-500 hover:text-gray-300'}`}
        >
          Team
        </button>
        <button 
          onClick={() => setActiveTab('invites')}
          className={`flex-1 py-3 text-xs font-medium transition-colors relative ${activeTab === 'invites' ? 'text-white border-b-2 border-gray-500' : 'text-gray-500 hover:text-gray-300'}`}
        >
          Invites
          {pendingInvites.length > 0 && (
            <span className="absolute top-2 right-4 w-4 h-4 bg-gray-600 rounded-full text-[10px] flex items-center justify-center text-white">
              {pendingInvites.length}
            </span>
          )}
        </button>
        <button 
          onClick={() => setActiveTab('settings')}
          className={`flex-1 py-3 text-xs font-medium transition-colors ${activeTab === 'settings' ? 'text-white border-b-2 border-gray-500' : 'text-gray-500 hover:text-gray-300'}`}
        >
          Settings
        </button>
      </div>
      
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4">
        
        {/* Team Tab */}
        {activeTab === 'team' && (
          <div className="space-y-4">
            {/* Invite Button */}
            <button
              onClick={() => setShowInviteForm(true)}
              className="w-full py-2.5 rounded-lg border border-dashed border-gray-600 text-gray-400 hover:border-gray-500 hover:text-white hover:bg-gray-800/50 transition-all text-sm font-medium flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Invite Team Member
            </button>
            
            {/* Invite Form */}
            {showInviteForm && (
              <div className="p-3 rounded-lg bg-gray-800/50 border border-gray-700 space-y-3">
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="Email address"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gray-500"
                />
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-sm text-white focus:outline-none focus:border-gray-500"
                >
                  {roles.filter(r => r.id !== 'owner').map(role => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </select>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowInviteForm(false)}
                    className="flex-1 py-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleInvite}
                    disabled={!inviteEmail.trim()}
                    className="flex-1 py-2 rounded-lg bg-white text-gray-900 hover:bg-gray-200 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Send Invite
                  </button>
                </div>
              </div>
            )}
            
            {/* Team Members List */}
            <div className="space-y-2">
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Team Members ({teamMembers.length})</h3>
              {teamMembers.map(member => (
                <div key={member.id} className="p-3 rounded-lg bg-gray-800/30 border border-gray-700/50 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-medium text-white">
                    {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{member.name}</p>
                    <p className="text-xs text-gray-500 truncate">{member.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {member.role === 'owner' ? (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-gray-700 text-gray-400">Owner</span>
                    ) : (
                      <>
                        <select
                          value={member.role}
                          onChange={(e) => handleChangeRole(member.id, e.target.value)}
                          className="text-[10px] px-2 py-1 rounded bg-gray-700 border-0 text-gray-300 focus:outline-none cursor-pointer"
                        >
                          {roles.filter(r => r.id !== 'owner').map(role => (
                            <option key={role.id} value={role.id}>{role.name}</option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleRemoveMember(member.id)}
                          className="p-1 rounded hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition-colors"
                          title="Remove member"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Invites Tab */}
        {activeTab === 'invites' && (
          <div className="space-y-4">
            {pendingInvites.length === 0 ? (
              <div className="text-center py-8">
                <svg className="w-12 h-12 mx-auto text-gray-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <p className="text-sm text-gray-500">No pending invites</p>
                <button
                  onClick={() => { setActiveTab('team'); setShowInviteForm(true); }}
                  className="mt-3 text-xs text-gray-400 hover:text-white transition-colors"
                >
                  Invite someone →
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Pending Invites ({pendingInvites.length})</h3>
                {pendingInvites.map(invite => (
                  <div key={invite.id} className="p-3 rounded-lg bg-gray-800/30 border border-gray-700/50">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-sm font-medium text-white">{invite.email}</p>
                        <p className="text-xs text-gray-500 capitalize">{invite.role}</p>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-gray-700 text-gray-400">Pending</span>
                    </div>
                    <div className="text-xs text-gray-500 mb-2">
                      Sent {invite.sentAt} · Expires {invite.expiresAt}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleResendInvite(invite.id)}
                        className="flex-1 py-1.5 rounded bg-gray-700 text-gray-300 hover:bg-gray-600 text-xs font-medium transition-colors"
                      >
                        Resend
                      </button>
                      <button
                        onClick={() => handleCancelInvite(invite.id)}
                        className="flex-1 py-1.5 rounded bg-gray-700 text-gray-300 hover:bg-red-500/20 hover:text-red-400 text-xs font-medium transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-5">
            {/* Profile Section */}
            <div className="space-y-3">
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Profile</h3>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/30 border border-gray-700/50">
                <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-lg font-medium text-white">
                  G
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">Gavin</p>
                  <p className="text-xs text-gray-500">gavin@company.com</p>
                </div>
                <button className="text-xs text-gray-400 hover:text-white transition-colors">
                  Edit
                </button>
              </div>
            </div>
            
            {/* Workspace Section */}
            <div className="space-y-3">
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Workspace</h3>
              <div className="p-3 rounded-lg bg-gray-800/30 border border-gray-700/50 space-y-3">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Workspace Name</label>
                  <input
                    type="text"
                    defaultValue="My Team"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-sm text-white focus:outline-none focus:border-gray-500"
                  />
                </div>
              </div>
            </div>
            
            {/* Danger Zone */}
            <div className="space-y-3">
              <h3 className="text-xs font-medium text-red-400/70 uppercase tracking-wide">Danger Zone</h3>
              <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/20 space-y-2">
                <p className="text-xs text-gray-400">Permanently delete your account and all associated data.</p>
                <button className="w-full py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs font-medium transition-colors">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Carousel Row Component
const CarouselRow = ({ carousel, designSystem, isSelected, hasAnySelection, selectedFrameId, onSelect, onSelectFrame, onAddFrame, onRemoveFrame, onRemoveRow, onUpdateText, activeTextField, onActivateTextField, onReorderFrames }) => {
  const totalFrames = carousel.frames.length;
  const isFaded = hasAnySelection && !isSelected;
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id && over) {
      const oldIndex = carousel.frames.findIndex(f => `frame-${f.id}` === active.id);
      const newIndex = carousel.frames.findIndex(f => `frame-${f.id}` === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        onReorderFrames(carousel.id, oldIndex, newIndex);
      }
    }
  };

  const frameIds = carousel.frames.map(f => `frame-${f.id}`);
  
  return (
    <div 
      data-carousel-id={carousel.id}
      className={`mb-10 rounded-xl transition-all duration-150 cursor-pointer overflow-x-auto hide-scrollbar ${isSelected ? 'bg-orange-500/5 border border-orange-500/20 py-4' : 'hover:bg-gray-800/30 border border-transparent py-4'} ${isFaded ? 'opacity-20 hover:opacity-50' : 'opacity-100'}`}
      style={{ marginLeft: '10px', marginRight: '10px', width: 'fit-content', minWidth: 'auto', maxWidth: 'calc(100% - 20px)' }}
      onClick={(e) => { e.stopPropagation(); onSelect(carousel.id); }}
    >
      <div className="mb-4 flex items-center px-4">
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
              {/* Remove Row Button - next to EDITING tag */}
              {isSelected && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onRemoveRow(carousel.id); }}
                  className="flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-medium bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all duration-150"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  REMOVE
                </button>
              )}
                </div>
            <p className="text-sm text-gray-400">{carousel.subtitle}</p>
          </div>
          </div>
        </div>
        
      <div className="px-4" style={{ minHeight: 300 }}>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={frameIds} strategy={horizontalListSortingStrategy}>
            <div className={`flex items-center transition-all duration-150 ease-out`} style={{ width: 'auto', minWidth: 'fit-content', gap: isSelected ? '12px' : '10px' }}>
              {carousel.frames.map((frame, index) => (
                <React.Fragment key={frame.id}>
                  <SortableFrame
                    id={`frame-${frame.id}`}
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
                    isRowSelected={isSelected}
                    cardWidth={frameSizes[carousel.frameSize]?.width || 192}
                  />
              
              {/* Add Button After Each Frame */}
              <div 
                className={`flex items-center justify-center self-stretch transition-all duration-150 ease-out ${isSelected ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                style={{ width: isSelected ? 32 : 0, paddingTop: 24, overflow: 'hidden' }}
              >
              <button
                  onClick={(e) => { e.stopPropagation(); onAddFrame(carousel.id, index + 1); }} 
                  className="w-7 h-7 rounded-full border-2 border-dashed border-gray-600 opacity-50 hover:opacity-100 hover:border-orange-500 hover:bg-orange-500/10 flex items-center justify-center transition-all duration-150"
                >
                  <svg className="w-3.5 h-3.5 text-gray-500 hover:text-orange-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              </button>
              </div>
            </React.Fragment>
            ))}
          </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

// Main App Component
export default function CarouselDesignTool() {
  const [carousels, setCarousels] = useState(initialCarousels);
  const [zoom, setZoom] = useState(120);
  const [designSystem, setDesignSystem] = useState(defaultDesignSystem);
  const [activePanel, setActivePanel] = useState(null);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [selectedCarouselId, setSelectedCarouselId] = useState(null);
  
  // View state - 'home' or 'editor'
  const [currentView, setCurrentView] = useState('home');
  
  // Browser-style tabs for projects
  const [tabs, setTabs] = useState([
    { id: 1, name: 'HelloData Campaign', active: false, hasContent: true, createdAt: '2024-12-20', updatedAt: '2024-12-22', frameCount: 5 }
  ]);
  const [activeTabId, setActiveTabId] = useState(1);
  
  const activeTab = tabs.find(t => t.id === activeTabId);
  
  const handleTabClick = (tabId) => {
    setActiveTabId(tabId);
    setTabs(prev => prev.map(tab => ({ ...tab, active: tab.id === tabId })));
  };
  
  const handleUpdateProjectName = (newName) => {
    if (!newName.trim()) return;
    setTabs(prev => prev.map(tab => tab.id === activeTabId ? { ...tab, name: newName.trim() } : tab));
  };
  
  const handleGoHome = () => {
    setCurrentView('home');
    setSelectedCarouselId(null);
    setSelectedFrameId(null);
    setActiveTextField(null);
  };
  
  const handleOpenProject = (projectId) => {
    setActiveTabId(projectId);
    setTabs(prev => prev.map(tab => ({ ...tab, active: tab.id === projectId })));
    setIsAccountOpen(false);
    setCurrentView('editor');
  };
  
  const handleCreateNewFromHome = () => {
    const newId = Math.max(...tabs.map(t => t.id)) + 1;
    const newTab = { 
      id: newId, 
      name: 'Untitled Project', 
      active: true, 
      hasContent: false, 
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      frameCount: 0
    };
    setTabs(prev => [...prev.map(t => ({ ...t, active: false })), newTab]);
    setActiveTabId(newId);
    setIsAccountOpen(false);
    setCurrentView('editor');
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
    setTabs(prev => [...prev.map(t => ({ ...t, active: false })), { id: newId, name: 'Untitled Project', active: true, hasContent: false, createdAt: new Date().toISOString().split('T')[0], updatedAt: new Date().toISOString().split('T')[0], frameCount: 0 }]);
    setActiveTabId(newId);
    setIsAccountOpen(false);
    setCurrentView('editor');
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
  const [showFormatPicker, setShowFormatPicker] = useState(false);
  const [showLayoutPicker, setShowLayoutPicker] = useState(false);
  const [showNewTabMenu, setShowNewTabMenu] = useState(false);
  const newTabMenuRef = useRef(null);
  const [showSnippetsPicker, setShowSnippetsPicker] = useState(false);
  
  // Refs for click outside handling
  const colorPickerRef = useRef(null);
  const fontSizeRef = useRef(null);
  const underlineRef = useRef(null);
  const fontPickerRef = useRef(null);
  const textAlignRef = useRef(null);
  const lineSpacingRef = useRef(null);
  const letterSpacingRef = useRef(null);
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
    setShowFormatPicker(false);
    setShowLayoutPicker(false);
    setShowSnippetsPicker(false);
    setShowNewTabMenu(false);
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
      if (formatPickerRef.current && !formatPickerRef.current.contains(event.target)) setShowFormatPicker(false);
      if (layoutPickerRef.current && !layoutPickerRef.current.contains(event.target)) setShowLayoutPicker(false);
      if (snippetsPickerRef.current && !snippetsPickerRef.current.contains(event.target)) setShowSnippetsPicker(false);
      if (newTabMenuRef.current && !newTabMenuRef.current.contains(event.target)) setShowNewTabMenu(false);
    };
      document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const selectedCarousel = carousels.find(c => c.id === selectedCarouselId) || carousels[0];
  const selectedFrame = selectedCarousel?.frames?.find(f => f.id === selectedFrameId);
  
  const handleSelectFrame = (carouselId, frameId) => {
    closeAllDropdowns();
    setActiveTextField(null);
    // If opening a new carousel
    if (carouselId !== selectedCarouselId) {
      setSelectedCarouselId(carouselId);
    }
    setSelectedFrameId(prev => (prev === frameId && carouselId === selectedCarouselId) ? null : frameId);
  };
  
  const handleSelectCarousel = (carouselId) => {
    closeAllDropdowns();
    setActiveTextField(null);
    
    // Determine if opening or closing
    const isOpening = carouselId !== null && carouselId !== selectedCarouselId;
    const isClosing = carouselId === null || (carouselId === selectedCarouselId && selectedCarouselId !== null);
    
    if (isOpening) {
      // Opening a row
      setSelectedFrameId(null);
      setSelectedCarouselId(carouselId);
    } else if (isClosing && carouselId === selectedCarouselId) {
      // Clicking the same row's close button - close it
      setSelectedCarouselId(null);
      setSelectedFrameId(null);
    } else if (carouselId === null) {
      // Explicitly closing
      setSelectedCarouselId(null);
      setSelectedFrameId(null);
    } else {
      // Switching to a different row
      setSelectedFrameId(null);
      setSelectedCarouselId(carouselId);
    }
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
  
  const handleReorderFrames = (carouselId, oldIndex, newIndex) => {
      setCarousels(prev => prev.map(carousel => {
      if (carousel.id !== carouselId) return carousel;
      const newFrames = arrayMove(carousel.frames, oldIndex, newIndex).map((f, idx) => ({ ...f, id: idx + 1 }));
      return { ...carousel, frames: newFrames };
    }));
  };

  const handleAddRow = (afterIndex) => {
    const newId = Date.now();
    const newCarousel = {
      id: newId,
      name: "New Row",
      subtitle: "Click to edit",
      frameSize: "portrait",
      frames: [
        {
          id: 1,
          variants: [
            { headline: "Your headline here", body: "Your body text here.", formatting: {} },
            { headline: "Alternative headline", body: "Alternative body text.", formatting: {} },
            { headline: "Third variation", body: "Third body option.", formatting: {} }
          ],
          currentVariant: 0,
          currentLayout: 0,
          layoutVariant: 0,
          style: "dark-single-pin"
        }
      ]
    };
    
    setCarousels(prev => {
      const newCarousels = [...prev];
      newCarousels.splice(afterIndex + 1, 0, newCarousel);
      return newCarousels;
    });
    
    // Select the new row
    setSelectedCarouselId(newId);
  };

  const handleRemoveRow = (carouselId) => {
    // Don't allow removing the last row
    if (carousels.length <= 1) return;
    
    // Clear selection if removing the selected row
    if (selectedCarouselId === carouselId) {
      setSelectedCarouselId(null);
      setSelectedFrameId(null);
      setActiveTextField(null);
    }
    
    setCarousels(prev => prev.filter(c => c.id !== carouselId));
  };
  
  const panelWidth = activePanel ? 288 : 0; // w-72 = 288px
  const sidebarWidth = 64; // w-16 = 64px
  const totalOffset = sidebarWidth + panelWidth;
  
  return (
    <div className="h-screen text-white overflow-hidden" style={{ backgroundColor: '#0d1321' }}>
      {/* Browser-style Tab Bar - Full Width */}
      <div className="fixed top-0 left-0 right-0 z-[110] border-b border-gray-700" style={{ height: 56, backgroundColor: '#0d1321' }}>
        <div className="flex items-end h-full">
          {/* Home Button */}
          <div className="flex items-center px-3 pb-2">
            <button 
              onClick={handleGoHome}
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${currentView === 'home' ? 'text-white bg-gray-800' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </button>
          </div>
          {/* Tabs */}
          <div className="flex items-end">
            {tabs.map((tab, index) => {
                const isTabActive = tab.active && currentView !== 'home';
                return (
              <div key={tab.id} className="flex items-end">
                {/* Vertical separator - show before inactive tabs (except first) */}
                {index > 0 && !isTabActive && !(tabs[index - 1]?.active && currentView !== 'home') && (
                  <div className="w-px h-5 bg-gray-700 self-center" />
                )}
                <div 
                  onClick={() => handleOpenProject(tab.id)}
                  className={`group flex items-center gap-2 px-4 h-10 rounded-t-lg cursor-pointer transition-colors duration-150 ${
                    isTabActive 
                      ? 'bg-gray-800 text-white' 
                      : 'bg-transparent text-gray-500 hover:text-gray-300'
                  }`}
                  style={{ minWidth: 140, maxWidth: 220 }}
                >
                  <svg className={`w-4 h-4 flex-shrink-0 transition-colors ${isTabActive ? 'text-gray-400' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-sm font-medium truncate flex-1">{tab.name}</span>
                  <button 
                    onClick={(e) => handleCloseTab(tab.id, e)}
                    className={`w-5 h-5 rounded flex items-center justify-center transition-opacity ${
                      isTabActive 
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
            );
              })}
            {/* Separator before add button */}
            <div className="w-px h-5 bg-gray-700 self-center mx-1" />
            {/* Add Tab Button with Dropdown */}
            <div ref={newTabMenuRef} className="relative mb-1">
              <button 
                onClick={() => { const wasOpen = showNewTabMenu; closeAllDropdowns(); if (!wasOpen && tabs.length < MAX_TABS) setShowNewTabMenu(true); }}
                disabled={tabs.length >= MAX_TABS}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                  tabs.length >= MAX_TABS 
                    ? 'text-gray-600 cursor-not-allowed' 
                    : showNewTabMenu ? 'text-white bg-gray-800' : 'text-gray-500 hover:text-white hover:bg-gray-800'
                }`}
                title={tabs.length >= MAX_TABS ? 'Maximum tabs reached' : 'New tab'}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
              
              {/* New Tab Dropdown Menu */}
              {showNewTabMenu && (
                <div className="absolute top-full left-0 mt-2 py-1.5 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-[200] min-w-[200px]">
                  {/* New Project Option */}
                  <button
                    onClick={() => { handleAddTab(); setShowNewTabMenu(false); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm text-gray-300 hover:bg-gray-700 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-white">New Project</div>
                      <div className="text-xs text-gray-500">Start from scratch</div>
                    </div>
                  </button>
                  
                  {/* Divider */}
                  <div className="my-1.5 border-t border-gray-700" />
                  
                  {/* Existing Projects Header */}
                  <div className="px-3 py-1.5 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Open Existing
                  </div>
                  
                  {/* List of existing projects */}
                  {tabs.map(project => (
                    <button
                      key={project.id}
                      onClick={() => { handleOpenProject(project.id); setShowNewTabMenu(false); }}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-left text-sm transition-colors ${
                        project.id === activeTabId && currentView !== 'home'
                          ? 'bg-gray-700/50 text-white' 
                          : 'text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${project.hasContent ? 'bg-gray-700' : 'bg-gray-800 border border-gray-700'}`}>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{project.name}</div>
                        <div className="text-xs text-gray-500">
                          {project.hasContent ? `${project.frameCount || 5} frames` : 'Empty'}
                        </div>
                      </div>
                      {project.id === activeTabId && currentView !== 'home' && (
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
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
      
      {/* Sidebar - Always visible */}
      <Sidebar 
        activePanel={activePanel} 
        onPanelChange={setActivePanel} 
        zoom={zoom} 
        onZoomChange={setZoom} 
        isHomePage={currentView === 'home'}
        onAccountClick={() => { setActivePanel(null); setIsAccountOpen(!isAccountOpen); }}
        isAccountOpen={isAccountOpen}
        onCloseAccount={() => setIsAccountOpen(false)}
      />
      
      {/* Panels - Always visible */}
      <DesignSystemPanel designSystem={designSystem} onUpdate={setDesignSystem} onClose={() => setActivePanel(null)} isOpen={activePanel === 'design'} />
      <ExportPanel onClose={() => setActivePanel(null)} isOpen={activePanel === 'export'} carousels={carousels} />
      <AccountPanel onClose={() => setIsAccountOpen(false)} isOpen={isAccountOpen && currentView === 'home'} />

      {/* Homepage or Editor View */}
      {currentView === 'home' ? (
        <div className="absolute inset-0 top-[56px]" style={{ left: totalOffset, transition: 'left 0.3s ease-out' }}>
          <Homepage 
            projects={tabs} 
            onOpenProject={handleOpenProject}
            onCreateNew={handleCreateNewFromHome}
          />
        </div>
      ) : (
        <>

      {/* Toolbar - Only show for projects with content */}
      {activeTab?.hasContent && (
      <div className="fixed z-[100] bg-gray-900 border-b border-gray-800 px-5 overflow-visible flex items-center" style={{ top: 56, left: totalOffset, right: 0, height: 64, transition: 'left 0.3s ease-out' }}>
        <div className="flex items-center justify-between text-sm text-gray-400 w-full">
          <div className="flex items-center gap-3">
            
            {/* Frame Group */}
            <div className={`flex items-center gap-2 px-2 py-1.5 bg-gray-800/60 rounded-xl transition-opacity ${selectedCarouselId ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
              {/* Format dropdown */}
              <div ref={formatPickerRef} className="relative">
                <button onClick={() => { const wasOpen = showFormatPicker; closeAllDropdowns(); if (!wasOpen) setShowFormatPicker(true); }} className="flex items-center gap-2 px-3 py-2 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
                  <span className="text-xs font-medium text-gray-300">Format</span>
                  <span className="text-[11px] text-gray-500">{frameSizes[selectedCarousel?.frameSize]?.name || 'Portrait'}</span>
                  <svg className={`w-3 h-3 text-gray-400 transition-transform ${showFormatPicker ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                {showFormatPicker && (
                  <div className="absolute top-full left-0 mt-2 p-1.5 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-[200] min-w-[160px]">
                {Object.entries(frameSizes).filter(([key]) => key !== 'landscape').map(([key, size]) => (
                      <button key={key} onClick={() => { handleChangeFrameSize(selectedCarouselId, key); setShowFormatPicker(false); }} className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-xs transition-colors ${selectedCarousel?.frameSize === key ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>
                        <span className="font-medium">{size.name}</span>
                        <span className="text-gray-500 ml-auto">{size.ratio}</span>
                      </button>
                ))}
              </div>
                    )}
                  </div>
            </div>

            {/* Layout Group */}
            <div className={`flex items-center gap-1.5 px-2 py-1.5 bg-gray-800/60 rounded-xl transition-opacity ${selectedFrame ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
              <div ref={layoutPickerRef} className="relative">
                <button onClick={() => { const wasOpen = showLayoutPicker; closeAllDropdowns(); if (!wasOpen) setShowLayoutPicker(true); }} className="flex items-center gap-2 px-3 py-2 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
                  <span className="text-xs font-medium text-gray-300">Layout</span>
                  <span className="text-[11px] text-gray-500">{layoutNames[selectedFrame?.currentLayout || 0]}</span>
                  <svg className={`w-3 h-3 text-gray-400 transition-transform ${showLayoutPicker ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                {showLayoutPicker && (
                  <div className="absolute top-full left-0 mt-2 p-1.5 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-[200] min-w-[140px]">
                    {layoutNames.map((name, idx) => (
                      <button key={idx} onClick={() => { handleSetLayout(selectedCarouselId, selectedFrameId, idx); setShowLayoutPicker(false); }} className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-xs transition-colors ${(selectedFrame?.currentLayout || 0) === idx ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>
                        {idx === 0 && <div className="w-4 h-5 bg-gray-600 rounded flex items-end p-0.5"><div className="w-full h-1 rounded-sm bg-orange-400" /></div>}
                        {idx === 1 && <div className="w-4 h-5 bg-gray-600 rounded flex items-center justify-center"><div className="w-2 h-2 rounded-sm bg-orange-400" /></div>}
                        {idx === 2 && <div className="w-4 h-5 bg-gray-600 rounded flex flex-col justify-between p-0.5"><div className="w-2 h-1 rounded-sm bg-orange-400" /><div className="w-1.5 h-1 bg-gray-500 rounded-sm self-end" /></div>}
                        <span className="font-medium">{name}</span>
                      </button>
                    ))}
                  </div>
                    )}
                  </div>
              <button onClick={() => { closeAllDropdowns(); selectedFrame && handleShuffleLayoutVariant(selectedCarouselId, selectedFrameId); }} className="p-2 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-gray-200 transition-all" title="Shuffle variant">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" /></svg>
                </button>
                  </div>

            {/* Snippets Group */}
            <div className={`flex items-center gap-1.5 px-2 py-1.5 bg-gray-800/60 rounded-xl transition-opacity ${activeTextField ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
              <div ref={snippetsPickerRef} className="relative">
                <button onClick={() => { const wasOpen = showSnippetsPicker; closeAllDropdowns(); if (!wasOpen) setShowSnippetsPicker(true); }} className="flex items-center gap-2 px-3 py-2 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
                  <span className="text-xs font-medium text-gray-300">Snippets</span>
                  <span className="text-[11px] text-orange-400 font-medium">S{(selectedFrame?.currentVariant || 0) + 1}</span>
                  <svg className={`w-3 h-3 text-gray-400 transition-transform ${showSnippetsPicker ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                {showSnippetsPicker && (
                  <div className="absolute top-full left-0 mt-2 p-1.5 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-[200] min-w-[90px]">
                    {[0, 1, 2].map((idx) => (
                      <button key={idx} onClick={() => { handleSetVariant(selectedCarouselId, selectedFrameId, idx); setShowSnippetsPicker(false); }} className={`w-full flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${selectedFrame?.currentVariant === idx ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>
                        <span className={selectedFrame?.currentVariant === idx ? 'text-white' : 'text-orange-400'}>S{idx + 1}</span>
                </button>
                    ))}
              </div>
                )}
              </div>
              <button className="p-2 rounded-lg text-orange-400 hover:bg-orange-500/20 transition-colors" title="Rewrite with AI">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L14.09 8.26L20 9.27L15.55 13.97L16.91 20L12 16.9L7.09 20L8.45 13.97L4 9.27L9.91 8.26L12 2Z" /></svg>
              </button>
            </div>
            
            {/* Typography Group */}
            <div className={`flex items-center gap-1.5 px-2 py-1.5 bg-gray-800/60 rounded-xl transition-opacity ${activeTextField ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
              {/* Font Type dropdown */}
              <div ref={fontPickerRef} className="relative">
                <button onClick={() => { if (!activeTextField) return; const wasOpen = showFontPicker; closeAllDropdowns(); if (!wasOpen) setShowFontPicker(true); }} className="flex items-center gap-1.5 px-3 py-2 bg-gray-700/50 rounded-lg text-xs font-medium text-gray-300 hover:bg-gray-700 transition-colors">
                  <span>Font</span>
                  <svg className={`w-2.5 h-2.5 transition-transform ${showFontPicker ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                {showFontPicker && activeTextField && (
                  <div className="absolute top-full left-0 mt-2 p-1.5 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-[200] max-h-56 overflow-y-auto min-w-[160px]" onClick={(e) => e.stopPropagation()}>
                    {allFonts.map(font => (
                      <button type="button" key={font.value} onClick={(e) => { e.stopPropagation(); handleUpdateFormatting(selectedCarouselId, selectedFrameId, activeTextField, 'fontFamily', font.value); setShowFontPicker(false); }} className={`w-full px-3 py-2 rounded-lg text-xs text-left transition-colors ${selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.fontFamily === font.value ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`} style={{ fontFamily: font.value }}>
                        {font.name}
                    </button>
                  ))}
                </div>
                )}
              </div>

              {/* Font Size dropdown */}
              <div ref={fontSizeRef} className="relative">
                <button onClick={() => { if (!activeTextField) return; const wasOpen = showFontSize; closeAllDropdowns(); if (!wasOpen) setShowFontSize(true); }} className="flex items-center gap-1.5 px-3 py-2 bg-gray-700/50 rounded-lg text-xs font-medium text-gray-300 hover:bg-gray-700 transition-colors">
                  <span>Size</span>
                  <svg className={`w-2.5 h-2.5 transition-transform ${showFontSize ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                {showFontSize && activeTextField && (
                  <div className="absolute top-full left-0 mt-2 p-1.5 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-[200]" onClick={(e) => e.stopPropagation()}>
                    <div className="flex gap-1">
                      {[{ name: 'S', value: 0.85 }, { name: 'M', value: 1 }, { name: 'L', value: 1.2 }].map(s => (
                        <button type="button" key={s.name} onClick={(e) => { e.stopPropagation(); handleUpdateFormatting(selectedCarouselId, selectedFrameId, activeTextField, 'fontSize', s.value); setShowFontSize(false); }} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.fontSize === s.value ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>{s.name}</button>
                      ))}
              </div>
                  </div>
                )}
            </div>
            
                {/* Color picker */}
              <div ref={colorPickerRef} className="relative">
                <button onClick={() => { if (!activeTextField) return; const wasOpen = showColorPicker; closeAllDropdowns(); if (!wasOpen) setShowColorPicker(true); }} className="flex items-center gap-1 p-2 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors" title="Text color">
                  <div className="w-5 h-5 rounded border border-gray-500" style={{ backgroundColor: (() => {
                    const explicitColor = selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.color;
                    if (explicitColor) return explicitColor;
                    // Get frame's style-based accent color for headlines
                    if (activeTextField === 'headline' && selectedFrame) {
                      const frameStyle = getFrameStyle(selectedCarouselId, selectedFrame.style, designSystem);
                      return frameStyle.accent;
                    }
                    return '#e5e7eb'; // gray-200 for body text
                  })() }} />
                  </button>
                  {showColorPicker && activeTextField && (
                  <div className="absolute top-full left-0 mt-2 p-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-[200]" onClick={(e) => e.stopPropagation()}>
                    <div className="flex gap-1.5">
                        {[{ name: 'Primary', value: designSystem.primary }, { name: 'Secondary', value: designSystem.secondary }, { name: 'Accent', value: designSystem.accent }, { name: 'Light', value: designSystem.neutral3 }, { name: 'White', value: '#ffffff' }].map(c => (
                        <button type="button" key={c.value} onClick={(e) => { e.stopPropagation(); handleUpdateFormatting(selectedCarouselId, selectedFrameId, activeTextField, 'color', c.value); setShowColorPicker(false); }} className="w-6 h-6 rounded-lg border border-gray-600 hover:scale-110 transition-transform" style={{ backgroundColor: c.value }} title={c.name} />
                        ))}
                      </div>
                    </div>
                  )}
              </div>
                </div>
                
            {/* Style Group */}
            <div className={`flex items-center gap-1 px-2 py-1.5 bg-gray-800/60 rounded-xl transition-opacity ${activeTextField ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                {/* Bold - headlines are bold by default */}
              <button onClick={() => { 
                if (!activeTextField) return; 
                closeAllDropdowns(); 
                const formatting = selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField] || {}; 
                const isDefaultBold = activeTextField === 'headline';
                const currentBold = formatting.bold !== undefined ? formatting.bold : isDefaultBold;
                handleUpdateFormatting(selectedCarouselId, selectedFrameId, activeTextField, 'bold', !currentBold); 
              }} className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold transition-colors ${
                (() => {
                  const formatting = selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField] || {};
                  const isDefaultBold = activeTextField === 'headline';
                  const isBold = formatting.bold !== undefined ? formatting.bold : isDefaultBold;
                  return isBold ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-700';
                })()
              }`} title="Bold">B</button>
                
                {/* Italic */}
              <button onClick={() => { if (!activeTextField) return; closeAllDropdowns(); const formatting = selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField] || {}; handleUpdateFormatting(selectedCarouselId, selectedFrameId, activeTextField, 'italic', !formatting.italic); }} className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm italic transition-colors ${selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.italic ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`} title="Italic">I</button>
                
                {/* Underline */}
              <div ref={underlineRef} className="relative flex">
                <button onClick={() => { if (!activeTextField) return; const wasOpen = showUnderlinePicker; closeAllDropdowns(); if (!wasOpen) setShowUnderlinePicker(true); }} className={`flex items-center gap-1 px-2 h-9 rounded-lg text-sm transition-colors ${selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.underline ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`} title="Underline">
                  <span style={{ textDecoration: 'underline' }}>U</span>
                  <svg className={`w-2.5 h-2.5 transition-transform ${showUnderlinePicker ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  {showUnderlinePicker && activeTextField && (
                  <div className="absolute top-full right-0 mt-2 p-3 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-[200] min-w-[160px]" onClick={(e) => e.stopPropagation()}>
                    <div className="text-[10px] text-gray-500 mb-2 uppercase tracking-wide font-medium">Style</div>
                    <div className="flex gap-1.5 mb-3">
                        {[{ name: 'Solid', value: 'solid' }, { name: 'Dotted', value: 'dotted' }, { name: 'Wavy', value: 'wavy' }, { name: 'Highlight', value: 'highlight' }].map(s => (
                        <button type="button" key={s.value} onClick={(e) => { e.stopPropagation(); handleUpdateFormatting(selectedCarouselId, selectedFrameId, activeTextField, 'underlineStyle', s.value); handleUpdateFormatting(selectedCarouselId, selectedFrameId, activeTextField, 'underline', true); }} className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.underlineStyle === s.value ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`} title={s.name}>
                            {s.value === 'solid' && <span style={{ textDecoration: 'underline', textDecorationStyle: 'solid' }}>S</span>}
                            {s.value === 'dotted' && <span style={{ textDecoration: 'underline', textDecorationStyle: 'dotted' }}>D</span>}
                            {s.value === 'wavy' && <span style={{ textDecoration: 'underline', textDecorationStyle: 'wavy' }}>W</span>}
                            {s.value === 'highlight' && <span style={{ backgroundImage: 'linear-gradient(to top, rgba(251,191,36,0.5) 30%, transparent 30%)' }}>H</span>}
                          </button>
                        ))}
                      </div>
                    <div className="text-[10px] text-gray-500 mb-2 uppercase tracking-wide font-medium">Color</div>
                    <div className="flex gap-2">
                        {[{ name: 'Primary', value: designSystem.primary }, { name: 'Secondary', value: designSystem.secondary }, { name: 'Accent', value: designSystem.accent }, { name: 'Light', value: designSystem.neutral3 }, { name: 'White', value: '#ffffff' }].map(c => (
                        <button type="button" key={c.value} onClick={(e) => { e.stopPropagation(); handleUpdateFormatting(selectedCarouselId, selectedFrameId, activeTextField, 'underlineColor', c.value); handleUpdateFormatting(selectedCarouselId, selectedFrameId, activeTextField, 'underline', true); if (!selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.underlineStyle) handleUpdateFormatting(selectedCarouselId, selectedFrameId, activeTextField, 'underlineStyle', 'solid'); }} className={`w-6 h-6 rounded-lg border-2 hover:scale-110 transition-transform ${selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.underlineColor === c.value ? 'border-orange-500' : 'border-gray-600'}`} style={{ backgroundColor: c.value }} title={c.name} />
                        ))}
                      </div>
                    <button type="button" onClick={(e) => { e.stopPropagation(); handleUpdateFormatting(selectedCarouselId, selectedFrameId, activeTextField, 'underline', false); setShowUnderlinePicker(false); }} className="w-full mt-3 px-3 py-2 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-gray-700 transition-colors border border-gray-700">Remove Underline</button>
                    </div>
                  )}
                </div>
              </div>

            {/* Alignment & Spacing Group */}
            <div className={`flex items-center gap-1 px-2 py-1.5 bg-gray-800/60 rounded-xl transition-opacity ${activeTextField ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
              {/* Text Alignment */}
              <div ref={textAlignRef} className="relative">
                <button onClick={() => { if (!activeTextField) return; const wasOpen = showTextAlign; closeAllDropdowns(); if (!wasOpen) setShowTextAlign(true); }} className={`flex items-center gap-1 px-2 h-9 rounded-lg transition-colors ${selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.textAlign && selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.textAlign !== 'left' ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`} title="Text alignment">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h16" /></svg>
                  <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                {showTextAlign && activeTextField && (
                  <div className="absolute top-full left-0 mt-2 p-1.5 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-[200]" onClick={(e) => e.stopPropagation()}>
                    <div className="flex gap-1">
                      {[{ name: 'Left', value: 'left', icon: 'M4 6h16M4 12h10M4 18h16' }, { name: 'Center', value: 'center', icon: 'M4 6h16M7 12h10M4 18h16' }, { name: 'Right', value: 'right', icon: 'M4 6h16M10 12h10M4 18h16' }, { name: 'Justify', value: 'justify', icon: 'M4 6h16M4 12h16M4 18h16' }].map(a => (
                        <button type="button" key={a.value} onClick={(e) => { e.stopPropagation(); handleUpdateFormatting(selectedCarouselId, selectedFrameId, activeTextField, 'textAlign', a.value); setShowTextAlign(false); }} className={`p-2 rounded-lg transition-colors ${selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.textAlign === a.value ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`} title={a.name}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={a.icon} /></svg>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
            </div>
            
              {/* Line Spacing */}
              <div ref={lineSpacingRef} className="relative">
                <button onClick={() => { if (!activeTextField) return; const wasOpen = showLineSpacing; closeAllDropdowns(); if (!wasOpen) setShowLineSpacing(true); }} className={`flex items-center gap-1 px-2 h-9 rounded-lg transition-colors ${selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.lineHeight && selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.lineHeight !== 1.4 ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`} title="Line spacing">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 3v18M12 3l-3 3M12 3l3 3M12 21l-3-3M12 21l3-3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                {showLineSpacing && activeTextField && (
                  <div className="absolute top-full left-0 mt-2 p-1.5 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-[200] min-w-[110px]" onClick={(e) => e.stopPropagation()}>
                    {[{ name: 'Tight', value: 1.1 }, { name: 'Normal', value: 1.4 }, { name: 'Relaxed', value: 1.7 }, { name: 'Loose', value: 2 }].map(s => (
                      <button type="button" key={s.name} onClick={(e) => { e.stopPropagation(); handleUpdateFormatting(selectedCarouselId, selectedFrameId, activeTextField, 'lineHeight', s.value); setShowLineSpacing(false); }} className={`w-full px-3 py-2 rounded-lg text-xs text-left transition-colors ${selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.lineHeight === s.value ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>{s.name}</button>
                    ))}
            </div>
                )}
          </div>

              {/* Letter Spacing */}
              <div ref={letterSpacingRef} className="relative">
                <button onClick={() => { if (!activeTextField) return; const wasOpen = showLetterSpacing; closeAllDropdowns(); if (!wasOpen) setShowLetterSpacing(true); }} className={`flex items-center gap-1 px-2 h-9 rounded-lg transition-colors ${selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.letterSpacing && selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.letterSpacing !== 0 ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`} title="Letter spacing">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M3 12h18M3 12l3-3M3 12l3 3M21 12l-3-3M21 12l-3 3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                {showLetterSpacing && activeTextField && (
                  <div className="absolute top-full left-0 mt-2 p-1.5 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-[200] min-w-[110px]" onClick={(e) => e.stopPropagation()}>
                    {[{ name: 'Tight', value: -0.5 }, { name: 'Normal', value: 0 }, { name: 'Wide', value: 1 }, { name: 'Wider', value: 2 }].map(s => (
                      <button type="button" key={s.name} onClick={(e) => { e.stopPropagation(); handleUpdateFormatting(selectedCarouselId, selectedFrameId, activeTextField, 'letterSpacing', s.value); setShowLetterSpacing(false); }} className={`w-full px-3 py-2 rounded-lg text-xs text-left transition-colors ${selectedFrame?.variants?.[selectedFrame?.currentVariant]?.formatting?.[activeTextField]?.letterSpacing === s.value ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>{s.name}</button>
                    ))}
                  </div>
                )}
        </div>
      </div>
      
            </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <span className="text-gray-400">Row <span className="text-white font-medium">{selectedCarouselId ? carousels.findIndex(c => c.id === selectedCarouselId) + 1 : '-'}</span> / {carousels.length}</span>
            <button onClick={() => { closeAllDropdowns(); setSelectedCarouselId(null); setSelectedFrameId(null); setActiveTextField(null); }} disabled={!selectedCarouselId && !selectedFrameId} className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors ${selectedCarouselId || selectedFrameId ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-800 text-gray-600 cursor-not-allowed'}`}>Deselect Row</button>
          </div>
        </div>
      </div>
      )}
      
      {/* Main Content - Scrollable Canvas Area */}
      <div className="overflow-y-auto overflow-x-hidden" style={{ marginLeft: totalOffset, marginTop: activeTab?.hasContent ? 120 : 56, height: activeTab?.hasContent ? 'calc(100vh - 120px)' : 'calc(100vh - 56px)', width: `calc(100vw - ${totalOffset}px)`, transition: 'margin-left 0.3s ease-out, width 0.3s ease-out' }}>
      {/* Content Area - Either New Project View or Canvas */}
      {activeTab && !activeTab.hasContent ? (
        <NewProjectView onCreateProject={handleCreateProject} />
      ) : (
        <>
          {/* Canvas workspace */}
          <div className="p-6 pb-96" onClick={() => { closeAllDropdowns(); setSelectedCarouselId(null); setSelectedFrameId(null); setActiveTextField(null); }}>
            <div style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left', width: `${100 / (zoom / 100)}%`, transition: 'transform 150ms ease-out' }}>
            
            {/* Project Header */}
            <ProjectHeader 
              projectName={activeTab?.name || 'Untitled Project'} 
              onUpdateName={handleUpdateProjectName}
            />
            
            {carousels.map((carousel, index) => (
              <React.Fragment key={carousel.id}>
                <CarouselRow
                  carousel={carousel}
                  designSystem={designSystem}
                  isSelected={selectedCarouselId === carousel.id}
                  hasAnySelection={selectedCarouselId !== null}
                  selectedFrameId={selectedCarouselId === carousel.id ? selectedFrameId : null}
                  onSelect={handleSelectCarousel}
                  onSelectFrame={handleSelectFrame}
                  onAddFrame={handleAddFrame}
                  onRemoveFrame={handleRemoveFrame}
                  onRemoveRow={handleRemoveRow}
                  onReorderFrames={handleReorderFrames}
                  onUpdateText={handleUpdateText}
                  activeTextField={activeTextField}
                  onActivateTextField={setActiveTextField}
                />
                {/* Add Row Button - only after last row */}
                {index === carousels.length - 1 && (
                  <div 
                    className="flex items-center px-4 -mt-4"
                    style={{ marginLeft: '10px' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleAddRow(index); }}
                      className="flex items-center gap-2 px-4 py-1.5 rounded-full border-2 border-dashed border-gray-600 text-gray-500 hover:border-orange-500 hover:text-orange-400 hover:bg-orange-500/10 transition-all duration-200"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <span className="text-xs font-medium">Add row</span>
                    </button>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
          </div>
        </>
        )}
      </div>
        </>
      )}
      
    </div>
  );
}
