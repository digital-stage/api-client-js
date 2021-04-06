import omit from 'lodash/omit';
import without from 'lodash/without';
import ServerDeviceEvents from '../../types/ServerDeviceEvents';
import ServerDevicePayloads from '../../types/ServerDevicePayloads';
import upsert from '../utils/upsert';
import LocalAudioTracks from '../collections/LocalAudioTracks';

function reduceLocalAudioTracks(
  state: LocalAudioTracks = {
    byId: {},
    allIds: [],
  },
  action: {
    type: string;
    payload: any;
  }
): LocalAudioTracks {
  switch (action.type) {
    case ServerDeviceEvents.LocalAudioTrackAdded: {
      const localAudioTrack = action.payload as ServerDevicePayloads.LocalAudioTrackAdded;
      return {
        byId: {
          ...state.byId,
          localAudioTrack,
        },
        allIds: upsert<string>(state.allIds, localAudioTrack._id),
      };
    }
    case ServerDeviceEvents.LocalAudioTrackChanged: {
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.payload._id]: {
            ...state.byId[action.payload._id],
            ...(action.payload as ServerDevicePayloads.LocalAudioTrackChanged),
          },
        },
      };
    }
    case ServerDeviceEvents.LocalAudioTrackRemoved: {
      const id = action.payload as ServerDevicePayloads.LocalAudioTrackRemoved;
      if (!state.byId[id]) {
        return state;
      }
      return {
        ...state,
        byId: omit(state.byId, id),
        allIds: without<string>(state.allIds, id),
      };
    }
    default:
      return state;
  }
}

export default reduceLocalAudioTracks;
