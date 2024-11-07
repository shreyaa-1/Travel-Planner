export function christofidesAlgorithm(distanceMatrix) {
    const n = distanceMatrix.length;
  
    // Step 1: Create an adjacency matrix from the distance matrix
    let graph = [];
    for (let i = 0; i < n; i++) {
      graph[i] = [];
      for (let j = 0; j < n; j++) {
        if (i !== j) {
          graph[i][j] = { weight: distanceMatrix[i][j] };
        } else {
          graph[i][j] = { weight: Infinity }; // Assuming no self-loops
        }
      }
    }
  
    // Step 2: Find Minimum Spanning Tree (MST) using Prim's algorithm
    function primMST(graph) {
      const parent = new Array(n).fill(-1);
      const key = new Array(n).fill(Infinity);
      const mstSet = new Array(n).fill(false);
  
      key[0] = 0;
      for (let count = 0; count < n - 1; count++) {
        const u = minKey(key, mstSet);
        mstSet[u] = true;
        for (let v = 0; v < n; v++) {
          if (graph[u][v] && !mstSet[v] && graph[u][v].weight < key[v]) {
            parent[v] = u;
            key[v] = graph[u][v].weight;
          }
        }
      }
  
      let mst = [];
      for (let i = 1; i < n; i++) {
        mst.push({ u: parent[i], v: i, weight: graph[i][parent[i]].weight });
      }
      return mst;
    }
  
    function minKey(key, mstSet) {
      let min = Infinity;
      let minIndex = -1;
      for (let v = 0; v < n; v++) {
        if (mstSet[v] === false && key[v] < min) {
          min = key[v];
          minIndex = v;
        }
      }
      return minIndex;
    }
  
    const MST = primMST(graph);
  
    // Step 3: Find vertices with odd degree in MST
    const oddDegreeVertices = new Set();
    const degree = new Array(n).fill(0);
    MST.forEach(edge => {
      degree[edge.u]++;
      degree[edge.v]++;
    });
    for (let i = 0; i < n; i++) {
      if (degree[i] % 2 === 1) {
        oddDegreeVertices.add(i);
      }
    }
  
    // Step 4: Find minimum weight perfect matching for odd-degree vertices (using greedy approach)
    function findMinimumWeightMatching(oddDegreeVertices) {
      const matched = new Set();
      const matching = [];
  
      const vertices = Array.from(oddDegreeVertices);
      for (let i = 0; i < vertices.length; i++) {
        if (!matched.has(vertices[i])) {
          let minWeight = Infinity;
          let minVertex = -1;
          for (let j = 0; j < vertices.length; j++) {
            if (i !== j && !matched.has(vertices[j]) && graph[vertices[i]][vertices[j]].weight < minWeight) {
              minWeight = graph[vertices[i]][vertices[j]].weight;
              minVertex = vertices[j];
            }
          }
          matched.add(vertices[i]);
          matched.add(minVertex);
          matching.push({ u: vertices[i], v: minVertex, weight: graph[vertices[i]][minVertex].weight });
        }
      }
  
      return matching;
    }
  
    const matching = findMinimumWeightMatching(oddDegreeVertices);
  
    // Step 5: Combine MST and matching to form Eulerian multigraph
    const multigraph = MST.concat(matching);
  
    // Step 6: Find Eulerian circuit in the multigraph (using Hierholzer's algorithm)
    function findEulerianCircuit(multigraph) {
      const adjacencyList = {};
      multigraph.forEach(edge => {
        if (!adjacencyList[edge.u]) adjacencyList[edge.u] = [];
        if (!adjacencyList[edge.v]) adjacencyList[edge.v] = [];
        adjacencyList[edge.u].push({ v: edge.v, weight: edge.weight });
        adjacencyList[edge.v].push({ v: edge.u, weight: edge.weight });
      });
  
      const circuit = [];
      eulerianHelper('0', adjacencyList, circuit);
      return circuit.map(vertex => parseInt(vertex));
    }
  
    function eulerianHelper(v, adjacencyList, circuit) {
      while (adjacencyList[v] && adjacencyList[v].length > 0) {
        const edge = adjacencyList[v].shift();
        eulerianHelper(edge.v.toString(), adjacencyList, circuit);
      }
      circuit.unshift(v);
    }
  
    const eulerianCircuit = findEulerianCircuit(multigraph);
  
    // Step 7: Convert Eulerian circuit to Hamiltonian circuit by skipping repeated vertices
    const visited = new Set();
    const tspPath = [];
    let totalDistance = 0;
    eulerianCircuit.forEach(vertex => {
      if (!visited.has(vertex)) {
        visited.add(vertex);
        tspPath.push(vertex);
        if (tspPath.length > 1) {
          totalDistance += distanceMatrix[tspPath[tspPath.length - 2]][vertex];
        }
      }
    });
  


    // Add the last edge to complete the circuit
    tspPath.push(tspPath[0]);
    totalDistance += distanceMatrix[tspPath[tspPath.length - 2]][tspPath[0]];
  
    return { path: tspPath, distance: totalDistance };
  }



