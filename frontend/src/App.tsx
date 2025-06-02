import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ForumHome from "./components/ForumHome";
import { Registration } from "./components/Registration";
import "./App.css";

const App: React.FC = () => {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path="/" element={<ForumHome />} />
          <Route path="/join" element={<Registration />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App; 
