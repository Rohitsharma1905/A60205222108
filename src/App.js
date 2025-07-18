import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ShortenerPage from './components/ShortenerPage';
import StatisticsPage from './components/StatisticsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ShortenerPage />} />
        <Route path="/stats" element={<StatisticsPage />} />
        <Route path="/:shortcode" element={<ShortenerPage />} />
      </Routes>
    </Router>
  );
}

export default App;
