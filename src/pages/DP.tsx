import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, RotateCcw, X } from "lucide-react";
import { fibonacci, knapsack, lcs, lis, Step } from "@/lib/dp-algorithms";
import AlgorithmVisualizer from "@/components/AlgorithmVisualizer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Algorithm {
  name: string;
  function: (...args: any[]) => Step[];
  description: string;
  timeComplexity: { best: string; average: string; worst: string };
  spaceComplexity: string;
  code: { JavaScript: string; Python: string; Java: string };
  info: string[];
  applications: string[];
}

const algorithms: Algorithm[] = [
  {
    name: "Fibonacci",
    function: fibonacci,
    description: "Calculates the nth Fibonacci number using dynamic programming to avoid redundant calculations.",
    timeComplexity: { best: "O(n)", average: "O(n)", worst: "O(n)" },
    spaceComplexity: "O(n)",
    code: {
      JavaScript: `function fibonacci(n) {
  const dp = new Array(n + 1).fill(0);
  dp[0] = 0;
  dp[1] = 1;
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
}`,
      Python: `def fibonacci(n):
    dp = [0] * (n + 1)
    dp[0] = 0
    dp[1] = 1
    for i in range(2, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
    return dp[n]`,
      Java: `int fibonacci(int n) {
    int[] dp = new int[n + 1];
    dp[0] = 0;
    dp[1] = 1;
    for (int i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    return dp[n];
}`
    },
    info: [
      "Uses memoization or tabulation to avoid redundant calculations.",
      "Reduces exponential time to linear time.",
      "Classic DP example."
    ],
    applications: [
      "Computing Fibonacci numbers efficiently",
      "Teaching dynamic programming concepts"
    ]
  },
  {
    name: "Knapsack",
    function: knapsack,
    description: "Solves the 0/1 Knapsack problem by finding the optimal combination of items that maximizes value while staying within capacity.",
    timeComplexity: { best: "O(nW)", average: "O(nW)", worst: "O(nW)" },
    spaceComplexity: "O(nW)",
    code: {
      JavaScript: `function knapsack(weights, values, capacity) {
  const n = weights.length;
  const dp = Array(n + 1).fill(0).map(() => Array(capacity + 1).fill(0));
  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= capacity; w++) {
      if (weights[i - 1] <= w) {
        dp[i][w] = Math.max(values[i - 1] + dp[i - 1][w - weights[i - 1]], dp[i - 1][w]);
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }
  return dp[n][capacity];
}`,
      Python: `def knapsack(weights, values, capacity):
    n = len(weights)
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        for w in range(capacity + 1):
            if weights[i - 1] <= w:
                dp[i][w] = max(values[i - 1] + dp[i - 1][w - weights[i - 1]], dp[i - 1][w])
            else:
                dp[i][w] = dp[i - 1][w]
    return dp[n][capacity]`,
      Java: `int knapsack(int[] weights, int[] values, int capacity) {
    int n = weights.length;
    int[][] dp = new int[n + 1][capacity + 1];
    for (int i = 1; i <= n; i++) {
        for (int w = 0; w <= capacity; w++) {
            if (weights[i - 1] <= w) {
                dp[i][w] = Math.max(values[i - 1] + dp[i - 1][w - weights[i - 1]], dp[i - 1][w]);
            } else {
                dp[i][w] = dp[i - 1][w];
            }
        }
    }
    return dp[n][capacity];
}`
    },
    info: [
      "Solves the 0/1 Knapsack problem using DP table.",
      "Builds up solutions to subproblems.",
      "Classic example of DP with two parameters."
    ],
    applications: [
      "Resource allocation",
      "Budget management",
      "Cargo loading"
    ]
  },
  {
    name: "LCS",
    function: lcs,
    description: "Finds the Longest Common Subsequence between two strings using dynamic programming.",
    timeComplexity: { best: "O(mn)", average: "O(mn)", worst: "O(mn)" },
    spaceComplexity: "O(mn)",
    code: {
      JavaScript: `function lcs(str1, str2) {
  const m = str1.length, n = str2.length;
  const dp = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  return dp[m][n];
}`,
      Python: `def lcs(str1, str2):
    m, n = len(str1), len(str2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if str1[i - 1] == str2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    return dp[m][n]`,
      Java: `int lcs(String str1, String str2) {
    int m = str1.length(), n = str2.length();
    int[][] dp = new int[m + 1][n + 1];
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (str1.charAt(i - 1) == str2.charAt(j - 1)) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }
    return dp[m][n];
}`
    },
    info: [
      "Finds the length of the longest subsequence present in both strings.",
      "Uses a 2D DP table.",
      "Classic example of DP on strings."
    ],
    applications: [
      "DNA sequence analysis",
      "File comparison",
      "Spell checking"
    ]
  },
  {
    name: "LIS",
    function: lis,
    description: "Finds the Longest Increasing Subsequence in an array using dynamic programming.",
    timeComplexity: { best: "O(n^2)", average: "O(n^2)", worst: "O(n^2)" },
    spaceComplexity: "O(n)",
    code: {
      JavaScript: `function lis(arr) {
  const n = arr.length;
  const dp = new Array(n).fill(1);
  for (let i = 1; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (arr[i] > arr[j]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
    }
  }
  return Math.max(...dp);
}`,
      Python: `def lis(arr):
    n = len(arr)
    dp = [1] * n
    for i in range(1, n):
        for j in range(i):
            if arr[i] > arr[j]:
                dp[i] = max(dp[i], dp[j] + 1)
    return max(dp)` ,
      Java: `int lis(int[] arr) {
    int n = arr.length;
    int[] dp = new int[n];
    Arrays.fill(dp, 1);
    for (int i = 1; i < n; i++) {
        for (int j = 0; j < i; j++) {
            if (arr[i] > arr[j]) {
                dp[i] = Math.max(dp[i], dp[j] + 1);
            }
        }
    }
    return Arrays.stream(dp).max().getAsInt();
}`
    },
    info: [
      "Finds the length of the longest increasing subsequence in an array.",
      "Uses a 1D DP array.",
      "Classic DP on arrays."
    ],
    applications: [
      "Stock market analysis",
      "Sequence alignment",
      "Data compression"
    ]
  }
];

