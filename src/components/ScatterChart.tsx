import React, { useState } from 'react';
import youMarker from '../assets/you_marker.svg';

export interface DataPoint {
  /** MRR value in USD */
  mrr: number;
  /** Growth rate percentage */
  growth: number;
  /** Color of the data point */
  color: string;
  /** Whether this point shows a tooltip */
  isMedian?: boolean;
  /** Whether this point represents the user's value */
  isUserValue?: boolean;
  /** Label for the tooltip */
  label?: string;
}

export interface AxisStatistics {
  q1: number;
  median: number;
  q3: number;
  userValue: number;
}

export interface ChartStatistics {
  xAxis: AxisStatistics;
  yAxis: AxisStatistics;
}

export interface ScatterChartProps {
  /** Width of the chart in pixels */
  width?: number;
  /** Height of the chart in pixels */
  height?: number;
  /** Data points to display (array format) */
  dataPoints?: DataPoint[];
  /** Statistics data (dictionary format) - will be transformed to dataPoints */
  statistics?: ChartStatistics;
  /** Label for the x-axis */
  xAxisLabel?: string;
  /** Label for the y-axis */
  yAxisLabel?: string;
  /** Jitter radius in pixels to spread overlapping points (0 to disable) */
  jitter?: number;
}

const defaultDataPoints: DataPoint[] = [
  { mrr: 35000, growth: 10, color: '#00BDB4', label: 'Bottom 25%' },
  { mrr: 140000, growth: 25, color: '#1EC337', label: 'Top 25%' },
  { mrr: 80102, growth: 30.8, color: '#9F4BC9', isMedian: true, label: 'Median' },
  { mrr: 150000, growth: 70, color: '#F5234B', label: 'Outlier' },
];

// Helper function to transform ChartStatistics to DataPoint[]
const transformStatisticsToDataPoints = (stats: ChartStatistics): DataPoint[] => [
  { mrr: stats.xAxis.q1, growth: stats.yAxis.q1, color: '#00BDB4', label: 'Q1' },
  { mrr: stats.xAxis.median, growth: stats.yAxis.median, color: '#1EC337', isMedian: true, label: 'Median' },
  { mrr: stats.xAxis.q3, growth: stats.yAxis.q3, color: '#9F4BC9', label: 'Q3' },
  { mrr: stats.xAxis.userValue, growth: stats.yAxis.userValue, color: '#F5234B', isUserValue: true, label: 'You' },
];

