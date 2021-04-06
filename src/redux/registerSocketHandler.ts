import { Store } from 'redux';
import { TeckosClient } from 'teckos-client';
import Cookie from 'js-cookie';
import ServerDeviceEvents from '../types/ServerDeviceEvents';
import allActions from './actions';
import ServerDevicePayloads from '../types/ServerDevicePayloads';

const registerSocketHandler = (
  store: Store,
  socket: TeckosClient
): TeckosClient => {
  // socket.setMaxListeners(70);
  socket.on('disconnect', () => {
    // Cleanup
    store.dispatch(allActions.client.reset());
  });

  socket.on(ServerDeviceEvents.Ready, () => {
    store.dispatch(allActions.server.setReady());
  });

  socket.on(
    ServerDeviceEvents.LocalDeviceReady,
    (payload: ServerDevicePayloads.LocalDeviceReady) => {
      store.dispatch(
        allActions.deviceActions.server.handleLocalDeviceReady(payload)
      );
      if (payload.requestSession && payload.uuid) {
        Cookie.set('device', payload.uuid);
      }
    }
  );

  socket.on(
    ServerDeviceEvents.UserReady,
    (payload: ServerDevicePayloads.UserReady) => {
      store.dispatch(allActions.server.handleUserReady(payload));
    }
  );

  socket.on(
    ServerDeviceEvents.UserChanged,
    (payload: ServerDevicePayloads.UserChanged) => {
      store.dispatch(allActions.server.changeUser(payload));
    }
  );

  socket.on(
    ServerDeviceEvents.DeviceAdded,
    (payload: ServerDevicePayloads.DeviceAdded) => {
      store.dispatch(allActions.deviceActions.server.addDevice(payload));
    }
  );
  socket.on(
    ServerDeviceEvents.DeviceChanged,
    (payload: ServerDevicePayloads.DeviceChanged) => {
      store.dispatch(allActions.deviceActions.server.changeDevice(payload));
    }
  );
  socket.on(
    ServerDeviceEvents.DeviceRemoved,
    (payload: ServerDevicePayloads.DeviceRemoved) => {
      store.dispatch(allActions.deviceActions.server.removeDevice(payload));
    }
  );

  socket.on(
    ServerDeviceEvents.RemoteUserAdded,
    (payload: ServerDevicePayloads.RemoteUserAdded) => {
      store.dispatch(allActions.stageActions.server.addRemoteUser(payload));
    }
  );

  socket.on(
    ServerDeviceEvents.RemoteUserChanged,
    (payload: ServerDevicePayloads.RemoteUserChanged) => {
      store.dispatch(allActions.stageActions.server.changeRemoteUser(payload));
    }
  );

  socket.on(
    ServerDeviceEvents.RemoteUserRemoved,
    (payload: ServerDevicePayloads.RemoteUserRemoved) => {
      store.dispatch(allActions.stageActions.server.removeRemoteUser(payload));
    }
  );

  socket.on(
    ServerDeviceEvents.ChatMessageSend,
    (payload: ServerDevicePayloads.ChatMessageSend) => {
      store.dispatch(allActions.stageActions.server.messageSent(payload));
    }
  );

  socket.on(
    ServerDeviceEvents.StageAdded,
    (payload: ServerDevicePayloads.StageAdded) => {
      store.dispatch(allActions.stageActions.server.addStage(payload));
    }
  );
  socket.on(
    ServerDeviceEvents.StageJoined,
    (payload: ServerDevicePayloads.StageJoined) => {
      store.dispatch(allActions.server.handleStageJoined(payload));
    }
  );
  socket.on(ServerDeviceEvents.StageLeft, () => {
    store.dispatch(allActions.server.handleStageLeft());
  });
  socket.on(
    ServerDeviceEvents.StageChanged,
    (payload: ServerDevicePayloads.StageChanged) => {
      store.dispatch(allActions.stageActions.server.changeStage(payload));
    }
  );
  socket.on(
    ServerDeviceEvents.StageRemoved,
    (payload: ServerDevicePayloads.StageRemoved) => {
      store.dispatch(allActions.stageActions.server.removeStage(payload));
    }
  );

  socket.on(
    ServerDeviceEvents.GroupAdded,
    (payload: ServerDevicePayloads.GroupAdded) => {
      store.dispatch(allActions.stageActions.server.addGroup(payload));
    }
  );
  socket.on(
    ServerDeviceEvents.GroupChanged,
    (payload: ServerDevicePayloads.GroupChanged) => {
      store.dispatch(allActions.stageActions.server.changeGroup(payload));
    }
  );
  socket.on(
    ServerDeviceEvents.GroupRemoved,
    (payload: ServerDevicePayloads.GroupRemoved) => {
      store.dispatch(allActions.stageActions.server.removeGroup(payload));
    }
  );

  socket.on(
    ServerDeviceEvents.CustomGroupVolumeAdded,
    (payload: ServerDevicePayloads.CustomGroupVolumeAdded) => {
      store.dispatch(
        allActions.stageActions.server.addCustomGroupVolume(payload)
      );
    }
  );
  socket.on(
    ServerDeviceEvents.CustomGroupVolumeChanged,
    (payload: ServerDevicePayloads.CustomGroupVolumeChanged) => {
      store.dispatch(
        allActions.stageActions.server.changeCustomGroupVolume(payload)
      );
    }
  );
  socket.on(
    ServerDeviceEvents.CustomGroupVolumeRemoved,
    (payload: ServerDevicePayloads.CustomGroupVolumeRemoved) => {
      store.dispatch(
        allActions.stageActions.server.removeCustomGroupVolume(payload)
      );
    }
  );
  socket.on(
    ServerDeviceEvents.CustomGroupPositionAdded,
    (payload: ServerDevicePayloads.CustomGroupPositionAdded) => {
      store.dispatch(
        allActions.stageActions.server.addCustomGroupPosition(payload)
      );
    }
  );
  socket.on(
    ServerDeviceEvents.CustomGroupPositionChanged,
    (payload: ServerDevicePayloads.CustomGroupPositionChanged) => {
      store.dispatch(
        allActions.stageActions.server.changeCustomGroupPosition(payload)
      );
    }
  );
  socket.on(
    ServerDeviceEvents.CustomGroupPositionRemoved,
    (payload: ServerDevicePayloads.CustomGroupPositionRemoved) => {
      store.dispatch(
        allActions.stageActions.server.removeCustomGroupPosition(payload)
      );
    }
  );

  socket.on(
    ServerDeviceEvents.StageMemberAdded,
    (payload: ServerDevicePayloads.StageMemberAdded) => {
      store.dispatch(allActions.stageActions.server.addStageMember(payload));
    }
  );
  socket.on(
    ServerDeviceEvents.StageMemberChanged,
    (payload: ServerDevicePayloads.StageMemberChanged) => {
      store.dispatch(allActions.stageActions.server.changeStageMember(payload));
    }
  );
  socket.on(
    ServerDeviceEvents.StageMemberRemoved,
    (payload: ServerDevicePayloads.StageMemberRemoved) => {
      store.dispatch(allActions.stageActions.server.removeStageMember(payload));
    }
  );

  socket.on(
    ServerDeviceEvents.CustomStageMemberVolumeAdded,
    (payload: ServerDevicePayloads.CustomStageMemberVolumeAdded) => {
      store.dispatch(
        allActions.stageActions.server.addCustomStageMemberVolume(payload)
      );
    }
  );
  socket.on(
    ServerDeviceEvents.CustomStageMemberVolumeChanged,
    (payload: ServerDevicePayloads.CustomStageMemberVolumeChanged) => {
      store.dispatch(
        allActions.stageActions.server.changeCustomStageMemberVolume(payload)
      );
    }
  );
  socket.on(
    ServerDeviceEvents.CustomStageMemberVolumeRemoved,
    (payload: ServerDevicePayloads.CustomStageMemberVolumeRemoved) => {
      store.dispatch(
        allActions.stageActions.server.removeCustomStageMemberVolume(payload)
      );
    }
  );
  socket.on(
    ServerDeviceEvents.CustomStageMemberPositionAdded,
    (payload: ServerDevicePayloads.CustomStageMemberPositionAdded) => {
      store.dispatch(
        allActions.stageActions.server.addCustomStageMemberPosition(payload)
      );
    }
  );
  socket.on(
    ServerDeviceEvents.CustomStageMemberPositionChanged,
    (payload: ServerDevicePayloads.CustomStageMemberPositionChanged) => {
      store.dispatch(
        allActions.stageActions.server.changeCustomStageMemberPosition(payload)
      );
    }
  );
  socket.on(
    ServerDeviceEvents.CustomStageMemberPositionRemoved,
    (payload: ServerDevicePayloads.CustomStageMemberPositionRemoved) => {
      store.dispatch(
        allActions.stageActions.server.removeCustomStageMemberPosition(payload)
      );
    }
  );

  socket.on(
    ServerDeviceEvents.RemoteAudioTrackAdded,
    (payload: ServerDevicePayloads.RemoteAudioTrackAdded) => {
      store.dispatch(
        allActions.stageActions.server.addRemoteAudioTrack(payload)
      );
    }
  );
  socket.on(
    ServerDeviceEvents.RemoteAudioTrackChanged,
    (payload: ServerDevicePayloads.RemoteAudioTrackChanged) => {
      store.dispatch(
        allActions.stageActions.server.changeRemoteAudioTrack(payload)
      );
    }
  );
  socket.on(
    ServerDeviceEvents.RemoteAudioTrackRemoved,
    (payload: ServerDevicePayloads.RemoteAudioTrackRemoved) => {
      store.dispatch(
        allActions.stageActions.server.removeRemoteAudioTrack(payload)
      );
    }
  );

  socket.on(
    ServerDeviceEvents.RemoteVideoTrackAdded,
    (payload: ServerDevicePayloads.RemoteVideoTrackAdded) => {
      store.dispatch(
        allActions.stageActions.server.addRemoteVideoTrack(payload)
      );
    }
  );
  socket.on(
    ServerDeviceEvents.RemoteVideoTrackChanged,
    (payload: ServerDevicePayloads.RemoteVideoTrackChanged) => {
      store.dispatch(
        allActions.stageActions.server.changeRemoteVideoTrack(payload)
      );
    }
  );
  socket.on(
    ServerDeviceEvents.RemoteVideoTrackRemoved,
    (payload: ServerDevicePayloads.RemoteVideoTrackRemoved) => {
      store.dispatch(
        allActions.stageActions.server.removeRemoteVideoTrack(payload)
      );
    }
  );

  socket.on(
    ServerDeviceEvents.CustomRemoteAudioTrackVolumeAdded,
    (payload: ServerDevicePayloads.CustomRemoteAudioTrackVolumeAdded) => {
      store.dispatch(
        allActions.stageActions.server.addCustomRemoteAudioTrackVolume(payload)
      );
    }
  );
  socket.on(
    ServerDeviceEvents.CustomRemoteAudioTrackVolumeChanged,
    (payload: ServerDevicePayloads.CustomRemoteAudioTrackVolumeChanged) => {
      store.dispatch(
        allActions.stageActions.server.changeCustomRemoteAudioTrackVolume(
          payload
        )
      );
    }
  );
  socket.on(
    ServerDeviceEvents.CustomRemoteAudioTrackVolumeRemoved,
    (payload: ServerDevicePayloads.CustomRemoteAudioTrackVolumeRemoved) => {
      store.dispatch(
        allActions.stageActions.server.removeCustomRemoteAudioTrackVolume(
          payload
        )
      );
    }
  );
  socket.on(
    ServerDeviceEvents.CustomRemoteAudioTrackPositionAdded,
    (payload: ServerDevicePayloads.CustomRemoteAudioTrackPositionAdded) => {
      store.dispatch(
        allActions.stageActions.server.addCustomRemoteAudioTrackPosition(
          payload
        )
      );
    }
  );
  socket.on(
    ServerDeviceEvents.CustomRemoteAudioTrackPositionChanged,
    (payload: ServerDevicePayloads.CustomRemoteAudioTrackPositionChanged) => {
      store.dispatch(
        allActions.stageActions.server.changeCustomRemoteAudioTrackPosition(
          payload
        )
      );
    }
  );
  socket.on(
    ServerDeviceEvents.CustomRemoteAudioTrackPositionRemoved,
    (payload: ServerDevicePayloads.CustomRemoteAudioTrackPositionRemoved) => {
      store.dispatch(
        allActions.stageActions.server.removeCustomRemoteAudioTrackPosition(
          payload
        )
      );
    }
  );

  socket.on(
    ServerDeviceEvents.LocalAudioTrackAdded,
    (payload: ServerDevicePayloads.LocalAudioTrackAdded) => {
      store.dispatch(
        allActions.stageActions.server.addLocalAudioTrack(payload)
      );
    }
  );
  socket.on(
    ServerDeviceEvents.LocalAudioTrackChanged,
    (payload: ServerDevicePayloads.LocalAudioTrackChanged) => {
      store.dispatch(
        allActions.stageActions.server.changeLocalAudioTrack(payload)
      );
    }
  );
  socket.on(
    ServerDeviceEvents.LocalAudioTrackRemoved,
    (payload: ServerDevicePayloads.LocalAudioTrackRemoved) => {
      store.dispatch(
        allActions.stageActions.server.removeLocalAudioTrack(payload)
      );
    }
  );

  socket.on(
    ServerDeviceEvents.LocalVideoTrackAdded,
    (payload: ServerDevicePayloads.LocalVideoTrackAdded) => {
      store.dispatch(
        allActions.stageActions.server.addLocalVideoTrack(payload)
      );
    }
  );
  socket.on(
    ServerDeviceEvents.LocalVideoTrackChanged,
    (payload: ServerDevicePayloads.LocalVideoTrackChanged) => {
      store.dispatch(
        allActions.stageActions.server.changeLocalVideoTrack(payload)
      );
    }
  );
  socket.on(
    ServerDeviceEvents.LocalVideoTrackRemoved,
    (payload: ServerDevicePayloads.LocalVideoTrackRemoved) => {
      store.dispatch(
        allActions.stageActions.server.removeLocalVideoTrack(payload)
      );
    }
  );

  socket.on(
    ServerDeviceEvents.SoundCardAdded,
    (payload: ServerDevicePayloads.SoundCardAdded) =>
      store.dispatch({
        type: ServerDeviceEvents.SoundCardAdded,
        payload,
      })
  );
  socket.on(
    ServerDeviceEvents.SoundCardChanged,
    (payload: ServerDevicePayloads.SoundCardChanged) =>
      store.dispatch({
        type: ServerDeviceEvents.SoundCardChanged,
        payload,
      })
  );
  socket.on(
    ServerDeviceEvents.SoundCardRemoved,
    (payload: ServerDevicePayloads.SoundCardRemoved) =>
      store.dispatch({
        type: ServerDeviceEvents.SoundCardRemoved,
        payload,
      })
  );

  return socket;
};

export default registerSocketHandler;
