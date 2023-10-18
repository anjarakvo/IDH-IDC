import { Store } from "pullstate";

const defaultUIState = {
  organisationOptions: [],
  tagOptions: [],
};

const UIState = new Store(defaultUIState);

export default UIState;
