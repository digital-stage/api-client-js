import { RemoteVideoTrack } from '@digitalstage/api-types'

interface RemoteVideoTracks {
    byId: {
        [id: string]: RemoteVideoTrack
    }
    byStage: {
        [stageId: string]: string[]
    }
    byStageMember: {
        [stageMemberId: string]: string[]
    }
    byStageDevice: {
        [stageDeviceId: string]: string[]
    }
    byUser: {
        [userId: string]: string[]
    }
    allIds: string[]
}

export default RemoteVideoTracks
