import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LobbyPage from "../pages/lobbyPage"; 
import CodeBlock from "../components/codeBlock"; 

const RouterComponent: React.FC = () => {
  return (
    <Router>
        <Routes>
        {/* The lobby page route */}
        <Route path="/" element={<LobbyPage />} />
        
        {/* The code block page route */}
        <Route path="/code-block/:id" element={<CodeBlock />} />
        </Routes>
    </Router>
  );
};

export default RouterComponent;
