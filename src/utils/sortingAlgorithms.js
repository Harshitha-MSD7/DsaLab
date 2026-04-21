// Each algorithm returns an array of step objects:
// { array, highlights: {index: 'comparing'|'swapping'|'sorted'|'current'|'pivot'}, desc, codeLine, swaps, comparisons }

function mkStep(arr, highlights, desc, codeLine, swaps, comparisons) {
  return { array: [...arr], highlights, desc, codeLine, swaps, comparisons }
}

// ─── Bubble Sort ─────────────────────────────────────────────────────────────
export function bubbleSortSteps(input) {
  const arr = [...input]
  const steps = []
  const n = arr.length
  let swaps = 0, comparisons = 0

  steps.push(mkStep(arr, {}, 'Start: unsorted array', 0, 0, 0))

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      comparisons++
      steps.push(mkStep(arr,
        { [j]: 'comparing', [j+1]: 'comparing' },
        `Comparing arr[${j}]=${arr[j]} and arr[${j+1}]=${arr[j+1]}`,
        3, swaps, comparisons
      ))
      if (arr[j] > arr[j + 1]) {
        ;[arr[j], arr[j+1]] = [arr[j+1], arr[j]]
        swaps++
        steps.push(mkStep(arr,
          { [j]: 'swapping', [j+1]: 'swapping' },
          `Swapped! arr[${j}]=${arr[j]} ↔ arr[${j+1}]=${arr[j+1]}`,
          5, swaps, comparisons
        ))
      }
    }
    steps.push(mkStep(arr,
      { [n-1-i]: 'sorted' },
      `Position ${n-1-i} is now sorted (value: ${arr[n-1-i]})`,
      7, swaps, comparisons
    ))
  }
  steps.push(mkStep(arr,
    Object.fromEntries(arr.map((_, i) => [i, 'sorted'])),
    'Array is fully sorted!',
    9, swaps, comparisons
  ))
  return steps
}

// ─── Merge Sort ──────────────────────────────────────────────────────────────
export function mergeSortSteps(input) {
  const arr = [...input]
  const steps = []
  let swaps = 0, comparisons = 0

  steps.push(mkStep(arr, {}, 'Start: unsorted array', 0, 0, 0))

  function merge(a, l, m, r) {
    const left = a.slice(l, m + 1)
    const right = a.slice(m + 1, r + 1)
    let i = 0, j = 0, k = l

    while (i < left.length && j < right.length) {
      comparisons++
      const hl = {}
      for (let x = l; x <= r; x++) hl[x] = 'current'
      steps.push(mkStep(a, hl,
        `Merging: comparing ${left[i]} and ${right[j]}`,
        8, swaps, comparisons
      ))
      if (left[i] <= right[j]) {
        a[k++] = left[i++]
      } else {
        a[k++] = right[j++]
        swaps++
      }
      const hl2 = {}
      for (let x = l; x < k; x++) hl2[x] = 'sorted'
      steps.push(mkStep(a, hl2, `Placed ${a[k-1]} at index ${k-1}`, 10, swaps, comparisons))
    }
    while (i < left.length) { a[k++] = left[i++] }
    while (j < right.length) { a[k++] = right[j++] }
    const hl3 = {}
    for (let x = l; x <= r; x++) hl3[x] = 'sorted'
    steps.push(mkStep(a, hl3, `Sub-array [${l}..${r}] merged`, 13, swaps, comparisons))
  }

  function mergeSort(a, l, r) {
    if (l >= r) return
    const m = Math.floor((l + r) / 2)
    const hl = {}
    for (let i = l; i <= r; i++) hl[i] = 'comparing'
    steps.push(mkStep(a, hl, `Divide: split [${l}..${r}] at mid=${m}`, 2, swaps, comparisons))
    mergeSort(a, l, m)
    mergeSort(a, m + 1, r)
    merge(a, l, m, r)
  }

  mergeSort(arr, 0, arr.length - 1)
  steps.push(mkStep(arr,
    Object.fromEntries(arr.map((_, i) => [i, 'sorted'])),
    'Array is fully sorted!',
    15, swaps, comparisons
  ))
  return steps
}

