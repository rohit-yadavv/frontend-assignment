"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  ReferenceArea,
} from "recharts";
import { format, parseISO, subMonths, subYears } from "date-fns";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StockDataPoint {
  date: string;
  adjOpen: number;
  adjHigh: number;
  adjLow: number;
  adjClose: number;
  volume: number;
}

interface FormattedDataPoint {
  date: string;
  price: number;
  fullDate: Date;
  displayDate: string;
  open: number;
  high: number;
  low: number;
  volume: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: { payload: FormattedDataPoint }[];
}

type TimeRange = "1M" | "3M" | "6M" | "1Y" | "ALL";

const formatLargeNumber = (num: number): string => {
  if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(2)}B`;
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(2)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(2)}K`;
  return num.toString();
};

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const isUp = data.price >= data.open;
    return (
      <div className="rounded-xl border bg-background/95 p-4 shadow-lg min-w-[180px]">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm text-muted-foreground">{data.displayDate}</p>
          <div
            className={`w-2 h-2 rounded-full ${
              isUp ? "bg-green-500" : "bg-red-500"
            }`}
          ></div>
        </div>
        <p className="text-2xl font-bold text-foreground mb-4">
          ${data.price.toFixed(2)}
        </p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Open</span>
            <span>${data.open.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">High</span>
            <span className="font-semibold text-green-600">
              ${data.high.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Low</span>
            <span className="font-semibold text-red-500">
              ${data.low.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Volume</span>
            <span className="font-semibold text-blue-600">
              {formatLargeNumber(data.volume)}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const StockChart = () => {
  const stockSymbol = "AAPL";
  const apiKeyValue = process.env.NEXT_PUBLIC_FMP_API_KEY;

  const [allData, setAllData] = useState<FormattedDataPoint[]>([]);
  const [filteredData, setFilteredData] = useState<FormattedDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>("3M");

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setIsError(null);
    try {
      const url = `https://financialmodelingprep.com/stable/historical-price-eod/non-split-adjusted?symbol=${stockSymbol}&apikey=${apiKeyValue}`;
      const response = await fetch(url);
      if (!response.ok)
        throw new Error("Failed to fetch. Check symbol or API key.");

      const result = await response.json();
      const historicalData = Array.isArray(result) ? result : result.historical;
      if (!Array.isArray(historicalData) || historicalData.length === 0) {
        throw new Error("No data available for this symbol.");
      }

      const formatted = [...historicalData]
        .reverse()
        .map((item: StockDataPoint) => {
          const fullDate = parseISO(item.date);
          return {
            date: format(fullDate, "MMM d"),
            price: item.adjClose,
            fullDate,
            displayDate: format(fullDate, "MMMM d, yyyy"),
            open: item.adjOpen,
            high: item.adjHigh,
            low: item.adjLow,
            volume: item.volume,
          };
        });
      setAllData(formatted);
    } catch (err) {
      setIsError(
        err instanceof Error ? err.message : "An unknown error occurred."
      );
    } finally {
      setIsLoading(false);
    }
  }, [stockSymbol, apiKeyValue]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (allData.length === 0) return;

    const getCutoffDate = (range: TimeRange): Date | null => {
      const now = new Date();
      switch (range) {
        case "1M":
          return subMonths(now, 1);
        case "3M":
          return subMonths(now, 3);
        case "6M":
          return subMonths(now, 6);
        case "1Y":
          return subYears(now, 1);
        default:
          return null;
      }
    };

    const cutoffDate = getCutoffDate(timeRange);
    const newFilteredData = cutoffDate
      ? allData.filter((item) => item.fullDate >= cutoffDate)
      : allData;

    setFilteredData(newFilteredData);
  }, [allData, timeRange]);

  const chartStats = useMemo(() => {
    if (filteredData.length < 1)
      return {
        currentPrice: 0,
        priceChange: 0,
        percentChange: 0,
        isPositive: true,
        latestDate: "",
      };

    const latest = filteredData[filteredData.length - 1];
    const first = filteredData[0];
    const currentPrice = latest.price;
    const priceChange = currentPrice - first.price;
    const percentChange =
      first.price === 0 ? 0 : (priceChange / first.price) * 100;

    return {
      currentPrice,
      priceChange,
      percentChange,
      isPositive: priceChange >= 0,
      latestDate: latest.displayDate,
    };
  }, [filteredData]);

  const { isPositive } = chartStats;

  if (isLoading) {
    return <Skeleton className="h-[480px] w-full" />;
  }

  if (isError) {
    return (
      <Card className="w-full h-[480px] flex flex-col items-center justify-center">
        <CardHeader className="w-full text-center">
          <CardTitle>Error Loading Chart</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <AlertCircle className="w-12 h-12 text-destructive" />
          <Button
            onClick={fetchData}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex  items-center gap-2">
          ${chartStats.currentPrice.toFixed(2)}
          <span
            className={`flex items-center gap-1 text-sm font-semibold ${
              isPositive ? "text-green-600" : "text-red-500"
            }`}
          >
            {isPositive ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            <span>{chartStats.percentChange.toFixed(2)}%</span>
            <span className="text-xs text-muted-foreground">
              ({chartStats.priceChange.toFixed(2)})
            </span>
          </span>
        </CardTitle>

        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={(value) => setTimeRange(value as TimeRange)}
            aria-label="Time range"
          >
            {(["1M", "3M", "6M", "1Y", "ALL"] as TimeRange[]).map((range) => (
              <ToggleGroupItem
                key={range}
                value={range}
                aria-label={`Select ${range}`}
              >
                {range}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </CardAction>
      </CardHeader>
      <CardContent className="pr-0 min-h-96 flex flex-col h-full">
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={filteredData}
              margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
            >
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={
                      isPositive ? "var(--success)" : "var(--destructive)"
                    }
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="95%"
                    stopColor={
                      isPositive ? "var(--success)" : "var(--destructive)"
                    }
                    stopOpacity={0.05}
                  />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
              />
              <YAxis
                orientation="left"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                tickFormatter={(value) => `$${Number(value).toFixed(0)}`}
                domain={["dataMin * 0.98", "dataMax * 1.02"]}
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
              />
              <Tooltip
                cursor={{ stroke: "var(--foreground)", strokeDasharray: "4 4" }}
                content={<CustomTooltip />}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke={isPositive ? "var(--success)" : "var(--destructive)"}
                strokeWidth={2}
                fill="url(#chartGradient)"
                dot={false}
                activeDot={{
                  r: 6,
                  stroke: "var(--background)",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default StockChart;
