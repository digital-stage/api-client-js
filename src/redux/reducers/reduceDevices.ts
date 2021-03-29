import omit from "lodash/omit";
import without from "lodash/without";
import upsert from "../utils/upsert";
import AdditionalReducerTypes from "../actions/AdditionalReducerTypes";
import Devices from "../collections/Devices";
import ServerDeviceEvents from "../../types/ServerDeviceEvents";
import ServerDevicePayloads from "../../types/ServerDevicePayloads";

function reduceDevices(
  state: Devices = {
    byId: {},
    allIds: [],
  },
  action: {
    type: string;
    payload: any;
  }
): Devices {
  switch (action.type) {
    case AdditionalReducerTypes.RESET: {
      return {
        byId: {},
        allIds: [],
      };
    }
    case ServerDeviceEvents.LocalDeviceReady:
    case ServerDeviceEvents.DeviceAdded: {
      const device = action.payload as ServerDevicePayloads.DeviceAdded;
      return {
        ...state,
        byId: {
          ...state.byId,
          [device._id]: device,
        },
        allIds: upsert<string>(state.allIds, device._id),
      };
    }
    case ServerDeviceEvents.DeviceChanged: {
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.payload._id]: {
            ...state.byId[action.payload._id],
            ...action.payload,
          },
        },
      };
    }
    case ServerDeviceEvents.DeviceRemoved: {
      return {
        ...state,
        byId: omit(state.byId, action.payload),
        allIds: without<string>(state.allIds, action.payload),
      };
    }
    default:
      return state;
  }
}

export default reduceDevices;