// ─── Quick Sort ───────────────────────────────────────────────────────────────
export function quickSortSteps(input) {
  const arr = [...input]
  const steps = []
  let swaps = 0, comparisons = 0

  steps.push(mkStep(arr, {}, 'Start: unsorted array', 0, 0, 0))

  function partition(a, lo, hi) {
    const pivot = a[hi]
    steps.push(mkStep(a, { [hi]: 'pivot' }, `Pivot selected: ${pivot} (index ${hi})`, 2, swaps, comparisons))
    let i = lo - 1

    for (let j = lo; j < hi; j++) {
      comparisons++
      steps.push(mkStep(a,
        { [hi]: 'pivot', [j]: 'comparing', ...(i >= lo ? { [i]: 'current' } : {}) },
        `Comparing arr[${j}]=${a[j]} with pivot ${pivot}`,
        5, swaps, comparisons
      ))
      if (a[j] <= pivot) {
        i++
        ;[a[i], a[j]] = [a[j], a[i]]
        swaps++
        steps.push(mkStep(a,
          { [hi]: 'pivot', [i]: 'swapping', [j]: 'swapping' },
          `arr[${j}]=${a[j]} ≤ pivot, swapped with arr[${i}]=${a[i]}`,
          7, swaps, comparisons
        ))
      }
    }
    ;[a[i+1], a[hi]] = [a[hi], a[i+1]]
    swaps++
    steps.push(mkStep(a,
      { [i+1]: 'sorted' },
      `Pivot ${pivot} placed at final position ${i+1}`,
      10, swaps, comparisons
    ))
    return i + 1
  }

  function qs(a, lo, hi) {
    if (lo >= hi) {
      if (lo === hi) {
        steps.push(mkStep(a, { [lo]: 'sorted' }, `Single element ${a[lo]} is sorted`, 12, swaps, comparisons))
      }
      return
    }
    const p = partition(a, lo, hi)
    qs(a, lo, p - 1)
    qs(a, p + 1, hi)
  }

  qs(arr, 0, arr.length - 1)
  steps.push(mkStep(arr,
    Object.fromEntries(arr.map((_, i) => [i, 'sorted'])),
    'Array is fully sorted!',
    14, swaps, comparisons
  ))
  return steps
}

// ─── Heap Sort ────────────────────────────────────────────────────────────────
export function heapSortSteps(input) {
  const arr = [...input]
  const steps = []
  const n = arr.length
  let swaps = 0, comparisons = 0

  steps.push(mkStep(arr, {}, 'Start: build a max-heap', 0, 0, 0))

  function heapify(a, size, root) {
    let largest = root
    const l = 2 * root + 1
    const r = 2 * root + 2

    comparisons++
    if (l < size && a[l] > a[largest]) largest = l
    comparisons++
    if (r < size && a[r] > a[largest]) largest = r

    steps.push(mkStep(a,
      { [root]: 'comparing', ...(l < size ? { [l]: 'comparing' } : {}), ...(r < size ? { [r]: 'comparing' } : {}) },
      `Heapify at ${root}: comparing with children`,
      4, swaps, comparisons
    ))

    if (largest !== root) {
      ;[a[root], a[largest]] = [a[largest], a[root]]
      swaps++
      steps.push(mkStep(a,
        { [root]: 'swapping', [largest]: 'swapping' },
        `Swapped arr[${root}]=${a[root]} and arr[${largest}]=${a[largest]}`,
        8, swaps, comparisons
      ))
      heapify(a, size, largest)
    }
  }

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(arr, n, i)
  steps.push(mkStep(arr, {}, 'Max-heap built! Now extracting elements.', 10, swaps, comparisons))

  for (let i = n - 1; i > 0; i--) {
    ;[arr[0], arr[i]] = [arr[i], arr[0]]
    swaps++
    steps.push(mkStep(arr,
      { 0: 'swapping', [i]: 'sorted' },
      `Moved max (${arr[i]}) to position ${i}`,
      13, swaps, comparisons
    ))
    heapify(arr, i, 0)
  }

  steps.push(mkStep(arr,
    Object.fromEntries(arr.map((_, i) => [i, 'sorted'])),
    'Array is fully sorted!',
    15, swaps, comparisons
  ))
  return steps
}

