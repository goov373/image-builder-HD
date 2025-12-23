import type { SingleImage, MockupTemplate } from '../types/singleImage';

/**
 * Mockup Template Definitions
 * Pre-configured arrangements for different dashboard presentations
 */
export const MOCKUP_TEMPLATES: Record<MockupTemplate, {
  name: string;
  description: string;
  defaultTransform: { x: number; y: number; width: number; height: number; rotation: number };
  cropPreset?: { x: number; y: number; width: number; height: number };
  perspective?: { rotateX: number; rotateY: number };
}> = {
  'dashboard-full': {
    name: 'Full Dashboard',
    description: 'Complete dashboard view with slight shadow lift',
    defaultTransform: { x: 100, y: 80, width: 1000, height: 600, rotation: 0 },
  },
  'dashboard-cropped-tl': {
    name: 'Top-Left Crop',
    description: 'Cropped to show top-left corner, great for nav/sidebar features',
    defaultTransform: { x: -150, y: -100, width: 1200, height: 700, rotation: 0 },
    cropPreset: { x: 0, y: 0, width: 0.6, height: 0.7 },
  },
  'dashboard-cropped-tr': {
    name: 'Top-Right Crop',
    description: 'Cropped to show top-right corner, ideal for header features',
    defaultTransform: { x: 250, y: -100, width: 1200, height: 700, rotation: 0 },
    cropPreset: { x: 0.4, y: 0, width: 0.6, height: 0.7 },
  },
  'dashboard-cropped-bl': {
    name: 'Bottom-Left Crop',
    description: 'Shows bottom-left, good for data tables and lists',
    defaultTransform: { x: -150, y: 150, width: 1200, height: 700, rotation: 0 },
    cropPreset: { x: 0, y: 0.3, width: 0.6, height: 0.7 },
  },
  'dashboard-cropped-br': {
    name: 'Bottom-Right Crop',
    description: 'Shows bottom-right corner content',
    defaultTransform: { x: 250, y: 150, width: 1200, height: 700, rotation: 0 },
    cropPreset: { x: 0.4, y: 0.3, width: 0.6, height: 0.7 },
  },
  'modal-centered': {
    name: 'Centered Modal',
    description: 'Floating modal dialog in center with dramatic shadow',
    defaultTransform: { x: 300, y: 150, width: 600, height: 400, rotation: 0 },
  },
  'modal-offset': {
    name: 'Offset Modal',
    description: 'Modal positioned off-center for dynamic composition',
    defaultTransform: { x: 450, y: 100, width: 550, height: 380, rotation: 2 },
  },
  'card-stack': {
    name: 'Card Stack',
    description: 'Overlapping cards for feature showcases',
    defaultTransform: { x: 200, y: 120, width: 400, height: 280, rotation: -3 },
  },
  'sidebar-peek': {
    name: 'Sidebar Peek',
    description: 'Partial sidebar view sliding in from edge',
    defaultTransform: { x: -80, y: 50, width: 320, height: 500, rotation: 0 },
  },
  'mobile-float': {
    name: 'Mobile Float',
    description: 'Mobile device mockup floating over content',
    defaultTransform: { x: 500, y: 80, width: 280, height: 560, rotation: 5 },
  },
  'browser-window': {
    name: 'Browser Window',
    description: 'Full browser chrome with address bar',
    defaultTransform: { x: 60, y: 60, width: 1080, height: 680, rotation: 0 },
  },
  'feature-callout': {
    name: 'Feature Callout',
    description: 'Small focused crop highlighting a specific feature',
    defaultTransform: { x: 350, y: 200, width: 500, height: 300, rotation: 0 },
  },
};

/**
 * Decorator Presets
 */