export const ScatterChart: React.FC<ScatterChartProps> = ({
  width = 800,
  height = 417,
  dataPoints,
  statistics,
  xAxisLabel = 'MRR (USD)',
  yAxisLabel = 'Revenue Growth Rate (%)',
  jitter = 20,
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  // Transform statistics to dataPoints if provided, otherwise use dataPoints or default
  const chartData = statistics
    ? transformStatisticsToDataPoints(statistics)
    : dataPoints ?? defaultDataPoints;

  // Calculate jitter offsets for overlapping points
  const calculateJitterOffsets = (data: DataPoint[]) => {
    if (jitter <= 0) return data.map(() => ({ x: 0, y: 0 }));

    const offsets = data.map(() => ({ x: 0, y: 0 }));
    const tolerance = 0.01; // 1% tolerance for coordinate comparison

    // Group points by their approximate coordinates
    const groups: number[][] = [];
    const visited = new Set<number>();

    for (let i = 0; i < data.length; i++) {
      if (visited.has(i)) continue;

      const group: number[] = [i];
      visited.add(i);

      for (let j = i + 1; j < data.length; j++) {
        if (visited.has(j)) continue;

        const mrrDiff = Math.abs(data[i].mrr - data[j].mrr) / Math.max(data[i].mrr, 1);
        const growthDiff = Math.abs(data[i].growth - data[j].growth) / Math.max(data[i].growth, 1);

        if (mrrDiff < tolerance && growthDiff < tolerance) {
          group.push(j);
          visited.add(j);
        }
      }

      if (group.length > 1) {
        groups.push(group);
      }
    }

    // Apply circular jitter to overlapping groups
    groups.forEach((group) => {
      const angleStep = (2 * Math.PI) / group.length;
      group.forEach((pointIndex, i) => {
        const angle = angleStep * i - Math.PI / 2; // Start from top
        offsets[pointIndex] = {
          x: Math.cos(angle) * jitter,
          y: Math.sin(angle) * jitter,
        };
      });
    });

    return offsets;
  };

  const jitterOffsets = calculateJitterOffsets(chartData);

  // Chart configuration
  const yAxisLabels = [80, 60, 40, 20, 0];
  const xAxisLabels = ['0k', '40k', '80k', '120k', '160k'];
  const yMax = 80;
  const xMax = 160000;

  // Margins for axes
  const leftMargin = 50;
  const rightMargin = 40;
  const topMargin = 20;
  const bottomMargin = 50;

  const chartWidth = width - leftMargin - rightMargin;
  const chartHeight = height - topMargin - bottomMargin;

  // Scale functions
  const scaleX = (mrr: number) => (mrr / xMax) * chartWidth;
  const scaleY = (growth: number) => chartHeight - (growth / yMax) * chartHeight;

  return (
    <div
      className="flex flex-col"
      style={{
        width: '100%',
        height: '100%',
        background: 'white',
        borderRadius: '12px',
        gap: '24px',
        overflow: 'hidden',
      }}
    >
      {/* Inner bordered container: chart area only */}
      <div
        className="flex flex-col"
        style={{
          padding: '24px',
          borderRadius: '12px',
          outline: '1px rgba(26, 31, 61, 0.10) solid',
          outlineOffset: '-1px',
          gap: '16px',
          boxSizing: 'border-box',
        }}
      >
      {/* Chart Container with Y-axis label */}
      <div className="flex items-start gap-2">
        {/* Y-axis label - rotated */}
        <div
          className="flex items-center justify-center"
          style={{
            width: '24px',
            height: height,
          }}
        >
          <div
            style={{
              transform: 'rotate(-90deg)',
              whiteSpace: 'nowrap',
              color: '#424242',
              fontSize: '16px',
              fontFamily: 'Geist, sans-serif',
              fontWeight: 500,
            }}
          >
            {yAxisLabel}
          </div>
        </div>

        {/* Main Chart Area */}
        <div className="flex-1 flex">
          {/* Y-axis with labels */}
          <div
            className="flex flex-col justify-between items-end pr-2"
            style={{
              width: '40px',
              height: chartHeight,
              marginTop: topMargin,
            }}
          >
            {yAxisLabels.map((label) => (
              <div
                key={label}
                className="flex items-center gap-1"
              >
                <span
                  style={{
                    color: '#737373',
                    fontSize: '12px',
                    fontFamily: 'Geist, sans-serif',
                    fontWeight: 500,
                  }}
                >
                  {label}
                </span>
                <div
                  style={{
                    width: '6px',
                    height: '1px',
                    background: 'rgba(26, 31, 61, 0.20)',
                  }}
                />
              </div>
            ))}
          </div>

          {/* Chart Plot Area */}
          <div
            className="relative flex-1"
            style={{
              height: height,
            }}
          >
            {/* Grid and Data Points Container */}
            <div
              className="relative"
              style={{
                position: 'absolute',
                top: topMargin,
                left: 0,
                right: rightMargin,
                height: chartHeight,
                background: 'linear-gradient(0deg, #F5FBFF 0%, white 100%)',
              }}
            >
              {/* Y-axis line (vertical) */}
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: '1px',
                  background: 'rgba(26, 31, 61, 0.15)',
                  zIndex: 1,
                }}
              />
              {/* X-axis line (horizontal) */}
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: '1px',
                  background: 'rgba(26, 31, 61, 0.15)',
                  zIndex: 1,
                }}
              />
              {/* Reference lines for "You" data point */}
              {chartData
                .filter((p) => p.isUserValue)
                .map((point, idx) => {
                  const userX = scaleX(point.mrr);
                  const userY = scaleY(point.growth);
                  const userIndex = chartData.findIndex((p) => p.isUserValue);
                  const jitterX = jitterOffsets[userIndex]?.x || 0;
                  const jitterY = jitterOffsets[userIndex]?.y || 0;
                  const finalX = userX + jitterX;
                  const finalY = userY + jitterY;

                  return (
                    <React.Fragment key={`ref-lines-${idx}`}>
                      {/* Horizontal dashed line - full width */}
                      <div
                        style={{
                          position: 'absolute',
                          left: 0,
                          right: 0,
                          top: finalY - 1,
                          height: '2px',
                          borderTop: '2px dashed rgba(26, 31, 61, 0.10)',
                          zIndex: 5,
                        }}
                      />
                      {/* Vertical dashed line - full height */}
                      <div
                        style={{
                          position: 'absolute',
                          left: finalX - 1,
                          top: 0,
                          bottom: 0,
                          width: '2px',
                          borderLeft: '2px dashed rgba(26, 31, 61, 0.10)',
                          zIndex: 5,
                        }}
                      />
                    </React.Fragment>
                  );
                })}

              {/* Data Points */}
              {chartData.map((point, index) => {
                const x = scaleX(point.mrr);
                const y = scaleY(point.growth);
                const isHovered = hoveredPoint === index;
                const isMedian = point.isMedian;
                const isUserValue = point.isUserValue;

                return (
                  <React.Fragment key={index}>
                    {/* Data Point with jitter offset */}
                    {isUserValue ? (
                      // "You" marker image for user value
                      <img
                        src={youMarker}
                        alt="You"
                        className="cursor-pointer transition-transform duration-200"
                        style={{
                          position: 'absolute',
                          width: '41px',
                          height: '41px',
                          left: x - 20.5 + jitterOffsets[index].x,
                          top: y - 20.5 + jitterOffsets[index].y,
                          transform: isHovered ? 'scale(1.3)' : 'scale(1)',
                          zIndex: isHovered ? 20 : 10,
                        }}
                        onMouseEnter={() => setHoveredPoint(index)}
                        onMouseLeave={() => setHoveredPoint(null)}
                      />
                    ) : (
                      // Circle marker for other points
                      <div
                        className="cursor-pointer transition-transform duration-200"
                        style={{
                          position: 'absolute',
                          width: '16px',
                          height: '16px',
                          left: x - 8 + jitterOffsets[index].x,
                          top: y - 8 + jitterOffsets[index].y,
                          background: point.color,
                          boxShadow: isMedian
                            ? '4px 4px 4px rgba(255, 255, 255, 0.25) inset, 0px 0px 12px rgba(255, 255, 255, 0.50)'
                            : '4px 4px 4px rgba(255, 255, 255, 0.25) inset',
                          borderRadius: '50%',
                          border: '2px white solid',
                          transform: isHovered ? 'scale(1.3)' : 'scale(1)',
                          zIndex: isHovered ? 20 : 10,
                        }}
                        onMouseEnter={() => setHoveredPoint(index)}
                        onMouseLeave={() => setHoveredPoint(null)}
                      />
                    )}

                    {/* Tooltip for data point */}
                    {isHovered && (
                      <div
                        className="z-30"
                        style={{
                          position: 'absolute',
                          left: Math.min(x + 15 + jitterOffsets[index].x, chartWidth - 210),
                          top: Math.min(y + 15 + jitterOffsets[index].y, chartHeight - 120),
                          pointerEvents: 'none',
                        }}
                      >
                        <div
                          className="flex flex-col"
                          style={{
                            width: '180px',
                            padding: '12px',
                            background: 'white',
                            borderRadius: '12px',
                            outline: '1px #E5E5E5 solid',
                            outlineOffset: '-1px',
                            gap: '10px',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                          }}
                        >
                          {/* Tooltip Header */}
                          <div className="flex items-center gap-2">
                            {point.isUserValue ? (
                              <img src={youMarker} alt="You" width="14" height="14" />
                            ) : (
                              <div
                                style={{
                                  width: '10px',
                                  height: '10px',
                                  background: point.color,
                                  boxShadow:
                                    '0px 0px 8px rgba(138, 56, 245, 0.80), 0px 0px 12px rgba(138, 56, 245, 0.25)',
                                  borderRadius: '50%',
                                }}
                              />
                            )}
                            <span
                              style={{
                                color: '#424242',
                                fontSize: '14px',
                                fontFamily: 'Geist, sans-serif',
                                fontWeight: 500,
                              }}
                            >
                              {point.label}
                            </span>
                          </div>

                          {/* Tooltip Data */}
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center justify-between">
                              <span
                                style={{
                                  color: '#737373',
                                  fontSize: '12px',
                                  fontFamily: 'Geist, sans-serif',
                                  fontWeight: 400,
                                }}
                              >
                                MRR
                              </span>
                              <span
                                style={{
                                  color: '#0A0A0A',
                                  fontSize: '12px',
                                  fontFamily: 'Geist, sans-serif',
                                  fontWeight: 500,
                                }}
                              >
                                USD {point.mrr.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span
                                style={{
                                  color: '#737373',
                                  fontSize: '12px',
                                  fontFamily: 'Geist, sans-serif',
                                  fontWeight: 400,
                                }}
                              >
                                Growth
                              </span>
                              <span
                                style={{
                                  color: '#0A0A0A',
                                  fontSize: '12px',
                                  fontFamily: 'Geist, sans-serif',
                                  fontWeight: 500,
                                }}
                              >
                                {point.growth}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* X-axis */}
            <div
              className="flex justify-between"
              style={{
                position: 'absolute',
                bottom: 10,
                left: 0,
                right: rightMargin,
                height: '30px',
              }}
            >
              {xAxisLabels.map((label, index) => (
                <div
                  key={label}
                  className="flex flex-col items-center"
                  style={{ width: '30px' }}
                >
                  <div
                    style={{
                      height: '6px',
                      width: '1px',
                      background: 'rgba(26, 31, 61, 0.20)',
                      opacity: index === 0 ? 0 : 1,
                    }}
                  />
                  <span
                    style={{
                      color: '#737373',
                      fontSize: '12px',
                      fontFamily: 'Geist, sans-serif',
                      fontWeight: 500,
                      marginTop: '4px',
                    }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* X-axis label */}
      <div className="flex justify-center" style={{ paddingLeft: '40px' }}>
        <span
          style={{
            color: '#424242',
            fontSize: '16px',
            fontFamily: 'Geist, sans-serif',
            fontWeight: 500,
          }}
        >
          {xAxisLabel}
        </span>
      </div>

      {/* Legend - inside the inner bordered container */}
      <div
        className="flex flex-wrap gap-4"
        style={{ paddingLeft: '0', paddingBottom: '0', marginBottom: '8px' }}
      >
        {chartData.map((point, index) => (
          <div key={index} className="flex items-center gap-2">
            {point.isUserValue ? (
              <img src={youMarker} alt="You" width="14" height="14" />
            ) : (
              <div
                style={{
                  width: '10px',
                  height: '10px',
                  background: point.color,
                  borderRadius: '50%',
                  border: '1px solid rgba(255, 255, 255, 0.5)',
                }}
              />
            )}
            <span
              style={{
                color: '#737373',
                fontSize: '12px',
                fontFamily: 'Geist, sans-serif',
                fontWeight: 500,
              }}
            >
              {point.label}
            </span>
          </div>
        ))}
      </div>
      </div>{/* end inner bordered container */}
    </div>
  );
};
