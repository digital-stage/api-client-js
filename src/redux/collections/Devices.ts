import Device from '../../types/model/Device';

interface Devices {
  byId: {
    [id: string]: Device;
  };
  allIds: string[];
}

export default Devices;
