import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LobbyPage from "../pages/lobbyPage"; // Import the LobbyPage component
import CodeBlock from "../components/codeBlock"; // Import the CodeBlockPage component

const RouterComponent: React.FC = () => {
  return (
    <Router>
        <Routes>
        {/* The lobby page route */}
        <Route path="/" element={<LobbyPage />} />
        
        {/* The code block page route */}
        {/* TODO :: change param use to key or prop-id */}
        <Route path="/code-block/:id" element={<CodeBlock />} />
        </Routes>
    </Router>
  );
};

export default RouterComponent;
