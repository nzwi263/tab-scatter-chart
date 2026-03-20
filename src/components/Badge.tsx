import React from 'react';

export type BadgeType = 'live' | 'top' | 'bottom';

interface BadgeProps {
  type?: BadgeType;
  text?: string;
}

const getStyles = (badgeType: BadgeType) => {
  switch (badgeType) {
    case 'top':
      return {
        backgroundColor: '#10B981',
        color: '#FAFAFA',
        fontSize: '14px',
        fontWeight: 500,
        lineHeight: '20px',
        borderColor: '#10B981',
      };
    case 'bottom':
      return {
        backgroundColor: '#F5F5F5',
        color: '#171717',
        fontSize: '14px',
        fontWeight: 500,
        lineHeight: '20px',
        borderColor: '#E5E5E5',
      };
    case 'live':
    default:
      return {
        backgroundColor: '#F5F5F5',
        color: '#171717',
        fontSize: '14px',
        fontWeight: 500,
        lineHeight: '20px',
        borderColor: '#E5E5E5',
      };
  }
};

export const Badge: React.FC<BadgeProps> = ({ type = 'live', text }) => {
  const styles = getStyles(type);
  const showRedDot = type === 'live';
  const displayText = text || (type === 'live' ? 'Live' : '');

  return (
    <div
      className="flex items-center gap-2 px-3 py-1 rounded-full border"
      style={{
        backgroundColor: styles.backgroundColor,
        borderColor: styles.borderColor,
      }}
    >
      {showRedDot && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
        </span>
      )}
      <span
        className="tracking-wider"
        style={{
          color: styles.color,
          fontSize: styles.fontSize,
          fontWeight: styles.fontWeight,
          lineHeight: styles.lineHeight,
        }}
      >
        {displayText}
      </span>
    </div>
  );
};
