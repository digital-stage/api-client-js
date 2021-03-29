import User from "../../types/model/User";

interface RemoteUsers {
  byId: {
    [id: string]: User;
  };
  allIds: string[];
}

export default RemoteUsers;
