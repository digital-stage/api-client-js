import { ServerDeviceEvents, ServerDevicePayloads } from '@digitalstage/api-types'

const messageSent = (message: ServerDevicePayloads.ChatMessageSend) => ({
    type: ServerDeviceEvents.ChatMessageSend,
    payload: message,
})

const addUser = (user: ServerDevicePayloads.UserAdded) => ({
    type: ServerDeviceEvents.UserAdded,
    payload: user,
})
const changeUser = (user: ServerDevicePayloads.UserChanged) => ({
    type: ServerDeviceEvents.UserChanged,
    payload: user,
})
const removeUser = (userId: ServerDevicePayloads.UserRemoved) => ({
    type: ServerDeviceEvents.UserRemoved,
    payload: userId,
})
const addStage = (stage: ServerDevicePayloads.StageAdded) => ({
    type: ServerDeviceEvents.StageAdded,
    payload: stage,
})
const changeStage = (stage: ServerDevicePayloads.StageChanged) => ({
    type: ServerDeviceEvents.StageChanged,
    payload: stage,
})
const removeStage = (stageId: ServerDevicePayloads.StageRemoved) => ({
    type: ServerDeviceEvents.StageRemoved,
    payload: stageId,
})

const addGroup = (group: ServerDevicePayloads.GroupAdded) => ({
    type: ServerDeviceEvents.GroupAdded,
    payload: group,
})
const changeGroup = (group: ServerDevicePayloads.GroupChanged) => ({
    type: ServerDeviceEvents.GroupChanged,
    payload: group,
})
const removeGroup = (groupId: ServerDevicePayloads.GroupRemoved) => ({
    type: ServerDeviceEvents.GroupRemoved,
    payload: groupId,
})

const addCustomGroupVolume = (group: ServerDevicePayloads.CustomGroupVolumeAdded) => ({
    type: ServerDeviceEvents.CustomGroupVolumeAdded,
    payload: group,
})
const changeCustomGroupVolume = (group: ServerDevicePayloads.CustomGroupVolumeChanged) => ({
    type: ServerDeviceEvents.CustomGroupVolumeChanged,
    payload: group,
})
const removeCustomGroupVolume = (groupId: ServerDevicePayloads.CustomGroupVolumeRemoved) => ({
    type: ServerDeviceEvents.CustomGroupVolumeRemoved,
    payload: groupId,
})
const addCustomGroupPosition = (group: ServerDevicePayloads.CustomGroupPositionAdded) => ({
    type: ServerDeviceEvents.CustomGroupPositionAdded,
    payload: group,
})
const changeCustomGroupPosition = (group: ServerDevicePayloads.CustomGroupPositionChanged) => ({
    type: ServerDeviceEvents.CustomGroupPositionChanged,
    payload: group,
})
const removeCustomGroupPosition = (groupId: ServerDevicePayloads.CustomGroupPositionRemoved) => ({
    type: ServerDeviceEvents.CustomGroupPositionRemoved,
    payload: groupId,
})

const addStageMember = (stageMember: ServerDevicePayloads.StageMemberAdded) => ({
    type: ServerDeviceEvents.StageMemberAdded,
    payload: stageMember,
})
const changeStageMember = (stageMember: ServerDevicePayloads.StageMemberChanged) => ({
    type: ServerDeviceEvents.StageMemberChanged,
    payload: stageMember,
})
const removeStageMember = (stageMemberId: ServerDevicePayloads.StageMemberRemoved) => ({
    type: ServerDeviceEvents.StageMemberRemoved,
    payload: stageMemberId,
})

const addCustomStageMemberVolume = (
    stageMember: ServerDevicePayloads.CustomStageMemberVolumeAdded
) => ({
    type: ServerDeviceEvents.CustomStageMemberVolumeAdded,
    payload: stageMember,
})
const changeCustomStageMemberVolume = (
    stageMember: ServerDevicePayloads.CustomStageMemberVolumeChanged
) => ({
    type: ServerDeviceEvents.CustomStageMemberVolumeChanged,
    payload: stageMember,
})
const removeCustomStageMemberVolume = (
    customStageMemberId: ServerDevicePayloads.CustomStageMemberVolumeRemoved
) => ({
    type: ServerDeviceEvents.CustomStageMemberVolumeRemoved,
    payload: customStageMemberId,
})
const addCustomStageMemberPosition = (
    stageMember: ServerDevicePayloads.CustomStageMemberPositionAdded
) => ({
    type: ServerDeviceEvents.CustomStageMemberPositionAdded,
    payload: stageMember,
})
const changeCustomStageMemberPosition = (
    stageMember: ServerDevicePayloads.CustomStageMemberPositionChanged
) => ({
    type: ServerDeviceEvents.CustomStageMemberPositionChanged,
    payload: stageMember,
})
const removeCustomStageMemberPosition = (
    customStageMemberId: ServerDevicePayloads.CustomStageMemberPositionRemoved
) => ({
    type: ServerDeviceEvents.CustomStageMemberPositionRemoved,
    payload: customStageMemberId,
})

const addStageDevice = (stageDevice: ServerDevicePayloads.StageDeviceAdded) => ({
    type: ServerDeviceEvents.StageDeviceAdded,
    payload: stageDevice,
})
const changeStageDevice = (stageDevice: ServerDevicePayloads.StageDeviceChanged) => ({
    type: ServerDeviceEvents.StageDeviceChanged,
    payload: stageDevice,
})
const removeStageDevice = (stageDeviceId: ServerDevicePayloads.StageDeviceRemoved) => ({
    type: ServerDeviceEvents.StageDeviceRemoved,
    payload: stageDeviceId,
})

