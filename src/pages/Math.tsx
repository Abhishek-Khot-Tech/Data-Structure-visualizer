import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, RotateCcw, X } from "lucide-react";
import { gcd, sieveOfEratosthenes, primeFactorization, matrixMultiplication, fastExponentiation } from "@/lib/math-algorithms";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AlgorithmVisualizer from "@/components/AlgorithmVisualizer";

const algorithms = [
  {
    name: "GCD (Euclidean)",
    function: gcd,
    description: "Finds the greatest common divisor of two numbers using the Euclidean algorithm.",
    code: {
      JavaScript: `function gcd(a, b) {
  while (b !== 0) {
    let temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}`,
      Python: `def gcd(a, b):
    while b != 0:
        a, b = b, a % b
    return a`,
      Java: `int gcd(int a, int b) {
    while (b != 0) {
        int temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}`
    },
    info: [
      "Uses the Euclidean algorithm.",
      "Efficient for large numbers.",
      "Fundamental in number theory."
    ],
    applications: [
      "Simplifying fractions",
      "Cryptography",
      "Number theory"
    ]
  },
  {
    name: "Sieve of Eratosthenes",
    function: sieveOfEratosthenes,
    description: "Finds all prime numbers up to a given limit using the sieve method.",
    code: {
      JavaScript: `function sieveOfEratosthenes(n) {
  const isPrime = new Array(n + 1).fill(true);
  isPrime[0] = isPrime[1] = false;
  for (let i = 2; i * i <= n; i++) {
    if (isPrime[i]) {
      for (let j = i * i; j <= n; j += i) {
        isPrime[j] = false;
      }
    }
  }
  return isPrime.map((val, idx) => val ? idx : 0);
}`,
      Python: `def sieve_of_eratosthenes(n):
    is_prime = [True] * (n + 1)
    is_prime[0] = is_prime[1] = False
    for i in range(2, int(n ** 0.5) + 1):
        if is_prime[i]:
            for j in range(i * i, n + 1, i):
                is_prime[j] = False
    return [i for i, val in enumerate(is_prime) if val]`,
      Java: `List<Integer> sieveOfEratosthenes(int n) {
    boolean[] isPrime = new boolean[n + 1];
    Arrays.fill(isPrime, true);
    isPrime[0] = isPrime[1] = false;
    for (int i = 2; i * i <= n; i++) {
        if (isPrime[i]) {
            for (int j = i * i; j <= n; j += i) {
                isPrime[j] = false;
            }
        }
    }
    List<Integer> primes = new ArrayList<>();
    for (int i = 2; i <= n; i++) {
        if (isPrime[i]) primes.add(i);
    }
    return primes;
}`
    },
    info: [
      "Efficient for finding all primes up to n.",
      "Marks multiples of each prime.",
      "Classic algorithm in mathematics."
    ],
    applications: [
      "Prime number generation",
      "Cryptography",
      "Mathematical research"
    ]
  },
  {
    name: "Prime Factorization",
    function: primeFactorization,
    description: "Finds all prime factors of a given number.",
    code: {
      JavaScript: `function primeFactorization(n) {
  const factors = [];
  for (let i = 2; i * i <= n; i++) {
    while (n % i === 0) {
      factors.push(i);
      n /= i;
    }
  }
  if (n > 1) factors.push(n);
  return factors;
}`,
      Python: `def prime_factorization(n):
    factors = []
    i = 2
    while i * i <= n:
        while n % i == 0:
            factors.append(i)
            n //= i
        i += 1
    if n > 1:
        factors.append(n)
    return factors`,
      Java: `List<Integer> primeFactorization(int n) {
    List<Integer> factors = new ArrayList<>();
    for (int i = 2; i * i <= n; i++) {
        while (n % i == 0) {
            factors.add(i);
            n /= i;
        }
    }
    if (n > 1) factors.add(n);
    return factors;
}`
    },
    info: [
      "Finds all prime factors of a number.",
      "Useful for cryptography and number theory.",
      "Can be used to simplify fractions."
    ],
    applications: [
      "Cryptography",
      "Simplifying fractions",
      "Mathematical proofs"
    ]
  },
  {
    name: "Matrix Multiplication",
    function: matrixMultiplication,
    description: "Multiplies two matrices using the standard algorithm.",
    code: {
      JavaScript: `function matrixMultiplication(a, b) {
  const m = a.length;
  const n = b[0].length;
  const p = b.length;
  const result = Array(m).fill(0).map(() => Array(n).fill(0));
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      for (let k = 0; k < p; k++) {
        result[i][j] += a[i][k] * b[k][j];
      }
    }
  }
  return result;
}`,
      Python: `def matrix_multiplication(a, b):
    m = len(a)
    n = len(b[0])
    p = len(b)
    result = [[0] * n for _ in range(m)]
    for i in range(m):
        for j in range(n):
            for k in range(p):
                result[i][j] += a[i][k] * b[k][j]
    return result`,
      Java: `int[][] matrixMultiplication(int[][] a, int[][] b) {
    int m = a.length;
    int n = b[0].length;
    int p = b.length;
    int[][] result = new int[m][n];
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            for (int k = 0; k < p; k++) {
                result[i][j] += a[i][k] * b[k][j];
            }
        }
    }
    return result;
}`
    },
    info: [
      "Standard matrix multiplication algorithm.",
      "Time complexity: O(n^3) for n x n matrices.",
      "Used in graphics, physics, and more."
    ],
    applications: [
      "Computer graphics",
      "Physics simulations",
      "Data transformations"
    ]
  },
  {
    name: "Fast Exponentiation",
    function: fastExponentiation,
    description: "Computes a^b efficiently using exponentiation by squaring.",
    code: {
      JavaScript: `function fastExponentiation(base, exponent) {
  let result = 1;
  while (exponent > 0) {
    if (exponent % 2 === 1) {
      result *= base;
    }
    base *= base;
    exponent = Math.floor(exponent / 2);
  }
  return result;
}`,
      Python: `def fast_exponentiation(base, exponent):
    result = 1
    while exponent > 0:
        if exponent % 2 == 1:
            result *= base
        base *= base
        exponent //= 2
    return result`,
      Java: `int fastExponentiation(int base, int exponent) {
    int result = 1;
    while (exponent > 0) {
        if (exponent % 2 == 1) {
            result *= base;
        }
        base *= base;
        exponent /= 2;
    }
    return result;
}`
    },
    info: [
      "Exponentiation by squaring.",
      "Reduces time complexity to O(log n).",
      "Widely used in cryptography."
    ],
    applications: [
      "Cryptography",
      "Modular arithmetic",
      "Scientific computing"
    ]
  }
];

