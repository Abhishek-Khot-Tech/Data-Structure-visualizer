interface Graph {
  vertices: number;
  edges: number[][];
}

interface Step {
  array?: number[];
  indices?: number[];
  comparison?: boolean;
  swap?: boolean;
  visited?: number[];
  current?: number;
  path?: number[];
}

export function bfs(graph: Graph, start: number, target?: number): Step[] {
  const steps: Step[] = [];
  const visited = new Array(graph.vertices).fill(false);
  const queue: number[] = [];
  const parent: number[] = new Array(graph.vertices).fill(-1);

  visited[start] = true;
  queue.push(start);
  steps.push({ visited: [...visited], current: start, path: [start] });

  let found = false;
  while (queue.length > 0 && !found) {
    const current = queue.shift()!;
    for (let i = 0; i < graph.edges[current].length; i++) {
      const neighbor = graph.edges[current][i];
      if (!visited[neighbor]) {
        visited[neighbor] = true;
        parent[neighbor] = current;
        queue.push(neighbor);
        // If target is found, reconstruct path
        if (neighbor === target) {
          found = true;
          const path = [];
          let node = neighbor;
          while (node !== -1) {
            path.push(node);
            node = parent[node];
          }
          path.reverse();
          steps.push({ visited: [...visited], current: neighbor, path });
          break;
        }
        steps.push({ visited: [...visited], current: neighbor, path: [] });
      }
    }
  }
  // If target not found, show traversal order
  if (!found && typeof target === 'number') {
    const path = [];
    let node = target;
    while (node !== -1) {
      path.push(node);
      node = parent[node];
    }
    path.reverse();
    steps.push({ visited: [...visited], current: target, path });
  }
  return steps;
}

export function dfs(graph: Graph, start: number, target?: number): Step[] {
  const steps: Step[] = [];
  const visited = new Array(graph.vertices).fill(false);
  const parent: number[] = new Array(graph.vertices).fill(-1);
  let found = false;
  function dfsHelper(vertex: number) {
    if (found) return;
    visited[vertex] = true;
    steps.push({ visited: [...visited], current: vertex, path: [] });
    if (vertex === target) {
      found = true;
      // Reconstruct path
      const path = [];
      let node = vertex;
      while (node !== -1) {
        path.push(node);
        node = parent[node];
      }
      path.reverse();
      steps.push({ visited: [...visited], current: vertex, path });
      return;
    }
    for (let i = 0; i < graph.edges[vertex].length; i++) {
      const neighbor = graph.edges[vertex][i];
      if (!visited[neighbor]) {
        parent[neighbor] = vertex;
        dfsHelper(neighbor);
      }
    }
  }
  dfsHelper(start);
  // If target not found, show traversal order
  if (!found && typeof target === 'number') {
    const path = [];
    let node = target;
    while (node !== -1) {
      path.push(node);
      node = parent[node];
    }
    path.reverse();
    steps.push({ visited: [...visited], current: target, path });
  }
  return steps;
}

export function dijkstra(graph: Graph, start: number, target?: number): Step[] {
  const steps: Step[] = [];
  const distances = new Array(graph.vertices).fill(Infinity);
  const visited = new Array(graph.vertices).fill(false);
  const parent: number[] = new Array(graph.vertices).fill(-1);

  distances[start] = 0;
  steps.push({ visited: [...visited], current: start, path: [start] });

  let found = false;
  for (let i = 0; i < graph.vertices; i++) {
    let minDist = Infinity;
    let minVertex = -1;
    for (let j = 0; j < graph.vertices; j++) {
      if (!visited[j] && distances[j] < minDist) {
        minDist = distances[j];
        minVertex = j;
      }
    }
    if (minVertex === -1) break;
    visited[minVertex] = true;
    // If target is found, reconstruct path
    if (minVertex === target) {
      found = true;
      const path = [];
      let node = minVertex;
      while (node !== -1) {
        path.push(node);
        node = parent[node];
      }
      path.reverse();
      steps.push({ visited: [...visited], current: minVertex, path });
      break;
    }
    steps.push({ visited: [...visited], current: minVertex, path: [] });
    for (let j = 0; j < graph.edges[minVertex].length; j++) {
      const neighbor = graph.edges[minVertex][j];
      const weight = 1; // Assuming unweighted graph for simplicity
      if (!visited[neighbor] && distances[minVertex] + weight < distances[neighbor]) {
        distances[neighbor] = distances[minVertex] + weight;
        parent[neighbor] = minVertex;
      }
    }
  }
  // If target not found, show traversal order
  if (!found && typeof target === 'number') {
    const path = [];
    let node = target;
    while (node !== -1) {
      path.push(node);
      node = parent[node];
    }
    path.reverse();
    steps.push({ visited: [...visited], current: target, path });
  }
  return steps;
}

export function prim(graph: Graph): Step[] {
  const steps: Step[] = [];
  const visited = new Array(graph.vertices).fill(false);
  const path: number[] = [];

  visited[0] = true;
  path.push(0);

  steps.push({
    visited: [...visited],
    current: 0,
    path: [...path]
  });

  for (let i = 0; i < graph.vertices - 1; i++) {
    let minEdge = Infinity;
    let minVertex = -1;

    for (let j = 0; j < graph.vertices; j++) {
      if (visited[j]) {
        for (let k = 0; k < graph.edges[j].length; k++) {
          const neighbor = graph.edges[j][k];
          if (!visited[neighbor]) {
            const weight = 1; // Assuming unweighted graph for simplicity
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
    path.push(minVertex);

    steps.push({
      visited: [...visited],
      current: minVertex,
      path: [...path]
    });
  }

  return steps;
}

export function kruskal(graph: Graph): Step[] {
  const steps: Step[] = [];
  const visited = new Array(graph.vertices).fill(false);
  const path: number[] = [];
  const edges: [number, number, number][] = [];

  // Create edge list
  for (let i = 0; i < graph.vertices; i++) {
    for (let j = 0; j < graph.edges[i].length; j++) {
      const neighbor = graph.edges[i][j];
      if (i < neighbor) { // Avoid duplicate edges
        edges.push([i, neighbor, 1]); // Assuming unweighted graph
      }
    }
  }

  // Sort edges by weight
  edges.sort((a, b) => a[2] - b[2]);

  // Union-Find data structure
  const parent = Array.from({ length: graph.vertices }, (_, i) => i);
  
  function find(x: number): number {
    if (parent[x] !== x) {
      parent[x] = find(parent[x]);
    }
    return parent[x];
  }

  function union(x: number, y: number) {
    parent[find(x)] = find(y);
  }

  for (const [u, v, w] of edges) {
    if (find(u) !== find(v)) {
      union(u, v);
      visited[u] = true;
      visited[v] = true;
      path.push(u, v);

      steps.push({
        visited: [...visited],
        current: v,
        path: [...path]
      });
    }
  }

  return steps;
} 