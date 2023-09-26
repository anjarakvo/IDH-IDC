import React from "react";
import "./App.scss";
import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/home";
import { PageLayout } from "./components/layout";

const App = () => {
  return (
    <PageLayout testid="page-layout">
      <Routes>
        <Route exact path="/" element={<Home />} />
      </Routes>
    </PageLayout>
  );
};

export default App;