export default function MathAlgorithmsPage() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>("gcd");
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<any[]>([]);
  const [input, setInput] = useState<string>("");
  const [showResultModal, setShowResultModal] = useState(false);
  const [finalAnswer, setFinalAnswer] = useState<string | number | null>(null);
  const [gcdSteps, setGcdSteps] = useState<any[]>([]);

  const startVisualization = () => {
    if (isPaused) {
      setIsPaused(false);
      return;
    }

    const selectedAlgo = algorithms.find(algo => algo.name.toLowerCase() === selectedAlgorithm.toLowerCase());
    if (!selectedAlgo) return;

    let newSteps;
    let answer: string | number | null = null;
    let stepsArr: any[] = [];
    switch (selectedAlgorithm.toLowerCase()) {
      case "gcd (euclidean)": {
        const [a, b] = input.split(',').map(Number);
        newSteps = gcd(a || 0, b || 0);
        answer = newSteps[newSteps.length - 1]?.result ?? null;
        stepsArr = newSteps.map(s => ({ a: s.result, b: s.current }));
        break;
      }
      case "sieve of eratosthenes": {
        newSteps = sieveOfEratosthenes(parseInt(input) || 0);
        break;
      }
      case "prime factorization": {
        newSteps = primeFactorization(parseInt(input) || 0);
        break;
      }
      case "matrix multiplication": {
        const [matrixA, matrixB] = input.split('|').map(s => s.trim());
        const A = matrixA.split(';').map(row => row.split(' ').map(Number));
        const B = matrixB.split(';').map(row => row.split(' ').map(Number));
        newSteps = matrixMultiplication(A, B);
        break;
      }
      case "fast exponentiation": {
        const [base, exp] = input.split(',').map(Number);
        newSteps = fastExponentiation(base || 0, exp || 0);
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
    setGcdSteps(stepsArr);
    setShowResultModal(false);
    // Animate steps (similar to DP/Graph)
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
      case "gcd (euclidean)":
        return "Enter two numbers (e.g., 48,18)";
      case "sieve of eratosthenes":
        return "Enter upper limit (e.g., 50)";
      case "prime factorization":
        return "Enter number to factorize (e.g., 84)";
      case "matrix multiplication":
        return "Enter matrices (e.g., 1 2;3 4 | 5 6;7 8)";
      case "fast exponentiation":
        return "Enter base and exponent (e.g., 2,10)";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-black dark:to-black py-8 mt-10 w-full">
      <div className="container mx-auto px-4 w-full">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-8 text-center">
          Mathematical Algorithms
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
                          {algorithms.map((algo) => (
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
                      algorithm={algorithms.find(a => a.name.toLowerCase() === selectedAlgorithm.toLowerCase()) || algorithms[0]}
                      type="math"
                      state={{
                        progress: 100 * (currentStep / Math.max(steps.length - 1, 1)),
                        comparisons: 0,
                        swaps: 0,
                        timeElapsed: 0,
                        currentArray: steps[currentStep]?.array || [],
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
                  <CardTitle>{algorithms.find(a => a.name.toLowerCase() === selectedAlgorithm.toLowerCase())?.name} Implementation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-slate-900 dark:text-white font-medium mb-2">JavaScript</h4>
                      <pre className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg overflow-x-auto">
                        <code>{algorithms.find(a => a.name.toLowerCase() === selectedAlgorithm.toLowerCase())?.code.JavaScript}</code>
                      </pre>
                    </div>
                    <div>
                      <h4 className="text-slate-900 dark:text-white font-medium mb-2">Python</h4>
                      <pre className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg overflow-x-auto">
                        <code>{algorithms.find(a => a.name.toLowerCase() === selectedAlgorithm.toLowerCase())?.code.Python}</code>
                      </pre>
                    </div>
                    <div>
                      <h4 className="text-slate-900 dark:text-white font-medium mb-2">Java</h4>
                      <pre className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg overflow-x-auto">
                        <code>{algorithms.find(a => a.name.toLowerCase() === selectedAlgorithm.toLowerCase())?.code.Java}</code>
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="info">
              <Card>
                <CardHeader>
                  <CardTitle>{algorithms.find(a => a.name.toLowerCase() === selectedAlgorithm.toLowerCase())?.name} Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {algorithms.find(a => a.name.toLowerCase() === selectedAlgorithm.toLowerCase())?.info && (
                      <div>
                        <h4 className="text-slate-900 dark:text-white font-medium mb-2">Key Characteristics</h4>
                        <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
                          {algorithms.find(a => a.name.toLowerCase() === selectedAlgorithm.toLowerCase())?.info.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {algorithms.find(a => a.name.toLowerCase() === selectedAlgorithm.toLowerCase())?.applications && (
                      <div>
                        <h4 className="text-slate-900 dark:text-white font-medium mb-2">Applications</h4>
                        <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
                          {algorithms.find(a => a.name.toLowerCase() === selectedAlgorithm.toLowerCase())?.applications.map((item, idx) => (
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
            {selectedAlgorithm === "gcd (euclidean)" && gcdSteps.length > 0 && (
              <div className="mt-2">
                <span className="font-semibold">Steps:</span>
                <ul className="list-disc ml-6 mt-1 text-slate-700 dark:text-slate-300 text-sm">
                  {gcdSteps.map((step, idx) => (
                    <li key={idx}>a = {step.a}, b = {step.b}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 