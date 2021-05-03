import StageDevice from '../../types/model/StageDevice'

interface StageDevices {
    byId: {
        [id: string]: StageDevice
    }
    byStage: {
        [stageId: string]: string[]
    }
    byGroup: {
        [groupId: string]: string[]
    }
    byStageMember: {
        [stageMemberId: string]: string[]
    }
    byUser: {
        [userId: string]: string[]
    }
    allIds: string[]
}

export default StageDevices
