/**
 * Sparkline Decorator
 * Mini chart visualization
 */
const Sparkline = ({
  data = [20, 35, 28, 45, 32, 55, 48, 60, 52, 68],
  type = 'line', // line, bar, area
  color = '#10b981',
  width = 80,
  height = 32,
  showDot = true,
  style = {},
  isSelected = false,
  onClick,
}) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  // Normalize points to SVG coordinates
  const points = data.map((value, i) => ({
    x: (i / (data.length - 1)) * width,
    y: height - ((value - min) / range) * height * 0.8 - height * 0.1,
  }));

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  const areaD = `${pathD} L ${width} ${height} L 0 ${height} Z`;

  return (
    <div
      onClick={onClick}
      className={`
        ${isSelected ? 'ring-2 ring-gray-400 rounded' : ''}
        cursor-pointer transition-all duration-150 hover:scale-105
      `}
      style={style}
    >
      <svg width={width} height={height} className="overflow-visible">
        {type === 'area' && <path d={areaD} fill={`${color}30`} />}

        {type === 'bar' ? (
          data.map((value, i) => {
            const barHeight = ((value - min) / range) * height * 0.8;
            const barWidth = width / data.length - 2;
            return (
              <rect
                key={i}
                x={(i / data.length) * width + 1}
                y={height - barHeight - height * 0.1}
                width={barWidth}
                height={barHeight}
                fill={color}
                rx={1}
              />
            );
          })
        ) : (
          <path d={pathD} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        )}

        {/* End dot */}
        {showDot && type !== 'bar' && (
          <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r={3} fill={color} />
        )}
      </svg>
    </div>
  );
};

export default Sparkline;
