import Group from '../../types/model/Group'

interface Groups {
    byId: {
        [id: string]: Group
    }
    byStage: {
        [stageId: string]: string[]
    }
    allIds: string[]
}

export default Groups
