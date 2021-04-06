/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import debug from 'debug';
import useStageSelector from '../useStageSelector';
import useMediasoupTransport from './useMediasoupTransport';
import RemoteVideoTrack from '../../types/model/RemoteVideoTrack';
import RemoteAudioTrack from '../../types/model/RemoteAudioTrack';

let working = false;

const report = debug('useMediasoup');

const reportError = report.extend('error');

function isRemoteAudioTrack(
  producer: RemoteVideoTrack | RemoteAudioTrack
): producer is RemoteAudioTrack {
  return (producer as RemoteAudioTrack).localAudioTrackId !== undefined;
}

const MediasoupProvider = (props: {
  children: React.ReactNode;
}): JSX.Element => {
  const { children } = props;
  // const dispatch = useDispatch();

  const localDevice = useStageSelector((state) =>
    state.globals.localDeviceId
      ? state.devices.byId[state.globals.localDeviceId]
      : undefined
  );
  const stage = useStageSelector((state) =>
    state.globals.stageId ? state.stages.byId[state.globals.stageId] : undefined
  );

  /**
   * SYNC ROUTER URL AND RESULTING TRANSPORT
   */
  const [routerUrl, setRouterUrl] = useState<string>();
  useEffect(() => {
    if (stage) {
      if (stage.videoType === 'mediasoup') {
        setRouterUrl(stage.videoRouter);
      } else if (stage.audioType === 'mediasoup') {
        setRouterUrl(stage.audioRouter);
      }
    } else {
      setRouterUrl(undefined);
    }
  }, [stage]);
  const {
    ready,
    consume,
    produce,
    stopProducing,
    stopConsuming,
  } = useMediasoupTransport({
    routerUrl,
  });

  /**
   * SYNC DEVICE
   */
  const [sendAudio, setSendAudio] = useState<boolean>(false);
  const [sendVideo, setSendVideo] = useState<boolean>(false);
  const [receiveVideo, setReceiveVideo] = useState<boolean>(false);
  const [receiveAudio, setReceiveAudio] = useState<boolean>(false);
  const [sendAudioOptions, setSendAudioOptions] = useState<{
    inputAudioDeviceId?: string;
    autoGainControl?: boolean;
    echoCancellation?: boolean;
    noiseSuppression?: boolean;
  }>(
    localDevice
      ? {
          inputAudioDeviceId: localDevice.inputAudioDeviceId || undefined,
          autoGainControl: localDevice.autoGainControl || false,
          echoCancellation: localDevice.echoCancellation || false,
          noiseSuppression: localDevice.noiseSuppression || false,
        }
      : {
          autoGainControl: false,
          echoCancellation: false,
          noiseSuppression: false,
        }
  );
  const [inputVideoDeviceId, setInputVideoDeviceId] = useState<
    string | undefined
  >(localDevice ? localDevice.inputVideoDeviceId : undefined);
  useEffect(() => {
    if (localDevice) {
      setReceiveAudio((prev) => {
        if (prev !== localDevice.receiveAudio) {
          report('RECEIVE AUDIO CHANGED');
          return localDevice.receiveAudio;
        }
        return prev;
      });
      setReceiveVideo((prev) => {
        if (prev !== localDevice.receiveVideo) {
          report('RECEIVE VIDEO CHANGED');
          return localDevice.receiveVideo;
        }
        return prev;
      });
      setSendAudio((prev) => {
        if (prev !== localDevice.sendAudio) {
          report('SEND AUDIO CHANGED');
          return localDevice.sendAudio;
        }
        return prev;
      });
      setSendVideo((prev) => {
        if (prev !== localDevice.sendVideo) {
          report('SEND VIDEO CHANGED');
          return localDevice.sendVideo;
        }
        return prev;
      });
      setInputVideoDeviceId((prev) => {
        if (prev !== localDevice.inputVideoDeviceId) {
          report('SEND VIDEO DEVICE ID CHANGED');
          return localDevice.inputVideoDeviceId;
        }
        return prev;
      });
      setSendAudioOptions((prev) => {
        report('SEND AUDIO DEVICE CHANGED');
        if (
          (localDevice.inputAudioDeviceId !== undefined &&
            localDevice.inputAudioDeviceId !== prev.inputAudioDeviceId) ||
          (localDevice.echoCancellation !== undefined &&
            localDevice.echoCancellation !== prev.echoCancellation) ||
          (localDevice.autoGainControl !== undefined &&
            localDevice.autoGainControl !== prev.autoGainControl) ||
          (localDevice.noiseSuppression !== undefined &&
            localDevice.noiseSuppression !== prev.noiseSuppression)
        ) {
          return {
            inputAudioDeviceId: localDevice.inputAudioDeviceId || undefined,
            autoGainControl: localDevice.autoGainControl || false,
            echoCancellation: localDevice.echoCancellation || false,
            noiseSuppression: localDevice.noiseSuppression || false,
          };
        }
        return prev;
      });
    }
  }, [localDevice]);

  /**
   * List of local media tracks, that are produced - only setter allowed to avoid deadlocks
   */
  const [, setVideoProducerList] = useState<{
    [mediaTrackId: string]: boolean;
  }>({});

  const [, setVideoStream] = useState<MediaStream>();
  useEffect(() => {
    // if(ready) {
    if (!working) {
      working = true;
      if (sendVideo && inputVideoDeviceId) {
        navigator.mediaDevices
          .getUserMedia({
            video: {
              deviceId: inputVideoDeviceId,
            },
            audio: false,
          })
          .then((videoStream) =>
            setVideoStream((prev) => {
              // End existing
              if (prev) {
                report(
                  `Stop publishing ${
                    prev.getTracks().length
                  } in grace of adding new`
                );
                prev.getTracks().map((track) => track.stop());
              }
              return videoStream;
            })
          )
          .finally(() => {
            working = true;
          })
          .catch((error) => reportError(error));
      } else {
        setVideoStream((prev) => {
          if (prev) {
            report(`Stop publishing ${prev.getTracks().length}`);
            prev.getTracks().map((track) => track.stop());
          } else {
            report('No tracks given');
          }
          return undefined;
        });
        working = true;
      }
    }
    return undefined;
    // }
  }, [inputVideoDeviceId, sendVideo]);

  return <>{children}</>;
};

const useMediasoup = undefined;

export { MediasoupProvider };
export default useMediasoup;
