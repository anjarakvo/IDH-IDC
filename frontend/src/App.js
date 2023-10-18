import React, { useEffect } from "react";
import "./App.scss";
import { useCookies } from "react-cookie";
import { Routes, Route } from "react-router-dom";
import { PrivateRoutes } from "./components/route";
import { PageLayout } from "./components/layout";
import { Home } from "./pages/home";
import { Landing } from "./pages/landing";
import { Login } from "./pages/login";
import { Cases, Case } from "./pages/cases";
import { Dashboard } from "./pages/dashboard";
import { NotFound } from "./pages/not-found";
import { Welcome } from "./pages/welcome";
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
            s.role = data.role;
            s.active = data.active;
            s.organisation_detail = data.organisation_detail;
            s.business_unit_detail = data.business_unit_detail;
            s.tags_count = data.tags_count;
            s.cases_count = data.cases_count;
          });
        })
        .catch(() => {
          UserState.update((s) => {
            s.id = 0;
            s.fullname = null;
            s.email = null;
            s.role = null;
            s.active = false;
            s.organisation_detail = {
              id: 0,
              name: null,
            };
            s.business_unit_detail = [
              {
                id: 0,
                name: null,
                role: null,
              },
            ];
            s.tags_count = 0;
            s.cases_count = 0;
          });
        });
    }
  }, [authTokenAvailable, cookies?.AUTH_TOKEN]);

  return (
    <PageLayout testid="page-layout">
      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route element={<PrivateRoutes />}>
          <Route exact path="/home" element={<Home />} />
          <Route exact path="/dashboard" element={<Dashboard />} />
          <Route exact path="/welcome" element={<Welcome />} />
          <Route exact path="/cases" element={<Cases />} />
          <Route exact path="/cases/new" element={<Case />} />
        </Route>
        <Route exact path="/" element={<Landing />} />
        <Route exact path="/login" element={<Login />} />
      </Routes>
    </PageLayout>
  );
};

export default App;
