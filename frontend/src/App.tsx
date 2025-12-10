import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Routes>
          <Route path="/" element={<div>Flight Scanner</div>} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
