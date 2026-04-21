import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Plus, Trash2, RotateCcw } from 'lucide-react'
import VisualizerLayout from '../components/VisualizerLayout'
import './LinkedListVisualizer.css'

const TYPES = {
  singly: { label: 'Singly Linked List' },
  doubly: { label: 'Doubly Linked List' },
}

const code = {
  singly: {
    python: [
      'class Node:',
      '    def __init__(self, val):',
      '        self.val = val',
      '        self.next = None',
      '',
      'class LinkedList:',
      '    def __init__(self): self.head = None',
      '',
      '    def insert_front(self, val):',
      '        node = Node(val)',
      '        node.next = self.head',
      '        self.head = node',
      '',
      '    def delete(self, val):',
      '        cur = self.head',
      '        if cur.val == val: self.head = cur.next; return',
      '        while cur.next:',
      '            if cur.next.val == val:',
      '                cur.next = cur.next.next; return',
      '            cur = cur.next',
    ],
    java: [
      'class Node<T> {',
      '    T val; Node<T> next;',
      '    Node(T v) { val = v; }',
      '}',
      'class LinkedList<T> {',
      '    Node<T> head;',
      '    void insertFront(T val) {',
      '        Node<T> n = new Node<>(val);',
      '        n.next = head; head = n;',
      '    }',
      '    void delete(T val) {',
      '        if (head == null) return;',
      '        if (head.val.equals(val)) { head = head.next; return; }',
      '        Node<T> cur = head;',
      '        while (cur.next != null)',
      '            if (cur.next.val.equals(val)) { cur.next = cur.next.next; return; }',
      '            else cur = cur.next;',
      '    }',
      '}',
    ],
    cpp: [
      'template<typename T>',
      'struct Node { T val; Node* next; };',
      '',
      'template<typename T>',
      'class LinkedList {',
      '    Node<T>* head = nullptr;',
      'public:',
      '    void insertFront(T val) {',
      '        Node<T>* n = new Node<T>{val, head};',
      '        head = n;',
      '    }',
      '    void remove(T val) {',
      '        if (!head) return;',
      '        if (head->val == val) { head = head->next; return; }',
      '        Node<T>* cur = head;',
      '        while (cur->next)',
      '            if (cur->next->val == val) { cur->next = cur->next->next; return; }',
      '            else cur = cur->next;',
      '    }',
      '};',
    ],
  },
  doubly: {
    python: [
      'class DNode:',
      '    def __init__(self, val):',
      '        self.val = val',
      '        self.prev = self.next = None',
      '',
      'class DoublyLinkedList:',
      '    def __init__(self): self.head = self.tail = None',
      '',
      '    def insert_front(self, val):',
      '        node = DNode(val)',
      '        if self.head: self.head.prev = node',
      '        node.next = self.head',
      '        self.head = node',
      '        if not self.tail: self.tail = node',
      '',
      '    def insert_back(self, val):',
      '        node = DNode(val)',
      '        if self.tail: self.tail.next = node; node.prev = self.tail',
      '        self.tail = node',
      '        if not self.head: self.head = node',
    ],
    java: [
      'class DNode<T> {',
      '    T val; DNode<T> prev, next;',
      '    DNode(T v) { val = v; }',
      '}',
      'class DoublyLinkedList<T> {',
      '    DNode<T> head, tail;',
      '    void insertFront(T val) {',
      '        DNode<T> n = new DNode<>(val);',
      '        if (head != null) head.prev = n;',
      '        n.next = head; head = n;',
      '        if (tail == null) tail = n;',
      '    }',
      '    void insertBack(T val) {',
      '        DNode<T> n = new DNode<>(val);',
      '        if (tail != null) { tail.next = n; n.prev = tail; }',
      '        tail = n;',
      '        if (head == null) head = n;',
      '    }',
      '}',
    ],
    cpp: [
      'template<typename T>',
      'struct DNode { T val; DNode *prev, *next; };',
      '',
      'template<typename T>',
      'class DoublyLinkedList {',
      '    DNode<T> *head=nullptr, *tail=nullptr;',
      'public:',
      '    void insertFront(T val) {',
      '        DNode<T>* n = new DNode<T>{val,nullptr,head};',
      '        if (head) head->prev = n;',
      '        head = n;',
      '        if (!tail) tail = n;',
      '    }',
      '    void insertBack(T val) {',
      '        DNode<T>* n = new DNode<T>{val,tail,nullptr};',
      '        if (tail) tail->next = n;',
      '        tail = n;',
      '        if (!head) head = n;',
      '    }',
      '};',
    ],
  },
}

