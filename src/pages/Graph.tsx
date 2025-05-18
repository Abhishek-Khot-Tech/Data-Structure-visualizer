// Interfaces
interface Graph {
  vertices: number;
  edges: number[][];
}

interface Algorithm {
  key: string;
  name: string;
  function: (graph: Graph, start: number, end?: number) => any[];
  description: string;
  timeComplexity: {
    best: string;
    average: string;
    worst: string;
  };
  spaceComplexity: string;
  code: {
    JavaScript: string;
    Python: string;
    Java: string;
  };
  info?: string[];
  applications?: string[];
}

import React, { useState, useEffect } from 'react';
import { bfs, dfs, dijkstra, prim, kruskal } from "@/lib/graph-algorithms";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, RotateCcw, X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AlgorithmVisualizer from "@/components/AlgorithmVisualizer";

const algorithms: Algorithm[] = [
  {
    key: "bfs",
    name: "BFS",
    function: bfs,
    description: "Breadth-First Search traverses the graph level by level, visiting all neighbors of a node before moving to the next level.",
    timeComplexity: { best: "O(V + E)", average: "O(V + E)", worst: "O(V + E)" },
    spaceComplexity: "O(V)",
    code: {
      JavaScript: `function bfs(graph, start) {
  const visited = new Array(graph.vertices).fill(false);
  const queue = [start];
  visited[start] = true;
  while (queue.length > 0) {
    const node = queue.shift();
    for (const neighbor of graph.edges[node]) {
      if (!visited[neighbor]) {
        visited[neighbor] = true;
        queue.push(neighbor);
      }
    }
  }
}`,
      Python: `def bfs(graph, start):
    visited = [False] * graph.vertices
    queue = [start]
    visited[start] = True
    while queue:
        node = queue.pop(0)
        for neighbor in graph.edges[node]:
            if not visited[neighbor]:
                visited[neighbor] = True
                queue.append(neighbor)`,
      Java: `void bfs(Graph graph, int start) {
    boolean[] visited = new boolean[graph.vertices];
    Queue<Integer> queue = new LinkedList<>();
    visited[start] = true;
    queue.add(start);
    while (!queue.isEmpty()) {
        int node = queue.poll();
        for (int neighbor : graph.edges[node]) {
            if (!visited[neighbor]) {
                visited[neighbor] = true;
                queue.add(neighbor);
            }
        }
    }
}`
    },
    info: [
      "Visits all nodes at the current depth before moving to the next level.",
      "Finds the shortest path in unweighted graphs.",
      "Can be used to check connectivity."
    ],
    applications: [
      "Finding shortest path in unweighted graphs",
      "Web crawlers",
      "Social networking sites"
    ]
  },
  {
    key: "dfs",
    name: "DFS",
    function: dfs,
    description: "Depth-First Search explores as far as possible along each branch before backtracking.",
    timeComplexity: { best: "O(V + E)", average: "O(V + E)", worst: "O(V + E)" },
    spaceComplexity: "O(V)",
    code: {
      JavaScript: `function dfs(graph, start) {
  const visited = new Array(graph.vertices).fill(false);
  function dfsHelper(node) {
    visited[node] = true;
    for (const neighbor of graph.edges[node]) {
      if (!visited[neighbor]) {
        dfsHelper(neighbor);
      }
    }
  }
  dfsHelper(start);
}`,
      Python: `def dfs(graph, start):
    visited = [False] * graph.vertices
    def dfs_helper(node):
        visited[node] = True
        for neighbor in graph.edges[node]:
            if not visited[neighbor]:
                dfs_helper(neighbor)
    dfs_helper(start)`,
      Java: `void dfs(Graph graph, int start) {
    boolean[] visited = new boolean[graph.vertices];
    dfsHelper(graph, start, visited);
}
void dfsHelper(Graph graph, int node, boolean[] visited) {
    visited[node] = true;
    for (int neighbor : graph.edges[node]) {
        if (!visited[neighbor]) {
            dfsHelper(graph, neighbor, visited);
        }
    }
}`
    },
    info: [
      "Explores as far as possible along each branch before backtracking.",
      "Can be implemented recursively or with a stack.",
      "Useful for topological sorting and cycle detection."
    ],
    applications: [
      "Path finding",
      "Cycle detection",
      "Topological sorting",
      "Solving puzzles (mazes, etc.)"
    ]
  },
  {
    key: "dijkstra",
    name: "Dijkstra's",
    function: dijkstra,
    description: "Dijkstra's algorithm finds the shortest path between nodes in a graph with non-negative edge weights.",
    timeComplexity: { best: "O((V + E)logV)", average: "O((V + E)logV)", worst: "O((V + E)logV)" },
    spaceComplexity: "O(V)",
    code: {
      JavaScript: `function dijkstra(graph, start) {
  const distances = new Array(graph.vertices).fill(Infinity);
  const visited = new Array(graph.vertices).fill(false);
  distances[start] = 0;
  for (let i = 0; i < graph.vertices; i++) {
    let minDist = Infinity, minVertex = -1;
    for (let j = 0; j < graph.vertices; j++) {
      if (!visited[j] && distances[j] < minDist) {
        minDist = distances[j];
        minVertex = j;
      }
    }
    if (minVertex === -1) break;
    visited[minVertex] = true;
    for (const neighbor of graph.edges[minVertex]) {
      const weight = 1;
      if (!visited[neighbor] && distances[minVertex] + weight < distances[neighbor]) {
        distances[neighbor] = distances[minVertex] + weight;
      }
    }
  }
}`,
      Python: `def dijkstra(graph, start):
    distances = [float('inf')] * graph.vertices
    visited = [False] * graph.vertices
    distances[start] = 0
    for _ in range(graph.vertices):
        min_dist = float('inf')
        min_vertex = -1
        for j in range(graph.vertices):
            if not visited[j] and distances[j] < min_dist:
                min_dist = distances[j]
                min_vertex = j
        if min_vertex == -1:
            break
        visited[min_vertex] = True
        for neighbor in graph.edges[min_vertex]:
            weight = 1
            if not visited[neighbor] and distances[min_vertex] + weight < distances[neighbor]:
                distances[neighbor] = distances[min_vertex] + weight` ,
      Java: `void dijkstra(Graph graph, int start) {
    int[] distances = new int[graph.vertices];
    boolean[] visited = new boolean[graph.vertices];
    Arrays.fill(distances, Integer.MAX_VALUE);
    distances[start] = 0;
    for (int i = 0; i < graph.vertices; i++) {
        int minDist = Integer.MAX_VALUE, minVertex = -1;
        for (int j = 0; j < graph.vertices; j++) {
            if (!visited[j] && distances[j] < minDist) {
                minDist = distances[j];
                minVertex = j;
            }
        }
        if (minVertex == -1) break;
        visited[minVertex] = true;
        for (int neighbor : graph.edges[minVertex]) {
            int weight = 1;
            if (!visited[neighbor] && distances[minVertex] + weight < distances[neighbor]) {
                distances[neighbor] = distances[minVertex] + weight;
            }
        }
    }
}`
    },
    info: [
      "Finds the shortest path from a start node to all other nodes in a weighted graph with non-negative weights.",
      "Uses a greedy approach and a priority queue for efficiency.",
      "Does not work with negative edge weights."
    ],
    applications: [
      "GPS navigation",
      "Network routing protocols",
      "Robot path planning"
    ]
  },
  {
    key: "prims",
    name: "Prim's",
    function: prim,
    description: "Prim's algorithm finds a minimum spanning tree for a weighted undirected graph.",
    timeComplexity: { best: "O(ElogV)", average: "O(ElogV)", worst: "O(ElogV)" },
    spaceComplexity: "O(V)",
    code: {
      JavaScript: `function prim(graph) {
  const visited = new Array(graph.vertices).fill(false);
  visited[0] = true;
  for (let i = 0; i < graph.vertices - 1; i++) {
    let minEdge = Infinity, minVertex = -1;
    for (let j = 0; j < graph.vertices; j++) {
      if (visited[j]) {
        for (const neighbor of graph.edges[j]) {
          if (!visited[neighbor]) {
            const weight = 1;
            if (weight < minEdge) {
              minEdge = weight;
              minVertex = neighbor;
            }
          }
        }
      }
    }
    if (minVertex === -1) break;
    visited[minVertex] = true;
  }
}`,
      Python: `def prim(graph):
    visited = [False] * graph.vertices
    visited[0] = True
    for _ in range(graph.vertices - 1):
        min_edge = float('inf')
        min_vertex = -1
        for j in range(graph.vertices):
            if visited[j]:
                for neighbor in graph.edges[j]:
                    if not visited[neighbor]:
                        weight = 1
                        if weight < min_edge:
                            min_edge = weight
                            min_vertex = neighbor
        if min_vertex == -1:
            break
        visited[min_vertex] = True` ,
      Java: `void prim(Graph graph) {
    boolean[] visited = new boolean[graph.vertices];
    visited[0] = true;
    for (int i = 0; i < graph.vertices - 1; i++) {
        int minEdge = Integer.MAX_VALUE, minVertex = -1;
        for (int j = 0; j < graph.vertices; j++) {
            if (visited[j]) {
                for (int neighbor : graph.edges[j]) {
                    if (!visited[neighbor]) {
                        int weight = 1;
                        if (weight < minEdge) {
                            minEdge = weight;
                            minVertex = neighbor;
                        }
                    }
                }
            }
        }
        if (minVertex == -1) break;
        visited[minVertex] = true;
    }
}`
    },
    info: [
      "Builds the minimum spanning tree by adding the cheapest edge from the tree to a new vertex.",
      "Uses a greedy approach.",
      "Works only for connected graphs."
    ],
    applications: [
      "Network design",
      "Cluster analysis",
      "Approximation algorithms"
    ]
  },
  {
    key: "kruskals",
    name: "Kruskal's",
    function: kruskal,
    description: "Kruskal's algorithm finds a minimum spanning tree by sorting edges and adding them one by one.",
    timeComplexity: { best: "O(ElogE)", average: "O(ElogE)", worst: "O(ElogE)" },
    spaceComplexity: "O(V + E)",
    code: {
      JavaScript: `function kruskal(graph) {
  // Create edge list and sort by weight
  // Use union-find to avoid cycles
  // Add edges to MST until all vertices are included
}`,
      Python: `def kruskal(graph):
    # Create edge list and sort by weight
    # Use union-find to avoid cycles
    # Add edges to MST until all vertices are included` ,
      Java: `void kruskal(Graph graph) {
    // Create edge list and sort by weight
    // Use union-find to avoid cycles
    // Add edges to MST until all vertices are included
}`
    },
    info: [
      "Sorts all edges by weight and adds them one by one to the MST, skipping those that would form a cycle.",
      "Uses union-find data structure.",
      "Works for disconnected graphs."
    ],
    applications: [
      "Network design",
      "Approximation algorithms",
      "Clustering"
    ]
  }
];

