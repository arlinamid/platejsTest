'use client';

import React from 'react';
import { cn } from '@udecode/cn';

interface RulerProps {
  className?: string;
  width?: number;
  unit?: 'px' | 'in' | 'cm';
  showMargins?: boolean;
  marginLeft?: number;
  marginRight?: number;
}

export function Ruler({ 
  className, 
  width = 800, 
  unit = 'px',
  showMargins = true,
  marginLeft = 64,
  marginRight = 64
}: RulerProps) {
  // Adjust scale for better visibility
  const rulerScale = unit === 'px' ? 100 : unit === 'in' ? 96 : 37.8; // pixels per unit
  const minorScale = rulerScale / 10; // For minor tick marks
  const totalMarks = Math.ceil(width / rulerScale);
  const totalMinorMarks = Math.ceil(width / minorScale);

  const formatLabel = (index: number) => {
    if (unit === 'px') return (index * rulerScale).toString();
    if (unit === 'in') return index.toString();
    if (unit === 'cm') return index.toString();
    return index.toString();
  };

  return (
    <div className={cn('relative bg-gray-100 border-b border-gray-300 select-none overflow-hidden', className)}>
      <div 
        className="relative h-8 bg-gradient-to-b from-gray-50 to-gray-100"
        style={{ width: Math.max(width, 400) }}
      >
        {/* Margin indicators */}
        {showMargins && (
          <>
            <div 
              className="absolute top-0 bottom-0 bg-blue-200 opacity-30"
              style={{ left: 0, width: marginLeft }}
            />
            <div 
              className="absolute top-0 bottom-0 bg-blue-200 opacity-30"
              style={{ right: 0, width: marginRight }}
            />
          </>
        )}

        {/* Minor tick marks */}
        {Array.from({ length: totalMinorMarks + 1 }, (_, index) => (
          <div
            key={`minor-${index}`}
            className="absolute top-4 w-px bg-gray-400"
            style={{ 
              left: index * minorScale,
              height: '8px'
            }}
          />
        ))}

        {/* Major ruler marks */}
        {Array.from({ length: totalMarks + 1 }, (_, index) => (
          <div key={`major-${index}`} className="absolute top-0 bottom-0">
            <div 
              className="absolute top-0 w-px bg-gray-700"
              style={{ 
                left: index * rulerScale,
                height: '100%'
              }}
            />
            <span 
              className="absolute top-1 text-xs text-gray-800 transform -translate-x-1/2 font-mono"
              style={{ left: index * rulerScale }}
            >
              {formatLabel(index)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
} 