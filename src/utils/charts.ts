import { ChartDataPoint } from "@/types/charts";
import { getValueYPosition } from "./calculations";

export function generateValuePolylinePoints(
  data: ChartDataPoint[],
  minValue: number,
  range: number
): string {
  if (data.length === 0) return "";

  return data
    .map((point, index) => {
      const x = (index / (data.length - 1)) * 380 + 10;
      const y = getValueYPosition(point.value, minValue, range);
      return `${x},${y}`;
    })
    .join(" ");
}

// Additional chart utilities can be added here as needed
export function generateChartPoints(
  data: ChartDataPoint[],
  getValue: (point: ChartDataPoint) => number,
  minValue: number,
  range: number
): Array<{ x: number; y: number }> {
  if (data.length === 0) return [];

  return data.map((point, index) => ({
    x: (index / (data.length - 1)) * 380 + 10,
    y: getValueYPosition(getValue(point), minValue, range)
  }));
}
