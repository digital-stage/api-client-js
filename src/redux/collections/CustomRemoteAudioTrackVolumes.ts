import CustomRemoteAudioTrackVolume from '../../types/model/CustomRemoteAudioTrackVolume';

interface CustomRemoteAudioTrackVolumes {
  byId: {
    [id: string]: CustomRemoteAudioTrackVolume;
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

export default CustomRemoteAudioTrackVolumes;
