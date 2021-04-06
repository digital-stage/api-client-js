import omit from 'lodash/omit';
import without from 'lodash/without';
import Stage from '../../types/model/Stage';
import Stages from '../collections/Stages';
import upsert from '../utils/upsert';
import ServerDeviceEvents from '../../types/ServerDeviceEvents';
import ServerDevicePayloads from '../../types/ServerDevicePayloads';
import AdditionalReducerTypes from '../actions/AdditionalReducerTypes';

const addStage = (state: Stages, stage: Stage): Stages => ({
  ...state,
  byId: {
    ...state.byId,
    [stage._id]: stage,
  },
  allIds: upsert<string>(state.allIds, stage._id),
});

function reduceStages(
  state: Stages = {
    byId: {},
    allIds: [],
  },
  action: {
    type: string;
    payload: any;
  }
): Stages {
  switch (action.type) {
    case AdditionalReducerTypes.RESET: {
      return {
        byId: {},
        allIds: [],
      };
    }
    case ServerDeviceEvents.StageJoined: {
      const { stage } = action.payload as ServerDevicePayloads.StageJoined;
      if (stage) return addStage(state, stage);
      return state;
    }
    case ServerDeviceEvents.StageAdded: {
      const stage = action.payload as ServerDevicePayloads.StageAdded;
      return addStage(state, stage);
    }
    case ServerDeviceEvents.StageChanged:
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
    case ServerDeviceEvents.StageRemoved:
      return {
        ...state,
        byId: omit(state.byId, action.payload),
        allIds: without<string>(state.allIds, action.payload),
      };
    default:
      return state;
  }
}

export default reduceStages;
