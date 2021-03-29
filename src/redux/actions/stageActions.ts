import ServerDeviceEvents from "../../types/ServerDeviceEvents";
import ServerDevicePayloads from "../../types/ServerDevicePayloads";

const messageSent = (message: ServerDevicePayloads.ChatMessageSend) => {
  return {
    type: ServerDeviceEvents.ChatMessageSend,
    payload: message,
  };
};

const addRemoteUser = (user: ServerDevicePayloads.RemoteUserAdded) => {
  return {
    type: ServerDeviceEvents.RemoteUserAdded,
    payload: user,
  };
};
const changeRemoteUser = (user: ServerDevicePayloads.RemoteUserChanged) => {
  return {
    type: ServerDeviceEvents.RemoteUserChanged,
    payload: user,
  };
};
const removeRemoteUser = (userId: ServerDevicePayloads.RemoteUserRemoved) => {
  return {
    type: ServerDeviceEvents.RemoteUserRemoved,
    payload: userId,
  };
};
const addStage = (stage: ServerDevicePayloads.StageAdded) => {
  return {
    type: ServerDeviceEvents.StageAdded,
    payload: stage,
  };
};
const changeStage = (stage: ServerDevicePayloads.StageChanged) => {
  return {
    type: ServerDeviceEvents.StageChanged,
    payload: stage,
  };
};
const removeStage = (stageId: ServerDevicePayloads.StageRemoved) => {
  return {
    type: ServerDeviceEvents.StageRemoved,
    payload: stageId,
  };
};

const addGroup = (group: ServerDevicePayloads.GroupAdded) => {
  return {
    type: ServerDeviceEvents.GroupAdded,
    payload: group,
  };
};
const changeGroup = (group: ServerDevicePayloads.GroupChanged) => {
  return {
    type: ServerDeviceEvents.GroupChanged,
    payload: group,
  };
};
const removeGroup = (groupId: ServerDevicePayloads.GroupRemoved) => {
  return {
    type: ServerDeviceEvents.GroupRemoved,
    payload: groupId,
  };
};

const addCustomGroupVolume = (
  group: ServerDevicePayloads.CustomGroupVolumeAdded
) => {
  return {
    type: ServerDeviceEvents.CustomGroupVolumeAdded,
    payload: group,
  };
};
const changeCustomGroupVolume = (
  group: ServerDevicePayloads.CustomGroupVolumeChanged
) => {
  return {
    type: ServerDeviceEvents.CustomGroupVolumeChanged,
    payload: group,
  };
};
const removeCustomGroupVolume = (
  groupId: ServerDevicePayloads.CustomGroupVolumeRemoved
) => {
  return {
    type: ServerDeviceEvents.CustomGroupVolumeRemoved,
    payload: groupId,
  };
};
const addCustomGroupPosition = (
  group: ServerDevicePayloads.CustomGroupPositionAdded
) => {
  return {
    type: ServerDeviceEvents.CustomGroupPositionAdded,
    payload: group,
  };
};
const changeCustomGroupPosition = (
  group: ServerDevicePayloads.CustomGroupPositionChanged
) => {
  return {
    type: ServerDeviceEvents.CustomGroupPositionChanged,
    payload: group,
  };
};
const removeCustomGroupPosition = (
  groupId: ServerDevicePayloads.CustomGroupPositionRemoved
) => {
  return {
    type: ServerDeviceEvents.CustomGroupPositionRemoved,
    payload: groupId,
  };
};

const addStageMember = (stageMember: ServerDevicePayloads.StageMemberAdded) => {
  return {
    type: ServerDeviceEvents.StageMemberAdded,
    payload: stageMember,
  };
};
const changeStageMember = (
  stageMember: ServerDevicePayloads.StageMemberChanged
) => {
  return {
    type: ServerDeviceEvents.StageMemberChanged,
    payload: stageMember,
  };
};
const removeStageMember = (
  stageMemberId: ServerDevicePayloads.StageMemberRemoved
) => {
  return {
    type: ServerDeviceEvents.StageMemberRemoved,
    payload: stageMemberId,
  };
};

