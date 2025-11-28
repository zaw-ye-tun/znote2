export default function Avatar({ level, size = 'md' }) {
  const getShape = (level) => {
    if (level <= 4) return 'dot';
    if (level <= 9) return 'circle';
    if (level <= 14) return 'triangle';
    if (level <= 19) return 'square';
    return 'hexagon';
  };

  const getColor = (level) => {
    if (level <= 4) return '#9ca3af'; // gray
    if (level <= 9) return '#3b82f6'; // blue
    if (level <= 14) return '#8b5cf6'; // purple
    if (level <= 19) return '#f59e0b'; // amber
    return '#ec4899'; // pink
  };

  const sizes = {
    sm: 32,
    md: 48,
    lg: 64,
  };

  const shapeSize = sizes[size];
  const shape = getShape(level);
  const color = getColor(level);

  const renderShape = () => {
    switch (shape) {
      case 'dot':
        return (
          <circle cx={shapeSize / 2} cy={shapeSize / 2} r={shapeSize / 6} fill={color} />
        );
      case 'circle':
        return (
          <circle cx={shapeSize / 2} cy={shapeSize / 2} r={shapeSize / 3} fill={color} />
        );
      case 'triangle':
        return (
          <polygon
            points={`${shapeSize / 2},${shapeSize / 4} ${(shapeSize * 3) / 4},${(shapeSize * 3) / 4} ${shapeSize / 4},${(shapeSize * 3) / 4}`}
            fill={color}
          />
        );
      case 'square':
        return (
          <rect
            x={shapeSize / 4}
            y={shapeSize / 4}
            width={shapeSize / 2}
            height={shapeSize / 2}
            fill={color}
          />
        );
      case 'hexagon':
        const hexPoints = [
          [shapeSize / 2, shapeSize / 5],
          [(shapeSize * 4) / 5, shapeSize / 3],
          [(shapeSize * 4) / 5, (shapeSize * 2) / 3],
          [shapeSize / 2, (shapeSize * 4) / 5],
          [shapeSize / 5, (shapeSize * 2) / 3],
          [shapeSize / 5, shapeSize / 3],
        ];
        return (
          <polygon points={hexPoints.map((p) => p.join(',')).join(' ')} fill={color} />
        );
      default:
        return null;
    }
  };

  return (
    <svg
      width={shapeSize}
      height={shapeSize}
      viewBox={`0 0 ${shapeSize} ${shapeSize}`}
      className="drop-shadow-sm"
    >
      {renderShape()}
    </svg>
  );
}
