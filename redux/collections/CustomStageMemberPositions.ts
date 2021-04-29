import CustomStageMemberPosition from '../../types/model/CustomStageMemberPosition';

interface CustomStageMemberPositions {
  byId: {
    [id: string]: CustomStageMemberPosition;
  };
  byDevice: {
    [deviceId: string]: string[];
  };
  byStageMember: {
    [stageMemberId: string]: string[];
  };
  byDeviceAndStageMember: {
    [deviceId: string]: {
      [stageMemberId: string]: string;
    };
  };
  allIds: string[];
}

export default CustomStageMemberPositions;
