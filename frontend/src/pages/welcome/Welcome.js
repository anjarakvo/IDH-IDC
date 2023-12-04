import React from "react";
import "./welcome.scss";
import { UserState } from "../../store";
import {
  Jumbotron,
  GetStarted,
  FrameworkDrivers,
  CompareIncomeTarget,
  ExploreStudies,
  FooterDisclaimer,
} from "../landing/components";

const Welcome = ({ signOut }) => {
  const userId = UserState.useState((s) => s.id);
  const loggedIn = userId ? true : false;

  return (
    <div>
      <Jumbotron signOut={signOut} />
      <GetStarted loggedIn={loggedIn} />
      <FrameworkDrivers />
      <CompareIncomeTarget />
      <ExploreStudies />
      <FooterDisclaimer />
    </div>
  );
};

export default Welcome;
