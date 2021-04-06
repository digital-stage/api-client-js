import CustomGroupPosition from '../../types/model/CustomGroupPosition';

interface CustomGroupPositions {
  byId: {
    [id: string]: CustomGroupPosition;
  };
  byDevice: {
    [deviceId: string]: string[];
  };
  byGroup: {
    [groupId: string]: string[];
  };
  byDeviceAndGroup: {
    [deviceId: string]: {
      [groupId: string]: string;
    };
  };
  allIds: string[];
}

export default CustomGroupPositions;
