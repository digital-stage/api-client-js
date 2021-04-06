import ServerDeviceEvents from '../../types/ServerDeviceEvents';
import ServerDevicePayloads from '../../types/ServerDevicePayloads';

const messageSent = (message: ServerDevicePayloads.ChatMessageSend) => ({
  type: ServerDeviceEvents.ChatMessageSend,
  payload: message,
});

const addRemoteUser = (user: ServerDevicePayloads.RemoteUserAdded) => ({
  type: ServerDeviceEvents.RemoteUserAdded,
  payload: user,
});
const changeRemoteUser = (user: ServerDevicePayloads.RemoteUserChanged) => ({
  type: ServerDeviceEvents.RemoteUserChanged,
  payload: user,
});
const removeRemoteUser = (userId: ServerDevicePayloads.RemoteUserRemoved) => ({
  type: ServerDeviceEvents.RemoteUserRemoved,
  payload: userId,
});
const addStage = (stage: ServerDevicePayloads.StageAdded) => ({
  type: ServerDeviceEvents.StageAdded,
  payload: stage,
});
const changeStage = (stage: ServerDevicePayloads.StageChanged) => ({
  type: ServerDeviceEvents.StageChanged,
  payload: stage,
});
const removeStage = (stageId: ServerDevicePayloads.StageRemoved) => ({
  type: ServerDeviceEvents.StageRemoved,
  payload: stageId,
});

const addGroup = (group: ServerDevicePayloads.GroupAdded) => ({
  type: ServerDeviceEvents.GroupAdded,
  payload: group,
});
const changeGroup = (group: ServerDevicePayloads.GroupChanged) => ({
  type: ServerDeviceEvents.GroupChanged,
  payload: group,
});
const removeGroup = (groupId: ServerDevicePayloads.GroupRemoved) => ({
  type: ServerDeviceEvents.GroupRemoved,
  payload: groupId,
});

const addCustomGroupVolume = (
  group: ServerDevicePayloads.CustomGroupVolumeAdded
) => ({
  type: ServerDeviceEvents.CustomGroupVolumeAdded,
  payload: group,
});
const changeCustomGroupVolume = (
  group: ServerDevicePayloads.CustomGroupVolumeChanged
) => ({
  type: ServerDeviceEvents.CustomGroupVolumeChanged,
  payload: group,
});
const removeCustomGroupVolume = (
  groupId: ServerDevicePayloads.CustomGroupVolumeRemoved
) => ({
  type: ServerDeviceEvents.CustomGroupVolumeRemoved,
  payload: groupId,
});
const addCustomGroupPosition = (
  group: ServerDevicePayloads.CustomGroupPositionAdded
) => ({
  type: ServerDeviceEvents.CustomGroupPositionAdded,
  payload: group,
});
const changeCustomGroupPosition = (
  group: ServerDevicePayloads.CustomGroupPositionChanged
) => ({
  type: ServerDeviceEvents.CustomGroupPositionChanged,
  payload: group,
});
const removeCustomGroupPosition = (
  groupId: ServerDevicePayloads.CustomGroupPositionRemoved
) => ({
  type: ServerDeviceEvents.CustomGroupPositionRemoved,
  payload: groupId,
});

const addStageMember = (
  stageMember: ServerDevicePayloads.StageMemberAdded
) => ({
  type: ServerDeviceEvents.StageMemberAdded,
  payload: stageMember,
});
const changeStageMember = (
  stageMember: ServerDevicePayloads.StageMemberChanged
) => ({
  type: ServerDeviceEvents.StageMemberChanged,
  payload: stageMember,
});
const removeStageMember = (
  stageMemberId: ServerDevicePayloads.StageMemberRemoved
) => ({
  type: ServerDeviceEvents.StageMemberRemoved,
  payload: stageMemberId,
});

const addCustomStageMemberVolume = (
  stageMember: ServerDevicePayloads.CustomStageMemberVolumeAdded
) => ({
  type: ServerDeviceEvents.CustomStageMemberVolumeAdded,
  payload: stageMember,
});
const changeCustomStageMemberVolume = (
  stageMember: ServerDevicePayloads.CustomStageMemberVolumeChanged
) => ({
  type: ServerDeviceEvents.CustomStageMemberVolumeChanged,
  payload: stageMember,
});
const removeCustomStageMemberVolume = (
  customStageMemberId: ServerDevicePayloads.CustomStageMemberVolumeRemoved
) => ({
  type: ServerDeviceEvents.CustomStageMemberVolumeRemoved,
  payload: customStageMemberId,
});
const addCustomStageMemberPosition = (
  stageMember: ServerDevicePayloads.CustomStageMemberPositionAdded
) => ({
  type: ServerDeviceEvents.CustomStageMemberPositionAdded,
  payload: stageMember,
});
const changeCustomStageMemberPosition = (
  stageMember: ServerDevicePayloads.CustomStageMemberPositionChanged
) => ({
  type: ServerDeviceEvents.CustomStageMemberPositionChanged,
  payload: stageMember,
});
const removeCustomStageMemberPosition = (
  customStageMemberId: ServerDevicePayloads.CustomStageMemberPositionRemoved
) => ({
  type: ServerDeviceEvents.CustomStageMemberPositionRemoved,
  payload: customStageMemberId,
});

