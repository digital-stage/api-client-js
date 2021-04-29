import omit from 'lodash/omit';
import without from 'lodash/without';
import upsert from '../utils/upsert';
import User from '../../types/model/User';
import RemoteUsers from '../collections/RemoteUsers';
import AdditionalReducerTypes from '../actions/AdditionalReducerTypes';
import ServerDeviceEvents from '../../types/ServerDeviceEvents';
import ServerDevicePayloads from '../../types/ServerDevicePayloads';

const addUser = (state: RemoteUsers, user: User): RemoteUsers => ({
  ...state,
  byId: {
    ...state.byId,
    [user._id]: user,
  },
  allIds: upsert<string>(state.allIds, user._id),
});

function reduceRemoteUsers(
  state: RemoteUsers = {
    byId: {},
    allIds: [],
  },
  action: {
    type: string;
    payload: any;
  }
): RemoteUsers {
  switch (action.type) {
    case AdditionalReducerTypes.RESET: {
      return {
        byId: {},
        allIds: [],
      };
    }
    case ServerDeviceEvents.StageJoined: {
      const {
        remoteUsers,
      } = action.payload as ServerDevicePayloads.StageJoined;
      let updated = { ...state };
      if (remoteUsers)
        remoteUsers.forEach((user) => {
          updated = addUser(updated, user);
        });
      return updated;
    }
    case ServerDeviceEvents.RemoteUserAdded: {
      const user = action.payload as User;
      return addUser(state, user);
    }
    case ServerDeviceEvents.RemoteUserChanged:
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
    case ServerDeviceEvents.RemoteUserRemoved:
      return {
        ...state,
        byId: omit(state.byId, action.payload),
        allIds: without<string>(state.allIds, action.payload),
      };
    default:
      return state;
  }
}

export default reduceRemoteUsers;
