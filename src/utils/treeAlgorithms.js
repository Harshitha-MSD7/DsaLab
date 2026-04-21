// BST node operations with step generation

export class BSTNode {
  constructor(val) {
    this.val = val
    this.left = null
    this.right = null
    this.height = 1
  }
}

// ─── BST helpers ──────────────────────────────────────────────────────────────
export function bstInsert(root, val) {
  if (!root) return new BSTNode(val)
  if (val < root.val)      root.left  = bstInsert(root.left,  val)
  else if (val > root.val) root.right = bstInsert(root.right, val)
  return root
}

export function bstSearch(root, val, path = []) {
  if (!root) return { found: false, path }
  path.push(root.val)
  if (val === root.val) return { found: true, path }
  if (val < root.val)  return bstSearch(root.left,  val, path)
  return                       bstSearch(root.right, val, path)
}

export function bstInorder(root, result = []) {
  if (!root) return result
  bstInorder(root.left, result)
  result.push(root.val)
  bstInorder(root.right, result)
  return result
}

export function bstInsertSteps(root, val) {
  const steps = []
  let current = root

  steps.push({ highlight: null, desc: `Insert ${val}: start at root`, codeLine: 0 })

  while (current) {
    steps.push({ highlight: current.val, desc: `At node ${current.val}: ${val} ${val < current.val ? '<' : '>'} ${current.val}, go ${val < current.val ? 'left' : 'right'}`, codeLine: val < current.val ? 2 : 3 })
    if (val < current.val) {
      if (!current.left) break
      current = current.left
    } else if (val > current.val) {
      if (!current.right) break
      current = current.right
    } else {
      steps.push({ highlight: current.val, desc: `${val} already exists in tree`, codeLine: 1 })
      return steps
    }
  }

  steps.push({ highlight: val, desc: `Insert ${val} here as new leaf`, codeLine: 4, inserted: val })
  return steps
}

export function bstSearchSteps(root, val) {
  const steps = []
  let current = root

  steps.push({ highlight: null, desc: `Search for ${val}: start at root`, codeLine: 0 })

  while (current) {
    steps.push({ highlight: current.val, desc: `At node ${current.val}: ${val === current.val ? 'FOUND!' : val < current.val ? `${val} < ${current.val}, go left` : `${val} > ${current.val}, go right`}`, codeLine: val === current.val ? 1 : val < current.val ? 2 : 3, found: val === current.val })
    if (val === current.val) return steps
    current = val < current.val ? current.left : current.right
  }

  steps.push({ highlight: null, desc: `${val} not found in tree`, codeLine: 5, notFound: true })
  return steps
}

// ─── Heap operations ──────────────────────────────────────────────────────────
export function heapInsertSteps(heap, val, isMin = false) {
  const arr = [...heap, val]
  const steps = [{ heap: [...arr], highlight: arr.length - 1, desc: `Insert ${val} at end (index ${arr.length - 1})`, codeLine: 0 }]
  let i = arr.length - 1

  while (i > 0) {
    const parent = Math.floor((i - 1) / 2)
    const shouldSwap = isMin ? arr[i] < arr[parent] : arr[i] > arr[parent]

    steps.push({ heap: [...arr], highlight: i, compareWith: parent, desc: `Compare ${arr[i]} with parent ${arr[parent]}: ${shouldSwap ? 'swap!' : 'heap property satisfied'}`, codeLine: 3 })

    if (shouldSwap) {
      ;[arr[i], arr[parent]] = [arr[parent], arr[i]]
      steps.push({ heap: [...arr], highlight: parent, desc: `Swapped ${arr[parent]} up to index ${parent}`, codeLine: 5 })
      i = parent
    } else break
  }

  steps.push({ heap: [...arr], highlight: -1, desc: `Heap property restored. Heap: [${arr.join(', ')}]`, codeLine: 7 })
  return { steps, heap: arr }
}

// ─── Code for trees ───────────────────────────────────────────────────────────
export const treeCode = {
  bst: {
    insert: {
      python: [
        'class Node:',
        '    def __init__(self, val):',
        '        self.val = val',
        '        self.left = self.right = None',
        '',
        'def insert(root, val):',
        '    if root is None: return Node(val)',
        '    if val < root.val:',
        '        root.left = insert(root.left, val)',
        '    elif val > root.val:',
        '        root.right = insert(root.right, val)',
        '    return root',
      ],
      java: [
        'class Node {',
        '    int val; Node left, right;',
        '    Node(int v) { val = v; }',
        '}',
        'Node insert(Node root, int val) {',
        '    if (root == null) return new Node(val);',
        '    if (val < root.val)',
        '        root.left = insert(root.left, val);',
        '    else if (val > root.val)',
        '        root.right = insert(root.right, val);',
        '    return root;',
        '}',
      ],
      cpp: [
        'struct Node { int val; Node *left, *right; };',
        'Node* insert(Node* root, int val) {',
        '    if (!root) return new Node{val,nullptr,nullptr};',
        '    if (val < root->val)',
        '        root->left = insert(root->left, val);',
        '    else if (val > root->val)',
        '        root->right = insert(root->right, val);',
        '    return root;',
        '}',
      ],
    },
  },
  heap: {
    insert: {
      python: [
        'import heapq',
        'heap = []  # min-heap',
        '',
        'def heap_push(heap, val):',
        '    heap.append(val)',
        '    heapq.heappush(heap, val)',
        '    # Python: _siftdown internally',
        '    # bubbles up until heap property holds',
      ],
      java: [
        'PriorityQueue<Integer> minHeap = new PriorityQueue<>();',
        '',
        'void heapPush(int val) {',
        '    minHeap.offer(val);',
        '    // internally: sift up',
        '    // parent = (i-1)/2',
        '    // swap if val < parent',
        '}',
      ],
      cpp: [
        'priority_queue<int, vector<int>, greater<int>> minHeap;',
        '',
        'void heapPush(int val) {',
        '    minHeap.push(val);',
        '    // sift-up: compare with parent',
        '    // parent index = (i-1)/2',
        '    // swap until heap property holds',
        '}',
      ],
    },
  },
}

export const treeComplexity = {
  bst:  { search: 'O(h)', insert: 'O(h)', delete: 'O(h)', notes: 'h = height. O(log n) balanced, O(n) worst case skewed.' },
  avl:  { search: 'O(log n)', insert: 'O(log n)', delete: 'O(log n)', notes: 'Self-balancing. Height always O(log n).' },
  heap: { insert: 'O(log n)', extractMin: 'O(log n)', peek: 'O(1)', notes: 'Complete binary tree stored in array.' },
}

export function buildSampleBST() {
  let root = null
  for (const v of [50, 30, 70, 20, 40, 60, 80, 10, 25, 35, 45]) {
    root = bstInsert(root, v)
  }
  return root
}

// Convert BST to D3 hierarchy-compatible format
export function treeToD3(root) {
  if (!root) return null
  return {
    name: root.val.toString(),
    val: root.val,
    children: [
      root.left  ? treeToD3(root.left)  : null,
      root.right ? treeToD3(root.right) : null,
    ].filter(Boolean),
    _left:  !!root.left,
    _right: !!root.right,
  }
}
