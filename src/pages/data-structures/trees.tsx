import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, RotateCcw } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

interface TreeVisualizerProps {
  tree: TreeNode | null;
  operation: string;
  highlight: number | null;
  animationState: string;
  animationStep: number;
  newElement: number | null;
  activeIndex: number | null;
}

function TreeVisualizer({ tree, operation, highlight, animationState, animationStep, newElement, activeIndex }: TreeVisualizerProps) {
  const renderNode = (node: TreeNode | null, x: number, y: number, level: number, isLeft: boolean) => {
    if (!node) return null;

    const nodeWidth = 60;
    const nodeHeight = 60;
    const levelHeight = 100;
    const offset = Math.pow(2, level) * 30;

    return (
      <div key={node.val} className="absolute" style={{ left: x, top: y }}>
        <div
          className={`
            w-14 h-14 flex items-center justify-center rounded-full border-2
            ${
              activeIndex === node.val
                ? animationState === "deleting"
                  ? "border-red-500 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 animate-pulse"
                  : animationState === "searching"
                    ? "border-blue-500 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 animate-pulse"
                    : "border-purple-500 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 animate-pulse"
                : highlight === node.val
                  ? "border-yellow-500 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300"
                  : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            }
            transition-all duration-300
          `}
        >
          <span className="text-lg font-medium">{node.val}</span>
        </div>

        {/* Left child */}
        {node.left && (
          <>
            <div
              className="absolute w-0.5 bg-slate-400 dark:bg-slate-600"
              style={{
                left: nodeWidth / 2,
                top: nodeHeight,
                width: '2px',
                height: levelHeight,
                transform: 'rotate(-30deg)',
                transformOrigin: 'top left'
              }}
            />
            {renderNode(node.left, x - offset, y + levelHeight, level + 1, true)}
          </>
        )}

        {/* Right child */}
        {node.right && (
          <>
            <div
              className="absolute w-0.5 bg-slate-400 dark:bg-slate-600"
              style={{
                left: nodeWidth / 2,
                top: nodeHeight,
                width: '2px',
                height: levelHeight,
                transform: 'rotate(30deg)',
                transformOrigin: 'top left'
              }}
            />
            {renderNode(node.right, x + offset, y + levelHeight, level + 1, false)}
          </>
        )}
      </div>
    );
  };

  return (
    <div className="aspect-square bg-slate-100 dark:bg-slate-800 rounded-lg relative overflow-hidden">
      {tree ? (
        <div className="absolute inset-0 flex items-center justify-center">
          {renderNode(tree, 50, 50, 0, true)}
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-slate-700 dark:text-slate-200">Empty Tree</span>
        </div>
      )}

      {/* New element being inserted */}
      {animationState === "inserting" && animationStep === 1 && newElement !== null && (
        <div
          className="absolute w-14 h-14 flex items-center justify-center rounded-full border-2 border-green-500 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 animate-bounce"
          style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
        >
          <span className="text-lg font-medium">{newElement}</span>
        </div>
      )}
    </div>
  );
}