const complexity = {
  singly: { insert: 'O(1)', search: 'O(n)', delete: 'O(n)', space: 'O(n)', notes: 'Insert at head is O(1). Search and delete require traversal O(n).' },
  doubly: { insert: 'O(1)', search: 'O(n)', delete: 'O(1)*', space: 'O(n)', notes: '*Delete O(1) if you have the node pointer. O(n) if searching by value.' },
}

export default function LinkedListVisualizer() {
  const { type = 'singly' } = useParams()
  const navigate = useNavigate()
  const [language, setLanguage] = useState('java')
  const [list, setList] = useState([1, 2, 3, 4, 5])
  const [inputVal, setInputVal] = useState('')
  const [highlighted, setHighlighted] = useState(null)
  const [stepDesc, setStepDesc] = useState('')

  function flash(idx, desc) {
    setHighlighted(idx)
    setStepDesc(desc)
    setTimeout(() => { setHighlighted(null); setStepDesc('') }, 1200)
  }

  function insertFront() {
    const v = parseInt(inputVal)
    if (isNaN(v)) return
    setList(l => [v, ...l])
    flash(0, `Inserted ${v} at the front — new head!`)
    setInputVal('')
  }

  function insertBack() {
    const v = parseInt(inputVal)
    if (isNaN(v)) return
    setList(l => [...l, v])
    flash(list.length, `Inserted ${v} at the tail`)
    setInputVal('')
  }

  function deleteNode(idx) {
    flash(idx, `Deleted node with value ${list[idx]}`)
    setTimeout(() => setList(l => l.filter((_, i) => i !== idx)), 400)
  }

  function reset() {
    setList([1, 2, 3, 4, 5])
    setHighlighted(null)
    setStepDesc('')
  }

  const controls = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
      <div className="algo-tabs">
        {Object.entries(TYPES).map(([k, v]) => (
          <button key={k} className={`algo-tab ${k === type ? 'active' : ''}`}
            onClick={() => navigate(`/linked-list/${k}`)}>
            {v.label}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <input type="number" value={inputVal} onChange={e => setInputVal(e.target.value)}
          placeholder="Value..." style={{ width: 100 }}
          onKeyDown={e => e.key === 'Enter' && insertFront()} />
        <button className="btn btn-primary" onClick={insertFront}><Plus size={14} /> Insert Front</button>
        <button className="btn btn-secondary" onClick={insertBack}><Plus size={14} /> Insert Back</button>
        <button className="btn btn-ghost btn-icon tooltip-container" onClick={reset}>
          <RotateCcw size={16} /><span className="tooltip">Reset</span>
        </button>
      </div>
    </div>
  )

  const visualization = (
    <div className="ll-canvas">
      <div className="ll-head-label">HEAD</div>
      <div className="ll-list">
        {list.map((val, i) => (
          <div key={i} className="ll-item-wrap">
            <div className={`ll-node ${highlighted === i ? 'highlighted' : ''}`}>
              <div className="ll-node-val">{val}</div>
              <div className="ll-node-ptr">→</div>
              <button className="ll-delete-btn" onClick={() => deleteNode(i)} title="Delete">
                <Trash2 size={10} />
              </button>
            </div>
            {type === 'doubly' && i > 0 && (
              <div className="ll-back-arrow">←</div>
            )}
            {i < list.length - 1 && (
              <div className="ll-arrow">→</div>
            )}
          </div>
        ))}
        <div className="ll-null">null</div>
      </div>
    </div>
  )

  return (
    <VisualizerLayout
      title={TYPES[type]?.label || 'Linked List'}
      subtitle="Insert, delete, and traverse node by node"
      category="linkedList"
      algoKey={type}
      controls={controls}
      visualization={visualization}
      stepDesc={stepDesc}
      code={code[type]}
      language={language}
      onLanguageChange={setLanguage}
      currentLine={0}
      complexity={complexity[type]}
    />
  )
}
