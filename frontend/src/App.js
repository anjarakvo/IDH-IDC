import React from "react";
import "./App.scss";
import { Routes, Route } from "react-router-dom";
import { PrivateRoutes } from "./components/route";
import { PageLayout } from "./components/layout";
import { Home } from "./pages/home";
import { Login } from "./pages/login";
import { Dashboard } from "./pages/dashboard";

const App = () => {
  return (
    <PageLayout testid="page-layout">
      <Routes>
        <Route element={<PrivateRoutes />}>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route exact path="/login" element={<Login />} />
      </Routes>
    </PageLayout>
  );
};

export default App;
