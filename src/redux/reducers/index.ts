import { combineReducers } from 'redux'
import { ChatMessage } from '@digitalstage/api-types'
import Stages from '../collections/Stages'
import Groups from '../collections/Groups'
import StageMembers from '../collections/StageMembers'
import Devices from '../collections/Devices'
import SoundCards from '../collections/SoundCards'
import Routers from '../collections/Routers'
import RemoteUsers from '../collections/RemoteUsers'
import CustomGroupVolumes from '../collections/CustomGroupVolumes'
import CustomGroupPositions from '../collections/CustomGroupPositions'
import CustomStageMemberVolumes from '../collections/CustomStageMemberVolumes'
import CustomStageMemberPositions from '../collections/CustomStageMemberPositions'
import CustomStageDeviceVolumes from '../collections/CustomStageDeviceVolumes'
import CustomStageDevicePositions from '../collections/CustomStageDevicePositions'
import CustomAudioTrackPositions from '../collections/CustomAudioTrackPositions'
import CustomAudioTrackVolumes from '../collections/CustomAudioTrackVolumes'
import reduceStages from './reduceStages'
import reduceGroups from './reduceGroups'
import reduceDevices from './reduceDevices'
import reduceSoundCards from './reduceSoundCards'
import reduceRouters from './reduceRouters'
import reduceStageMembers from './reduceStageMembers'
import reduceChatMessage from './reduceChatMessage'
import reduceAudioTracks from './reduceAudioTracks'
import reduceVideoTracks from './reduceVideoTracks'
import Globals from '../collections/Globals'
import reduceGlobals from './reduceGlobals'
import reduceRemoteUsers from './reduceRemoteUsers'
import reduceCustomGroupVolumes from './reduceCustomGroupVolumes'
import reduceCustomGroupPositions from './reduceCustomGroupPositions'
import reduceCustomStageMemberVolumes from './reduceCustomStageMemberVolumes'
import reduceCustomAudioTrackVolumes from './reduceCustomAudioTrackVolumes'
import reduceCustomAudioTrackPositions from './reduceCustomAudioTrackPositions'
import reduceCustomStageMemberPositions from './reduceCustomStageMemberPositions'
import reduceStageDevices from './reduceStageDevices'
import { AudioTracks, StageDevices, VideoTracks } from '../collections'
import reduceCustomStageDeviceVolumes from './reduceCustomStageDeviceVolumes'
import reduceCustomStageDevicePositions from './reduceCustomStageDevicePositions'

interface RootReducer {
    globals: Globals
    chatMessages: ChatMessage[]
    devices: Devices
    soundCards: SoundCards
    routers: Routers
    remoteUsers: RemoteUsers
    stages: Stages
    groups: Groups
    stageMembers: StageMembers
    stageDevices: StageDevices
    videoTracks: VideoTracks
    audioTracks: AudioTracks
    customGroupVolumes: CustomGroupVolumes
    customGroupPositions: CustomGroupPositions
    customStageMemberVolumes: CustomStageMemberVolumes
    customStageMemberPositions: CustomStageMemberPositions
    customStageDeviceVolumes: CustomStageDeviceVolumes
    customStageDevicePositions: CustomStageDevicePositions
    customAudioTrackVolumes: CustomAudioTrackVolumes
    customAudioTrackPositions: CustomAudioTrackPositions
}

export type {
    RootReducer,
    Globals,
    ChatMessage,
    Devices,
    SoundCards,
    Routers,
    RemoteUsers,
    Stages,
    Groups,
    StageMembers,
    StageDevices,
    VideoTracks,
    AudioTracks,
    CustomGroupVolumes,
    CustomGroupPositions,
    CustomStageMemberVolumes,
    CustomStageMemberPositions,
    CustomStageDeviceVolumes,
    CustomStageDevicePositions,
    CustomAudioTrackVolumes,
    CustomAudioTrackPositions,
}

const reducer = combineReducers<RootReducer>({
    globals: reduceGlobals,
    chatMessages: reduceChatMessage,
    devices: reduceDevices,
    soundCards: reduceSoundCards,
    routers: reduceRouters,
    remoteUsers: reduceRemoteUsers,
    stages: reduceStages,
    groups: reduceGroups,
    stageMembers: reduceStageMembers,
    stageDevices: reduceStageDevices,
    videoTracks: reduceVideoTracks,
    audioTracks: reduceAudioTracks,
    customGroupVolumes: reduceCustomGroupVolumes,
    customGroupPositions: reduceCustomGroupPositions,
    customStageMemberVolumes: reduceCustomStageMemberVolumes,
    customStageMemberPositions: reduceCustomStageMemberPositions,
    customStageDeviceVolumes: reduceCustomStageDeviceVolumes,
    customStageDevicePositions: reduceCustomStageDevicePositions,
    customAudioTrackVolumes: reduceCustomAudioTrackVolumes,
    customAudioTrackPositions: reduceCustomAudioTrackPositions,
})
export default reducer