export default function DP() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>("fibonacci");
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<Step[]>([]);
  const [input, setInput] = useState<string>("");
  const [state, setState] = useState({
    progress: 0,
    comparisons: 0,
    swaps: 0,
    timeElapsed: 0,
    currentArray: [] as number[],
    currentIndices: [] as number[],
    completed: false,
    dp: undefined as number[][] | undefined,
    current: undefined as number | undefined,
    currentCol: undefined as number | undefined,
  });
  const [showResultModal, setShowResultModal] = useState(false);
  const [finalAnswer, setFinalAnswer] = useState<string | number | null>(null);
  const [targetCapacity, setTargetCapacity] = useState<string>("");
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const getInputPlaceholder = () => {
    switch (selectedAlgorithm.toLowerCase()) {
      case "fibonacci":
        return "Enter n (e.g., 10)";
      case "knapsack":
        return "Enter weights, values, capacity (e.g., 2 3 4, 3 4 5, 10)";
      case "lcs":
        return "Enter two strings (e.g., ABCDGH, AEDFHR)";
      case "lis":
        return "Enter array (e.g., 10 22 9 33 21 50 41 60)";
      default:
        return "";
    }
  };

  const selectedAlgo = algorithms.find(algo => algo.name.toLowerCase() === selectedAlgorithm.toLowerCase());

  const startVisualization = () => {
    if (isPaused) {
      setIsPaused(false);
      return;
    }
    if (!selectedAlgo) return;
    const startTime = Date.now();
    let newSteps: Step[] = [];
    let inputArray: number[] = [];
    let answer: string | number | null = null;
    let selected: number[] = [];
    switch (selectedAlgorithm.toLowerCase()) {
      case "fibonacci": {
        const n = parseInt(input) || 10;
        newSteps = selectedAlgo.function(n);
        inputArray = Array.from({ length: n + 1 }, (_, i) => i);
        answer = n >= 0 ? (newSteps[newSteps.length - 1]?.dp?.[0]?.[n] ?? null) : null;
        break;
      }
      case "knapsack": {
        const [weights, values, capacity] = input.split(',').map(s => s.trim());
        const weightsArray = weights.split(' ').map(Number);
        const valuesArray = values.split(' ').map(Number);
        const cap = parseInt(capacity) || 10;
        const targetCap = parseInt(targetCapacity) || cap;
        newSteps = selectedAlgo.function(weightsArray, valuesArray, cap);
        inputArray = weightsArray;
        answer = newSteps[newSteps.length - 1]?.dp?.[weightsArray.length]?.[targetCap] ?? null;
        let w = targetCap;
        selected = [];
        for (let i = weightsArray.length; i > 0 && w > 0; i--) {
          if (newSteps[newSteps.length - 1]?.dp?.[i][w] !== newSteps[newSteps.length - 1]?.dp?.[i - 1][w]) {
            selected.push(i - 1);
            w -= weightsArray[i - 1];
          }
        }
        selected.reverse();
        break;
      }
      case "lcs": {
        const [str1, str2] = input.split(',').map(s => s.trim());
        newSteps = selectedAlgo.function(str1, str2);
        answer = (str1 && str2)
          ? (newSteps[newSteps.length - 1]?.dp?.[str1.length]?.[str2.length] ?? null)
          : null;
        inputArray = Array.from({ length: Math.max(str1.length, str2.length) }, (_, i) => i);
        break;
      }
      case "lis": {
        const numbers = input.split(' ').map(Number);
        newSteps = selectedAlgo.function(numbers);
        answer = numbers.length > 0 ? Math.max(...(newSteps[newSteps.length - 1]?.dp?.[0] || [0])) : null;
        inputArray = numbers;
        break;
      }
      default:
        return;
    }
    setSteps(newSteps);
    setCurrentStep(0);
    setIsRunning(true);
    setIsPaused(false);
    setShowResultModal(false);
    setFinalAnswer(null);
    let stepIndex = 0;
    const totalSteps = newSteps.length;
    const interval = setInterval(() => {
      if (isPaused) return;
      if (stepIndex < totalSteps) {
        const step = newSteps[stepIndex];
        setState(prevState => ({
          ...prevState,
          progress: Math.round((stepIndex / totalSteps) * 100),
          comparisons: prevState.comparisons + (step.comparison ? 1 : 0),
          swaps: prevState.swaps + (step.swap ? 1 : 0),
          currentArray: step.array || inputArray,
          currentIndices: step.indices || [],
          dp: step.dp,
          current: step.current,
          currentCol: step.currentCol,
          timeElapsed: Date.now() - startTime,
        }));
        stepIndex++;
      } else {
        setState(prevState => ({
          ...prevState,
          progress: 100,
          completed: true,
          timeElapsed: Date.now() - startTime,
        }));
        setFinalAnswer(answer);
        setSelectedItems(selected);
        setShowResultModal(true);
        clearInterval(interval);
        setIsRunning(false);
      }
    }, 1000 / (speed / 10));
    return () => clearInterval(interval);
  };

  const pauseVisualization = () => setIsPaused(true);
  const resetVisualization = () => {
    setIsRunning(false);
    setIsPaused(false);
    setCurrentStep(0);
    setSteps([]);
    setState({
      progress: 0,
      comparisons: 0,
      swaps: 0,
      timeElapsed: 0,
      currentArray: [],
      currentIndices: [],
      completed: false,
      dp: undefined,
      current: undefined,
      currentCol: undefined,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-black dark:to-black py-8 mt-10 w-full">
      <div className="container mx-auto px-4 w-full">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-8 text-center">
          Dynamic Programming Algorithms
        </h1>
        <div className="w-full">
          <Tabs defaultValue="visualization" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="visualization">Visualization</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
              <TabsTrigger value="info">Information</TabsTrigger>
            </TabsList>
            <TabsContent value="visualization">
              <Card className="mb-6 w-full">
                <CardHeader>
                  <CardTitle>{selectedAlgo?.name} Visualization</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                    <div className="space-y-4 w-full">
                      <div>
                        <label className="block text-sm font-medium mb-2">Algorithm</label>
                        <select
                          className="w-full p-2 border rounded bg-white text-black dark:bg-slate-800 dark:text-white"
                          value={selectedAlgorithm}
                          onChange={e => setSelectedAlgorithm(e.target.value)}
                          aria-label="Select algorithm"
                        >
                          {algorithms.map(algo => (
                            <option key={algo.name} value={algo.name.toLowerCase()}>
                              {algo.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Input</label>
                        <input
                          type="text"
                          className="w-full p-2 border rounded"
                          placeholder={getInputPlaceholder()}
                          value={input}
                          onChange={e => setInput(e.target.value)}
                        />
                      </div>
                      {selectedAlgorithm === "knapsack" && (
                        <div>
                          <label className="block text-sm font-medium mb-2">Target Capacity</label>
                          <input
                            type="number"
                            className="w-full p-2 border rounded"
                            placeholder="Enter target capacity (e.g., 10)"
                            value={targetCapacity}
                            onChange={e => setTargetCapacity(e.target.value)}
                          />
                        </div>
                      )}
                      <div>
                        <label className="block text-sm font-medium mb-2">Speed</label>
                        <Slider
                          value={[speed]}
                          onValueChange={value => setSpeed(value[0])}
                          min={1}
                          max={100}
                          step={1}
                        />
                      </div>
                      <div className="flex space-x-2">
                        {!isRunning ? (
                          <Button onClick={startVisualization}>
                            <Play className="mr-2 h-4 w-4" />
                            Start
                          </Button>
                        ) : (
                          <Button onClick={pauseVisualization}>
                            <Pause className="mr-2 h-4 w-4" />
                            Pause
                          </Button>
                        )}
                        <Button variant="outline" onClick={resetVisualization}>
                          <RotateCcw className="mr-2 h-4 w-4" />
                          Reset
                        </Button>
                      </div>
                    </div>
                    <AlgorithmVisualizer
                      algorithm={selectedAlgo || algorithms[0]}
                      type="dp"
                      state={state}
                      data={state.currentArray}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="code">
              <Card>
                <CardHeader>
                  <CardTitle>{selectedAlgo?.name} Implementation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-slate-900 dark:text-white font-medium mb-2">JavaScript</h4>
                      <pre className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg overflow-x-auto">
                        <code>{selectedAlgo?.code.JavaScript}</code>
                      </pre>
                    </div>
                    <div>
                      <h4 className="text-slate-900 dark:text-white font-medium mb-2">Python</h4>
                      <pre className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg overflow-x-auto">
                        <code>{selectedAlgo?.code.Python}</code>
                      </pre>
                    </div>
                    <div>
                      <h4 className="text-slate-900 dark:text-white font-medium mb-2">Java</h4>
                      <pre className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg overflow-x-auto">
                        <code>{selectedAlgo?.code.Java}</code>
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="info">
              <Card>
                <CardHeader>
                  <CardTitle>{selectedAlgo?.name} Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-slate-900 dark:text-white font-medium mb-2">Time Complexity</h4>
                      <ul className="space-y-1 text-slate-700 dark:text-slate-300">
                        <li>
                          <span className="text-green-600 dark:text-green-400 font-semibold">Best Case:</span>{' '}
                          {selectedAlgo?.timeComplexity.best}
                        </li>
                        <li>
                          <span className="text-yellow-600 dark:text-yellow-400 font-semibold">Average Case:</span>{' '}
                          {selectedAlgo?.timeComplexity.average}
                        </li>
                        <li>
                          <span className="text-red-600 dark:text-red-400 font-semibold">Worst Case:</span>{' '}
                          {selectedAlgo?.timeComplexity.worst}
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-slate-900 dark:text-white font-medium mb-2">Space Complexity</h4>
                      <p className="text-slate-700 dark:text-slate-300">{selectedAlgo?.spaceComplexity}</p>
                    </div>
                    {selectedAlgo?.info && (
                      <div>
                        <h4 className="text-slate-900 dark:text-white font-medium mb-2">Key Characteristics</h4>
                        <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
                          {selectedAlgo.info.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {selectedAlgo?.applications && (
                      <div>
                        <h4 className="text-slate-900 dark:text-white font-medium mb-2">Applications</h4>
                        <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
                          {selectedAlgo.applications.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      {showResultModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-6 min-w-[320px] relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-900 dark:hover:text-white"
              onClick={() => setShowResultModal(false)}
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-lg font-bold mb-4">Result</h3>
            <div className="mb-2">
              <span className="font-semibold">Answer:</span>
              <span className="ml-2 text-violet-700 dark:text-violet-300 text-lg font-mono">{finalAnswer !== null ? finalAnswer : "N/A"}</span>
            </div>
            {selectedAlgorithm === "knapsack" && selectedItems.length > 0 && (
              <div className="mt-2">
                <span className="font-semibold">Selected Items (0-based indices):</span>
                <span className="ml-2 text-violet-700 dark:text-violet-300 text-lg font-mono">{selectedItems.join(", ")}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 