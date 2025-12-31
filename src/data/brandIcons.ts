/**
 * HelloData Brand Icons
 * 
 * Icon style based on brand guidelines:
 * - Outlined, 2px stroke, rounded corners
 * - Modern, minimal, functional
 * - Focused on PropTech, multifamily real estate, and AI analytics
 */

export interface BrandIcon {
  id: string;
  name: string;
  category: 'analytics' | 'property' | 'ai' | 'business';
  path: string; // SVG path data
  description: string;
}

export const brandIcons: BrandIcon[] = [
  // Analytics & Data Icons
  {
    id: 'icon-bar-chart',
    name: 'Analytics',
    category: 'analytics',
    path: 'M9 19V13M5 19V17M13 19V9M17 19V5',
    description: 'Bar chart for market analytics'
  },
  {
    id: 'icon-trend-up',
    name: 'Rent Trend',
    category: 'analytics',
    path: 'M2 17L8 11L12 15L22 5M22 5H16M22 5V11',
    description: 'Upward trend for rent growth'
  },
  {
    id: 'icon-pie-chart',
    name: 'Market Share',
    category: 'analytics',
    path: 'M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3V12H21Z M21 12C21 9.79086 20.2 7.76 18.9 6.15L12 12H21Z',
    description: 'Pie chart for portfolio breakdown'
  },
  {
    id: 'icon-speedometer',
    name: 'Score',
    category: 'analytics',
    path: 'M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12M12 12L16 8M12 12V8',
    description: 'Similarity score gauge'
  },
  
  // Property & Real Estate Icons
  {
    id: 'icon-building',
    name: 'Property',
    category: 'property',
    path: 'M3 21V8L12 3L21 8V21M7 21V14H11V21M13 21V14H17V21M7 11H9M15 11H17M7 8H9M15 8H17',
    description: 'Multifamily building'
  },
  {
    id: 'icon-map-pin',
    name: 'Location',
    category: 'property',
    path: 'M12 21C12 21 19 14.5 19 10C19 6.13401 15.866 3 12 3C8.13401 3 5 6.13401 5 10C5 14.5 12 21 12 21ZM12 12C13.1046 12 14 11.1046 14 10C14 8.89543 13.1046 8 12 8C10.8954 8 10 8.89543 10 10C10 11.1046 10.8954 12 12 12Z',
    description: 'Property location marker'
  },
  {
    id: 'icon-compass',
    name: 'Submarket',
    category: 'property',
    path: 'M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21ZM14.5 9.5L10 10L9.5 14.5L14 14L14.5 9.5Z',
    description: 'Submarket compass'
  },
  {
    id: 'icon-layers',
    name: 'Units',
    category: 'property',
    path: 'M12 2L2 7L12 12L22 7L12 2ZM2 17L12 22L22 17M2 12L12 17L22 12',
    description: 'Unit mix layers'
  },

  // AI & Technology Icons
  {
    id: 'icon-brain',
    name: 'AI',
    category: 'ai',
    path: 'M12 4C8.5 4 6 6.5 6 9.5C6 11.5 7 13 8.5 14L8 17C8 18.1046 8.89543 19 10 19H14C15.1046 19 16 18.1046 16 17L15.5 14C17 13 18 11.5 18 9.5C18 6.5 15.5 4 12 4ZM10 21H14M9 9H10.5M13.5 9H15M9 12H15',
    description: 'AI-powered insights'
  },
  {
    id: 'icon-automation',
    name: 'Automate',
    category: 'ai',
    path: 'M12 14.5C13.3807 14.5 14.5 13.3807 14.5 12C14.5 10.6193 13.3807 9.5 12 9.5C10.6193 9.5 9.5 10.6193 9.5 12C9.5 13.3807 10.6193 14.5 12 14.5ZM12 14.5V17M12 9.5V7M14.5 12H17M9.5 12H7M19.0711 4.92893L16.9497 7.05025M7.05025 16.9497L4.92893 19.0711M4.92893 4.92893L7.05025 7.05025M16.9497 16.9497L19.0711 19.0711',
    description: 'Automated market surveys'
  },
  {
    id: 'icon-network',
    name: 'Network',
    category: 'ai',
    path: 'M12 4V8M12 16V20M20 12H16M8 12H4M17.6569 6.34315L14.8284 9.17157M9.17157 14.8284L6.34315 17.6569M17.6569 17.6569L14.8284 14.8284M9.17157 9.17157L6.34315 6.34315M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z',
    description: 'Property data network'
  },
  {
    id: 'icon-api',
    name: 'API',
    category: 'ai',
    path: 'M8 9H6C4.89543 9 4 9.89543 4 11V13C4 14.1046 4.89543 15 6 15H8M16 9H18C19.1046 9 20 9.89543 20 11V13C20 14.1046 19.1046 15 18 15H16M8 9V15M16 9V15M8 12H16M4 6H20M4 18H20',
    description: 'PropTech API connections'
  },

  // Business & Finance Icons
  {
    id: 'icon-dollar',
    name: 'Revenue',
    category: 'business',
    path: 'M12 3V21M17 8C17 6.34315 14.7614 5 12 5C9.23858 5 7 6.34315 7 8C7 9.65685 9.23858 11 12 11C14.7614 11 17 12.3431 17 14C17 15.6569 14.7614 17 12 17C9.23858 17 7 15.6569 7 14',
    description: 'NOI and revenue'
  },
  {
    id: 'icon-briefcase',
    name: 'Investor',
    category: 'business',
    path: 'M8 7V5C8 3.89543 8.89543 3 10 3H14C15.1046 3 16 3.89543 16 5V7M4 8C4 7.44772 4.44772 7 5 7H19C19.5523 7 20 7.44772 20 8V19C20 19.5523 19.5523 20 19 20H5C4.44772 20 4 19.5523 4 19V8ZM10 12H14',
    description: 'Investor briefcase'
  },
  {
    id: 'icon-handshake',
    name: 'Broker',
    category: 'business',
    path: 'M7 11L3 15L7 19L11 15M17 11L21 15L17 19L13 15M11 15H13M8 7H16L18 11H6L8 7Z',
    description: 'Broker deal handshake'
  },
  {
    id: 'icon-users',
    name: 'Team',
    category: 'business',
    path: 'M17 21V19C17 16.7909 15.2091 15 13 15H5C2.79086 15 1 16.7909 1 19V21M23 21V19C23 17.1362 21.7252 15.5701 20 15.126M16 3.12602C17.7252 3.57006 19 5.13623 19 7C19 8.86377 17.7252 10.4299 16 10.874M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z',
    description: 'Property management team'
  },
];

// Get all icons
export const getAllBrandIcons = (): BrandIcon[] => brandIcons;

// Get icons by category
export const getBrandIconsByCategory = (category: BrandIcon['category']): BrandIcon[] => 
  brandIcons.filter(icon => icon.category === category);

// Icon categories for display
export const iconCategories = [
  { id: 'analytics', label: 'Analytics', color: '#6466e9' },
  { id: 'property', label: 'Property', color: '#818cf8' },
  { id: 'ai', label: 'AI & Tech', color: '#F97316' },
  { id: 'business', label: 'Business', color: '#6B7280' },
] as const;

export default brandIcons;