const treeAlgorithms = [
  {
    name: "Insert",
    description: "Insert a value into the binary search tree.",
    code: {
      JavaScript: `function insert(root, value) {
  if (!root) return { val: value, left: null, right: null };
  if (value < root.val) root.left = insert(root.left, value);
  else root.right = insert(root.right, value);
  return root;
}`,
      Python: `def insert(root, value):
    if not root:
        return Node(value)
    if value < root.val:
        root.left = insert(root.left, value)
    else:
        root.right = insert(root.right, value)
    return root`,
      Java: `TreeNode insert(TreeNode root, int value) {
    if (root == null) return new TreeNode(value);
    if (value < root.val) root.left = insert(root.left, value);
    else root.right = insert(root.right, value);
    return root;
}`
    },
    info: [
      "Maintains BST property.",
      "Recursive or iterative implementation.",
      "O(h) time complexity."
    ],
    applications: [
      "Dynamic set operations",
      "Database indexing"
    ]
  },
  {
    name: "Delete",
    description: "Delete a value from the binary search tree.",
    code: {
      JavaScript: `function deleteNode(root, value) {
  if (!root) return null;
  if (value < root.val) root.left = deleteNode(root.left, value);
  else if (value > root.val) root.right = deleteNode(root.right, value);
  else {
    if (!root.left) return root.right;
    if (!root.right) return root.left;
    let minLarger = root.right;
    while (minLarger.left) minLarger = minLarger.left;
    root.val = minLarger.val;
    root.right = deleteNode(root.right, minLarger.val);
  }
  return root;
}`,
      Python: `def delete_node(root, value):
    if not root:
        return None
    if value < root.val:
        root.left = delete_node(root.left, value)
    elif value > root.val:
        root.right = delete_node(root.right, value)
    else:
        if not root.left:
            return root.right
        if not root.right:
            return root.left
        min_larger = root.right
        while min_larger.left:
            min_larger = min_larger.left
        root.val = min_larger.val
        root.right = delete_node(root.right, min_larger.val)
    return root`,
      Java: `TreeNode deleteNode(TreeNode root, int value) {
    if (root == null) return null;
    if (value < root.val) root.left = deleteNode(root.left, value);
    else if (value > root.val) root.right = deleteNode(root.right, value);
    else {
        if (root.left == null) return root.right;
        if (root.right == null) return root.left;
        TreeNode minLarger = root.right;
        while (minLarger.left != null) minLarger = minLarger.left;
        root.val = minLarger.val;
        root.right = deleteNode(root.right, minLarger.val);
    }
    return root;
}`
    },
    info: [
      "Handles three cases: leaf, one child, two children.",
      "Maintains BST property.",
      "O(h) time complexity."
    ],
    applications: [
      "Dynamic set operations",
      "Database indexing"
    ]
  },
  {
    name: "Search",
    description: "Search for a value in the binary search tree.",
    code: {
      JavaScript: `function search(root, value) {
  if (!root) return false;
  if (root.val === value) return true;
  if (value < root.val) return search(root.left, value);
  return search(root.right, value);
}`,
      Python: `def search(root, value):
    if not root:
        return False
    if root.val == value:
        return True
    if value < root.val:
        return search(root.left, value)
    return search(root.right, value)`,
      Java: `boolean search(TreeNode root, int value) {
    if (root == null) return false;
    if (root.val == value) return true;
    if (value < root.val) return search(root.left, value);
    return search(root.right, value);
}`
    },
    info: [
      "Follows BST property for efficient search.",
      "O(h) time complexity.",
      "Recursive or iterative implementation."
    ],
    applications: [
      "Membership test",
      "Database indexing"
    ]
  },
  {
    name: "Inorder Traversal",
    description: "Traverse the tree in inorder (left, root, right).",
    code: {
      JavaScript: `function inorder(root) {
  if (!root) return;
  inorder(root.left);
  visit(root);
  inorder(root.right);
}`,
      Python: `def inorder(root):
    if not root:
        return
    inorder(root.left)
    visit(root)
    inorder(root.right)`,
      Java: `void inorder(TreeNode root) {
    if (root == null) return;
    inorder(root.left);
    visit(root);
    inorder(root.right);
}`
    },
    info: [
      "Visits nodes in sorted order for BST.",
      "O(n) time complexity.",
      "Recursive or iterative implementation."
    ],
    applications: [
      "Sorted output",
      "Tree to array conversion"
    ]
  }
];

