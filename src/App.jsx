import { Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Home from './components/Home'
import SortingVisualizer from './visualizers/SortingVisualizer'
import TreeVisualizer from './visualizers/TreeVisualizer'
import GraphVisualizer from './visualizers/GraphVisualizer'
import LinkedListVisualizer from './visualizers/LinkedListVisualizer'
import StackQueueVisualizer from './visualizers/StackQueueVisualizer'
import HashMapVisualizer from './visualizers/HashMapVisualizer'
import BinarySearchVisualizer from './visualizers/BinarySearchVisualizer'
import DPVisualizer from './visualizers/DPVisualizer'
import './App.css'

function AppLayout() {
  return (
    <div className="app-layout">
      <Navbar />
      <div className="app-body">
        <Sidebar />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sorting/:algo?" element={<SortingVisualizer />} />
            <Route path="/trees/:type?" element={<TreeVisualizer />} />
            <Route path="/graphs/:algo?" element={<GraphVisualizer />} />
            <Route path="/linked-list/:type?" element={<LinkedListVisualizer />} />
            <Route path="/stack-queue/:type?" element={<StackQueueVisualizer />} />
            <Route path="/hashmap" element={<HashMapVisualizer />} />
            <Route path="/search" element={<BinarySearchVisualizer />} />
            <Route path="/dp/:algo?" element={<DPVisualizer />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppLayout />
    </AppProvider>
  )
}
