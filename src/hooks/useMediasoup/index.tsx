import React, { createContext, useContext, useEffect, useState } from 'react';
import debug from 'debug';
import { Producer } from 'mediasoup-client/lib/Producer';
import { Consumer } from 'mediasoup-client/lib/Consumer';
import { shallowEqual } from 'react-redux';
import omit from 'lodash/omit';
import useStageSelector from '../useStageSelector';
import useMediasoupTransport from './useMediasoupTransport';
import { MediasoupDevice } from '../../types/model/mediasoup';
import useConnection from '../useConnection';
import { ClientDeviceEvents, LocalVideoTrack } from '../../types';
import MediasoupRemoteVideoTrack from '../../types/model/mediasoup/MediasoupRemoteVideoTrack';

const report = debug('useMediasoup');

const reportError = report.extend('error');

export interface IMediasoupContext {
  videoConsumers: {
    [videoTrackId: string]: Consumer;
  };
}

const MediasoupContext = createContext<IMediasoupContext>({
  videoConsumers: {},
});

const MediasoupProvider = (props: {
  children: React.ReactNode;
}): JSX.Element => {
  const { children } = props;
  const apiConnection = useConnection();

  const localDevice = useStageSelector((state) =>
    state.globals.localDeviceId
      ? (state.devices.byId[state.globals.localDeviceId] as MediasoupDevice)
      : undefined
  );
  const stage = useStageSelector((state) =>
    state.globals.stageId ? state.stages.byId[state.globals.stageId] : undefined
  );

  /**
   * SYNC ROUTER URL AND RESULTING TRANSPORT
   */
  const [routerUrl, setRouterUrl] = useState<string>();

  const {
    ready,
    consume,
    produce,
    stopProducing,
    stopConsuming,
  } = useMediasoupTransport({
    routerUrl,
  });

  /** *
   * PRODUCING VIDEOS
   */
  const [, setVideoProducers] = useState<{
    [localVideoTrackId: string]: Producer;
  }>({});

  /*
  const [videoStream, setVideoStream] = useState<MediaStream>();
  useEffect(() => {
    if (localDevice?.sendVideo && localDevice.inputVideoDeviceId) {
      navigator.mediaDevices
        .getUserMedia({
          video: {
            deviceId: localDevice.inputVideoDeviceId,
          },
          audio: false,
        })
        .then((stream) => setVideoStream(stream))
        .catch((err) => reportError(err));

      return () => {
        setVideoStream(undefined);
      };
    }
    return undefined;
  }, [localDevice?.sendVideo, localDevice?.inputVideoDeviceId]); */
  useEffect(() => {
    if (
      apiConnection &&
      ready &&
      stage &&
      localDevice?.sendVideo &&
      localDevice?.inputVideoDeviceId
    ) {
      navigator.mediaDevices
        .getUserMedia({
          video: {
            deviceId: localDevice.inputVideoDeviceId,
          },
          audio: false,
        })
        .then((stream) => stream.getVideoTracks())
        .then((tracks) =>
          tracks.map((track) =>
            produce(track).then((producer) => {
              return new Promise<LocalVideoTrack>((resolve, reject) => {
                apiConnection.emit(
                  ClientDeviceEvents.CreateLocalVideoTrack,
                  {
                    type: 'mediasoup',
                    producerId: producer.id,
                  },
                  (error: string | null, localVideoTrack?: LocalVideoTrack) => {
                    if (error) {
                      return reject(error);
                    }
                    if (!localVideoTrack) {
                      return reject(
                        new Error('No local video track provided by server')
                      );
                    }
                    return resolve(localVideoTrack);
                  }
                );
              }).then((localVideoTrack) => {
                console.log(`Added local video track ${localVideoTrack._id}`);
                return setVideoProducers((prev) => ({
                  ...prev,
                  [localVideoTrack._id]: producer,
                }));
              });
            })
          )
        )
        .catch((err) => reportError(err));
      return () => {
        setVideoProducers((prev) => {
          Object.keys(prev)
            .map((id) => {
              console.log(`Removing local video track ${id}`);
              apiConnection.emit(ClientDeviceEvents.RemoveLocalVideoTrack, id);
              return prev[id];
            })
            .map((producer) =>
              stopProducing(producer).catch((error) => reportError(error))
            );
          return {};
        });
      };
    }
    return undefined;
  }, [
    apiConnection,
    ready,
    stage,
    produce,
    stopProducing,
    localDevice?.sendVideo,
    localDevice?.inputVideoDeviceId,
  ]);

  /** *
   * CONSUMING VIDEOS
   */
  const remoteVideoTracks = useStageSelector(
    (state) =>
      state.remoteVideoTracks.allIds.map(
        (id) => state.remoteVideoTracks.byId[id]
      ),
    shallowEqual
  );
  const [videoConsumers, setVideoConsumers] = useState<{
    [remoteVideoTrackId: string]: Consumer;
  }>({});
  useEffect(() => {
    if (ready && stage && localDevice?.receiveVideo) {
      return () => {
        // Stop consuming
        report('Stop consuming all remote video tracks');
        setVideoConsumers((prev) => {
          Object.keys(prev).map((id) =>
            stopConsuming(prev[id]).catch((err) => reportError(err))
          );
          return {};
        });
      };
    }
    return undefined;
  }, [ready, stage, stopConsuming, localDevice?.receiveVideo]);
  useEffect(() => {
    if (ready && stage && localDevice?.receiveVideo) {
      const mediasoupTracks = remoteVideoTracks
        .filter((track) => track.type === 'mediasoup')
        .map((track) => track as MediasoupRemoteVideoTrack);
      setVideoConsumers((prev) => {
        const removedTrackIds = Object.keys(prev).filter(
          (id) => !mediasoupTracks.find((track) => track._id === id)
        );
        // Consume new tracks (async, will be added when available)
        mediasoupTracks
          .filter((track) => !prev[track._id])
          .map((track) => {
            report(`Consuming new remote video track ${track._id}`);
            return consume(track.producerId)
              .then((consumer) =>
                setVideoConsumers((prev2) => ({
                  ...prev2,
                  [track._id]: consumer,
                }))
              )
              .catch((err) => reportError(err));
          });
        // Stop removed tracks async
        removedTrackIds.map((id) => {
          report(`Stop consuming unavailable video remote track ${id}`);
          return stopConsuming(prev[id]).catch((err) => reportError(err));
        });
        // Omit removed tracks already
        return omit(prev, removedTrackIds);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    ready,
    stage,
    localDevice?.receiveVideo,
    consume,
    stopConsuming,
    remoteVideoTracks.length,
  ]);

  useEffect(() => {
    if (
      stage &&
      (stage.videoType === 'mediasoup' ||
        (stage.audioType === 'mediasoup' && stage.mediasoup))
    ) {
      setRouterUrl(`${stage.mediasoup.url}:${stage.mediasoup.port}`);
      return () => {
        setRouterUrl(undefined);
      };
    }
    return undefined;
  }, [stage]);

  return (
    <MediasoupContext.Provider value={{ videoConsumers }}>
      {children}
    </MediasoupContext.Provider>
  );
};

const useMediasoup = (): IMediasoupContext =>
  useContext<IMediasoupContext>(MediasoupContext);

export { MediasoupProvider };
export default useMediasoup;