export default function Trees() {
  const [selectedOperation, setSelectedOperation] = useState<string>("Insert");
  const [input, setInput] = useState("");
  const [tree, setTree] = useState<TreeNode | null>({
    val: 8,
    left: {
      val: 3,
      left: { val: 1, left: null, right: null },
      right: {
        val: 6,
        left: { val: 4, left: null, right: null },
        right: { val: 7, left: null, right: null }
      }
    },
    right: {
      val: 10,
      left: null,
      right: {
        val: 14,
        left: { val: 13, left: null, right: null },
        right: null
      }
    }
  });
  const [highlight, setHighlight] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [animationState, setAnimationState] = useState<string>("idle");
  const [animationStep, setAnimationStep] = useState(0);
  const [newElement, setNewElement] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const insertNode = (root: TreeNode | null, value: number): TreeNode => {
    if (!root) {
      return { val: value, left: null, right: null };
    }

    if (value < root.val) {
      root.left = insertNode(root.left, value);
    } else {
      root.right = insertNode(root.right, value);
    }

    return root;
  };

  const deleteNode = (root: TreeNode | null, value: number): TreeNode | null => {
    if (!root) return null;

    if (value < root.val) {
      root.left = deleteNode(root.left, value);
    } else if (value > root.val) {
      root.right = deleteNode(root.right, value);
    } else {
      if (!root.left) return root.right;
      if (!root.right) return root.left;

      let minLarger = root.right;
      while (minLarger.left) {
        minLarger = minLarger.left;
      }
      root.val = minLarger.val;
      root.right = deleteNode(root.right, minLarger.val);
    }

    return root;
  };

  const searchNode = (root: TreeNode | null, value: number): boolean => {
    if (!root) return false;
    if (root.val === value) return true;
    if (value < root.val) return searchNode(root.left, value);
    return searchNode(root.right, value);
  };

  const inorderTraversal = (root: TreeNode | null): number[] => {
    const result: number[] = [];
    const traverse = (node: TreeNode | null) => {
      if (!node) return;
      traverse(node.left);
      result.push(node.val);
      traverse(node.right);
    };
    traverse(root);
    return result;
  };

  const handleStart = async () => {
    if (!input && selectedOperation !== "Inorder Traversal") return;
    
    setIsRunning(true);
    setAnimationState(selectedOperation.toLowerCase());
    setAnimationStep(1);

    const value = parseInt(input);
    if (isNaN(value) && selectedOperation !== "Inorder Traversal") {
      alert("Please enter a valid number");
      setIsRunning(false);
      return;
    }

    switch (selectedOperation) {
      case "Insert":
        setNewElement(value);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setTree(prev => insertNode(prev, value));
        setNewElement(null);
        break;

      case "Delete":
        if (!tree) {
          alert("Tree is empty");
          setIsRunning(false);
          return;
        }
        setActiveIndex(value);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setTree(prev => deleteNode(prev, value));
        setActiveIndex(null);
        break;

      case "Search":
        if (!tree) {
          alert("Tree is empty");
          setIsRunning(false);
          return;
        }
        setActiveIndex(value);
        await new Promise(resolve => setTimeout(resolve, 1000));
        const found = searchNode(tree, value);
        setHighlight(found ? value : null);
        setActiveIndex(null);
        if (found) {
          alert(`Value ${value} found in the tree`);
        } else {
          alert(`Value ${value} not found in the tree`);
        }
        break;

      case "Inorder Traversal":
        if (!tree) {
          alert("Tree is empty");
          setIsRunning(false);
          return;
        }
        const traversal = inorderTraversal(tree);
        for (const val of traversal) {
          setHighlight(val);
          await new Promise(resolve => setTimeout(resolve, 1000 / speed));
        }
        setHighlight(null);
        alert(`Inorder traversal: ${traversal.join(" -> ")}`);
        break;
    }

    setIsRunning(false);
    setAnimationState("idle");
    setAnimationStep(0);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsPaused(false);
    setAnimationState("idle");
    setAnimationStep(0);
    setNewElement(null);
    setActiveIndex(null);
    setHighlight(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-black dark:to-black py-8 mt-10 w-full">
      <div className="container mx-auto px-4 w-full">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-8 text-center">
          Tree Data Structure
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
                  <CardTitle>{selectedOperation} Visualization</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                    <div className="space-y-4 w-full">
                      <div>
                        <label className="block text-sm font-medium mb-2">Operation</label>
                        <select
                          className="w-full p-2 border rounded dark:bg-slate-800 dark:text-white"
                          value={selectedOperation}
                          onChange={e => setSelectedOperation(e.target.value)}
                          aria-label="Select tree operation"
                        >
                          {treeAlgorithms.map(op => (
                            <option key={op.name} value={op.name}>{op.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Input</label>
                        <input
                          type="text"
                          className="w-full p-2 border rounded dark:bg-slate-800 dark:text-white"
                          placeholder={selectedOperation === "Inorder Traversal" ? "(no input needed)" : "Enter value (e.g., 42)"}
                          value={input}
                          onChange={e => setInput(e.target.value)}
                          disabled={selectedOperation === "Inorder Traversal"}
                        />
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
                        <Button onClick={handleStart} disabled={isRunning}>
                          <Play className="mr-2 h-4 w-4" />
                          Start
                        </Button>
                        <Button variant="outline" onClick={handleReset}>
                          <RotateCcw className="mr-2 h-4 w-4" />
                          Reset
                        </Button>
                      </div>
                    </div>
                    <TreeVisualizer
                      tree={tree}
                      operation={selectedOperation}
                      highlight={highlight}
                      animationState={animationState}
                      animationStep={animationStep}
                      newElement={newElement}
                      activeIndex={activeIndex}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="code">
              <Card>
                <CardHeader>
                  <CardTitle>{selectedOperation} Implementation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-slate-900 dark:text-white font-medium mb-2">JavaScript</h4>
                      <pre className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg overflow-x-auto">
                        <code>{treeAlgorithms.find(op => op.name === selectedOperation)?.code.JavaScript}</code>
                      </pre>
                    </div>
                    <div>
                      <h4 className="text-slate-900 dark:text-white font-medium mb-2">Python</h4>
                      <pre className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg overflow-x-auto">
                        <code>{treeAlgorithms.find(op => op.name === selectedOperation)?.code.Python}</code>
                      </pre>
                    </div>
                    <div>
                      <h4 className="text-slate-900 dark:text-white font-medium mb-2">Java</h4>
                      <pre className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg overflow-x-auto">
                        <code>{treeAlgorithms.find(op => op.name === selectedOperation)?.code.Java}</code>
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="info">
              <Card>
                <CardHeader>
                  <CardTitle>{selectedOperation} Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {treeAlgorithms.find(op => op.name === selectedOperation)?.info && (
                      <div>
                        <h4 className="text-slate-900 dark:text-white font-medium mb-2">Key Characteristics</h4>
                        <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
                          {treeAlgorithms.find(op => op.name === selectedOperation)?.info.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {treeAlgorithms.find(op => op.name === selectedOperation)?.applications && (
                      <div>
                        <h4 className="text-slate-900 dark:text-white font-medium mb-2">Applications</h4>
                        <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
                          {treeAlgorithms.find(op => op.name === selectedOperation)?.applications.map((item, idx) => (
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
    </div>
  );
} 