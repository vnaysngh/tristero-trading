import { formatCurrency, formatPercentage } from "./formatting";

interface PnlTimeframeData {
  day: { pnl: number; percentage: number; changeType: "positive" | "negative" };
  week: {
    pnl: number;
    percentage: number;
    changeType: "positive" | "negative";
  };
  month: {
    pnl: number;
    percentage: number;
    changeType: "positive" | "negative";
  };
  allTime: {
    pnl: number;
    percentage: number;
    changeType: "positive" | "negative";
  };
}

interface StatItem {
  label: string;
  value: string;
  change: string | null;
  changeType: "positive" | "negative" | null;
}

export function generatePnlStats(
  pnlData: PnlTimeframeData,
  dayVolume: number,
  currentValue: number
): StatItem[] {
  return [
    {
      label: "Current Value",
      value: formatCurrency(currentValue),
      change: null,
      changeType: null
    },
    {
      label: "24h P&L",
      value: formatCurrency(pnlData.day.pnl),
      change: formatPercentage(pnlData.day.percentage),
      changeType: pnlData.day.changeType
    },
    {
      label: "7d P&L",
      value: formatCurrency(pnlData.week.pnl),
      change: formatPercentage(pnlData.week.percentage),
      changeType: pnlData.week.changeType
    },
    {
      label: "30d P&L",
      value: formatCurrency(pnlData.month.pnl),
      change: formatPercentage(pnlData.month.percentage),
      changeType: pnlData.month.changeType
    },
    {
      label: "All Time P&L",
      value: formatCurrency(pnlData.allTime.pnl),
      change: formatPercentage(pnlData.allTime.percentage),
      changeType: pnlData.allTime.changeType
    },
    {
      label: "Volume (24h)",
      value: formatCurrency(dayVolume),
      change: null,
      changeType: null
    }
  ];
}

// Legacy compatibility function
export const getPnLData = generatePnlStats;
