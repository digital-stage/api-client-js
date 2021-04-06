import { combineReducers } from 'redux';
import Stages from '../collections/Stages';
import Groups from '../collections/Groups';
import StageMembers from '../collections/StageMembers';
import Devices from '../collections/Devices';
import SoundCards from '../collections/SoundCards';
import Routers from '../collections/Routers';
import RemoteUsers from '../collections/RemoteUsers';
import RemoteVideoTracks from '../collections/RemoteVideoTracks';
import RemoteAudioTracks from '../collections/RemoteAudioTracks';
import CustomGroupVolumes from '../collections/CustomGroupVolumes';
import CustomGroupPositions from '../collections/CustomGroupPositions';
import CustomStageMemberVolumes from '../collections/CustomStageMemberVolumes';
import CustomStageMemberPositions from '../collections/CustomStageMemberPositions';
import CustomRemoteAudioTrackPositions from '../collections/CustomRemoteAudioTrackPositions';
import CustomRemoteAudioTrackVolumes from '../collections/CustomRemoteAudioTrackVolumes';
import reduceStages from './reduceStages';
import reduceGroups from './reduceGroups';
import reduceDevices from './reduceDevices';
import reduceSoundCards from './reduceSoundCards';
import reduceRouters from './reduceRouters';
import reduceStageMembers from './reduceStageMembers';
import reduceChatMessage from './reduceChatMessage';
import { ChatMessages } from '../collections/ChatMessages';
import reduceRemoteAudioTracks from './reduceRemoteAudioTracks';
import reduceRemoteVideoTracks from './reduceRemoteVideoTracks';
import Globals from '../collections/Globals';
import reduceGlobals from './reduceGlobals';
import reduceRemoteUsers from './reduceRemoteUsers';
import reduceCustomGroupVolumes from './reduceCustomGroupVolumes';
import reduceCustomGroupPositions from './reduceCustomGroupPositions';
import reduceCustomStageMemberVolumes from './reduceCustomStageMemberVolumes';
import reduceCustomRemoteAudioTrackVolumes from './reduceCustomRemoteAudioTrackVolumes';
import reduceCustomRemoteAudioTrackPositions from './reduceCustomRemoteAudioTrackPositions';
import reduceCustomStageMemberPositions from './reduceCustomStageMemberPositions';
import Mediasoup from '../collections/Mediasoup';
import reduceMediasoup from './reduceMediasoup';
import LocalAudioTracks from '../collections/LocalAudioTracks';
import LocalVideoTracks from '../collections/LocalVideoTracks';
import reduceLocalAudioTracks from './reduceLocalAudioTracks';
import reduceLocalVideoTracks from './reduceLocalVideoTracks';

export interface RootReducer {
  globals: Globals;
  chatMessages: ChatMessages;
  devices: Devices;
  soundCards: SoundCards;
  routers: Routers;
  remoteUsers: RemoteUsers;
  stages: Stages;
  groups: Groups;
  stageMembers: StageMembers;
  remoteVideoTracks: RemoteVideoTracks;
  remoteAudioTracks: RemoteAudioTracks;
  customGroupVolumes: CustomGroupVolumes;
  customGroupPositions: CustomGroupPositions;
  customStageMemberVolumes: CustomStageMemberVolumes;
  customStageMemberPositions: CustomStageMemberPositions;
  customRemoteAudioTrackVolumes: CustomRemoteAudioTrackVolumes;
  customRemoteAudioTrackPositions: CustomRemoteAudioTrackPositions;
  localVideoTracks: LocalVideoTracks;
  localAudioTracks: LocalAudioTracks;
  mediasoup: Mediasoup;
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
  remoteVideoTracks: reduceRemoteVideoTracks,
  remoteAudioTracks: reduceRemoteAudioTracks,
  customGroupVolumes: reduceCustomGroupVolumes,
  customGroupPositions: reduceCustomGroupPositions,
  customStageMemberVolumes: reduceCustomStageMemberVolumes,
  customStageMemberPositions: reduceCustomStageMemberPositions,
  customRemoteAudioTrackVolumes: reduceCustomRemoteAudioTrackVolumes,
  customRemoteAudioTrackPositions: reduceCustomRemoteAudioTrackPositions,
  localVideoTracks: reduceLocalVideoTracks,
  localAudioTracks: reduceLocalAudioTracks,
  mediasoup: reduceMediasoup,
});
export default reducer;
