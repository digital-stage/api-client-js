import { useCallback, useEffect, useState } from 'react';
import { ITeckosClient, TeckosClient } from 'teckos-client';
import mediasoupClient from 'mediasoup-client';
import { Device as MediasoupDevice } from 'mediasoup-client/lib/Device';
import debug from 'debug';
import {
  closeConsumer,
  createConsumer,
  createProducer,
  createWebRTCTransport,
  resumeConsumer,
  RouterRequests,
  stopProducer,
} from './util';

const d = debug('useMediasoupTransport');
const trace = d.extend('trace');
const err = d.extend('err');
const warn = d.extend('warn');

const useMediasoupTransport = (props: {
  routerUrl?: string;
}): {
  ready: boolean;

  consume: (producerId: string) => Promise<mediasoupClient.types.Consumer>;
  stopConsuming: (
    consumer: mediasoupClient.types.Consumer
  ) => Promise<mediasoupClient.types.Consumer>;

  produce: (track: MediaStreamTrack) => Promise<mediasoupClient.types.Producer>;
  stopProducing: (
    producer: mediasoupClient.types.Producer
  ) => Promise<mediasoupClient.types.Producer>;
} => {
  const { routerUrl } = props;
  // Connection to router
  const [ready, setReady] = useState<boolean>(false);
  const [routerConnection, setRouterConnection] = useState<ITeckosClient>();
  const [
    rtpCapabilities,
    setRtpCapabilities,
  ] = useState<mediasoupClient.types.RtpCapabilities>();
  const [
    mediasoupDevice,
    setMediasoupDevice,
  ] = useState<mediasoupClient.Device>();
  const [
    sendTransport,
    setSendTransport,
  ] = useState<mediasoupClient.types.Transport>();
  const [
    receiveTransport,
    setReceiveTransport,
  ] = useState<mediasoupClient.types.Transport>();

  /**
   * HANDLE ROUTER CONNECTION
   */
  useEffect(() => {
    if (routerUrl) {
      trace(`Connecting to ${routerUrl}`);
      const conn = new TeckosClient(routerUrl);
      conn.on('connect_error', (error) => {
        err(error);
      });
      conn.on('connect_timeout', (error) => {
        err(error);
      });
      conn.on('connect', () => {
        trace(`Connected to router ${routerUrl} via socket communication`);
        setRouterConnection(conn);
      });

      conn.connect();

      return () => {
        trace('Cleaning up router connection');
        conn.close();
        setRouterConnection(undefined);
      };
    }
    return undefined;
  }, [routerUrl]);

  useEffect(() => {
    trace('Fetching RTP capabilities');
    if (routerConnection) {
      routerConnection.emit(
        RouterRequests.GetRTPCapabilities,
        {},
        (
          error: string,
          retrievedRtpCapabilities: mediasoupClient.types.RtpCapabilities
        ) => {
          if (error) {
            return err(new Error(error));
          }
          trace('Retrieved RTP capabilities');
          return setRtpCapabilities(retrievedRtpCapabilities);
        }
      );
      return () => {
        trace('Cleaning up RTP capabilities');
        setRtpCapabilities(undefined);
      };
    }
    return undefined;
  }, [routerConnection]);

  useEffect(() => {
    trace('Creating mediasoup device');
    if (rtpCapabilities) {
      // Create mediasoup device
      const createdDevice = new MediasoupDevice();
      createdDevice
        .load({ routerRtpCapabilities: rtpCapabilities })
        .then(() => {
          trace('Created mediasoup device');
          return setMediasoupDevice(createdDevice);
        })
        .catch((error) => err(error));
      return () => {
        trace('Cleaning up mediasoup device');
        setMediasoupDevice(undefined);
      };
    }
    return undefined;
  }, [rtpCapabilities]);

  useEffect(() => {
    trace('Creating send transport');
    if (routerConnection && mediasoupDevice) {
      let createdTransport: mediasoupClient.types.Transport;
      // Create send transport
      createWebRTCTransport(routerConnection, mediasoupDevice, 'send')
        .then((transport) => {
          createdTransport = transport;
          trace('Created send transport');
          return setSendTransport(createdTransport);
        })
        .catch((error) => err(error));

      return () => {
        trace('Cleaning up send transport');
        if (createdTransport) {
          createdTransport.close();
        }
      };
    }
    return undefined;
  }, [routerConnection, mediasoupDevice]);

  useEffect(() => {
    trace('Creating receive transport');
    if (routerConnection && mediasoupDevice) {
      let createdTransport: mediasoupClient.types.Transport;
      // Create receive transport
      createWebRTCTransport(routerConnection, mediasoupDevice, 'receive')
        .then((transport) => {
          createdTransport = transport;
          return setReceiveTransport(createdTransport);
        })
        .catch((error) => err(error));

      return () => {
        trace('Cleaning up receive transport');
        if (createdTransport) createdTransport.close();
      };
    }
    return undefined;
  }, [routerConnection, mediasoupDevice]);

  const consume = useCallback(
    (producerId: string): Promise<mediasoupClient.types.Consumer> => {
      trace(`Consuming ${producerId}`);
      if (routerConnection && mediasoupDevice && receiveTransport) {
        return createConsumer(
          routerConnection,
          mediasoupDevice,
          receiveTransport,
          producerId
        ).then(async (localConsumer) => {
          trace(
            `Created consumer ${localConsumer.id} to consume ${producerId}`
          );
          if (localConsumer.paused) {
            d(`Consumer ${localConsumer.id} is paused, try to resume it`);
            await resumeConsumer(routerConnection, localConsumer);
          }
          if (localConsumer.paused) {
            warn(`Consumer ${localConsumer.id} is still paused after resume`);
          }
          return localConsumer;
        });
      }
      throw new Error('Not connected');
    },
    [routerConnection, mediasoupDevice, receiveTransport]
  );

  const stopConsuming = useCallback(
    async (
      consumer: mediasoupClient.types.Consumer
    ): Promise<mediasoupClient.types.Consumer> => {
      if (!consumer) throw new Error('Consumer is undefined');
      if (routerConnection) {
        d(`Stopped consumer ${consumer.id}`);
        return closeConsumer(routerConnection, consumer).then(
          (): mediasoupClient.types.Consumer => consumer
        );
      }
      warn(`Stopped consumer ${consumer.id} when not connected to router`);

      return consumer;
    },
    [routerConnection]
  );

  const produce = useCallback(
    (track: MediaStreamTrack): Promise<mediasoupClient.types.Producer> => {
      trace(`Creating producer for track ${track.id}`);
      if (!track)
        throw new Error('Could not create producer: Track is undefined');
      if (sendTransport) {
        return createProducer(sendTransport, track).then((producer) => {
          if (producer.paused) {
            d(`Producer ${producer.id} is paused`);
          }
          return producer;
        });
      }
      throw new Error(`Could not create producer: send transport is not ready`);
    },
    [sendTransport]
  );

  const stopProducing = useCallback(
    async (
      producer: mediasoupClient.types.Producer
    ): Promise<mediasoupClient.types.Producer> => {
      if (!producer) throw new Error('Local producer is undefined');

      if (routerConnection && sendTransport) {
        d(`Stopping producer ${producer.id}`);
        await stopProducer(routerConnection, producer);
      } else {
        warn('Stopped producer when not connected to router');
      }
      return producer;
    },
    [routerConnection, sendTransport]
  );

  useEffect(() => {
    if (routerConnection && receiveTransport && sendTransport) {
      setReady(true);
      return () => {
        setReady(false);
      };
    }
    return undefined;
  }, [routerConnection, receiveTransport, sendTransport]);

  return {
    ready,
    consume,
    stopConsuming,
    produce,
    stopProducing,
  };
};
export default useMediasoupTransport;
