import StageMember from '../../types/model/StageMember';

interface StageMembers {
  byId: {
    [id: string]: StageMember;
  };
  byStage: {
    [stageId: string]: string[];
  };
  byGroup: {
    [groupId: string]: string[];
  };
  byUser: {
    [userId: string]: string[];
  };
  allIds: string[];
}

export default StageMembers;
