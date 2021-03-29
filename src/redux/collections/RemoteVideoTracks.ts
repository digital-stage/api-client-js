import RemoteVideoTrack from "../../types/model/RemoteVideoTrack";

interface RemoteVideoTracks {
  byId: {
    [id: string]: RemoteVideoTrack;
  };
  byStage: {
    [stageId: string]: string[];
  };
  byStageMember: {
    [stageMemberId: string]: string[];
  };
  byUser: {
    [userId: string]: string[];
  };
  allIds: string[];
}

export default RemoteVideoTracks;
