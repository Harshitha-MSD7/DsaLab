// Graph step generators
// Graph is represented as adjacency list: { 0: [1,2], 1: [0,3], ... }
// For weighted: { 0: [{node:1,w:4},{node:2,w:2}], ... }

function mkStep(visited, current, queue, path, desc, codeLine, highlights) {
  return { visited: new Set(visited), current, queue: [...queue], path: [...path], desc, codeLine, highlights: { ...highlights } }
}

// ─── BFS ─────────────────────────────────────────────────────────────────────
export function bfsSteps(graph, start) {
  const steps = []
  const visited = new Set()
  const queue = [start]
  const path = []

  steps.push(mkStep([], null, [start], [], `Initialize: push start node ${start}`, 0, { [start]: 'current' }))

  visited.add(start)

  while (queue.length > 0) {
    const node = queue.shift()
    path.push(node)

    const hl = {}
    visited.forEach(v => { hl[v] = 'visited' })
    hl[node] = 'current'

    steps.push(mkStep(visited, node, queue, path,
      `Dequeue node ${node}, add to visited`, 3, hl
    ))

    const neighbors = graph[node] || []
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor)
        queue.push(neighbor)

        const hl2 = {}
        visited.forEach(v => { hl2[v] = 'visited' })
        hl2[node] = 'current'
        hl2[neighbor] = 'comparing'

        steps.push(mkStep(visited, node, queue, path,
          `Discover neighbor ${neighbor}, enqueue it`, 6, hl2
        ))
      }
    }
  }

  const finalHl = {}
  path.forEach(n => { finalHl[n] = 'sorted' })
  steps.push(mkStep(visited, null, [], path, `BFS complete! Order: ${path.join(' → ')}`, 9, finalHl))
  return steps
}

// ─── DFS ─────────────────────────────────────────────────────────────────────
export function dfsSteps(graph, start) {
  const steps = []
  const visited = new Set()
  const path = []

  steps.push(mkStep([], null, [], [], `Start DFS from node ${start}`, 0, { [start]: 'current' }))

  function dfs(node) {
    visited.add(node)
    path.push(node)

    const hl = {}
    visited.forEach(v => { hl[v] = 'visited' })
    hl[node] = 'current'
    steps.push(mkStep(visited, node, [], path, `Visit node ${node} (depth-first)`, 2, hl))

    for (const neighbor of (graph[node] || [])) {
      if (!visited.has(neighbor)) {
        const hl2 = {}
        visited.forEach(v => { hl2[v] = 'visited' })
        hl2[node] = 'current'
        hl2[neighbor] = 'comparing'
        steps.push(mkStep(visited, node, [], path,
          `Explore edge ${node}→${neighbor} (unvisited)`, 4, hl2
        ))
        dfs(neighbor)
      }
    }
  }

  dfs(start)

  const finalHl = {}
  path.forEach(n => { finalHl[n] = 'sorted' })
  steps.push(mkStep(visited, null, [], path, `DFS complete! Order: ${path.join(' → ')}`, 8, finalHl))
  return steps
}

// ─── Dijkstra ─────────────────────────────────────────────────────────────────
export function dijkstraSteps(graph, start) {
  const steps = []
  const n = Object.keys(graph).length
  const dist = {}
  const prev = {}
  const visited = new Set()

  Object.keys(graph).forEach(k => { dist[k] = Infinity; prev[k] = null })
  dist[start] = 0

  steps.push({
    dist: { ...dist }, visited: new Set(), current: null, desc: `Init: dist[${start}]=0, all others=∞`, codeLine: 0, highlights: { [start]: 'current' }
  })

  for (let i = 0; i < n; i++) {
    // Pick unvisited node with min dist
    let u = null
    Object.keys(dist).forEach(k => {
      if (!visited.has(parseInt(k)) && (u === null || dist[k] < dist[u])) u = parseInt(k)
    })
    if (u === null || dist[u] === Infinity) break

    visited.add(u)
    const hl = {}
    visited.forEach(v => { hl[v] = 'visited' })
    hl[u] = 'current'

    steps.push({
      dist: { ...dist }, visited: new Set(visited), current: u,
      desc: `Select node ${u} with dist=${dist[u]}`, codeLine: 4, highlights: hl
    })

    for (const { node: v, w } of (graph[u] || [])) {
      if (!visited.has(v)) {
        const alt = dist[u] + w
        const hl2 = {}
        visited.forEach(x => { hl2[x] = 'visited' })
        hl2[u] = 'current'; hl2[v] = 'comparing'

        steps.push({
          dist: { ...dist }, visited: new Set(visited), current: u,
          desc: `Relax edge ${u}→${v}: dist[${v}] = min(${dist[v] === Infinity ? '∞' : dist[v]}, ${dist[u]}+${w}=${alt})`,
          codeLine: 7, highlights: hl2
        })

        if (alt < dist[v]) {
          dist[v] = alt
          prev[v] = u
          const hl3 = {}
          visited.forEach(x => { hl3[x] = 'visited' })
          hl3[u] = 'current'; hl3[v] = 'path'
          steps.push({
            dist: { ...dist }, visited: new Set(visited), current: u,
            desc: `Updated dist[${v}] = ${alt} via node ${u}`, codeLine: 9, highlights: hl3
          })
        }
      }
    }
  }

  const finalHl = {}
  Object.keys(dist).forEach(k => { if (dist[k] !== Infinity) finalHl[parseInt(k)] = 'sorted' })
  steps.push({
    dist: { ...dist }, visited: new Set(visited), current: null,
    desc: `Done! Shortest distances from ${start}: ${Object.entries(dist).map(([k,v]) => `${k}:${v === Infinity ? '∞' : v}`).join(', ')}`,
    codeLine: 12, highlights: finalHl
  })
  return steps
}

