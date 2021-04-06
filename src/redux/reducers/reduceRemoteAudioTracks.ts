import omit from 'lodash/omit';
import without from 'lodash/without';
import upsert from '../utils/upsert';
import RemoteAudioTracks from '../collections/RemoteAudioTracks';
import ServerDeviceEvents from '../../types/ServerDeviceEvents';
import AdditionalReducerTypes from '../actions/AdditionalReducerTypes';
import ServerDevicePayloads from '../../types/ServerDevicePayloads';
import RemoteAudioTrack from '../../types/model/RemoteAudioTrack';

const addRemoteAudioTrack = (
  state: RemoteAudioTracks,
  remoteAudioTrack: RemoteAudioTrack
): RemoteAudioTracks => ({
  ...state,
  byId: {
    ...state.byId,
    [remoteAudioTrack._id]: remoteAudioTrack,
  },
  byStageMember: {
    ...state.byStageMember,
    [remoteAudioTrack.stageMemberId]: state.byStageMember[
      remoteAudioTrack.stageMemberId
    ]
      ? [
          ...state.byStageMember[remoteAudioTrack.stageMemberId],
          remoteAudioTrack._id,
        ]
      : [remoteAudioTrack._id],
  },
  byUser: {
    ...state.byUser,
    [remoteAudioTrack.userId]: state.byUser[remoteAudioTrack.userId]
      ? [...state.byUser[remoteAudioTrack.userId], remoteAudioTrack._id]
      : [remoteAudioTrack._id],
  },
  byStage: {
    ...state.byStage,
    [remoteAudioTrack.stageId]: state.byStage[remoteAudioTrack.stageId]
      ? [...state.byStage[remoteAudioTrack.stageId], remoteAudioTrack._id]
      : [remoteAudioTrack._id],
  },
  allIds: upsert<string>(state.allIds, remoteAudioTrack._id),
});

function reduceRemoteAudioTracks(
  state: RemoteAudioTracks = {
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
): RemoteAudioTracks {
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
        remoteAudioTracks,
      } = action.payload as ServerDevicePayloads.StageJoined;
      let updatedState = { ...state };
      if (remoteAudioTracks)
        remoteAudioTracks.forEach((remoteAudioTrack) => {
          updatedState = addRemoteAudioTrack(updatedState, remoteAudioTrack);
        });
      return updatedState;
    }
    case ServerDeviceEvents.RemoteAudioTrackAdded: {
      const remoteAudioTrack = action.payload as ServerDevicePayloads.RemoteAudioTrackAdded;
      return addRemoteAudioTrack(state, remoteAudioTrack);
    }
    case ServerDeviceEvents.RemoteAudioTrackChanged: {
      const update = action.payload as ServerDevicePayloads.RemoteAudioTrackChanged;
      return {
        ...state,
        byId: {
          ...state.byId,
          [update._id]: {
            ...state.byId[update._id],
            ...update,
          },
        },
      };
    }
    case ServerDeviceEvents.RemoteAudioTrackRemoved: {
      const id = action.payload as ServerDevicePayloads.RemoteAudioTrackRemoved;
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

export default reduceRemoteAudioTracks;
