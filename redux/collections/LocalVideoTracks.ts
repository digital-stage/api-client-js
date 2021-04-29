import LocalVideoTrack from '../../types/model/LocalVideoTrack';

interface LocalVideoTracks {
  byId: {
    [id: string]: LocalVideoTrack;
  };
  allIds: string[];
}

export default LocalVideoTracks;
