import { Store } from "pullstate";

const defaultUIState = {
  rootLoading: true,
  organisationOptions: [],
  tagOptions: [],
};

const UIState = new Store(defaultUIState);

export default UIState;