const addRemoteVideoTrack = (
  remoteVideoTrack: ServerDevicePayloads.RemoteVideoTrackAdded
) => ({
  type: ServerDeviceEvents.RemoteVideoTrackAdded,
  payload: remoteVideoTrack,
});
const changeRemoteVideoTrack = (
  remoteVideoTrack: ServerDevicePayloads.RemoteVideoTrackChanged
) => ({
  type: ServerDeviceEvents.RemoteVideoTrackChanged,
  payload: remoteVideoTrack,
});
const removeRemoteVideoTrack = (
  remoteVideoTrackId: ServerDevicePayloads.RemoteVideoTrackRemoved
) => ({
  type: ServerDeviceEvents.RemoteVideoTrackRemoved,
  payload: remoteVideoTrackId,
});

const addRemoteAudioTrack = (
  remoteAudioTrack: ServerDevicePayloads.RemoteAudioTrackAdded
) => ({
  type: ServerDeviceEvents.RemoteAudioTrackAdded,
  payload: remoteAudioTrack,
});
const changeRemoteAudioTrack = (
  remoteAudioTrack: ServerDevicePayloads.RemoteAudioTrackChanged
) => ({
  type: ServerDeviceEvents.RemoteAudioTrackChanged,
  payload: remoteAudioTrack,
});
const removeRemoteAudioTrack = (
  remoteAudioTrackId: ServerDevicePayloads.RemoteAudioTrackRemoved
) => ({
  type: ServerDeviceEvents.RemoteAudioTrackRemoved,
  payload: remoteAudioTrackId,
});

const addCustomRemoteAudioTrackVolume = (
  customRemoteAudioTrackVolume: ServerDevicePayloads.CustomRemoteAudioTrackVolumeAdded
) => ({
  type: ServerDeviceEvents.CustomRemoteAudioTrackVolumeAdded,
  payload: customRemoteAudioTrackVolume,
});
const changeCustomRemoteAudioTrackVolume = (
  customRemoteAudioTrackVolume: ServerDevicePayloads.CustomRemoteAudioTrackVolumeChanged
) => ({
  type: ServerDeviceEvents.CustomRemoteAudioTrackVolumeChanged,
  payload: customRemoteAudioTrackVolume,
});
const removeCustomRemoteAudioTrackVolume = (
  customRemoteAudioTrackVolumeId: ServerDevicePayloads.CustomRemoteAudioTrackVolumeRemoved
) => ({
  type: ServerDeviceEvents.CustomRemoteAudioTrackVolumeRemoved,
  payload: customRemoteAudioTrackVolumeId,
});
const addCustomRemoteAudioTrackPosition = (
  customRemoteAudioTrackPosition: ServerDevicePayloads.CustomRemoteAudioTrackPositionAdded
) => ({
  type: ServerDeviceEvents.CustomRemoteAudioTrackVolumeAdded,
  payload: customRemoteAudioTrackPosition,
});
const changeCustomRemoteAudioTrackPosition = (
  customRemoteAudioTrackPosition: ServerDevicePayloads.CustomRemoteAudioTrackPositionChanged
) => ({
  type: ServerDeviceEvents.CustomRemoteAudioTrackPositionChanged,
  payload: customRemoteAudioTrackPosition,
});
const removeCustomRemoteAudioTrackPosition = (
  customRemoteAudioTrackPositionId: ServerDevicePayloads.CustomRemoteAudioTrackPositionRemoved
) => ({
  type: ServerDeviceEvents.CustomRemoteAudioTrackPositionRemoved,
  payload: customRemoteAudioTrackPositionId,
});

const addLocalAudioTrack = (
  localAudioTrack: ServerDevicePayloads.LocalAudioTrackAdded
) => ({
  type: ServerDeviceEvents.LocalAudioTrackAdded,
  payload: localAudioTrack,
});
const changeLocalAudioTrack = (
  localAudioTrack: ServerDevicePayloads.LocalAudioTrackChanged
) => ({
  type: ServerDeviceEvents.LocalAudioTrackChanged,
  payload: localAudioTrack,
});
const removeLocalAudioTrack = (
  localAudioTrackId: ServerDevicePayloads.LocalAudioTrackRemoved
) => ({
  type: ServerDeviceEvents.LocalAudioTrackRemoved,
  payload: localAudioTrackId,
});
const addLocalVideoTrack = (
  localVideoTrack: ServerDevicePayloads.LocalVideoTrackAdded
) => ({
  type: ServerDeviceEvents.LocalVideoTrackAdded,
  payload: localVideoTrack,
});
const changeLocalVideoTrack = (
  localVideoTrack: ServerDevicePayloads.LocalVideoTrackChanged
) => ({
  type: ServerDeviceEvents.LocalVideoTrackChanged,
  payload: localVideoTrack,
});
const removeLocalVideoTrack = (
  localVideoTrackId: ServerDevicePayloads.LocalVideoTrackRemoved
) => ({
  type: ServerDeviceEvents.LocalVideoTrackRemoved,
  payload: localVideoTrackId,
});

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
