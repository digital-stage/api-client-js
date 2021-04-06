import Cookie from 'js-cookie';
import Globals from '../collections/Globals';
import AdditionalReducerTypes from '../actions/AdditionalReducerTypes';
import ServerDeviceEvents from '../../types/ServerDeviceEvents';
import ServerDevicePayloads from '../../types/ServerDevicePayloads';

function reduceGlobals(
  state: Globals = {
    ready: false,
    stageId: undefined,
    groupId: undefined,
    localDeviceId: undefined,
    localUser: undefined,
  },
  action: {
    type: string;
    payload: any;
  }
): Globals {
  switch (action.type) {
    case AdditionalReducerTypes.RESET: {
      return {
        ready: false,
        stageId: undefined,
        groupId: undefined,
        localDeviceId: undefined,
        localUser: undefined,
      };
    }
    case ServerDeviceEvents.Ready:
      return {
        ...state,
        ready: true,
      };
    case ServerDeviceEvents.StageJoined: {
      const {
        stageId,
        groupId,
      } = action.payload as ServerDevicePayloads.StageJoined;
      return {
        ...state,
        stageId,
        groupId,
      };
    }
    case ServerDeviceEvents.StageLeft:
      return {
        ...state,
        stageId: undefined,
        groupId: undefined,
      };
    case ServerDeviceEvents.UserReady:
      return {
        ...state,
        localUser: action.payload,
      };
    case ServerDeviceEvents.UserChanged:
      return {
        ...state,
        localUser: {
          ...state.localUser,
          ...action.payload,
        },
      };
    case ServerDeviceEvents.UserRemoved:
      return {
        ...state,
        localUser: undefined,
      };
    case ServerDeviceEvents.LocalDeviceReady: {
      // Store cookie of uuid
      const payload = action.payload as ServerDevicePayloads.LocalDeviceReady;
      if (payload.uuid) {
        Cookie.set('device', payload.uuid);
      }
      return {
        ...state,
        localDeviceId: action.payload._id,
      };
    }
    default: {
      return state;
    }
  }
}

export default reduceGlobals;
