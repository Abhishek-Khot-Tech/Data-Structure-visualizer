import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, RotateCcw, X } from "lucide-react";
import { activitySelection, huffmanCoding, coinChange, fractionalKnapsack } from "@/lib/greedy-algorithms";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AlgorithmVisualizer from "@/components/AlgorithmVisualizer";

interface Activity {
  start: number;
  end: number;
  index: number;
}

export default function Greedy() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>("activitySelection");
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<any[]>([]);
  const [input, setInput] = useState<string>("");
  const [showResultModal, setShowResultModal] = useState(false);
  const [finalAnswer, setFinalAnswer] = useState<string | number | null>(null);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);

  const greedyAlgorithms = [
    {
      name: "Activity Selection",
      function: activitySelection,
      description: "Selects the maximum number of non-overlapping activities.",
      code: {
        JavaScript: `function activitySelection(activities) {
  activities.sort((a, b) => a.end - b.end);
  let lastEnd = 0, selected = [];
  for (let i = 0; i < activities.length; i++) {
    if (activities[i].start >= lastEnd) {
      selected.push(i);
      lastEnd = activities[i].end;
    }
  }
  return selected;
}`,
        Python: `def activity_selection(activities):
    activities.sort(key=lambda x: x.end)
    last_end = 0
    selected = []
    for i, act in enumerate(activities):
        if act.start >= last_end:
            selected.append(i)
            last_end = act.end
    return selected`,
        Java: `List<Integer> activitySelection(List<Activity> activities) {
    activities.sort(Comparator.comparingInt(a -> a.end));
    int lastEnd = 0;
    List<Integer> selected = new ArrayList<>();
    for (int i = 0; i < activities.size(); i++) {
        if (activities.get(i).start >= lastEnd) {
            selected.add(i);
            lastEnd = activities.get(i).end;
        }
    }
    return selected;
}`
      },
      info: [
        "Sorts activities by end time.",
        "Greedy choice: always pick the next activity that finishes earliest.",
        "Classic interval scheduling problem."
      ],
      applications: [
        "Scheduling",
        "Resource allocation",
        "Event planning"
      ]
    },
    {
      name: "Huffman Coding",
      function: huffmanCoding,
      description: "Builds an optimal prefix code for a set of frequencies.",
      code: {
        JavaScript: `function huffmanCoding(freq) {
  // Build a min-heap, merge nodes, build tree, assign codes
}`,
        Python: `def huffman_coding(freq):
    # Build a min-heap, merge nodes, build tree, assign codes
`,
        Java: `void huffmanCoding(Map<Character, Integer> freq) {
    // Build a min-heap, merge nodes, build tree, assign codes
}`
      },
      info: [
        "Builds a binary tree with minimum weighted path length.",
        "Used for lossless data compression.",
        "Assigns shorter codes to more frequent symbols."
      ],
      applications: [
        "Data compression",
        "File formats (ZIP, JPEG, etc.)",
        "Network protocols"
      ]
    },
    {
      name: "Coin Change",
      function: coinChange,
      description: "Finds the minimum number of coins for a given amount using a greedy approach.",
      code: {
        JavaScript: `function coinChange(coins, amount) {
  coins.sort((a, b) => b - a);
  let count = 0;
  for (let coin of coins) {
    while (amount >= coin) {
      amount -= coin;
      count++;
    }
  }
  return count;
}`,
        Python: `def coin_change(coins, amount):
    coins.sort(reverse=True)
    count = 0
    for coin in coins:
        while amount >= coin:
            amount -= coin
            count += 1
    return count`,
        Java: `int coinChange(int[] coins, int amount) {
    Arrays.sort(coins);
    int count = 0;
    for (int i = coins.length - 1; i >= 0; i--) {
        while (amount >= coins[i]) {
            amount -= coins[i];
            count++;
        }
    }
    return count;
}`
      },
      info: [
        "Greedy for canonical coin systems (e.g., US coins).",
        "May not work for all coin systems.",
        "Simple and fast."
      ],
      applications: [
        "Making change",
        "ATM machines",
        "Vending machines"
      ]
    },
    {
      name: "Fractional Knapsack",
      function: fractionalKnapsack,
      description: "Maximizes value by taking fractions of items based on value/weight ratio.",
      code: {
        JavaScript: `function fractionalKnapsack(weights, values, capacity) {
  let items = weights.map((w, i) => ({ w, v: values[i], r: values[i]/w }));
  items.sort((a, b) => b.r - a.r);
  let total = 0;
  for (let item of items) {
    if (capacity >= item.w) {
      total += item.v;
      capacity -= item.w;
    } else {
      total += item.v * (capacity / item.w);
      break;
    }
  }
  return total;
}`,
        Python: `def fractional_knapsack(weights, values, capacity):
    items = sorted(zip(weights, values), key=lambda x: x[1]/x[0], reverse=True)
    total = 0
    for w, v in items:
        if capacity >= w:
            total += v
            capacity -= w
        else:
            total += v * (capacity / w)
            break
    return total`,
        Java: `double fractionalKnapsack(int[] weights, int[] values, int capacity) {
    Item[] items = ...; // value/weight ratio
    Arrays.sort(items, (a, b) -> Double.compare(b.ratio, a.ratio));
    double total = 0;
    for (Item item : items) {
        if (capacity >= item.weight) {
            total += item.value;
            capacity -= item.weight;
        } else {
            total += item.value * ((double)capacity / item.weight);
            break;
        }
    }
    return total;
}`
      },
      info: [
        "Sorts items by value/weight ratio.",
        "Takes as much as possible of the best item.",
        "Optimal for fractional case."
      ],
      applications: [
        "Resource allocation",
        "Cargo loading",
        "Budget optimization"
      ]
    }
  ];

  const startVisualization = () => {
    if (isPaused) {
      setIsPaused(false);
      return;
    }

    const selectedAlgo = greedyAlgorithms.find(algo => algo.name.toLowerCase() === selectedAlgorithm.toLowerCase());
    if (!selectedAlgo) return;

    let newSteps;
    let answer: string | number | null = null;
    let selected: any[] = [];
    switch (selectedAlgorithm.toLowerCase()) {
      case "activityselection": {
        const activities: Activity[] = input.split(';').map((activity, index) => {
          const [start, end] = activity.split(',').map(Number);
          return { start, end, index };
        });
        newSteps = activitySelection(activities);
        const lastStepA = newSteps[newSteps.length - 1];
        answer = lastStepA.selected ? lastStepA.selected.length : null;
        selected = lastStepA.selected || [];
        break;
      }
      case "huffmancoding": {
        const freq: { [key: string]: number } = {};
        input.split(',').forEach(pair => {
          const [char, count] = pair.split(':');
          freq[char] = parseInt(count);
        });
        newSteps = huffmanCoding(freq);
        const lastStepH = newSteps[newSteps.length - 1];
        answer = lastStepH.selected ? lastStepH.selected.join(', ') : null;
        selected = lastStepH.selected || [];
        break;
      }
      case "coinchange": {
        const [coins, amount] = input.split('|').map(s => s.trim());
        const coinsArr = coins.split(' ').map(Number);
        const amt = parseInt(amount) || 0;
        newSteps = coinChange(coinsArr, amt);
        const lastStepC = newSteps[newSteps.length - 1];
        answer = lastStepC.selected ? lastStepC.selected.length : null;
        selected = lastStepC.selected || [];
        break;
      }
      case "fractionalknapsack": {
        const [weights, values, capacity] = input.split('|').map(s => s.trim());
        const weightsArr = weights.split(' ').map(Number);
        const valuesArr = values.split(' ').map(Number);
        const cap = parseInt(capacity) || 0;
        newSteps = fractionalKnapsack(weightsArr, valuesArr, cap);
        const lastStepF = newSteps[newSteps.length - 1];
        answer = lastStepF.selected ? lastStepF.selected.length : null;
        selected = lastStepF.selected || [];
        break;
      }
      default:
        return;
    }

    setSteps(newSteps);
    setCurrentStep(0);
    setIsRunning(true);
    setIsPaused(false);
    setFinalAnswer(answer);
    setSelectedItems(selected);
    setShowResultModal(false);
    let stepIndex = 0;
    const totalSteps = newSteps.length;
    const interval = setInterval(() => {
      if (isPaused) return;
      if (stepIndex < totalSteps) {
        setCurrentStep(stepIndex);
        stepIndex++;
      } else {
        setShowResultModal(true);
        clearInterval(interval);
        setIsRunning(false);
      }
    }, 1000 / (speed / 10));
    return () => clearInterval(interval);
  };

  const pauseVisualization = () => {
    setIsPaused(true);
  };

  const resetVisualization = () => {
    setIsRunning(false);
    setIsPaused(false);
    setCurrentStep(0);
    setSteps([]);
  };

  const getInputPlaceholder = () => {
    switch (selectedAlgorithm.toLowerCase()) {
      case "activityselection":
        return "Enter activities (e.g., 1,4;2,6;4,7;6,9)";
      case "huffmancoding":
        return "Enter character frequencies (e.g., a:5,b:9,c:12,d:13,e:16,f:45)";
      case "coinchange":
        return "Enter coins and amount (e.g., 1 2 5 | 11)";
      case "fractionalknapsack":
        return "Enter weights, values, and capacity (e.g., 10 20 30 | 60 100 120 | 50)";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-black dark:to-black py-8 mt-10 w-full">
      <div className="container mx-auto px-4 w-full">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-8 text-center">
          Greedy Algorithms
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
                  <CardTitle>{selectedAlgorithm} Visualization</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                    <div className="space-y-4 w-full">
                      <div>
                        <label className="block text-sm font-medium mb-2">Algorithm</label>
                        <select
                          className="w-full p-2 border rounded dark:bg-slate-800 dark:text-white"
                          value={selectedAlgorithm}
                          onChange={(e) => setSelectedAlgorithm(e.target.value)}
                          aria-label="Select algorithm"
                        >
                          {greedyAlgorithms.map((algo) => (
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
                          className="w-full p-2 border rounded dark:bg-slate-800 dark:text-white"
                          placeholder={getInputPlaceholder()}
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Speed</label>
                        <Slider
                          value={[speed]}
                          onValueChange={(value) => setSpeed(value[0])}
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
                      algorithm={greedyAlgorithms.find(a => a.name.toLowerCase() === selectedAlgorithm.toLowerCase()) || greedyAlgorithms[0]}
                      type="greedy"
                      state={{
                        progress: 100 * (currentStep / Math.max(steps.length - 1, 1)),
                        comparisons: 0,
                        swaps: 0,
                        timeElapsed: 0,
                        currentArray: steps[currentStep]?.selected || steps[currentStep]?.array || [],
                        currentIndices: steps[currentStep]?.current !== undefined ? [steps[currentStep]?.current] : [],
                        completed: currentStep === steps.length - 1,
                      }}
                      data={steps[currentStep]}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="code">
              <Card>
                <CardHeader>
                  <CardTitle>{greedyAlgorithms.find(a => a.name.toLowerCase() === selectedAlgorithm.toLowerCase())?.name} Implementation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-slate-900 dark:text-white font-medium mb-2">JavaScript</h4>
                      <pre className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg overflow-x-auto">
                        <code>{greedyAlgorithms.find(a => a.name.toLowerCase() === selectedAlgorithm.toLowerCase())?.code.JavaScript}</code>
                      </pre>
                    </div>
                    <div>
                      <h4 className="text-slate-900 dark:text-white font-medium mb-2">Python</h4>
                      <pre className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg overflow-x-auto">
                        <code>{greedyAlgorithms.find(a => a.name.toLowerCase() === selectedAlgorithm.toLowerCase())?.code.Python}</code>
                      </pre>
                    </div>
                    <div>
                      <h4 className="text-slate-900 dark:text-white font-medium mb-2">Java</h4>
                      <pre className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg overflow-x-auto">
                        <code>{greedyAlgorithms.find(a => a.name.toLowerCase() === selectedAlgorithm.toLowerCase())?.code.Java}</code>
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="info">
              <Card>
                <CardHeader>
                  <CardTitle>{greedyAlgorithms.find(a => a.name.toLowerCase() === selectedAlgorithm.toLowerCase())?.name} Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {greedyAlgorithms.find(a => a.name.toLowerCase() === selectedAlgorithm.toLowerCase())?.info && (
                      <div>
                        <h4 className="text-slate-900 dark:text-white font-medium mb-2">Key Characteristics</h4>
                        <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
                          {greedyAlgorithms.find(a => a.name.toLowerCase() === selectedAlgorithm.toLowerCase())?.info.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {greedyAlgorithms.find(a => a.name.toLowerCase() === selectedAlgorithm.toLowerCase())?.applications && (
                      <div>
                        <h4 className="text-slate-900 dark:text-white font-medium mb-2">Applications</h4>
                        <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
                          {greedyAlgorithms.find(a => a.name.toLowerCase() === selectedAlgorithm.toLowerCase())?.applications.map((item, idx) => (
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
            {selectedAlgorithm === "coinchange" && selectedItems.length > 0 && (
              <div className="mt-2">
                <span className="font-semibold">Selected Coins:</span>
                <span className="ml-2 text-violet-700 dark:text-violet-300 text-lg font-mono">{selectedItems.join(", ")}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 