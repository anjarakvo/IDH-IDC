import React, { useEffect, useState } from "react";
import "./App.scss";
import { Spin } from "antd";
import { useCookies } from "react-cookie";
import { Routes, Route } from "react-router-dom";
import { PrivateRoutes } from "./components/route";
import { PageLayout } from "./components/layout";
import { Home } from "./pages/home";
import { Landing } from "./pages/landing";
import { Login } from "./pages/login";
import { Cases, Case } from "./pages/cases";
import { NotFound } from "./pages/not-found";
import { Welcome } from "./pages/welcome";
import { Users, UserForm } from "./pages/admin";
import { UserState, UIState } from "./store";
import { api } from "./lib";
import { adminRole } from "./store/static";

const optionRoutes = ["organisation/options", "tag/options"];

const App = () => {
  const [cookies] = useCookies(["AUTH_TOKEN"]);
  const [authTokenAvailable, setAuthTokenAvailable] = useState(false);
  const userRole = UserState.useState((s) => s.role);
  const rootLoading = UIState.useState((s) => s.rootLoading);

  useEffect(() => {
    const optionApiCalls = optionRoutes.map((url) => api.get(url));
    Promise.all(optionApiCalls)
      .then((res) => {
        const [orgRes, tagRes] = res;
        UIState.update((s) => {
          s.organisationOptions = orgRes.data;
          s.tagOptions = tagRes.data;
        });
      })
      .catch((e) => {
        console.error(e);
      });
  }, []);

  useEffect(() => {
    setAuthTokenAvailable(
      cookies?.AUTH_TOKEN && cookies?.AUTH_TOKEN !== "undefined"
    );
    api.setToken(cookies?.AUTH_TOKEN);
  }, [cookies]);

  useEffect(() => {
    if (authTokenAvailable && userRole === null) {
      UIState.update((s) => {
        s.rootLoading = true;
      });
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
        })
        .finally(() => {
          UIState.update((s) => {
            s.rootLoading = false;
          });
        });
    }
  }, [authTokenAvailable, userRole]);

  return (
    <PageLayout testid="page-layout">
      {rootLoading ? (
        <div className="loading-container">
          <Spin />
        </div>
      ) : (
        <Routes>
          <Route path="*" element={<NotFound />} />
          {userRole !== null ? (
            <Route element={<PrivateRoutes />}>
              <Route exact path="/welcome" element={<Welcome />} />
              <Route exact path="/home" element={<Home />} />
              <Route exact path="/welcome" element={<Welcome />} />
              <Route exact path="/cases" element={<Cases />} />
              <Route exact path="/cases/new" element={<Case />} />
              <Route exact path="/cases/:caseId" element={<Case />} />
            </Route>
          ) : (
            ""
          )}
          {adminRole.includes(userRole) ? (
            <Route element={<PrivateRoutes />}>
              <Route exact path="/admin/users" element={<Users />} />
              <Route exact path="/admin/user/new" element={<UserForm />} />
              <Route path="/admin/user/:userId" element={<UserForm />} />
            </Route>
          ) : (
            ""
          )}
          <Route exact path="/" element={<Landing />} />
          <Route exact path="/login" element={<Login />} />
        </Routes>
      )}
    </PageLayout>
  );
};

export default App;
