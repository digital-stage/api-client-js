import LocalVideoTrack from '@digitalstage/api-types'

interface LocalVideoTracks {
    byId: {
        [id: string]: LocalVideoTrack
    }
    allIds: string[]
}

export default LocalVideoTracks
