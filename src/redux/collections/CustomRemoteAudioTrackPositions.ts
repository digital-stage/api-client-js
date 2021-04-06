import CustomRemoteAudioTrackPosition from '../../types/model/CustomRemoteAudioTrackPosition';

interface CustomRemoteAudioTrackPositions {
  byId: {
    [id: string]: CustomRemoteAudioTrackPosition;
  };
  byDevice: {
    [deviceId: string]: string[];
  };
  byRemoteAudioTrack: {
    [remoteAudioTrackId: string]: string[];
  };
  byDeviceAndRemoteAudioTrack: {
    [deviceId: string]: {
      [remoteAudioTrackId: string]: string;
    };
  };
  allIds: string[];
}

export default CustomRemoteAudioTrackPositions;
