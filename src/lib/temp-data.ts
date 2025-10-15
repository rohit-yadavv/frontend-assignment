export interface StockData {
  stock_symbol: string;
  company_name: string;
  exchange: string;
  market_data: {
    last_price: number;
    open: number;
    high: number;
    low: number;
    previous_close: number;
    "52_week_high": number;
    "52_week_low": number;
    volume: number;
    average_volume: number;
  };
  fundamentals: {
    market_cap: number;
    pe_ratio: number;
    pb_ratio: number;
    eps: number;
    dividend_yield: number;
    roe: number;
    debt_to_equity: number;
    revenue: number;
    profit: number;
  };
  technical_indicators: {
    moving_averages: {
      ma_20: number;
      ma_50: number;
      ma_100: number;
      ma_200: number;
    };
    rsi_14: number;
    macd: {
      macd_value: number;
      signal: number;
      histogram: number;
    };
    bollinger_bands: {
      upper_band: number;
      middle_band: number;
      lower_band: number;
    };
  };
  volume_analysis: {
    average_5_day_volume: number;
    average_10_day_volume: number;
    volume_spike: boolean;
  };
  momentum: {
    atr_14: number;
    adx_14: number;
    stochastic_k: number;
    stochastic_d: number;
  };
  analyst_ratings: {
    buy: number;
    hold: number;
    sell: number;
    target_price: number;
  };
  news: Array<{
    date: string;
    headline: string;
    link: string;
  }>;
}

export const mockStockData: StockData = {
  stock_symbol: "ADANIPOWER",
  company_name: "Adani Power Ltd",
  exchange: "NSE",
  market_data: {
    last_price: 330.25,
    open: 325.5,
    high: 335.0,
    low: 323.75,
    previous_close: 328.0,
    "52_week_high": 450.0,
    "52_week_low": 280.0,
    volume: 2500000,
    average_volume: 2000000,
  },
  fundamentals: {
    market_cap: 150000000000,
    pe_ratio: 12.5,
    pb_ratio: 1.8,
    eps: 26.4,
    dividend_yield: 0.8,
    roe: 14.5,
    debt_to_equity: 1.2,
    revenue: 110000000000,
    profit: 15000000000,
  },
  technical_indicators: {
    moving_averages: {
      ma_20: 328.0,
      ma_50: 322.5,
      ma_100: 315.0,
      ma_200: 300.0,
    },
    rsi_14: 55.0,
    macd: {
      macd_value: 5.2,
      signal: 3.5,
      histogram: 1.7,
    },
    bollinger_bands: {
      upper_band: 340.0,
      middle_band: 330.0,
      lower_band: 320.0,
    },
  },
  volume_analysis: {
    average_5_day_volume: 2300000,
    average_10_day_volume: 2200000,
    volume_spike: true,
  },
  momentum: {
    atr_14: 8.5,
    adx_14: 22.0,
    stochastic_k: 70.0,
    stochastic_d: 65.0,
  },
  analyst_ratings: {
    buy: 8,
    hold: 6,
    sell: 2,
    target_price: 360.0,
  },
  news: [
    {
      date: "2025-10-10",
      headline: "Adani Power secures new solar power contract in Rajasthan",
      link: "https://example.com/adani-power-news1",
    },
  ],
};
