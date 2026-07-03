import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Predict from './components/Predict';
import Insights from './components/Insights';

function App() {
  const [predictionData, setPredictionData] = useState(null);

  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/predict" element={<Predict setPredictionData={setPredictionData} />} />
          <Route path="/insights" element={<Insights predictionData={predictionData} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;