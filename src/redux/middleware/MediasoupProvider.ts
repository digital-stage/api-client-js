import ITeckosClient from 'teckos-client/dist/ITeckosClient';
import { TeckosClient } from 'teckos-client';
import debug from 'debug';

const d = debug('MediasoupProvider');
const trace = d.extend('trace');
const err = d.extend('error');

class MediasoupProvider {
  private conn?: ITeckosClient = undefined;

  public connect = (routerUrl: string) => {
    this.conn = new TeckosClient(routerUrl);
    this.conn.on('connect_error', (error) => {
      err(error);
    });
    this.conn.on('connect_timeout', (error) => {
      err(error);
    });
    this.conn.on('connect', () => {
      trace(`Connected to router ${routerUrl} via socket communication`);
    });
    this.conn.connect();
  };

  public disconnect = () => {
    this.conn?.disconnect();
  };
}

export default MediasoupProvider;
