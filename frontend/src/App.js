import React, { useEffect } from "react";
import "./App.scss";
import { useCookies } from "react-cookie";
import { Routes, Route } from "react-router-dom";
import { PrivateRoutes } from "./components/route";
import { PageLayout } from "./components/layout";
import { Home } from "./pages/home";
import { Login } from "./pages/login";
import { Dashboard } from "./pages/dashboard";
import { UserState } from "./store";
import { api } from "./lib";

const App = () => {
  const [cookies] = useCookies(["AUTH_TOKEN"]);
  const authTokenAvailable =
    cookies?.AUTH_TOKEN && cookies?.AUTH_TOKEN !== "undefined";

  useEffect(() => {
    if (authTokenAvailable) {
      api.setToken(cookies?.AUTH_TOKEN);
      api
        .get("user/me")
        .then((res) => {
          const { data } = res;
          UserState.update((s) => {
            s.id = data.id;
            s.fullname = data.fullname;
            s.email = data.email;
            s.active = data.active;
            s.organisation_detail = data.organisation_detail;
          });
        })
        .catch(() => {
          UserState.update((s) => {
            s.id = null;
            s.fullname = null;
            s.email = null;
            s.active = false;
            s.organisation_detail = {
              id: null,
              name: null,
            };
          });
        });
    }
  }, [authTokenAvailable, cookies?.AUTH_TOKEN]);

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
