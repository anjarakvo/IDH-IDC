import { Store } from "pullstate";

const defaultUserState = {
  id: null,
  fullname: null,
  email: null,
  active: 0,
  organisation_detail: {
    id: null,
    name: null,
  },
};

const UserState = new Store(defaultUserState);

export default UserState;
