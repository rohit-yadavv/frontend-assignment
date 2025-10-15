import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Sparkles, HelpCircle } from "lucide-react";
import { Typography } from "@/components/ui/typography";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export const ScoreCard = () => {
  const prismScore = 70.49;
  const prismRank = 4;
  const totalRanks = 18;
  const breakdown = [
    { label: "Performance", value: 70, level: "Medium" },
    { label: "Valuation", value: 40, level: "Low" },
    { label: "Growth", value: 78, level: "High" },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Prysm Score:
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs max-w-xs">
                      It justifies the overall comparative analysis of stock
                      within the industry considering the fundamentals and the
                      current valuation, independent of holding period.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
            <CardAction>
              <Typography className={"font-bold text-success"}>
                {prismScore.toFixed(2)}
              </Typography>
            </CardAction>
          </CardHeader>

          <CardContent>
            <Progress value={prismScore} className="h-3 [&>div]:bg-success!" />
            <div className="flex justify-between mt-1">
              <span>0</span>
              <span>25</span>
              <span>50</span>
              <span>75</span>
              <span>100</span>
            </div>
          </CardContent>
          <CardFooter>
            <CardTitle className="flex items-center gap-2 pr-2">
              Prysm Rank:
              <span>{prismRank}</span>
            </CardTitle>
            <CardAction>
              <span className="text-muted-foreground">
                (Out of {totalRanks})
              </span>
            </CardAction>
          </CardFooter>
        </Card>
      </div>

      <Button className="w-full" size="lg">
        <Sparkles className="h-4 w-4 mr-2" />
        Generate AI Report
      </Button>

      {/* Score Breakdown separate card */}
      <Card>
        <CardHeader>
          <CardTitle>Score Breakdown</CardTitle>
          <CardDescription>Last updated: Today</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {breakdown.map((b) => (
            <div key={b.label} className="space-y-2">
              <div className="flex items-center justify-between">
                <Typography variant={"mutedSmall"}>{b.label}</Typography>
                <Typography
                  variant={"extrasmall"}
                  className={cn(
                    "flex items-center gap-2",
                    b.level === "Low" && "text-destructive",
                    b.level === "High" && "text-success"
                  )}
                >
                  {b.level}
                  <span>{(b.value / 10).toFixed(1)}</span>
                </Typography>
              </div>
              <Progress
                value={b.value}
                className={cn(
                  "h-2",
                  "flex items-center gap-2",
                  b.level === "Low" && "[&>div]:bg-destructive",
                  b.level === "High" && "[&>div]:bg-success"
                )}
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
