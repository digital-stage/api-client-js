import { AnyAction, Dispatch, Middleware, MiddlewareAPI } from 'redux';
import { RootReducer } from '../reducers';
import ServerDeviceEvents from '../../types/ServerDeviceEvents';
import Device from '../../types/model/Device';
import ServerDevicePayloads from '../../types/ServerDevicePayloads';

/*
const syncSendingVideos = (state: RootReducer, dispatch: Dispatch) => {
  // Shall this device send video?
  const localDevice = state.globals.localDeviceId
    ? (state.devices.byId[state.globals.localDeviceId] as MediasoupDevice)
    : undefined;
  const stage = state.globals.stageId
    ? state.stages.byId[state.globals.stageId]
    : undefined;

  if (
    localDevice?.sendVideo &&
    localDevice.inputVideoDeviceId &&
    stage?.videoType === 'mediasoup'
  ) {
    // Are we already sending?
  }
}; */

const mediasoupMiddleware: Middleware = (
  api: MiddlewareAPI<Dispatch, RootReducer>
) => (next: Dispatch) => <A extends AnyAction>(action: A): A => {
  console.log('Before');

  const result = next(action);

  const state = api.getState();
  const localDevice: Device | undefined = state.globals.localDeviceId
    ? state.devices.byId[state.globals.localDeviceId]
    : undefined;
  switch (action.type) {
    case ServerDeviceEvents.RemoteVideoTrackAdded: {
      const payload = action.payload as ServerDevicePayloads.RemoteVideoTrackAdded;
      if (payload.type === 'mediasoup') {
        if (localDevice?.receiveVideo) {
          console.log('CONSUME VIDEO');
        }
      }
      break;
    }
    case ServerDeviceEvents.StageJoined: {
      const payload = action.payload as ServerDevicePayloads.StageJoined;
      const stage = state.stages.byId[payload.stageId];

      if (localDevice?.sendVideo && stage.videoRouter === 'mediasoup') {
      }
      break;
    }
    default: {
      console.log(`Nothing to do for ${action.type}`);
    }
  }
  console.log('After'); // Can use: api.getState()
  return result;
};

export default mediasoupMiddleware;