const addCustomStageDeviceVolume = (
    stageDevice: ServerDevicePayloads.CustomStageDeviceVolumeAdded
) => ({
    type: ServerDeviceEvents.CustomStageDeviceVolumeAdded,
    payload: stageDevice,
})
const changeCustomStageDeviceVolume = (
    stageDevice: ServerDevicePayloads.CustomStageDeviceVolumeChanged
) => ({
    type: ServerDeviceEvents.CustomStageDeviceVolumeChanged,
    payload: stageDevice,
})
const removeCustomStageDeviceVolume = (
    customStageDeviceId: ServerDevicePayloads.CustomStageDeviceVolumeRemoved
) => ({
    type: ServerDeviceEvents.CustomStageDeviceVolumeRemoved,
    payload: customStageDeviceId,
})
const addCustomStageDevicePosition = (
    stageDevice: ServerDevicePayloads.CustomStageDevicePositionAdded
) => ({
    type: ServerDeviceEvents.CustomStageDevicePositionAdded,
    payload: stageDevice,
})
const changeCustomStageDevicePosition = (
    stageDevice: ServerDevicePayloads.CustomStageDevicePositionChanged
) => ({
    type: ServerDeviceEvents.CustomStageDevicePositionChanged,
    payload: stageDevice,
})
const removeCustomStageDevicePosition = (
    customStageDeviceId: ServerDevicePayloads.CustomStageDevicePositionRemoved
) => ({
    type: ServerDeviceEvents.CustomStageDevicePositionRemoved,
    payload: customStageDeviceId,
})

const addVideoTrack = (videoTrack: ServerDevicePayloads.VideoTrackAdded) => ({
    type: ServerDeviceEvents.VideoTrackAdded,
    payload: videoTrack,
})
const changeVideoTrack = (videoTrack: ServerDevicePayloads.VideoTrackChanged) => ({
    type: ServerDeviceEvents.VideoTrackChanged,
    payload: videoTrack,
})
const removeVideoTrack = (videoTrackId: ServerDevicePayloads.VideoTrackRemoved) => ({
    type: ServerDeviceEvents.VideoTrackRemoved,
    payload: videoTrackId,
})

const addAudioTrack = (audioTrack: ServerDevicePayloads.AudioTrackAdded) => ({
    type: ServerDeviceEvents.AudioTrackAdded,
    payload: audioTrack,
})
const changeAudioTrack = (audioTrack: ServerDevicePayloads.AudioTrackChanged) => ({
    type: ServerDeviceEvents.AudioTrackChanged,
    payload: audioTrack,
})
const removeAudioTrack = (audioTrackId: ServerDevicePayloads.AudioTrackRemoved) => ({
    type: ServerDeviceEvents.AudioTrackRemoved,
    payload: audioTrackId,
})

const addCustomAudioTrackVolume = (
    customAudioTrackVolume: ServerDevicePayloads.CustomAudioTrackVolumeAdded
) => ({
    type: ServerDeviceEvents.CustomAudioTrackVolumeAdded,
    payload: customAudioTrackVolume,
})
const changeCustomAudioTrackVolume = (
    customAudioTrackVolume: ServerDevicePayloads.CustomAudioTrackVolumeChanged
) => ({
    type: ServerDeviceEvents.CustomAudioTrackVolumeChanged,
    payload: customAudioTrackVolume,
})
const removeCustomAudioTrackVolume = (
    customAudioTrackVolumeId: ServerDevicePayloads.CustomAudioTrackVolumeRemoved
) => ({
    type: ServerDeviceEvents.CustomAudioTrackVolumeRemoved,
    payload: customAudioTrackVolumeId,
})
const addCustomAudioTrackPosition = (
    customAudioTrackPosition: ServerDevicePayloads.CustomAudioTrackPositionAdded
) => ({
    type: ServerDeviceEvents.CustomAudioTrackPositionAdded,
    payload: customAudioTrackPosition,
})
const changeCustomAudioTrackPosition = (
    customAudioTrackPosition: ServerDevicePayloads.CustomAudioTrackPositionChanged
) => ({
    type: ServerDeviceEvents.CustomAudioTrackPositionChanged,
    payload: customAudioTrackPosition,
})
const removeCustomAudioTrackPosition = (
    customAudioTrackPositionId: ServerDevicePayloads.CustomAudioTrackPositionRemoved
) => ({
    type: ServerDeviceEvents.CustomAudioTrackPositionRemoved,
    payload: customAudioTrackPositionId,
})

const server = {
    messageSent,
    addUser,
    changeUser,
    removeUser,
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
    addStageDevice,
    changeStageDevice,
    removeStageDevice,
    addCustomStageDeviceVolume,
    changeCustomStageDeviceVolume,
    removeCustomStageDeviceVolume,
    addCustomStageDevicePosition,
    changeCustomStageDevicePosition,
    removeCustomStageDevicePosition,
    addCustomAudioTrackPosition,
    changeCustomAudioTrackPosition,
    removeCustomAudioTrackPosition,
    addCustomAudioTrackVolume,
    changeCustomAudioTrackVolume,
    removeCustomAudioTrackVolume,
    addAudioTrack,
    changeAudioTrack,
    removeAudioTrack,
    addVideoTrack,
    changeVideoTrack,
    removeVideoTrack,
}
const stageActions = {
    server,
}
export default stageActions
