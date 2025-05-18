import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart3, Clock, Search } from "lucide-react";

interface AlgorithmVisualizerProps {
  algorithm: {
    name: string;
    description: string;
  };
  type: "graph" | "dp" | "greedy" | "math";
  state: {
    progress: number;
    comparisons: number;
    swaps: number;
    timeElapsed: number;
    currentArray?: number[];
    currentIndices?: number[];
    completed: boolean;
    dp?: number[][];
    current?: number;
    currentCol?: number;
  };
  data: any; // The data to visualize (graph, array, etc.)
}

export default function AlgorithmVisualizer({ algorithm, type, state, data }: AlgorithmVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [animationFrame, setAnimationFrame] = useState<number | null>(null);

  // Draw the visualization on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    switch (type) {
      case "graph":
        drawGraphVisualization(ctx, canvas, data, state);
        break;
      case "dp":
        drawDPVisualization(ctx, canvas, data, state);
        break;
      case "greedy":
        drawGreedyVisualization(ctx, canvas, data, state);
        break;
      case "math":
        drawMathVisualization(ctx, canvas, data, state);
        break;
    }

    // Request animation frame for smooth updates
    const frame = requestAnimationFrame(() => {
      setAnimationFrame(frame);
    });

    return () => {
      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [data, state, type, animationFrame]);

  const drawGraphVisualization = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, graph: any, state: any) => {
    const { vertices, edges } = graph;
    const nodeRadius = 20;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - nodeRadius - 20;

    // Draw edges
    edges.forEach((edge: number[], i: number) => {
      const startAngle = (2 * Math.PI * i) / vertices;
      const startX = centerX + radius * Math.cos(startAngle);
      const startY = centerY + radius * Math.sin(startAngle);

      edge.forEach((endVertex: number) => {
        const endAngle = (2 * Math.PI * endVertex) / vertices;
        const endX = centerX + radius * Math.cos(endAngle);
        const endY = centerY + radius * Math.sin(endAngle);

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = state.currentIndices?.includes(i) ? "rgb(239, 68, 68)" : "rgb(124, 58, 237)";
        ctx.stroke();
      });
    });

    // Draw vertices
    for (let i = 0; i < vertices; i++) {
      const angle = (2 * Math.PI * i) / vertices;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      ctx.beginPath();
      ctx.arc(x, y, nodeRadius, 0, 2 * Math.PI);
      ctx.fillStyle = state.currentIndices?.includes(i) ? "rgb(239, 68, 68)" : "rgb(124, 58, 237)";
      ctx.fill();

      ctx.fillStyle = "white";
      ctx.font = "16px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(i.toString(), x, y);
    }
  };

  const drawDPVisualization = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, data: any, state: any) => {
    // 2D DP Table (for LCS, Knapsack, etc.)
    if (state.dp && Array.isArray(state.dp) && Array.isArray(state.dp[0])) {
      const dp = state.dp;
      const numRows = dp.length;
      const numCols = dp[0].length;
      const cellWidth = canvas.width / numCols;
      const cellHeight = canvas.height / numRows;
      const highlightRow = typeof state.current === 'number' ? state.current : -1;
      // Optionally, highlight a column if state.currentCol is provided
      const highlightCol = typeof state.currentCol === 'number' ? state.currentCol : -1;

      for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
          // Highlight current cell or row
          if (i === highlightRow && (highlightCol === -1 || j === highlightCol)) {
            ctx.fillStyle = 'rgb(239, 68, 68)'; // red
          } else if (state.completed) {
            ctx.fillStyle = 'rgb(16, 185, 129)'; // green
          } else {
            ctx.fillStyle = 'rgb(124, 58, 237)'; // purple
          }
          ctx.fillRect(j * cellWidth, i * cellHeight, cellWidth - 2, cellHeight - 2);

          // Draw value
          ctx.fillStyle = document.documentElement.classList.contains('dark') ? 'white' : 'black';
          ctx.font = '14px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(
            dp[i][j]?.toString() ?? '',
            j * cellWidth + cellWidth / 2,
            i * cellHeight + cellHeight / 2
          );
        }
      }
      return;
    }

    // 1D DP Array (Fibonacci, LIS, etc.)
    const { currentArray, currentIndices } = state;
    if (!currentArray) return;

    const barWidth = canvas.width / currentArray.length;
    const maxValue = Math.max(...currentArray);

    currentArray.forEach((value: number, index: number) => {
      const barHeight = (value / maxValue) * (canvas.height - 20);
      const x = index * barWidth;
      const y = canvas.height - barHeight;

      ctx.fillStyle = state.completed
        ? 'rgb(16, 185, 129)'
        : currentIndices?.includes(index)
        ? 'rgb(239, 68, 68)'
        : 'rgb(124, 58, 237)';

      ctx.fillRect(x, y, barWidth - 1, barHeight);

      if (barWidth > 20 && barHeight > 15) {
        ctx.fillStyle = document.documentElement.classList.contains('dark') ? 'white' : 'black';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(value.toString(), x + barWidth / 2, y + 12);
      }
    });
  };

  const drawGreedyVisualization = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, data: any, state: any) => {
    const { currentArray, currentIndices } = state;
    if (!currentArray) return;

    const boxSize = Math.min(50, canvas.width / currentArray.length);
    const boxesPerRow = Math.floor(canvas.width / boxSize);

    currentArray.forEach((value: number, index: number) => {
      const row = Math.floor(index / boxesPerRow);
      const col = index % boxesPerRow;
      const x = col * boxSize;
      const y = row * boxSize;

      ctx.fillStyle = state.completed
        ? "rgb(16, 185, 129)"
        : currentIndices?.includes(index)
        ? "rgb(239, 68, 68)"
        : "rgb(124, 58, 237)";

      ctx.fillRect(x, y, boxSize - 2, boxSize - 2);

      ctx.fillStyle = document.documentElement.classList.contains("dark") ? "white" : "black";
      ctx.font = "12px Arial";
      ctx.textAlign = "center";
      ctx.fillText(value.toString(), x + boxSize / 2, y + boxSize / 2 + 4);
    });
  };

  const drawMathVisualization = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, data: any, state: any) => {
    const { currentArray, currentIndices } = state;
    if (!currentArray) return;

    const barWidth = canvas.width / currentArray.length;
    const maxValue = Math.max(...currentArray);

    currentArray.forEach((value: number, index: number) => {
      const barHeight = (value / maxValue) * (canvas.height - 20);
      const x = index * barWidth;
      const y = canvas.height - barHeight;

      ctx.fillStyle = state.completed
        ? "rgb(16, 185, 129)"
        : currentIndices?.includes(index)
        ? "rgb(239, 68, 68)"
        : "rgb(124, 58, 237)";

      ctx.fillRect(x, y, barWidth - 1, barHeight);

      if (barWidth > 20 && barHeight > 15) {
        ctx.fillStyle = document.documentElement.classList.contains("dark") ? "white" : "black";
        ctx.font = "10px Arial";
        ctx.textAlign = "center";
        ctx.fillText(value.toString(), x + barWidth / 2, y + 12);
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visualization</CardTitle>
        <CardDescription>Watch the algorithm in action</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{algorithm.name}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">{algorithm.description}</p>
              </div>

              <div className="flex items-center gap-2">
                <Badge className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {type === "graph" ? <BarChart3 className="h-3 w-3 mr-1" /> : <Search className="h-3 w-3 mr-1" />}
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Badge>

                {state.completed && (
                  <Badge className="bg-green-600 text-white">
                    <Clock className="h-3 w-3 mr-1" />
                    {(state.timeElapsed / 1000).toFixed(2)}s
                  </Badge>
                )}
              </div>
            </div>

            <div className="mt-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-slate-700 dark:text-slate-300 text-sm">Progress</span>
                <span className="text-slate-700 dark:text-slate-300 text-sm">{Math.round(state.progress)}%</span>
              </div>
              <Progress value={state.progress} className="h-2" />
            </div>
          </div>

          <div className="aspect-square">
            <canvas
              ref={canvasRef}
              className="w-full h-full"
              style={{ background: "transparent" }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 