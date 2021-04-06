import omit from 'lodash/omit';
import without from 'lodash/without';
import Mediasoup, {
  MediasoupAudioConsumer,
  MediasoupVideoConsumer,
} from '../collections/Mediasoup';
import AdditionalReducerTypes from '../actions/AdditionalReducerTypes';
import upsert from '../utils/upsert';

function reduceMediasoup(
  prev: Mediasoup = {
    videoConsumers: {
      byId: {},
      byRemoteVideoTrackId: {},
      allIds: [],
    },
    audioConsumers: {
      byId: {},
      byRemoteAudioTrackId: {},
      allIds: [],
    },
  },
  action: {
    type: string;
    payload: any;
  }
): Mediasoup {
  switch (action.type) {
    case AdditionalReducerTypes.ADD_MEDIASOUP_VIDEO_CONSUMER: {
      const videoConsumer = action.payload as MediasoupVideoConsumer;
      return {
        ...prev,
        videoConsumers: {
          byId: {
            ...prev.videoConsumers.byId,
            [videoConsumer.id]: videoConsumer,
          },
          byRemoteVideoTrackId: {
            ...prev.videoConsumers.byRemoteVideoTrackId,
            [videoConsumer.remoteVideoTrackId]: videoConsumer.id,
          },
          allIds: upsert<string>(prev.videoConsumers.allIds, videoConsumer.id),
        },
      };
    }
    case AdditionalReducerTypes.CHANGE_MEDIASOUP_VIDEO_CONSUMER: {
      const videoConsumer = action.payload as Partial<MediasoupVideoConsumer>;
      const { id } = videoConsumer;
      if (!id) return prev;
      return {
        ...prev,
        videoConsumers: {
          ...prev.videoConsumers,
          byId: {
            ...prev.videoConsumers.byId,
            [id]: {
              ...prev.videoConsumers.byId[id],
              ...videoConsumer,
            } as MediasoupVideoConsumer,
          },
        },
      };
    }
    case AdditionalReducerTypes.REMOVE_MEDIASOUP_VIDEO_CONSUMER: {
      const id = action.payload as string;
      const { remoteVideoTrackId } = prev.videoConsumers.byId[id];
      return {
        ...prev,
        videoConsumers: {
          byId: omit(prev.videoConsumers.byId, id),
          byRemoteVideoTrackId: omit(
            prev.videoConsumers.byRemoteVideoTrackId,
            remoteVideoTrackId
          ),
          allIds: without<string>(prev.videoConsumers.allIds, id),
        },
      };
    }
    case AdditionalReducerTypes.ADD_MEDIASOUP_AUDIO_CONSUMER: {
      const audioConsumer = action.payload as MediasoupAudioConsumer;
      return {
        ...prev,
        audioConsumers: {
          byId: {
            ...prev.audioConsumers.byId,
            [audioConsumer.id]: audioConsumer,
          },
          byRemoteAudioTrackId: {
            ...prev.audioConsumers.byRemoteAudioTrackId,
            [audioConsumer.remoteAudioTrackId]: audioConsumer.id,
          },
          allIds: upsert<string>(prev.audioConsumers.allIds, audioConsumer.id),
        },
      };
    }
    case AdditionalReducerTypes.CHANGE_MEDIASOUP_AUDIO_CONSUMER: {
      const audioConsumer = action.payload as Partial<MediasoupAudioConsumer>;
      const { id } = audioConsumer;
      if (!id) return prev;
      return {
        ...prev,
        audioConsumers: {
          ...prev.audioConsumers,
          byId: {
            ...prev.audioConsumers.byId,
            [id]: {
              ...prev.audioConsumers.byId[id],
              ...audioConsumer,
            } as MediasoupAudioConsumer,
          },
        },
      };
    }
    case AdditionalReducerTypes.REMOVE_MEDIASOUP_AUDIO_CONSUMER: {
      const id = action.payload as string;
      const { remoteAudioTrackId } = prev.audioConsumers.byId[id];
      return {
        ...prev,
        audioConsumers: {
          byId: omit(prev.audioConsumers.byId, id),
          byRemoteAudioTrackId: omit(
            prev.audioConsumers.byRemoteAudioTrackId,
            remoteAudioTrackId
          ),
          allIds: without<string>(prev.audioConsumers.allIds, id),
        },
      };
    }
    default: {
      return prev;
    }
  }
}

export default reduceMediasoup;