const defaultGraph: Graph = {
  vertices: 6,
  edges: [
    [1, 2],
    [0, 2, 3],
    [0, 1, 3, 4],
    [1, 2, 4, 5],
    [2, 3, 5],
    [3, 4],
  ],
};

function Graph() {
  const [graph, setGraph] = useState<Graph>(defaultGraph);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>(algorithms[0].key);
  const [startNode, setStartNode] = useState<number>(0);
  const [endNode, setEndNode] = useState<number>(graph.vertices - 1);
  const [customInput, setCustomInput] = useState<string>("");
  const [speed, setSpeed] = useState(50);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [steps, setSteps] = useState<any[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [state, setState] = useState({
    progress: 0,
    comparisons: 0,
    swaps: 0,
    timeElapsed: 0,
    currentIndices: [] as number[],
    completed: false,
  });
  const [finalPath, setFinalPath] = useState<number[]>([]);
  const [showMSTModal, setShowMSTModal] = useState(false);
  const [mstEdges, setMstEdges] = useState<number[][]>([]);
  const [mstCost, setMstCost] = useState<number>(0);

  useEffect(() => {
    setEndNode(graph.vertices - 1);
  }, [graph.vertices]);

  const selectedAlgo = algorithms.find(algo => algo.key === selectedAlgorithm);
  const isPathAlgorithm = (algoKey: string) => ["dijkstra", "bfs", "dfs"].includes(algoKey);
  const isMSTAlgorithm = (algoKey: string) => ["prims", "kruskals"].includes(algoKey);

  const handleCustomInput = () => {
    try {
      const [vertices, edgesStr] = customInput.split('\n');
      const numVertices = parseInt(vertices);
      const edges = edgesStr.split(';').map(edgeStr =>
        edgeStr.split(',').map(num => parseInt(num.trim()))
      );
      setGraph({ vertices: numVertices, edges });
    } catch (error) {
      // Invalid input
    }
  };

  const startVisualization = () => {
    if (isPaused) {
      setIsPaused(false);
      return;
    }
    if (!selectedAlgo) return;
    const startTime = Date.now();
    let newSteps;
    if (isPathAlgorithm(selectedAlgorithm)) {
      newSteps = selectedAlgo.function(graph, startNode, endNode);
    } else {
      newSteps = selectedAlgo.function(graph, startNode);
    }
    setSteps(newSteps);
    setCurrentStep(0);
    setIsRunning(true);
    setIsPaused(false);
    let stepIndex = 0;
    const totalSteps = newSteps.length;
    setFinalPath([]);
    setShowMSTModal(false);
    setMstEdges([]);
    setMstCost(0);
    const interval = setInterval(() => {
      if (isPaused) return;
      if (stepIndex < totalSteps) {
        const step = newSteps[stepIndex];
        setState(prevState => ({
          ...prevState,
          progress: Math.round((stepIndex / totalSteps) * 100),
          comparisons: prevState.comparisons + (step.comparison ? 1 : 0),
          swaps: prevState.swaps + (step.swap ? 1 : 0),
          currentIndices: step.current !== undefined ? [step.current] : [],
          timeElapsed: Date.now() - startTime,
        }));
        setFinalPath(step.path || []);
        stepIndex++;
      } else {
        setState(prevState => ({
          ...prevState,
          progress: 100,
          completed: true,
          timeElapsed: Date.now() - startTime,
        }));
        if (newSteps.length > 0 && newSteps[newSteps.length - 1].path) {
          setFinalPath(newSteps[newSteps.length - 1].path);
        }
        if (isMSTAlgorithm(selectedAlgorithm)) {
          const lastStep = newSteps[newSteps.length - 1];
          const pathArr = lastStep && lastStep.path ? lastStep.path : [];
          const edges: number[][] = [];
          let cost = 0;
          for (let i = 0; i < pathArr.length - 1; i += 2) {
            if (typeof pathArr[i] === 'number' && typeof pathArr[i + 1] === 'number') {
              edges.push([pathArr[i], pathArr[i + 1]]);
              cost += 1;
            }
          }
          setMstEdges(edges);
          setMstCost(cost);
          setShowMSTModal(true);
        }
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
      currentIndices: [],
      completed: false,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-black dark:to-black py-8 mt-10 w-full">
      <div className="container mx-auto px-4 w-full">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-8 text-center">
          Graph Algorithms
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
                            <option key={algo.key} value={algo.key}>
                              {algo.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      {isPathAlgorithm(selectedAlgorithm) && (
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <label className="block text-sm font-medium mb-2">Start Node</label>
                            <input
                              type="number"
                              min={0}
                              max={graph.vertices - 1}
                              className="w-full p-2 border rounded"
                              value={startNode}
                              onChange={e => setStartNode(Number(e.target.value))}
                              placeholder="Start node index"
                              title="Start node index"
                            />
                          </div>
                          <div className="flex-1">
                            <label className="block text-sm font-medium mb-2">Target Node</label>
                            <input
                              type="number"
                              min={0}
                              max={graph.vertices - 1}
                              className="w-full p-2 border rounded"
                              value={endNode}
                              onChange={e => setEndNode(Number(e.target.value))}
                              placeholder="Target node index"
                              title="Target node index"
                            />
                          </div>
                        </div>
                      )}
                      <div>
                        <label className="block text-sm font-medium mb-2">Custom Graph Input</label>
                        <textarea
                          className="w-full p-2 border rounded h-24"
                          placeholder={"6\n0,1;1,2;2,3;3,4;4,5;5,0"}
                          value={customInput}
                          onChange={e => setCustomInput(e.target.value)}
                        />
                        <Button className="mt-2" onClick={handleCustomInput}>
                          Apply Graph
                        </Button>
                      </div>
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
                      {finalPath.length > 0 && (
                        <div className="mt-4">
                          <h4 className="font-semibold mb-2">Path Traversed:</h4>
                          <div className="flex flex-wrap gap-2">
                            {finalPath.map((node, idx) => (
                              <span key={idx} className="px-3 py-1 bg-violet-600 text-white rounded-full text-sm">
                                {node}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <AlgorithmVisualizer
                      algorithm={selectedAlgo || algorithms[0]}
                      type="graph"
                      state={state}
                      data={graph}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="code">
              <Card>
                <CardHeader>
                  <CardTitle>{selectedAlgo?.name} Code</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="JavaScript">
                    <TabsList>
                      <TabsTrigger value="JavaScript">JavaScript</TabsTrigger>
                      <TabsTrigger value="Python">Python</TabsTrigger>
                      <TabsTrigger value="Java">Java</TabsTrigger>
                    </TabsList>
                    <TabsContent value="JavaScript">
                      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
                        <code>{selectedAlgo?.code.JavaScript}</code>
                      </pre>
                    </TabsContent>
                    <TabsContent value="Python">
                      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
                        <code>{selectedAlgo?.code.Python}</code>
                      </pre>
                    </TabsContent>
                    <TabsContent value="Java">
                      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
                        <code>{selectedAlgo?.code.Java}</code>
                      </pre>
                    </TabsContent>
                  </Tabs>
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
        {showMSTModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-6 min-w-[320px] relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-900 dark:hover:text-white"
                onClick={() => setShowMSTModal(false)}
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
              <h3 className="text-lg font-bold mb-4">Minimum Spanning Tree</h3>
              <div className="mb-2">
                <span className="font-semibold">Edges:</span>
                <ul className="list-disc list-inside mt-2">
                  {mstEdges.map(([u, v], idx) => (
                    <li key={idx} className="text-sm">{u} - {v}</li>
                  ))}
                </ul>
              </div>
              <div className="mt-2">
                <span className="font-semibold">Total Cost:</span> <span>{mstCost}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Graph;