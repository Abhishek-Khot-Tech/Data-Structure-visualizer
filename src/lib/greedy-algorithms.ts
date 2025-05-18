interface Step {
  array?: number[];
  indices?: number[];
  comparison?: boolean;
  swap?: boolean;
  selected?: number[];
  current?: number;
  path?: number[];
}

interface Activity {
  start: number;
  end: number;
  index: number;
}

interface HuffmanNode {
  char?: string;
  freq: number;
  left?: HuffmanNode;
  right?: HuffmanNode;
}

export function activitySelection(activities: Activity[]): Step[] {
  const steps: Step[] = [];
  const selected: number[] = [];
  
  // Sort activities by end time
  activities.sort((a, b) => a.end - b.end);
  
  let lastEnd = 0;
  
  for (let i = 0; i < activities.length; i++) {
    if (activities[i].start >= lastEnd) {
      selected.push(activities[i].index);
      lastEnd = activities[i].end;
      
      steps.push({
        selected: [...selected],
        current: i
      });
    }
  }
  
  return steps;
}

export function huffmanCoding(freq: { [key: string]: number }): Step[] {
  const steps: Step[] = [];
  const nodes: HuffmanNode[] = [];
  
  // Create initial nodes
  for (const [char, frequency] of Object.entries(freq)) {
    nodes.push({ char, freq: frequency });
  }
  
  steps.push({
    selected: nodes.map(n => n.freq),
    current: 0
  });
  
  // Build Huffman tree
  while (nodes.length > 1) {
    // Sort nodes by frequency
    nodes.sort((a, b) => a.freq - b.freq);
    
    // Take two nodes with lowest frequency
    const left = nodes.shift()!;
    const right = nodes.shift()!;
    
    // Create new internal node
    const internal: HuffmanNode = {
      freq: left.freq + right.freq,
      left,
      right
    };
    
    nodes.push(internal);
    
    steps.push({
      selected: nodes.map(n => n.freq),
      current: nodes.length
    });
  }
  
  return steps;
}

export function coinChange(coins: number[], amount: number): Step[] {
  const steps: Step[] = [];
  const selected: number[] = [];
  let remaining = amount;
  
  // Sort coins in descending order
  coins.sort((a, b) => b - a);
  
  for (let i = 0; i < coins.length; i++) {
    while (remaining >= coins[i]) {
      selected.push(coins[i]);
      remaining -= coins[i];
      
      steps.push({
        selected: [...selected],
        current: i
      });
    }
  }
  
  return steps;
}

export function fractionalKnapsack(weights: number[], values: number[], capacity: number): Step[] {
  const steps: Step[] = [];
  const selected: number[] = [];
  let remainingCapacity = capacity;
  
  // Create items array with value/weight ratio
  const items = weights.map((weight, index) => ({
    weight,
    value: values[index],
    ratio: values[index] / weight,
    index
  }));
  
  // Sort items by value/weight ratio in descending order
  items.sort((a, b) => b.ratio - a.ratio);
  
  for (let i = 0; i < items.length; i++) {
    if (remainingCapacity >= items[i].weight) {
      selected.push(items[i].index);
      remainingCapacity -= items[i].weight;
    } else {
      const fraction = remainingCapacity / items[i].weight;
      selected.push(items[i].index);
      remainingCapacity = 0;
    }
    
    steps.push({
      selected: [...selected],
      current: i
    });
    
    if (remainingCapacity === 0) break;
  }
  
  return steps;
} 