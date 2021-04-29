import LocalAudioTrack from '../../types/model/LocalAudioTrack';

interface LocalAudioTracks {
  byId: {
    [id: string]: LocalAudioTrack;
  };
  allIds: string[];
}

export default LocalAudioTracks;
