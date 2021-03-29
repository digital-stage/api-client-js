import omit from "lodash/omit";
import without from "lodash/without";
import upsert from "../utils/upsert";
import RemoteVideoTracks from "../collections/RemoteVideoTracks";
import ServerDeviceEvents from "../../types/ServerDeviceEvents";
import AdditionalReducerTypes from "../actions/AdditionalReducerTypes";
import ServerDevicePayloads from "../../types/ServerDevicePayloads";
import RemoteVideoTrack from "../../types/model/RemoteVideoTrack";

const addRemoteVideoTrack = (
  state: RemoteVideoTracks,
  remoteVideoTrack: RemoteVideoTrack
): RemoteVideoTracks => {
  return {
    ...state,
    byId: {
      ...state.byId,
      [remoteVideoTrack._id]: remoteVideoTrack,
    },
    byStageMember: {
      ...state.byStageMember,
      [remoteVideoTrack.stageMemberId]: state.byStageMember[
        remoteVideoTrack.stageMemberId
      ]
        ? [
            ...state.byStageMember[remoteVideoTrack.stageMemberId],
            remoteVideoTrack._id,
          ]
        : [remoteVideoTrack._id],
    },
    byUser: {
      ...state.byUser,
      [remoteVideoTrack.userId]: state.byUser[remoteVideoTrack.userId]
        ? [...state.byUser[remoteVideoTrack.userId], remoteVideoTrack._id]
        : [remoteVideoTrack._id],
    },
    byStage: {
      ...state.byStage,
      [remoteVideoTrack.stageId]: state.byStage[remoteVideoTrack.stageId]
        ? [...state.byStage[remoteVideoTrack.stageId], remoteVideoTrack._id]
        : [remoteVideoTrack._id],
    },
    allIds: upsert<string>(state.allIds, remoteVideoTrack._id),
  };
};

function reduceRemoteVideoTracks(
  state: RemoteVideoTracks = {
    byId: {},
    byStageMember: {},
    byStage: {},
    byUser: {},
    allIds: [],
  },
  action: {
    type: string;
    payload: any;
  }
): RemoteVideoTracks {
  switch (action.type) {
    case ServerDeviceEvents.StageLeft:
    case AdditionalReducerTypes.RESET: {
      return {
        byId: {},
        byStageMember: {},
        byStage: {},
        byUser: {},
        allIds: [],
      };
    }
    case ServerDeviceEvents.StageJoined: {
      const {
        remoteVideoTracks,
      } = action.payload as ServerDevicePayloads.StageJoined;
      let updatedState = { ...state };
      if (remoteVideoTracks)
        remoteVideoTracks.forEach((remoteVideoTrack) => {
          updatedState = addRemoteVideoTrack(updatedState, remoteVideoTrack);
        });
      return updatedState;
    }
    case ServerDeviceEvents.RemoteVideoTrackAdded: {
      const remoteVideoTrack = action.payload as ServerDevicePayloads.RemoteVideoTrackAdded;
      return addRemoteVideoTrack(state, remoteVideoTrack);
    }
    case ServerDeviceEvents.RemoteVideoTrackChanged: {
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
    case ServerDeviceEvents.RemoteVideoTrackRemoved: {
      const id = action.payload as string;
      if (!state.byId[id]) {
        return state;
      }
      const { stageId, stageMemberId, userId } = state.byId[id];
      return {
        ...state,
        byId: omit(state.byId, id),
        byStageMember: {
          ...state.byStageMember,
          [stageMemberId]: without(state.byStageMember[stageMemberId], id),
        },
        byStage: {
          ...state.byStage,
          [stageId]: without(state.byStage[stageId], id),
        },
        byUser: {
          ...state.byUser,
          [userId]: without(state.byUser[userId], id),
        },
        allIds: without<string>(state.allIds, id),
      };
    }
    default:
      return state;
  }
}

export default reduceRemoteVideoTracks;