export const DECORATOR_PRESETS = {
  chip: [
    { content: '+23%', variant: 'success', icon: 'trending-up' },
    { content: 'Live', variant: 'danger', icon: 'radio' },
    { content: 'New', variant: 'primary', icon: 'sparkles' },
    { content: 'Beta', variant: 'warning', icon: 'flask' },
    { content: 'Pro', variant: 'secondary', icon: 'crown' },
  ],
  tag: [
    { content: 'Analytics', variant: 'primary' },
    { content: 'Dashboard', variant: 'neutral' },
    { content: 'Reports', variant: 'secondary' },
    { content: 'Settings', variant: 'neutral' },
  ],
  badge: [
    { content: '3', variant: 'danger' },
    { content: '12', variant: 'primary' },
    { content: '99+', variant: 'warning' },
  ],
  stat: [
    { content: '$12.4K', label: 'Revenue', trend: '+12%' },
    { content: '2,847', label: 'Users', trend: '+8%' },
    { content: '94.2%', label: 'Uptime', trend: '+0.3%' },
  ],
};

/**
 * Initial Single Image Data
 */
export const initialSingleImages: SingleImage[] = [
  {
    id: 1,
    name: "Dashboard Hero",
    subtitle: "Landing Page Feature",
    canvasSize: 'hero',
    canvasWidth: 1200,
    canvasHeight: 630,
    background: {
      type: 'gradient',
      gradient: {
        type: 'linear',
        from: '#18191A',
        to: '#2d2e30',
        angle: 135,
      },
    },
    layers: [
      {
        id: 1,
        name: 'Main Dashboard',
        type: 'mockup',
        template: 'dashboard-cropped-tr',
        transform: {
          x: 150,
          y: -50,
          width: 1100,
          height: 650,
          rotation: 0,
          scaleX: 1,
          scaleY: 1,
        },
        style: {
          cornerRadius: 16,
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.1)',
          borderStyle: 'solid',
          shadowEnabled: true,
          shadowX: 0,
          shadowY: 32,
          shadowBlur: 64,
          shadowSpread: -16,
          shadowColor: 'rgba(0,0,0,0.4)',
          innerShadowEnabled: false,
          innerShadowBlur: 0,
          innerShadowColor: 'rgba(0,0,0,0.1)',
          glowEnabled: true,
          glowColor: '#6466e9',
          glowBlur: 60,
        },
        opacity: 1,
        visible: true,
        locked: false,
        zIndex: 1,
        placeholderType: 'analytics',
      },
      {
        id: 2,
        name: 'Growth Chip',
        type: 'decorator',
        decoratorType: 'chip',
        content: '+23%',
        variant: 'success',
        size: 'md',
        transform: {
          x: 80,
          y: 450,
          width: 80,
          height: 32,
          rotation: -5,
          scaleX: 1,
          scaleY: 1,
        },
        decoratorStyle: {
          backgroundColor: '#059669',
          textColor: '#ffffff',
          borderRadius: 16,
          hasShadow: true,
          hasGlow: false,
        },
        opacity: 1,
        visible: true,
        locked: false,
        zIndex: 10,
      },
      {
        id: 3,
        name: 'Live Badge',
        type: 'decorator',
        decoratorType: 'chip',
        content: 'Live',
        variant: 'danger',
        size: 'sm',
        icon: 'radio',
        transform: {
          x: 1050,
          y: 80,
          width: 60,
          height: 24,
          rotation: 0,
          scaleX: 1,
          scaleY: 1,
        },
        decoratorStyle: {
          backgroundColor: '#dc2626',
          textColor: '#ffffff',
          borderRadius: 12,
          hasShadow: true,
          hasGlow: true,
          glowColor: '#dc2626',
        },
        opacity: 1,
        visible: true,
        locked: false,
        zIndex: 11,
      },
    ],
    createdAt: '2024-12-23',
    updatedAt: '2024-12-23',
  },
];

/**
 * Create empty single image
 */
export function createEmptySingleImage(id: number, name: string): SingleImage {
  return {
    id,
    name,
    subtitle: 'Product Mockup',
    canvasSize: 'hero',
    canvasWidth: 1200,
    canvasHeight: 630,
    background: {
      type: 'gradient',
      gradient: {
        type: 'linear',
        from: '#18191A',
        to: '#2d2e30',
        angle: 135,
      },
    },
    layers: [],
    createdAt: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0],
  };
}

