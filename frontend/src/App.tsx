import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ForumHome from './components/ForumHome';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path="/" element={<ForumHome />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App; 