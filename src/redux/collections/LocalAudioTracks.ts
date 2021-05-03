import { LocalAudioTrack } from '@digitalstage/api-types'

interface LocalAudioTracks {
    byId: {
        [id: string]: LocalAudioTrack
    }
    allIds: string[]
}

export default LocalAudioTracks