// ─── Bellman-Ford ─────────────────────────────────────────────────────────────
export function bellmanFordSteps(graph, start, edges) {
  const steps = []
  const nodes = Object.keys(graph).map(Number)
  const dist = {}
  nodes.forEach(n => { dist[n] = Infinity })
  dist[start] = 0

  steps.push({
    dist: { ...dist }, current: null, desc: `Init: dist[${start}]=0, all others=∞`, codeLine: 0, highlights: { [start]: 'current' }
  })

  for (let i = 0; i < nodes.length - 1; i++) {
    steps.push({
      dist: { ...dist }, current: null, desc: `Iteration ${i+1} of ${nodes.length - 1}: relax all edges`, codeLine: 2, highlights: {}
    })

    for (const [u, v, w] of edges) {
      const hl = { [u]: 'comparing', [v]: 'current' }
      steps.push({
        dist: { ...dist }, current: u,
        desc: `Check edge ${u}→${v} (w=${w}): dist[${v}]=${dist[v] === Infinity ? '∞' : dist[v]}, dist[${u}]+${w}=${dist[u] === Infinity ? '∞' : dist[u]+w}`,
        codeLine: 4, highlights: hl
      })
      if (dist[u] !== Infinity && dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w
        steps.push({
          dist: { ...dist }, current: u,
          desc: `Relaxed! dist[${v}] = ${dist[v]}`, codeLine: 6, highlights: { [u]: 'current', [v]: 'path' }
        })
      }
    }
  }

  steps.push({
    dist: { ...dist }, current: null,
    desc: `Bellman-Ford done! Distances: ${Object.entries(dist).map(([k,v]) => `${k}:${v === Infinity ? '∞' : v}`).join(', ')}`,
    codeLine: 9, highlights: Object.fromEntries(nodes.map(n => [n, dist[n] !== Infinity ? 'sorted' : 'default']))
  })
  return steps
}