const addCustomStageMemberVolume = (
  stageMember: ServerDevicePayloads.CustomStageMemberVolumeAdded
) => {
  return {
    type: ServerDeviceEvents.CustomStageMemberVolumeAdded,
    payload: stageMember,
  };
};
const changeCustomStageMemberVolume = (
  stageMember: ServerDevicePayloads.CustomStageMemberVolumeChanged
) => {
  return {
    type: ServerDeviceEvents.CustomStageMemberVolumeChanged,
    payload: stageMember,
  };
};
const removeCustomStageMemberVolume = (
  customStageMemberId: ServerDevicePayloads.CustomStageMemberVolumeRemoved
) => {
  return {
    type: ServerDeviceEvents.CustomStageMemberVolumeRemoved,
    payload: customStageMemberId,
  };
};
const addCustomStageMemberPosition = (
  stageMember: ServerDevicePayloads.CustomStageMemberPositionAdded
) => {
  return {
    type: ServerDeviceEvents.CustomStageMemberPositionAdded,
    payload: stageMember,
  };
};
const changeCustomStageMemberPosition = (
  stageMember: ServerDevicePayloads.CustomStageMemberPositionChanged
) => {
  return {
    type: ServerDeviceEvents.CustomStageMemberPositionChanged,
    payload: stageMember,
  };
};
const removeCustomStageMemberPosition = (
  customStageMemberId: ServerDevicePayloads.CustomStageMemberPositionRemoved
) => {
  return {
    type: ServerDeviceEvents.CustomStageMemberPositionRemoved,
    payload: customStageMemberId,
  };
};

const addRemoteVideoTrack = (
  remoteVideoTrack: ServerDevicePayloads.RemoteVideoTrackAdded
) => {
  return {
    type: ServerDeviceEvents.RemoteVideoTrackAdded,
    payload: remoteVideoTrack,
  };
};
const changeRemoteVideoTrack = (
  remoteVideoTrack: ServerDevicePayloads.RemoteVideoTrackChanged
) => {
  return {
    type: ServerDeviceEvents.RemoteVideoTrackChanged,
    payload: remoteVideoTrack,
  };
};
const removeRemoteVideoTrack = (
  remoteVideoTrackId: ServerDevicePayloads.RemoteVideoTrackRemoved
) => {
  return {
    type: ServerDeviceEvents.RemoteVideoTrackRemoved,
    payload: remoteVideoTrackId,
  };
};

const addRemoteAudioTrack = (
  remoteAudioTrack: ServerDevicePayloads.RemoteAudioTrackAdded
) => {
  return {
    type: ServerDeviceEvents.RemoteAudioTrackAdded,
    payload: remoteAudioTrack,
  };
};
const changeRemoteAudioTrack = (
  remoteAudioTrack: ServerDevicePayloads.RemoteAudioTrackChanged
) => {
  return {
    type: ServerDeviceEvents.RemoteAudioTrackChanged,
    payload: remoteAudioTrack,
  };
};
const removeRemoteAudioTrack = (
  remoteAudioTrackId: ServerDevicePayloads.RemoteAudioTrackRemoved
) => {
  return {
    type: ServerDeviceEvents.RemoteAudioTrackRemoved,
    payload: remoteAudioTrackId,
  };
};