// ─── Radix Sort ───────────────────────────────────────────────────────────────
export function radixSortSteps(input) {
  const arr = [...input]
  const steps = []
  let swaps = 0, comparisons = 0

  steps.push(mkStep(arr, {}, 'Start: sort by each digit position', 0, 0, 0))

  const max = Math.max(...arr)
  let exp = 1

  while (Math.floor(max / exp) > 0) {
    const output = new Array(arr.length)
    const count = new Array(10).fill(0)
    const digit = Math.floor(Math.log10(exp)) + 1

    steps.push(mkStep(arr, {}, `Pass ${digit}: sorting by ${exp === 1 ? 'ones' : exp === 10 ? 'tens' : 'hundreds'} digit`, 2, swaps, comparisons))

    for (let i = 0; i < arr.length; i++) {
      const d = Math.floor(arr[i] / exp) % 10
      count[d]++
      comparisons++
    }
    for (let i = 1; i < 10; i++) count[i] += count[i - 1]
    for (let i = arr.length - 1; i >= 0; i--) {
      const d = Math.floor(arr[i] / exp) % 10
      output[--count[d]] = arr[i]
    }
    for (let i = 0; i < arr.length; i++) {
      arr[i] = output[i]
      swaps++
    }

    steps.push(mkStep(arr,
      Object.fromEntries(arr.map((_, i) => [i, 'current'])),
      `After ${digit > 1 ? digit + ' passes' : '1 pass'}: array rearranged by digit ${digit}`,
      8, swaps, comparisons
    ))
    exp *= 10
  }

  steps.push(mkStep(arr,
    Object.fromEntries(arr.map((_, i) => [i, 'sorted'])),
    'Array is fully sorted!',
    12, swaps, comparisons
  ))
  return steps
}

