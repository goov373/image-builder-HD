/**
 * Decorator Components
 * Visual embellishments for product mockup images
 */

export { default as DataChip } from './DataChip';
export { default as StatCard } from './StatCard';
export { default as Tooltip } from './Tooltip';
export { default as Sparkline } from './Sparkline';
export { default as AvatarGroup } from './AvatarGroup';
export { default as ProgressRing } from './ProgressRing';

// Decorator type to component mapping
export const DECORATOR_COMPONENTS = {
  chip: 'DataChip',
  'stat-card': 'StatCard',
  tooltip: 'Tooltip',
  sparkline: 'Sparkline',
  'avatar-group': 'AvatarGroup',
  progress: 'ProgressRing',
};
