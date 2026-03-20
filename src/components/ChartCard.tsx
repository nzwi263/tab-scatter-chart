import React, { type ReactNode } from 'react';
import { Badge, type BadgeType } from './Badge';

export interface ChartCardProps {
  /** Card title displayed in the header */
  title?: string;
  /** Description text displayed below the title */
  description?: string;
  /** Badge type determining the visual style */
  badgeType?: BadgeType;
  /** Custom badge text (optional, defaults based on badgeType) */
  badgeText?: string;
  /** Width of the card in pixels */
  width?: number;
  /** Height of the chart container in pixels */
  height?: number;
  /** Optional children to render inside the chart container */
  children?: ReactNode;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title = 'Chart Title',
  description = 'Chart description goes here',
  badgeType = 'live',
  badgeText,
  width = 1008,
  height = 400,
  children,
}) => {
  return (
    <div className="relative p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
      {/* Header Section */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h2
            style={{
              color: '#18181b',
              fontSize: '24px',
              fontFamily: 'Geist, sans-serif',
              fontWeight: 600,
              lineHeight: '32px',
              letterSpacing: '-0.02em',
              margin: 0,
            }}
          >
            {title}
          </h2>
          <Badge type={badgeType} text={badgeText} />
        </div>
        <p
          style={{
            color: '#404040',
            fontSize: '16px',
            fontFamily: 'Geist, sans-serif',
            fontWeight: 400,
            lineHeight: '24px',
            wordWrap: 'break-word',
            marginTop: '4px',
            marginBottom: 0,
          }}
        >
          {description}
        </p>
      </div>

      {/* Chart Container */}
      <div
        className={`rounded-lg flex items-center justify-center${!children ? ' border border-gray-200 bg-gray-50' : ''}`}
        style={{
          width: '100%',
          height: `${height}px`,
        }}
      >
        {children ? (
          children
        ) : (
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-2">Chart content will be rendered here</p>
            <p className="text-gray-300 text-xs">Dimensions: {width}px × {height}px</p>
          </div>
        )}
      </div>
    </div>
  );
};