// ─── Code snippets ─────────────────────────────────────────────────────────────
export const sortingCode = {
  bubble: {
    python: [
      'def bubble_sort(arr):',
      '    n = len(arr)',
      '    for i in range(n - 1):',
      '        for j in range(n - i - 1):',
      '            if arr[j] > arr[j+1]:',
      '                arr[j], arr[j+1] = arr[j+1], arr[j]',
      '        # largest bubbles to end',
      '    return arr',
      '    # sorted!',
    ],
    java: [
      'void bubbleSort(int[] arr) {',
      '    int n = arr.length;',
      '    for (int i = 0; i < n-1; i++) {',
      '        for (int j = 0; j < n-i-1; j++) {',
      '            if (arr[j] > arr[j+1]) {',
      '                int tmp = arr[j];',
      '                arr[j] = arr[j+1]; arr[j+1] = tmp;',
      '            }',
      '        } // largest is at end',
      '    }',
      '}',
    ],
    cpp: [
      'void bubbleSort(int arr[], int n) {',
      '    for (int i = 0; i < n-1; i++)',
      '        for (int j = 0; j < n-i-1; j++)',
      '            if (arr[j] > arr[j+1])',
      '                swap(arr[j], arr[j+1]);',
      '    // array sorted',
      '}',
    ],
  },
  merge: {
    python: [
      'def merge_sort(arr, l, r):',
      '    if l >= r: return',
      '    mid = (l + r) // 2',
      '    merge_sort(arr, l, mid)',
      '    merge_sort(arr, mid+1, r)',
      '    merge(arr, l, mid, r)',
      '',
      'def merge(arr, l, m, r):',
      '    left = arr[l:m+1]; right = arr[m+1:r+1]',
      '    i = j = 0; k = l',
      '    while i < len(left) and j < len(right):',
      '        if left[i] <= right[j]:',
      '            arr[k] = left[i]; i += 1',
      '        else:',
      '            arr[k] = right[j]; j += 1',
      '        k += 1',
    ],
    java: [
      'void mergeSort(int[] arr, int l, int r) {',
      '    if (l >= r) return;',
      '    int mid = (l + r) / 2;',
      '    mergeSort(arr, l, mid);',
      '    mergeSort(arr, mid+1, r);',
      '    merge(arr, l, mid, r);',
      '}',
      'void merge(int[] arr, int l, int m, int r) {',
      '    int[] left = Arrays.copyOfRange(arr, l, m+1);',
      '    int[] right = Arrays.copyOfRange(arr, m+1, r+1);',
      '    int i=0, j=0, k=l;',
      '    while (i < left.length && j < right.length)',
      '        arr[k++] = left[i] <= right[j] ? left[i++] : right[j++];',
      '    // copy remaining',
      '}',
    ],
    cpp: [
      'void merge(int arr[], int l, int m, int r) {',
      '    vector<int> left(arr+l, arr+m+1);',
      '    vector<int> right(arr+m+1, arr+r+1);',
      '    int i=0,j=0,k=l;',
      '    while(i<left.size()&&j<right.size())',
      '        arr[k++]=left[i]<=right[j]?left[i++]:right[j++];',
      '    while(i<left.size()) arr[k++]=left[i++];',
      '    while(j<right.size()) arr[k++]=right[j++];',
      '}',
      'void mergeSort(int arr[], int l, int r) {',
      '    if(l>=r) return;',
      '    int m=(l+r)/2;',
      '    mergeSort(arr,l,m);',
      '    mergeSort(arr,m+1,r);',
      '    merge(arr,l,m,r);',
      '}',
    ],
  },
  quick: {
    python: [
      'def quick_sort(arr, lo, hi):',
      '    if lo >= hi: return',
      '    p = partition(arr, lo, hi)',
      '    quick_sort(arr, lo, p - 1)',
      '    quick_sort(arr, p + 1, hi)',
      '',
      'def partition(arr, lo, hi):',
      '    pivot = arr[hi]',
      '    i = lo - 1',
      '    for j in range(lo, hi):',
      '        if arr[j] <= pivot:',
      '            i += 1',
      '            arr[i], arr[j] = arr[j], arr[i]',
      '    arr[i+1], arr[hi] = arr[hi], arr[i+1]',
      '    return i + 1',
    ],
    java: [
      'void quickSort(int[] arr, int lo, int hi) {',
      '    if (lo >= hi) return;',
      '    int p = partition(arr, lo, hi);',
      '    quickSort(arr, lo, p - 1);',
      '    quickSort(arr, p + 1, hi);',
      '}',
      'int partition(int[] arr, int lo, int hi) {',
      '    int pivot = arr[hi], i = lo - 1;',
      '    for (int j = lo; j < hi; j++)',
      '        if (arr[j] <= pivot) { i++; swap(arr,i,j); }',
      '    swap(arr, i+1, hi);',
      '    return i + 1;',
      '}',
      '// pivot is in final sorted position',
    ],
    cpp: [
      'int partition(int arr[],int lo,int hi){',
      '    int pivot=arr[hi], i=lo-1;',
      '    for(int j=lo;j<hi;j++)',
      '        if(arr[j]<=pivot) swap(arr[++i],arr[j]);',
      '    swap(arr[i+1],arr[hi]);',
      '    return i+1;',
      '}',
      'void quickSort(int arr[],int lo,int hi){',
      '    if(lo>=hi) return;',
      '    int p=partition(arr,lo,hi);',
      '    quickSort(arr,lo,p-1);',
      '    quickSort(arr,p+1,hi);',
      '}',
      '// divide and conquer!',
    ],
  },
  heap: {
    python: [
      'def heap_sort(arr):',
      '    n = len(arr)',
      '    # build max-heap',
      '    for i in range(n//2-1, -1, -1):',
      '        heapify(arr, n, i)',
      '    for i in range(n-1, 0, -1):',
      '        arr[0], arr[i] = arr[i], arr[0]',
      '        heapify(arr, i, 0)',
      '',
      'def heapify(arr, n, i):',
      '    largest = i; l = 2*i+1; r = 2*i+2',
      '    if l < n and arr[l] > arr[largest]: largest = l',
      '    if r < n and arr[r] > arr[largest]: largest = r',
      '    if largest != i:',
      '        arr[i], arr[largest] = arr[largest], arr[i]',
      '        heapify(arr, n, largest)',
    ],
    java: [
      'void heapSort(int[] arr) {',
      '    int n = arr.length;',
      '    for (int i=n/2-1; i>=0; i--)',
      '        heapify(arr, n, i); // build max-heap',
      '    for (int i=n-1; i>0; i--) {',
      '        swap(arr, 0, i);',
      '        heapify(arr, i, 0);',
      '    }',
      '}',
      'void heapify(int[] arr, int n, int i) {',
      '    int largest=i, l=2*i+1, r=2*i+2;',
      '    if (l<n && arr[l]>arr[largest]) largest=l;',
      '    if (r<n && arr[r]>arr[largest]) largest=r;',
      '    if (largest!=i) { swap(arr,i,largest); heapify(arr,n,largest); }',
      '}',
    ],
    cpp: [
      'void heapify(int arr[], int n, int i) {',
      '    int lg=i, l=2*i+1, r=2*i+2;',
      '    if(l<n&&arr[l]>arr[lg]) lg=l;',
      '    if(r<n&&arr[r]>arr[lg]) lg=r;',
      '    if(lg!=i){swap(arr[i],arr[lg]);heapify(arr,n,lg);}',
      '}',
      'void heapSort(int arr[], int n) {',
      '    for(int i=n/2-1;i>=0;i--) heapify(arr,n,i);',
      '    for(int i=n-1;i>0;i--){',
      '        swap(arr[0],arr[i]);',
      '        heapify(arr,i,0);',
      '    }',
      '}',
    ],
  },
  radix: {
    python: [
      'def radix_sort(arr):',
      '    max_val = max(arr)',
      '    exp = 1',
      '    while max_val // exp > 0:',
      '        counting_sort(arr, exp)',
      '        exp *= 10',
      '',
      'def counting_sort(arr, exp):',
      '    n = len(arr); output = [0]*n; count = [0]*10',
      '    for i in arr: count[(i//exp)%10] += 1',
      '    for i in range(1,10): count[i] += count[i-1]',
      '    for i in range(n-1,-1,-1):',
      '        d = (arr[i]//exp)%10',
      '        output[count[d]-1] = arr[i]; count[d] -= 1',
      '    arr[:] = output',
    ],
    java: [
      'void radixSort(int[] arr) {',
      '    int max = Arrays.stream(arr).max().getAsInt();',
      '    for (int exp=1; max/exp>0; exp*=10)',
      '        countSort(arr, exp);',
      '}',
      'void countSort(int[] arr, int exp) {',
      '    int n=arr.length; int[] out=new int[n]; int[] cnt=new int[10];',
      '    for (int v : arr) cnt[(v/exp)%10]++;',
      '    for (int i=1;i<10;i++) cnt[i]+=cnt[i-1];',
      '    for (int i=n-1;i>=0;i--)',
      '        out[--cnt[(arr[i]/exp)%10]]=arr[i];',
      '    System.arraycopy(out,0,arr,0,n);',
      '}',
    ],
    cpp: [
      'void countSort(int arr[],int n,int exp){',
      '    int out[n],cnt[10]={};',
      '    for(int i=0;i<n;i++) cnt[(arr[i]/exp)%10]++;',
      '    for(int i=1;i<10;i++) cnt[i]+=cnt[i-1];',
      '    for(int i=n-1;i>=0;i--) out[--cnt[(arr[i]/exp)%10]]=arr[i];',
      '    for(int i=0;i<n;i++) arr[i]=out[i];',
      '}',
      'void radixSort(int arr[],int n){',
      '    int mx=*max_element(arr,arr+n);',
      '    for(int exp=1;mx/exp>0;exp*=10)',
      '        countSort(arr,n,exp);',
      '}',
    ],
  },
}

export const sortingComplexity = {
  bubble:  { time: 'O(n²)',     best: 'O(n)',      space: 'O(1)',      stable: true  },
  merge:   { time: 'O(n log n)', best: 'O(n log n)', space: 'O(n)',     stable: true  },
  quick:   { time: 'O(n log n)', best: 'O(n log n)', space: 'O(log n)', stable: false },
  heap:    { time: 'O(n log n)', best: 'O(n log n)', space: 'O(1)',      stable: false },
  radix:   { time: 'O(nk)',      best: 'O(nk)',       space: 'O(n+k)',   stable: true  },
}
