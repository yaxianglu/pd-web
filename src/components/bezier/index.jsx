import React from 'react';

export default function Bezier(props) {
  const {
    width = 210,
    height = 240,
    color = "#C1DF1A",
    strokeWidth = 10,
    direction,
    circleColor = "#76Aaff",
    circleRadius = 12,
    circlePosition,
  } = props;
  if (direction === 'left') {
    return (
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none">
        {circlePosition === 'top' && <circle cx={width / 2} cy="20" r={circleRadius} fill={circleColor}/>}
        <path
          d={`M${width / 2} 20 Q0 ${height / 2} ${width / 2} ${height - circleRadius}`}
          stroke={color}
          stroke-width={strokeWidth}
          fill="none"
          stroke-linecap="round"
        />
        {circlePosition === 'bottom' && <circle cx={width / 2} cy={height - circleRadius} r={circleRadius} fill={circleColor}/>}
      </svg>
    )
  }
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none">
        {circlePosition === 'top' && <circle cx={width / 2} cy="20" r={circleRadius} fill={circleColor}/>}
        <path
          d={`M${width / 2} 20 Q${width} ${height / 2} ${width / 2} ${height - circleRadius}`}
          stroke={color}
          stroke-width={strokeWidth}
          fill="none"
          stroke-linecap="round"
        />
        {circlePosition === 'bottom' && <circle cx={width / 2} cy={height - circleRadius} r={circleRadius} fill={circleColor}/>}
    </svg>
  );
}