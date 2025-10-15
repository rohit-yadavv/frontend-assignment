"use client";

import { useState, useEffect, useCallback, memo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Trash2, BarChartHorizontalBig } from "lucide-react";
import {
  Empty,
  EmptyContent,
  EmptyTitle,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
} from "@/components/ui/empty";

interface Metric {
  id: number;
  name: string;
  pe: number;
  peg: number;
  rsi: number;
}

const LOCAL_STORAGE_KEY = "customMetrics";

const MetricRow = memo(function MetricRow({
  metric,
  onRemoveRequest,
}: {
  metric: Metric;
  onRemoveRequest: (id: number) => void;
}) {
  return (
    <TableRow>
      <TableCell className="font-medium">{metric.name}</TableCell>
      <TableCell>{metric.pe}</TableCell>
      <TableCell>{metric.peg}</TableCell>
      <TableCell>{metric.rsi}</TableCell>
      <TableCell>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemoveRequest(metric.id)}
          aria-label={`Remove ${metric.name}`}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </TableCell>
    </TableRow>
  );
});

export default function CustomMetrics() {
  const [metrics, setMetrics] = useState<Metric[]>([]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newMetricName, setNewMetricName] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);
  const [metricToRemove, setMetricToRemove] = useState<number | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      setMetrics(stored ? JSON.parse(stored) : []);
    } catch {
      setMetrics([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(metrics));
  }, [metrics]);

  const handleAddMetric = useCallback(() => {
    if (!newMetricName.trim()) {
      setNameError("Metric name cannot be empty.");
      return;
    }
    const newMetric: Metric = {
      id: Date.now(),
      name: newMetricName.trim(),
      pe: +(Math.random() * 60).toFixed(2),
      peg: +(Math.random() * 3).toFixed(2),
      rsi: Math.floor(Math.random() * 100),
    };
    setMetrics((prev) => [...prev, newMetric]);
    setIsAddDialogOpen(false);
    setNewMetricName("");
  }, [newMetricName]);

  const handleDialogClose = (isOpen: boolean) => {
    setIsAddDialogOpen(isOpen);
    if (!isOpen) {
      setNewMetricName("");
      setNameError(null);
    }
  };

  const handleConfirmRemove = useCallback(() => {
    if (metricToRemove === null) return;
    setMetrics((prev) => prev.filter((m) => m.id !== metricToRemove));
    setMetricToRemove(null);
  }, [metricToRemove]);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Custom Metrics</CardTitle>
          <CardDescription>Manage your saved stock metrics.</CardDescription>
          <CardAction>
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="shrink-0"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Metric
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          {metrics.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>P/E Ratio</TableHead>
                    <TableHead>PEG Ratio</TableHead>
                    <TableHead>RSI</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {metrics.map((metric) => (
                    <MetricRow
                      key={metric.id}
                      metric={metric}
                      onRemoveRequest={setMetricToRemove}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <BarChartHorizontalBig className="h-12 w-12 text-muted-foreground" />
                </EmptyMedia>
                <EmptyTitle>No Metrics Yet</EmptyTitle>
                <EmptyDescription>
                  Click &quot;Add Metric&quot; to get started.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button
                  size={"lg"}
                  onClick={() => setIsAddDialogOpen(true)}
                  className="shrink-0 px-6"
                >
                  <PlusCircle className="mr-2 h-4 w-4 " />
                  Add Metric
                </Button>
              </EmptyContent>
            </Empty>
          )}
        </CardContent>
      </Card>

      <Dialog open={isAddDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Metric</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-2 pt-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={newMetricName}
              onChange={(e) => {
                setNewMetricName(e.target.value);
                if (nameError) setNameError(null);
              }}
              placeholder="e.g., 'Tech Growth Stocks'"
              autoFocus
            />
            {nameError && (
              <p className="text-sm text-destructive">{nameError}</p>
            )}
          </div>
          <DialogFooter className="pt-2">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" onClick={handleAddMetric}>
              Save Metric
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={metricToRemove !== null}
        onOpenChange={() => setMetricToRemove(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              metric from your list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmRemove}
              className="text-destructive-foreground bg-destructive hover:bg-destructive/90"
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
