interface Step {
  array?: number[];
  indices?: number[];
  comparison?: boolean;
  swap?: boolean;
  result?: number;
  current?: number;
  path?: number[];
}

export function gcd(a: number, b: number): Step[] {
  const steps: Step[] = [];
  let x = a;
  let y = b;
  
  steps.push({
    result: x,
    current: y
  });
  
  while (y !== 0) {
    const temp = y;
    y = x % y;
    x = temp;
    
    steps.push({
      result: x,
      current: y
    });
  }
  
  return steps;
}

export function sieveOfEratosthenes(n: number): Step[] {
  const steps: Step[] = [];
  const isPrime = new Array(n + 1).fill(true);
  isPrime[0] = isPrime[1] = false;
  
  steps.push({
    array: isPrime.map((val, idx) => val ? idx : 0),
    current: 2
  });
  
  for (let i = 2; i * i <= n; i++) {
    if (isPrime[i]) {
      for (let j = i * i; j <= n; j += i) {
        isPrime[j] = false;
      }
      
      steps.push({
        array: isPrime.map((val, idx) => val ? idx : 0),
        current: i
      });
    }
  }
  
  return steps;
}

export function primeFactorization(n: number): Step[] {
  const steps: Step[] = [];
  const factors: number[] = [];
  let num = n;
  
  steps.push({
    result: num,
    path: [...factors]
  });
  
  for (let i = 2; i * i <= num; i++) {
    while (num % i === 0) {
      factors.push(i);
      num /= i;
      
      steps.push({
        result: num,
        path: [...factors]
      });
    }
  }
  
  if (num > 1) {
    factors.push(num);
    steps.push({
      result: 1,
      path: [...factors]
    });
  }
  
  return steps;
}

export function matrixMultiplication(a: number[][], b: number[][]): Step[] {
  const steps: Step[] = [];
  const m = a.length;
  const n = b[0].length;
  const p = b.length;
  
  const result: number[][] = Array(m).fill(0).map(() => Array(n).fill(0));
  
  steps.push({
    array: result.map(row => [...row]),
    current: 0
  });
  
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      for (let k = 0; k < p; k++) {
        result[i][j] += a[i][k] * b[k][j];
      }
    }
    
    steps.push({
      array: result.map(row => [...row]),
      current: i
    });
  }
  
  return steps;
}

export function fastExponentiation(base: number, exponent: number): Step[] {
  const steps: Step[] = [];
  let result = 1;
  let currentBase = base;
  let currentExponent = exponent;
  
  steps.push({
    result,
    current: currentExponent
  });
  
  while (currentExponent > 0) {
    if (currentExponent % 2 === 1) {
      result *= currentBase;
    }
    currentBase *= currentBase;
    currentExponent = Math.floor(currentExponent / 2);
    
    steps.push({
      result,
      current: currentExponent
    });
  }
  
  return steps;
} 