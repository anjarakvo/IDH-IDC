import React from "react";
import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/home";

const App = () => {
  return (
    <div testid="hello">
      <Routes>
        <Route exact path="/" element={<Home />} />
      </Routes>
    </div>
  );
};

export default App;
