import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import {
  Bell,
  Heart,
  MessageSquare,
  Wrench,
  TrendingUp,
  TrendingDown,
  ChevronDown,
  WandSparkles,
  Calculator,
  Sigma,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Image from "next/image";
import { StockData } from "@/lib/temp-data";
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@/components/ui/button-group";

interface StockHeaderProps {
  data: StockData;
}

export const StockHeader = ({ data }: StockHeaderProps) => {
  const priceChange =
    data.market_data.last_price - data.market_data.previous_close;
  const priceChangePercent =
    (priceChange / data.market_data.previous_close) * 100;
  const isPositive = priceChange >= 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Left card: Company info */}
      <Card className="lg:col-span-2">
        <div className="flex w-full items-center">
          <Image
            src={"/adani-logo.webp"}
            width={100}
            height={100}
            alt="logo"
            className="pl-6 h-6! w-20"
          />

          <CardHeader className="w-full pl-2">
            <CardTitle>{data.company_name}</CardTitle>
            <CardDescription>{data.stock_symbol}</CardDescription>
            <CardAction className="flex gap-2">
              <Button variant="outline" size="sm" aria-label="Notifications">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" aria-label="Watchlist">
                <Heart className="h-4 w-4" />
              </Button>

              <Popover>
                <PopoverTrigger asChild>
                  <Button size={"sm"} variant="outline" aria-label="Tools">
                    <Wrench className="h-4 w-4" />
                    Tools
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  align="center"
                  className="p-1 w-56 flex items-center flex-col"
                >
                  <Button
                    variant={"ghost"}
                    className="w-full flex items-center justify-start text-muted-foreground "
                  >
                    <Calculator />
                    CAGR Forecast
                  </Button>
                  <Button
                    variant={"ghost"}
                    className="w-full flex items-center justify-start text-muted-foreground "
                  >
                    <Sigma />
                    SIP Returns Calculator
                  </Button>
                </PopoverContent>
              </Popover>

              <Button
                variant="default"
                size={"sm"}
                className="bg-primary text-primary-foreground"
                aria-label="Chat with AI"
              >
                <WandSparkles className="h-4 w-4 mr-2" />

                <Typography as="span" variant="small" className="text-white">
                  Chat with AI
                </Typography>
              </Button>
            </CardAction>
          </CardHeader>
        </div>
        <CardContent className="space-y-6 ">
          {/* Badges row */}
          <div className="flex flex-wrap gap-2 ">
            <Badge variant="secondary">
              <span className="text-muted-foreground">Large Cap </span>{" "}
              <span>₹{(data.fundamentals.market_cap / 1e7).toFixed(2)} Cr</span>
            </Badge>
            <Badge variant="secondary">
              <span className="text-muted-foreground">Sector </span>
              <span>Utilities</span>
            </Badge>
            <Badge variant="secondary">
              <span className="text-muted-foreground">Industry </span>
              <span>Independent Power Producer</span>
            </Badge>
          </div>

          <div className="rounded-xl border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Typography variant="mutedSmall">52W low</Typography>
                <Typography as="span" className="font-semibold">
                  {data.market_data["52_week_low"].toFixed(2)}
                </Typography>
              </div>
              <div className="flex items-center gap-2">
                <Typography as="span" className="font-semibold">
                  {data.market_data["52_week_high"].toFixed(2)}
                </Typography>
                <Typography variant="mutedSmall">52W high</Typography>
              </div>
            </div>

            {/* Track with current price marker and label */}
            {(() => {
              const pct =
                ((data.market_data.last_price -
                  data.market_data["52_week_low"]) /
                  (data.market_data["52_week_high"] -
                    data.market_data["52_week_low"])) *
                100;
              return (
                <div className="mt-4">
                  <div className="relative h-2 rounded-full bg-primary/10">
                    <div
                      className="absolute -top-10 -translate-x-1/2 rounded-md border bg-card px-2 py-1 shadow-sm"
                      style={{ left: `${pct}%` }}
                    >
                      <Typography
                        as="span"
                        variant="small"
                        className="text-primary"
                      >
                        {data.market_data.last_price.toFixed(2)}
                      </Typography>
                    </div>
                    <div
                      className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary bg-primary shadow"
                      style={{ left: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })()}

            {/* Bottom percentages */}
            {(() => {
              const fromLow =
                ((data.market_data.last_price -
                  data.market_data["52_week_low"]) /
                  (data.market_data["52_week_high"] -
                    data.market_data["52_week_low"])) *
                100;
              const fromHigh =
                ((data.market_data["52_week_high"] -
                  data.market_data.last_price) /
                  (data.market_data["52_week_high"] -
                    data.market_data["52_week_low"])) *
                100;
              return (
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Typography variant="mutedSmall">
                      from 52W Low
                      <span className="ml-2 font-semibold text-[color:var(--success)]">
                        {fromLow.toFixed(2)}%
                      </span>
                    </Typography>
                    <TrendingUp className="h-4 w-4 text-[color:var(--success)]" />
                  </div>

                  <div className="flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 text-destructive" />
                    <Typography variant="mutedSmall">
                      <span className="mr-2 font-semibold text-destructive">
                        {fromHigh.toFixed(2)}%
                      </span>
                      from 52W High
                    </Typography>
                  </div>
                </div>
              );
            })()}
          </div>

          <div>
            <Typography variant="mutedSmall" className="line-clamp-2">
              Adani Power Limited engages in the generation, transmission, and
              sale of electricity under long term power purchase agreements
              (PPA), medium and short term PPA, and on merchant basis in India.
              The company generates electricity through thermal and solar energy
              sources. It has various power projects with a combined installed
              and commissioned capacity of 13,650 MW, including 4,620 MW at
              Mundra, Gujarat; 3,300 MW at Tiroda, Maharashtra; 1,320 MW at
              Kawai, Rajasthan; 1,200 MW at Udupi, Karnataka; 1,370 MW at
              Raipur, Chhattisgarh; 600 MW at Raigarh, Chhattisgarh; 1,200 MW at
              Singrauli, Madhya Pradesh; and 40 MW at Bitta, Gujarat. The
              company also trades in coal. Adani Power Limited was founded in
              1988 and is headquartered in Ahmedabad, India.
            </Typography>
            <Button variant="link" size="sm" className="px-0">
              See more
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Right card: Price info */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>₹{data.market_data.last_price.toFixed(2)}</CardTitle>
            <CardAction
              className={`font-semibold flex items-center ${
                isPositive ? "text-[color:var(--success)]" : "text-destructive"
              }`}
            >
              {isPositive ? (
                <TrendingUp className="h-5 w-5 mr-1" />
              ) : (
                <TrendingDown className="h-5 w-5 mr-1" />
              )}
              {priceChangePercent.toFixed(2)}%
            </CardAction>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-xl border px-3 py-2">
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <Typography variant="mutedSmall">Qty in portfolio</Typography>
              <Typography variant="mutedSmall" className="justify-self-end">
                56
              </Typography>
              <Typography variant="mutedSmall">Avg.</Typography>
              <Typography variant="mutedSmall" className="justify-self-end">
                —
              </Typography>
              <Typography variant="mutedSmall">Invested</Typography>
              <Typography variant="mutedSmall" className="justify-self-end">
                —
              </Typography>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-y-1">
            <Typography variant="mutedSmall">Volume</Typography>
            <Typography variant="mutedSmall" className="justify-self-end">
              {data.market_data.volume.toLocaleString()} shares
            </Typography>
            <Typography variant="mutedSmall">Avg traded price</Typography>
            <Typography variant="mutedSmall" className="justify-self-end">
              ₹{((data.market_data.high + data.market_data.low) / 2).toFixed(2)}
            </Typography>
            <Typography variant="mutedSmall">Avg volume (10D)</Typography>
            <Typography variant="mutedSmall" className="justify-self-end">
              {data.volume_analysis?.average_10_day_volume?.toLocaleString?.() ||
                "—"}
            </Typography>
          </div>

          <div className="flex gap-2 items-center w-full pt-2">
            <Button variant="outline" className="flex-1">
              Add to Basket
            </Button>
            <ButtonGroup>
              <Button className="bg-success hover:bg-success/90">Buy</Button>
              <ButtonGroupSeparator />
              <Button className="bg-success hover:bg-success/90">
                <ChevronDown className="h-4 w-4" />
              </Button>
            </ButtonGroup>
            <ButtonGroup>
              <Button className="bg-destructive hover:bg-destructive/90">
                Sell
              </Button>
              <ButtonGroupSeparator />
              <Button
                size="icon"
                className="bg-destructive hover:bg-destructive/90"
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </ButtonGroup>{" "}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
