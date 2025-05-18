export interface Step {
  array?: number[];
  indices?: number[];
  comparison?: boolean;
  swap?: boolean;
  dp?: number[][];
  current?: number;
  currentCol?: number;
  path?: number[];
}

export function fibonacci(n: number): Step[] {
  const steps: Step[] = [];
  const dp: number[] = new Array(n + 1).fill(0);
  
  dp[0] = 0;
  dp[1] = 1;
  
  steps.push({
    dp: [dp],
    current: 1
  });

  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
    steps.push({
      dp: [dp],
      current: i
    });
  }

  return steps;
}

export function knapsack(weights: number[], values: number[], capacity: number): Step[] {
  const steps: Step[] = [];
  const n = weights.length;
  const dp: number[][] = Array(n + 1).fill(0).map(() => Array(capacity + 1).fill(0));

  steps.push({
    dp: dp.map(row => [...row]),
    current: 0
  });

  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= capacity; w++) {
      if (weights[i - 1] <= w) {
        dp[i][w] = Math.max(
          values[i - 1] + dp[i - 1][w - weights[i - 1]],
          dp[i - 1][w]
        );
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
    steps.push({
      dp: dp.map(row => [...row]),
      current: i
    });
  }

  return steps;
}

export function lcs(str1: string, str2: string): Step[] {
  const steps: Step[] = [];
  const m = str1.length;
  const n = str2.length;
  const dp: number[][] = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0));

  steps.push({
    dp: dp.map(row => [...row]),
    current: 0
  });

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
    steps.push({
      dp: dp.map(row => [...row]),
      current: i
    });
  }

  return steps;
}

export function lis(arr: number[]): Step[] {
  const steps: Step[] = [];
  const n = arr.length;
  const dp: number[] = new Array(n).fill(1);
  const path: number[] = [];

  steps.push({
    dp: [dp],
    array: [...dp],
    current: 0,
    path: [...path]
  });

  for (let i = 1; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (arr[i] > arr[j]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
    }
    path.push(i);
    steps.push({
      dp: [dp],
      array: [...dp],
      current: i,
      path: [...path]
    });
  }

  return steps;
} 