import CustomStageMemberVolume from "../../types/model/CustomStageMemberVolume";

interface CustomStageMemberVolumes {
  byId: {
    [id: string]: CustomStageMemberVolume;
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

export default CustomStageMemberVolumes;
