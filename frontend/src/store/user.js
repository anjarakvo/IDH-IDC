import { Store } from "pullstate";

const defaultUserState = {
  id: null,
  fullname: null,
  email: null,
  active: false,
  organisation_detail: {
    id: null,
    name: null,
  },
};

const UserState = new Store(defaultUserState);

export default UserState;
