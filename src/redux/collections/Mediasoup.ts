export interface MediasoupVideoConsumer {
    id: string
    producerId: string
    track: MediaStreamTrack
    remoteVideoTrackId: string
}

export interface MediasoupAudioConsumer {
    id: string
    producerId: string
    track: MediaStreamTrack
    remoteAudioTrackId: string
}

interface Mediasoup {
    videoConsumers: {
        byId: {
            [id: string]: MediasoupVideoConsumer
        }
        byRemoteVideoTrackId: {
            [remoteVideoTrackId: string]: string
        }
        allIds: string[]
    }
    audioConsumers: {
        byId: {
            [id: string]: MediasoupAudioConsumer
        }
        byRemoteAudioTrackId: {
            [remoteAudioTrackId: string]: string
        }
        allIds: string[]
    }
}

export default Mediasoup