export const graphCode = {
  bfs: {
    python: [
      'from collections import deque',
      'def bfs(graph, start):',
      '    visited = set([start])',
      '    queue = deque([start])',
      '    while queue:',
      '        node = queue.popleft()',
      '        print(node)  # process node',
      '        for nbr in graph[node]:',
      '            if nbr not in visited:',
      '                visited.add(nbr)',
      '                queue.append(nbr)',
    ],
    java: [
      'void bfs(Map<Integer,List<Integer>> g, int s) {',
      '    Set<Integer> visited = new HashSet<>();',
      '    Queue<Integer> q = new LinkedList<>();',
      '    visited.add(s); q.offer(s);',
      '    while (!q.isEmpty()) {',
      '        int node = q.poll();',
      '        System.out.println(node);',
      '        for (int nbr : g.get(node))',
      '            if (!visited.contains(nbr)) {',
      '                visited.add(nbr); q.offer(nbr);',
      '            }',
      '    }',
      '}',
    ],
    cpp: [
      'void bfs(vector<vector<int>>& g, int s) {',
      '    vector<bool> vis(g.size(),false);',
      '    queue<int> q;',
      '    vis[s]=true; q.push(s);',
      '    while(!q.empty()){',
      '        int node=q.front(); q.pop();',
      '        cout<<node<<" ";',
      '        for(int nbr:g[node])',
      '            if(!vis[nbr]){vis[nbr]=true;q.push(nbr);}',
      '    }',
      '}',
    ],
  },
  dfs: {
    python: [
      'def dfs(graph, start, visited=None):',
      '    if visited is None: visited = set()',
      '    visited.add(start)',
      '    print(start)  # process node',
      '    for nbr in graph[start]:',
      '        if nbr not in visited:',
      '            dfs(graph, nbr, visited)',
      '    return visited',
      '# recursive depth-first',
    ],
    java: [
      'void dfs(Map<Integer,List<Integer>> g, int node,',
      '         Set<Integer> visited) {',
      '    visited.add(node);',
      '    System.out.println(node);',
      '    for (int nbr : g.get(node))',
      '        if (!visited.contains(nbr))',
      '            dfs(g, nbr, visited);',
      '}',
      '// call: dfs(graph, start, new HashSet<>())',
    ],
    cpp: [
      'void dfs(vector<vector<int>>& g, int node,',
      '         vector<bool>& vis) {',
      '    vis[node]=true;',
      '    cout<<node<<" ";',
      '    for(int nbr:g[node])',
      '        if(!vis[nbr]) dfs(g,nbr,vis);',
      '}',
      '// recursive, stack uses call stack',
    ],
  },
  dijkstra: {
    python: [
      'import heapq',
      'def dijkstra(graph, start):',
      '    dist = {n: float("inf") for n in graph}',
      '    dist[start] = 0',
      '    pq = [(0, start)]',
      '    while pq:',
      '        d, u = heapq.heappop(pq)',
      '        if d > dist[u]: continue',
      '        for v, w in graph[u]:',
      '            if dist[u] + w < dist[v]:',
      '                dist[v] = dist[u] + w',
      '                heapq.heappush(pq, (dist[v], v))',
      '    return dist',
    ],
    java: [
      'int[] dijkstra(List<int[]>[] g, int src) {',
      '    int n=g.length; int[] dist=new int[n];',
      '    Arrays.fill(dist, Integer.MAX_VALUE);',
      '    dist[src]=0;',
      '    PriorityQueue<int[]> pq=new PriorityQueue<>((a,b)->a[0]-b[0]);',
      '    pq.offer(new int[]{0,src});',
      '    while(!pq.isEmpty()){',
      '        int[] cur=pq.poll(); int d=cur[0],u=cur[1];',
      '        if(d>dist[u]) continue;',
      '        for(int[] e:g[u]) if(dist[u]+e[1]<dist[e[0]]){',
      '            dist[e[0]]=dist[u]+e[1];',
      '            pq.offer(new int[]{dist[e[0]],e[0]});',
      '        }',
      '    } return dist;',
      '}',
    ],
    cpp: [
      'vector<int> dijkstra(vector<vector<pair<int,int>>>& g, int src){',
      '    int n=g.size(); vector<int> dist(n,INT_MAX);',
      '    dist[src]=0;',
      '    priority_queue<pair<int,int>,vector<pair<int,int>>,greater<>> pq;',
      '    pq.push({0,src});',
      '    while(!pq.empty()){',
      '        auto[d,u]=pq.top(); pq.pop();',
      '        if(d>dist[u]) continue;',
      '        for(auto[v,w]:g[u]) if(dist[u]+w<dist[v]){',
      '            dist[v]=dist[u]+w; pq.push({dist[v],v});',
      '        }',
      '    } return dist;',
      '}',
    ],
  },
}

export const graphComplexity = {
  bfs:         { time: 'O(V + E)', space: 'O(V)', notes: 'V = vertices, E = edges. Uses a queue.' },
  dfs:         { time: 'O(V + E)', space: 'O(V)', notes: 'V = vertices, E = edges. Uses recursion stack.' },
  dijkstra:    { time: 'O((V+E) log V)', space: 'O(V)', notes: 'With binary heap. No negative weights!' },
  bellmanFord: { time: 'O(VE)', space: 'O(V)', notes: 'Handles negative weights. Detects negative cycles.' },
}

// Default graph for demos
export const defaultGraph = {
  nodes: [0, 1, 2, 3, 4, 5, 6],
  adjacency: {
    0: [{ node: 1, w: 4 }, { node: 2, w: 2 }],
    1: [{ node: 0, w: 4 }, { node: 3, w: 5 }, { node: 2, w: 1 }],
    2: [{ node: 0, w: 2 }, { node: 1, w: 1 }, { node: 4, w: 8 }],
    3: [{ node: 1, w: 5 }, { node: 4, w: 2 }, { node: 5, w: 6 }],
    4: [{ node: 2, w: 8 }, { node: 3, w: 2 }, { node: 5, w: 3 }, { node: 6, w: 1 }],
    5: [{ node: 3, w: 6 }, { node: 4, w: 3 }, { node: 6, w: 7 }],
    6: [{ node: 4, w: 1 }, { node: 5, w: 7 }],
  },
  unweighted: {
    0: [1, 2],
    1: [0, 3, 2],
    2: [0, 1, 4],
    3: [1, 4, 5],
    4: [2, 3, 5, 6],
    5: [3, 4, 6],
    6: [4, 5],
  },
  positions: {
    0: { x: 100, y: 150 },
    1: { x: 220, y: 80  },
    2: { x: 220, y: 220 },
    3: { x: 340, y: 60  },
    4: { x: 340, y: 200 },
    5: { x: 460, y: 100 },
    6: { x: 460, y: 240 },
  },
  edges: [[0,1,4],[0,2,2],[1,2,1],[1,3,5],[2,4,8],[3,4,2],[3,5,6],[4,5,3],[4,6,1],[5,6,7]],
}
