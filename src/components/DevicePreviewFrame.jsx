/**
 * Device Preview Frame Component
 * Wraps content in a realistic device mockup frame
 */
const DevicePreviewFrame = ({ device, children, scale = 1 }) => {
  // No frame selected
  if (!device || device.id === 'none') {
    return children;
  }

  const {
    screen,
    bezel,
    borderRadius,
    notchHeight,
    homeIndicator,
  } = device;

  // Calculate total dimensions
  const totalWidth = screen.width + bezel.left + bezel.right;
  const totalHeight = screen.height + bezel.top + bezel.bottom;

  return (
    <div 
      className="relative flex items-center justify-center"
      style={{ 
        transform: `scale(${scale})`,
        transformOrigin: 'center center',
      }}
    >
      {/* Device Frame */}
      <div
        className="relative bg-gray-900 shadow-2xl"
        style={{
          width: totalWidth,
          height: totalHeight,
          borderRadius: borderRadius,
          padding: `${bezel.top}px ${bezel.right}px ${bezel.bottom}px ${bezel.left}px`,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
        }}
      >
        {/* Device Buttons - Left Side (Volume) */}
        <div 
          className="absolute bg-gray-700 rounded-l"
          style={{
            left: -3,
            top: bezel.top + 80,
            width: 3,
            height: 30,
          }}
        />
        <div 
          className="absolute bg-gray-700 rounded-l"
          style={{
            left: -3,
            top: bezel.top + 120,
            width: 3,
            height: 30,
          }}
        />
        
        {/* Device Buttons - Right Side (Power) */}
        <div 
          className="absolute bg-gray-700 rounded-r"
          style={{
            right: -3,
            top: bezel.top + 100,
            width: 3,
            height: 40,
          }}
        />

        {/* Screen Area */}
        <div
          className="relative overflow-hidden bg-black"
          style={{
            width: screen.width,
            height: screen.height,
            borderRadius: Math.max(0, borderRadius - 10),
          }}
        >
          {/* Dynamic Island / Notch */}
          {notchHeight && (
            <div 
              className="absolute top-0 left-1/2 -translate-x-1/2 bg-black z-10 flex items-center justify-center"
              style={{
                width: notchHeight > 30 ? 120 : 90,
                height: notchHeight,
                borderRadius: `0 0 ${notchHeight / 2}px ${notchHeight / 2}px`,
              }}
            >
              {/* Camera dot */}
              <div 
                className="w-2.5 h-2.5 rounded-full bg-gray-800 border border-gray-700"
                style={{ boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.5)' }}
              />
            </div>
          )}

          {/* Content Area */}
          <div className="w-full h-full overflow-hidden">
            {children}
          </div>

          {/* Home Indicator */}
          {homeIndicator && (
            <div 
              className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white/80 rounded-full z-10"
              style={{
                width: 134,
                height: 5,
              }}
            />
          )}
        </div>
      </div>

      {/* Device Label */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
        <span className="text-xs text-gray-500 font-medium">{device.name}</span>
      </div>
    </div>
  );
};

export default DevicePreviewFrame;

