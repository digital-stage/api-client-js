import { RemoteAudioTrack } from '@digitalstage/api-types'

interface RemoteAudioTracks {
    byId: {
        [id: string]: RemoteAudioTrack
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

export default RemoteAudioTracks
