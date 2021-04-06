import ITeckosClient from 'teckos-client/dist/ITeckosClient';
import TeckosClient from 'teckos-client/dist/TeckosClient';
import mediasoupClient from 'mediasoup-client';
import { Device as MediasoupDevice } from 'mediasoup-client/lib/Device';
import { Transport } from 'mediasoup-client/lib/Transport';
import ClientDeviceEvents from '../../types/ClientDeviceEvents';
import MediasoupLocalVideoTrack from '../../types/model/mediasoup/MediasoupLocalVideoTrack';
import { createWebRTCTransport, RouterRequests } from './util';

const d = debug('Mediasoup');
const trace = d.extend('trace');
const err = d.extend('error');

class Mediasoup {
  private _apiConnection: ITeckosClient;

  private _routerConnection?: ITeckosClient = undefined;

  private _inputVideoDeviceId?: string = undefined;

  private _videoStream?: MediaStream = undefined;

  private _sendTransport?: Transport = undefined;

  private _receiveTransport?: Transport = undefined;

  public constructor(apiConnection: ITeckosClient) {
    this._apiConnection = apiConnection;
  }

  private createMediasoupDevice = (): Promise<MediasoupDevice> => {
    return new Promise<MediasoupDevice>((resolve, reject) => {
      if (this._routerConnection) {
        this._routerConnection.emit(
          RouterRequests.GetRTPCapabilities,
          {},
          (
            error: string,
            retrievedRtpCapabilities: mediasoupClient.types.RtpCapabilities
          ) => {
            if (error) {
              return reject(error);
            }
            const createdDevice = new MediasoupDevice();
            return createdDevice
              .load({ routerRtpCapabilities: retrievedRtpCapabilities })
              .then(() => {
                trace('Created mediasoup device');
                return createdDevice;
              });
          }
        );
      }
      throw new Error('Not ready');
    });
  };

  public connect = (routerUrl: string) => {
    this.disconnect();
    this._routerConnection = new TeckosClient(routerUrl);
    this._routerConnection.connect();
    return this.createMediasoupDevice()
      .then((device) => {
        if (!this._routerConnection)
          throw new Error('Connection lost while esablishing transports');
        return Promise.all([
          createWebRTCTransport(this._routerConnection, device, 'send').then(
            (transport) => {
              this._sendTransport = transport;
              return transport;
            }
          ),
          createWebRTCTransport(this._routerConnection, device, 'receive').then(
            (transport) => {
              this._receiveTransport = transport;
              return transport;
            }
          ),
        ]);
      })
      .then(() => d('CONNECTED!'));
  };

  set inputVideoDeviceId(value: string | undefined) {
    this._inputVideoDeviceId = value;
  }

  get inputVideoDeviceId(): string | undefined {
    return this._inputVideoDeviceId;
  }

  public syncVideoProduction = () => {
    if (this._inputVideoDeviceId) {
      return navigator.mediaDevices
        .getUserMedia({
          video: {
            deviceId: this._inputVideoDeviceId,
          },
        })
        .then((stream) => {
          this._videoStream = stream;
          // Create stream to
          this._routerConnection.emit();
          this._api.emit(ClientDeviceEvents.CreateLocalVideoTrack, {
            type: 'mediasoup',
            producer,
          } as MediasoupLocalVideoTrack);
        })
        .catch((error) => console.error(error));
    }
    // Stop all video producers

    return undefined;
  };

  public disconnect = () => {
    if (this._routerConnection) this._routerConnection.disconnect();
  };
}
export default Mediasoup;
