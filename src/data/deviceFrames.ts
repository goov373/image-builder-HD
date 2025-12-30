/**
 * Device Frame Specifications
 * Pre-configured device mockups for previewing content
 */

export interface DeviceFrame {
  id: string;
  name: string;
  shortName: string;
  type: 'phone' | 'tablet';
  screen: {
    width: number;
    height: number;
  };
  bezel: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  borderRadius: number;
  notchHeight?: number;
  homeIndicator?: boolean;
}

export const deviceFrames: DeviceFrame[] = [
  {
    id: 'none',
    name: 'No Device Frame',
    shortName: 'None',
    type: 'phone',
    screen: { width: 0, height: 0 },
    bezel: { top: 0, bottom: 0, left: 0, right: 0 },
    borderRadius: 0,
  },
  {
    id: 'iphone-15-pro',
    name: 'iPhone 15 Pro',
    shortName: 'iPhone 15',
    type: 'phone',
    screen: { width: 393, height: 852 },
    bezel: { top: 12, bottom: 12, left: 12, right: 12 },
    borderRadius: 55,
    notchHeight: 35,
    homeIndicator: true,
  },
  {
    id: 'iphone-se',
    name: 'iPhone SE',
    shortName: 'iPhone SE',
    type: 'phone',
    screen: { width: 375, height: 667 },
    bezel: { top: 65, bottom: 65, left: 12, right: 12 },
    borderRadius: 40,
    homeIndicator: false,
  },
  {
    id: 'pixel-8',
    name: 'Google Pixel 8',
    shortName: 'Pixel 8',
    type: 'phone',
    screen: { width: 412, height: 915 },
    bezel: { top: 12, bottom: 12, left: 12, right: 12 },
    borderRadius: 45,
    notchHeight: 25,
    homeIndicator: true,
  },
  {
    id: 'samsung-s24',
    name: 'Samsung Galaxy S24',
    shortName: 'Galaxy S24',
    type: 'phone',
    screen: { width: 412, height: 915 },
    bezel: { top: 10, bottom: 10, left: 10, right: 10 },
    borderRadius: 40,
    notchHeight: 20,
    homeIndicator: false,
  },
];

/**
 * Get device by ID
 */
export function getDeviceById(id: string): DeviceFrame | undefined {
  return deviceFrames.find(d => d.id === id);
}

/**
 * Get devices by type
 */
export function getDevicesByType(type: 'phone' | 'tablet'): DeviceFrame[] {
  return deviceFrames.filter(d => d.type === type);
}

export default deviceFrames;

