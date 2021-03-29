import { AnyAction } from "redux";
import stageActions from "./stageActions";
import deviceActions from "./deviceActions";
import AdditionalReducerTypes from "./AdditionalReducerTypes";
import User from "../../types/model/User";
import ServerDeviceEvents from "../../types/ServerDeviceEvents";
import ServerDevicePayloads from "../../types/ServerDevicePayloads";

export interface ReducerAction extends AnyAction {
  type: typeof ServerDeviceEvents | AdditionalReducerTypes;
  payload?: any;
}

const changeUser = (user: Partial<User>) => {
  return {
    type: ServerDeviceEvents.UserAdded,
    payload: user,
  };
};
const handleUserReady = (user: ServerDevicePayloads.UserReady) => {
  return {
    type: ServerDeviceEvents.UserReady,
    payload: user,
  };
};
const setReady = () => {
  return {
    type: ServerDeviceEvents.Ready,
  };
};

const handleStageJoined = (payload: ServerDevicePayloads.StageJoined) => {
  return {
    type: ServerDeviceEvents.StageJoined,
    payload,
  };
};
const handleStageLeft = () => {
  return {
    type: ServerDeviceEvents.StageLeft,
  };
};

const reset = () => {
  return {
    type: AdditionalReducerTypes.RESET,
  };
};

const allActions = {
  server: {
    changeUser,
    handleUserReady,
    handleStageJoined,
    handleStageLeft,
    setReady,
  },
  client: {
    reset,
  },
  stageActions,
  deviceActions,
};
export default allActions;