const addCustomRemoteAudioTrackVolume = (
  customRemoteAudioTrackVolume: ServerDevicePayloads.CustomRemoteAudioTrackVolumeAdded
) => {
  return {
    type: ServerDeviceEvents.CustomRemoteAudioTrackVolumeAdded,
    payload: customRemoteAudioTrackVolume,
  };
};
const changeCustomRemoteAudioTrackVolume = (
  customRemoteAudioTrackVolume: ServerDevicePayloads.CustomRemoteAudioTrackVolumeChanged
) => {
  return {
    type: ServerDeviceEvents.CustomRemoteAudioTrackVolumeChanged,
    payload: customRemoteAudioTrackVolume,
  };
};
const removeCustomRemoteAudioTrackVolume = (
  customRemoteAudioTrackVolumeId: ServerDevicePayloads.CustomRemoteAudioTrackVolumeRemoved
) => {
  return {
    type: ServerDeviceEvents.CustomRemoteAudioTrackVolumeRemoved,
    payload: customRemoteAudioTrackVolumeId,
  };
};
const addCustomRemoteAudioTrackPosition = (
  customRemoteAudioTrackPosition: ServerDevicePayloads.CustomRemoteAudioTrackPositionAdded
) => {
  return {
    type: ServerDeviceEvents.CustomRemoteAudioTrackVolumeAdded,
    payload: customRemoteAudioTrackPosition,
  };
};
const changeCustomRemoteAudioTrackPosition = (
  customRemoteAudioTrackPosition: ServerDevicePayloads.CustomRemoteAudioTrackPositionChanged
) => {
  return {
    type: ServerDeviceEvents.CustomRemoteAudioTrackPositionChanged,
    payload: customRemoteAudioTrackPosition,
  };
};
const removeCustomRemoteAudioTrackPosition = (
  customRemoteAudioTrackPositionId: ServerDevicePayloads.CustomRemoteAudioTrackPositionRemoved
) => {
  return {
    type: ServerDeviceEvents.CustomRemoteAudioTrackPositionRemoved,
    payload: customRemoteAudioTrackPositionId,
  };
};

const addLocalAudioTrack = (
  localAudioTrack: ServerDevicePayloads.LocalAudioTrackAdded
) => {
  return {
    type: ServerDeviceEvents.LocalAudioTrackAdded,
    payload: localAudioTrack,
  };
};
const changeLocalAudioTrack = (
  localAudioTrack: ServerDevicePayloads.LocalAudioTrackChanged
) => {
  return {
    type: ServerDeviceEvents.LocalAudioTrackChanged,
    payload: localAudioTrack,
  };
};
const removeLocalAudioTrack = (
  localAudioTrackId: ServerDevicePayloads.LocalAudioTrackRemoved
) => {
  return {
    type: ServerDeviceEvents.LocalAudioTrackRemoved,
    payload: localAudioTrackId,
  };
};
const addLocalVideoTrack = (
  localVideoTrack: ServerDevicePayloads.LocalVideoTrackAdded
) => {
  return {
    type: ServerDeviceEvents.LocalVideoTrackAdded,
    payload: localVideoTrack,
  };
};
const changeLocalVideoTrack = (
  localVideoTrack: ServerDevicePayloads.LocalVideoTrackChanged
) => {
  return {
    type: ServerDeviceEvents.LocalVideoTrackChanged,
    payload: localVideoTrack,
  };
};
const removeLocalVideoTrack = (
  localVideoTrackId: ServerDevicePayloads.LocalVideoTrackRemoved
) => {
  return {
    type: ServerDeviceEvents.LocalVideoTrackRemoved,
    payload: localVideoTrackId,
  };
};

const server = {
  messageSent,
  addRemoteUser,
  changeRemoteUser,
  removeRemoteUser,
  addStage,
  changeStage,
  removeStage,
  addGroup,
  changeGroup,
  removeGroup,
  addCustomGroupVolume,
  changeCustomGroupVolume,
  removeCustomGroupVolume,
  addCustomGroupPosition,
  changeCustomGroupPosition,
  removeCustomGroupPosition,
  addStageMember,
  changeStageMember,
  removeStageMember,
  addCustomStageMemberVolume,
  changeCustomStageMemberVolume,
  removeCustomStageMemberVolume,
  addCustomStageMemberPosition,
  changeCustomStageMemberPosition,
  removeCustomStageMemberPosition,
  addRemoteAudioTrack,
  changeRemoteAudioTrack,
  removeRemoteAudioTrack,
  addRemoteVideoTrack,
  changeRemoteVideoTrack,
  removeRemoteVideoTrack,
  addCustomRemoteAudioTrackPosition,
  changeCustomRemoteAudioTrackPosition,
  removeCustomRemoteAudioTrackPosition,
  addCustomRemoteAudioTrackVolume,
  changeCustomRemoteAudioTrackVolume,
  removeCustomRemoteAudioTrackVolume,
  addLocalAudioTrack,
  changeLocalAudioTrack,
  removeLocalAudioTrack,
  addLocalVideoTrack,
  changeLocalVideoTrack,
  removeLocalVideoTrack,
};
const stageActions = {
  server,
};
export default stageActions;
