/**
 * Preset Tag Definitions
 * 
 * Audience tags represent multifamily industry personas/roles.
 * Feature tags represent HelloData products, topics, and content categories.
 */

export interface TagDefinition {
  id: string;
  label: string;
  description?: string;
  color?: string;
}

// ===== AUDIENCE / PERSONA TAGS =====
// Target audiences in the multifamily real estate industry

export const AUDIENCE_TAGS: TagDefinition[] = [
  {
    id: 'investor',
    label: 'Investor / Acquisitions',
    description: 'Multifamily investors, acquisition teams, and deal seekers',
  },
  {
    id: 'property-manager',
    label: 'Property Manager',
    description: 'On-site managers, regional managers, and operations teams',
  },
  {
    id: 'developer',
    label: 'Developer / Builder',
    description: 'Multifamily developers and construction professionals',
  },
  {
    id: 'asset-manager',
    label: 'Asset Manager',
    description: 'Portfolio and asset management professionals',
  },
  {
    id: 'analyst',
    label: 'Analyst / Research',
    description: 'Market analysts, research teams, and data professionals',
  },
  {
    id: 'broker',
    label: 'Broker / Agent',
    description: 'Commercial real estate brokers and leasing agents',
  },
  {
    id: 'lender',
    label: 'Lender / Underwriter',
    description: 'Banks, lenders, and underwriting professionals',
  },
  {
    id: 'executive',
    label: 'Executive / C-Suite',
    description: 'CEOs, CFOs, and senior leadership',
  },
];

// ===== FEATURE / TOPIC TAGS =====
// HelloData products, features, and content categories

export const FEATURE_TAGS: TagDefinition[] = [
  {
    id: 'rent-forecast',
    label: 'Rent Forecast',
    description: 'Forward-looking rent projections and predictions',
  },
  {
    id: 'market-survey',
    label: 'Market Survey',
    description: 'Automated comp surveys and market intelligence',
  },
  {
    id: 'comp-analysis',
    label: 'Comp Analysis',
    description: 'Rental comparables and competitive analysis',
  },
  {
    id: 'deal-screening',
    label: 'Deal Screening',
    description: 'Quick property analysis and deal evaluation',
  },
  {
    id: 'portfolio-analytics',
    label: 'Portfolio Analytics',
    description: 'Multi-property performance tracking',
  },
  {
    id: 'expense-benchmarking',
    label: 'Expense Benchmarking',
    description: 'Operating expense comparisons and analysis',
  },
  {
    id: 'about-us',
    label: 'About Us / Brand',
    description: 'Company information and brand messaging',
  },
  {
    id: 'product-launch',
    label: 'Product Launch',
    description: 'New feature and product announcements',
  },
  {
    id: 'case-study',
    label: 'Case Study',
    description: 'Customer success stories and examples',
  },
  {
    id: 'testimonial',
    label: 'Testimonial',
    description: 'Customer quotes and social proof',
  },
  {
    id: 'thought-leadership',
    label: 'Thought Leadership',
    description: 'Industry insights and expert perspectives',
  },
  {
    id: 'how-to',
    label: 'How-To / Tutorial',
    description: 'Educational content and guides',
  },
];

// ===== HELPER FUNCTIONS =====

/**
 * Get a tag definition by ID
 */
export const getAudienceTag = (id: string): TagDefinition | undefined => {
  return AUDIENCE_TAGS.find((tag) => tag.id === id);
};

export const getFeatureTag = (id: string): TagDefinition | undefined => {
  return FEATURE_TAGS.find((tag) => tag.id === id);
};

/**
 * Get tag labels for an array of IDs
 */
export const getAudienceLabels = (ids: string[]): string[] => {
  return ids.map((id) => getAudienceTag(id)?.label || id).filter(Boolean);
};

export const getFeatureLabels = (ids: string[]): string[] => {
  return ids.map((id) => getFeatureTag(id)?.label || id).filter(Boolean);
};

export default {
  AUDIENCE_TAGS,
  FEATURE_TAGS,
  getAudienceTag,
  getFeatureTag,
  getAudienceLabels,
  getFeatureLabels,
};

