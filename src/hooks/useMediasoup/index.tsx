import React, {createContext, useCallback, useEffect, useState} from 'react';
import mediasoupClient from 'mediasoup-client';
import omit from 'lodash/omit';
import debug from 'debug';
import {
  ClientDeviceEvents,
  ClientDevicePayloads,
  Device,
  LocalVideoTrack,
  RemoteVideoTrack,
  Stage,
} from '../../types';
import useMediasoupTransport from './useMediasoupTransport';
import {MediasoupDevice} from '../../types/model/mediasoup';
import MediasoupRemoteVideoTrack from '../../types/model/mediasoup/MediasoupRemoteVideoTrack';
import useStageSelector from '../useStageSelector';
import useConnection from '../useConnection';

const d = debug('useMediasoup');
const err = d.extend('err');

interface MediasoupTrack {
}

interface IMediasoupContext {
  videos: {
    [remoteVideoTrackId: string]: MediasoupTrack;
  };
  audios: {
    [remoteAudioTrackId: string]: MediasoupTrack;
  };
}

const MediasoupContext = createContext<IMediasoupContext>({
  videos: {},
  audios: {}
});

export const MediasoupProvider = (props: { children: React.ReactNode }) => {
  const {children} = props;

  // Stage data and its cache
  const stage = useStageSelector<Stage | undefined>((state) =>
    state.globals.stageId ? state.stages.byId[state.globals.stageId] : undefined
  );
  const localDevice = useStageSelector<Device | undefined>((state) =>
    state.globals.localDeviceId
      ? state.devices.byId[state.globals.localDeviceId]
      : undefined
  );
  const [, setSendAudio] = useState<boolean>(false);
  const [sendVideo, setSendVideo] = useState<boolean>(false);
  const [receiveVideo, setReceiveVideo] = useState<boolean>(false);
  const [, setReceiveAudio] = useState<boolean>(false);
  const [routerUrl, setRouterUrl] = useState<string>();

  // Local Consumers, assigned to the remote tracks
  const [videoConsumers, setVideoConsumers] = useState<{
    [remoteAudioTrackId: string]: mediasoupClient.types.Consumer;
  }>({});
  // Local Producers
  const [localVideoProducers, setLocalVideoProducers] = useState<{
    [localVideoTrackId: string]: mediasoupClient.types.Producer;
  }>({});

  useEffect(() => {
    if (stage && localDevice) {
      if (stage.videoType === 'mediasoup') {
        setRouterUrl(stage.videoRouter);
        if (localDevice.receiveVideo) {
          setReceiveVideo(true);
        } else {
          setReceiveVideo(false);
        }
        if (localDevice.sendVideo) {
          setSendVideo(true);
        } else {
          setSendVideo(false);
        }
      }
      if (stage.audioType === 'mediasoup') {
        if (localDevice.receiveAudio) {
          setReceiveAudio(true);
        } else {
          setReceiveAudio(false);
        }
        if (localDevice.sendAudio) {
          setSendAudio(true);
        } else {
          setSendAudio(false);
        }
        if (stage.videoType !== 'mediasoup') {
          setRouterUrl(stage.audioRouter);
        }
      }
    } else {
      setReceiveVideo(false);
      setReceiveAudio(false);
      setSendAudio(false);
      setSendVideo(false);
    }
  }, [stage, localDevice]);

  const {
    ready,
    consume,
    stopConsuming,
    produce,
    stopProducing,
  } = useMediasoupTransport({routerUrl});

  const remoteVideoTracks = useStageSelector<RemoteVideoTrack[]>((state) =>
    state.remoteVideoTracks.allIds.map((id) => state.remoteVideoTracks.byId[id])
  );
  const consumeVideoTrack = useCallback((track: RemoteVideoTrack) => {
    return consume(
      (track as MediasoupRemoteVideoTrack).producerId
    )
      .then(consumer => setVideoConsumers(prev => ({...prev, [track._id]: consumer})))
  }, [consume]);
  const stopConsumingVideoTrack = useCallback((trackId: string) => {
    const videoConsumer = videoConsumers[trackId];
    if (videoConsumer) {
      return stopConsuming(videoConsumer)
        .then(() => setVideoConsumers(prev => omit(prev, trackId)));
    }
    throw new Error("Could not found video consumer " + trackId);
  }, [stopConsuming, videoConsumers]);
  const syncRemoteVideoTracks = useCallback(() => {
    // Consume new remote video tracks
    remoteVideoTracks
      .filter(track => track.type === "mediasoup" && !videoConsumers[track._id])
      .map(track => consumeVideoTrack(track));
    // Clean up removed remote video tracks
    Object.keys(videoConsumers)
      .filter(id => !remoteVideoTracks.find(track => track._id === id))
      .map(id => stopConsumingVideoTrack(id));
  }, [remoteVideoTracks, videoConsumers]);
  useEffect(() => {
    if (ready && consume && remoteVideoTracks && receiveVideo) {
      syncRemoteVideoTracks();
    }
  }, [ready, consume, receiveVideo, remoteVideoTracks]);

  const connection = useConnection();
  useEffect(() => {
    if (ready && localDevice && connection && produce) {
      if (sendVideo) {
        console.log("CONSUME VIDEOS");
        navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: (localDevice as MediasoupDevice).inputVideoDeviceId,
          },
          audio: false
        })
          .then(tracks => tracks.getVideoTracks())
          .then(tracks => tracks.map(track => produce(track).then((producer) => {
            return connection.emit(
              ClientDeviceEvents.CreateLocalVideoTrack,
              {
                type: 'mediasoup',
                producerId: producer.id,
              } as ClientDevicePayloads.CreateLocalVideoTrack,
              (error: string | null, localVideoTrack: LocalVideoTrack) => {
                if (error) {
                  return err(error);
                }
                return setLocalVideoProducers((prev) => ({
                  ...prev,
                  [localVideoTrack._id]: producer,
                }));
              }
            );
          })))
      }
    }
  }, [ready, connection, produce, sendVideo, localDevice]);
  useEffect(() => {
    if (ready && connection && stopProducing) {
      if (!sendVideo) {
        Object.keys(localVideoProducers).map((id) => {
          const producer = localVideoProducers[id];
          return stopProducing(producer).then(() =>
            connection.emit(ClientDeviceEvents.RemoveLocalVideoTrack, id)
          );
        });
      }
    }
  }, [ready, connection, stopProducing, localVideoProducers, sendVideo]);

  return (
    <MediasoupContext.Provider
      value={{
        audios: {},
        videos: videoConsumers
      }}
    >
      {children}
    </MediasoupContext.Provider>
  );
};

const useMediasoup = (): IMediasoupContext =>
  React.useContext<IMediasoupContext>(MediasoupContext);

export default useMediasoup;
