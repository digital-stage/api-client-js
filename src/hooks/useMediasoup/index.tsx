import React, { createContext, useContext, useEffect, useState } from 'react'
import debug from 'debug'
import { Producer } from 'mediasoup-client/lib/Producer'
import { Consumer } from 'mediasoup-client/lib/Consumer'
import { shallowEqual } from 'react-redux'
import omit from 'lodash/omit'
import { ITeckosClient } from 'teckos-client'
import {
    ClientDeviceEvents,
    AudioTrack,
    VideoTrack,
    MediasoupDevice,
    MediasoupAudioTrack,
    MediasoupVideoTrack,
    ClientDevicePayloads,
} from '@digitalstage/api-types'
import useStageSelector from '../useStageSelector'
import useMediasoupTransport from './useMediasoupTransport'
import useConnection from '../useConnection'
import { getAudioTracks, getVideoTracks, refreshMediaDevices } from './util'

const report = debug('useMediasoup')

const reportError = report.extend('error')

/**
 * Helper function to publish producer at the API server
 * @param apiConnection
 * @param stageId
 * @param producer
 */
const publishProducer = (apiConnection: ITeckosClient, stageId: string, producer: Producer) =>
    new Promise<MediasoupVideoTrack | MediasoupAudioTrack>((resolve, reject) => {
        apiConnection.emit(
            producer.kind === 'video'
                ? ClientDeviceEvents.CreateVideoTrack
                : ClientDeviceEvents.CreateAudioTrack,
            {
                type: 'mediasoup',
                stageId,
                producerId: producer.id,
            } as ClientDevicePayloads.CreateVideoTrack,
            (error: string | null, track?: VideoTrack | AudioTrack) => {
                if (error) {
                    return reject(error)
                }
                if (!track) {
                    return reject(new Error('No video track provided by server'))
                }
                if (producer.kind === 'audio') {
                    return resolve(track as MediasoupAudioTrack)
                }
                return resolve(track as MediasoupVideoTrack)
            }
        )
    })

export interface IMediasoupContext {
    videoConsumers: {
        [videoTrackId: string]: Consumer
    }
    audioConsumers: {
        [videoTrackId: string]: Consumer
    }
    videoProducers: {
        [localVideoTrackId: string]: Producer
    }
    audioProducers: {
        [localAudioTrackId: string]: Producer
    }
}

const MediasoupContext = createContext<IMediasoupContext>({
    videoProducers: {},
    videoConsumers: {},
    audioProducers: {},
    audioConsumers: {},
})

const MediasoupProvider = (props: { children: React.ReactNode }): JSX.Element => {
    const { children } = props
    const apiConnection = useConnection()

    const localDevice = useStageSelector((state) =>
        state.globals.localDeviceId
            ? (state.devices.byId[state.globals.localDeviceId] as MediasoupDevice)
            : undefined
    )
    const stage = useStageSelector((state) =>
        state.globals.stageId ? state.stages.byId[state.globals.stageId] : undefined
    )

    /**
     * SYNC ROUTER URL AND RESULTING TRANSPORT
     */
    const [routerUrl, setRouterUrl] = useState<string>()

    const { ready, consume, produce, stopProducing, stopConsuming } = useMediasoupTransport({
        routerUrl,
    })

    /**
     * PRODUCING VIDEOS
     */
    const [videoProducers, setVideoProducers] = useState<{
        [localVideoTrackId: string]: Producer
    }>({})
    useEffect(() => {
        if (
            apiConnection &&
            ready &&
            stage &&
            localDevice?.sendVideo &&
            stage.videoType === 'mediasoup'
        ) {
            report(`Fetch video and produce it for stage ${stage._id}`)
            getVideoTracks(localDevice.inputVideoDeviceId)
                .then((tracks) => Promise.all(tracks.map((track) => produce(track))))
                .then((producers) =>
                    Promise.all(
                        producers.map((producer) =>
                            // eslint-disable-next-line promise/no-nesting
                            publishProducer(apiConnection, stage._id, producer).then(
                                (localVideoTrack) =>
                                    setVideoProducers((prev) => ({
                                        ...prev,
                                        [localVideoTrack._id]: producer,
                                    }))
                            )
                        )
                    )
                )
                .then(() => refreshMediaDevices(localDevice, apiConnection))
                .catch((err) => reportError(err))
            return () => {
                setVideoProducers((prev) => {
                    Object.keys(prev)
                        .map((id) => {
                            report(`Removing local video track ${id}`)
                            apiConnection.emit(ClientDeviceEvents.RemoveVideoTrack, id)
                            return prev[id]
                        })
                        .map((producer) =>
                            stopProducing(producer).catch((error) => reportError(error))
                        )
                    return {}
                })
            }
        }
        return undefined
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        apiConnection,
        ready,
        stage,
        produce,
        stopProducing,
        localDevice?.sendVideo,
        localDevice?.inputVideoDeviceId,
    ])

    /**
     * PRODUCING AUDIO
     */
    const [audioProducers, setAudioProducers] = useState<{
        [localAudioTrackId: string]: Producer
    }>({})
    useEffect(() => {
        if (
            apiConnection &&
            ready &&
            stage &&
            localDevice?.sendAudio &&
            stage.audioType === 'mediasoup'
        ) {
            getAudioTracks({
                inputAudioDeviceId: localDevice.inputAudioDeviceId,
                autoGainControl: localDevice.autoGainControl,
                echoCancellation: localDevice.echoCancellation,
                noiseSuppression: localDevice.noiseSuppression,
                sampleRate: localDevice.sampleRate,
            })
                .then((tracks) => Promise.all(tracks.map((track) => produce(track))))
                .then((producers) =>
                    Promise.all(
                        producers.map((producer) =>
                            // eslint-disable-next-line promise/no-nesting
                            publishProducer(apiConnection, stage._id, producer).then(
                                (localAudioTrack) =>
                                    setAudioProducers((prev) => ({
                                        ...prev,
                                        [localAudioTrack._id]: producer,
                                    }))
                            )
                        )
                    )
                )
                .then(() => refreshMediaDevices(localDevice, apiConnection))
                .catch((err) => reportError(err))
            return () => {
                setAudioProducers((prev) => {
                    Object.keys(prev)
                        .map((id) => {
                            report(`Removing local audio track ${id}`)
                            apiConnection.emit(ClientDeviceEvents.RemoveAudioTrack, id)
                            return prev[id]
                        })
                        .map((producer) =>
                            stopProducing(producer).catch((error) => reportError(error))
                        )
                    return {}
                })
            }
        }
        return undefined
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        apiConnection,
        ready,
        stage,
        produce,
        stopProducing,
        localDevice?.sendAudio,
        localDevice?.inputAudioDeviceId,
        localDevice?.sampleRate,
        localDevice?.echoCancellation,
        localDevice?.noiseSuppression,
        localDevice?.autoGainControl,
    ])

    /** *
     * CONSUMING VIDEOS
     */
    const videoTracks = useStageSelector(
        (state) => state.videoTracks.allIds.map((id) => state.videoTracks.byId[id]),
        shallowEqual
    )
    const [videoConsumers, setVideoConsumers] = useState<{
        [videoTrackId: string]: Consumer
    }>({})
    useEffect(() => {
        if (ready && stage && localDevice?.receiveVideo) {
            return () => {
                // Stop consuming
                report('Stop consuming all remote video tracks')
                setVideoConsumers((prev) => {
                    Object.keys(prev).map((id) =>
                        stopConsuming(prev[id]).catch((err) => reportError(err))
                    )
                    return {}
                })
            }
        }
        return undefined
    }, [ready, stage, stopConsuming, localDevice?.receiveVideo])
    useEffect(() => {
        if (ready && stage && localDevice?.receiveVideo) {
            const mediasoupTracks = videoTracks
                .filter((track) => track.type === 'mediasoup')
                .map((track) => track as MediasoupVideoTrack)
            setVideoConsumers((prev) => {
                const removedTrackIds = Object.keys(prev).filter(
                    (id) => !mediasoupTracks.find((track) => track._id === id)
                )
                // Consume new tracks (async, will be added when available)
                mediasoupTracks
                    .filter((track) => !prev[track._id])
                    .map((track) => {
                        report(`Consuming new remote video track ${track._id}`)
                        return consume(track.producerId)
                            .then((consumer) =>
                                setVideoConsumers((prev2) => ({
                                    ...prev2,
                                    [track._id]: consumer,
                                }))
                            )
                            .catch((err) => reportError(err))
                    })
                // Stop removed tracks async
                removedTrackIds.map((id) => {
                    report(`Stop consuming unavailable video remote track ${id}`)
                    return stopConsuming(prev[id]).catch((err) => reportError(err))
                })
                // Omit removed tracks already
                return omit(prev, removedTrackIds)
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ready, stage, localDevice?.receiveVideo, consume, stopConsuming, videoTracks.length])

    /** *
     * CONSUMING AUDIO
     */
    const audioTracks = useStageSelector(
        (state) => state.audioTracks.allIds.map((id) => state.audioTracks.byId[id]),
        shallowEqual
    )
    const [audioConsumers, setAudioConsumers] = useState<{
        [audioTrackId: string]: Consumer
    }>({})
    useEffect(() => {
        if (ready && stage && localDevice?.receiveAudio) {
            return () => {
                // Stop consuming
                report('Stop consuming all remote audio tracks')
                setAudioConsumers((prev) => {
                    Object.keys(prev).map((id) =>
                        stopConsuming(prev[id]).catch((err) => reportError(err))
                    )
                    return {}
                })
            }
        }
        return undefined
    }, [ready, stage, stopConsuming, localDevice?.receiveAudio])
    useEffect(() => {
        if (ready && stage && localDevice?.receiveAudio) {
            const mediasoupTracks = audioTracks
                .filter((track) => track.type === 'mediasoup')
                .map((track) => track as MediasoupAudioTrack)
            setAudioConsumers((prev) => {
                const removedTrackIds = Object.keys(prev).filter(
                    (id) => !mediasoupTracks.find((track) => track._id === id)
                )
                // Consume new tracks (async, will be added when available)
                mediasoupTracks
                    .filter((track) => !prev[track._id])
                    .map((track) => {
                        report(`Consuming new audio track ${track._id}`)
                        return consume(track.producerId)
                            .then((consumer) =>
                                setAudioConsumers((prev2) => ({
                                    ...prev2,
                                    [track._id]: consumer,
                                }))
                            )
                            .catch((err) => reportError(err))
                    })
                // Stop removed tracks async
                removedTrackIds.map((id) => {
                    report(`Stop consuming unavailable audio track ${id}`)
                    return stopConsuming(prev[id]).catch((err) => reportError(err))
                })
                // Omit removed tracks already
                return omit(prev, removedTrackIds)
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ready, stage, localDevice?.receiveAudio, consume, stopConsuming, audioTracks.length])

    useEffect(() => {
        if (
            stage &&
            (stage.videoType === 'mediasoup' || stage.audioType === 'mediasoup') &&
            stage.mediasoup
        ) {
            setRouterUrl(`${stage.mediasoup.url}:${stage.mediasoup.port}`)
            return () => {
                setRouterUrl(undefined)
            }
        }
        return undefined
    }, [stage])

    return (
        <MediasoupContext.Provider
            value={{
                videoConsumers,
                videoProducers,
                audioConsumers,
                audioProducers,
            }}
        >
            {children}
        </MediasoupContext.Provider>
    )
}

const useMediasoup = (): IMediasoupContext => useContext<IMediasoupContext>(MediasoupContext)

export { MediasoupProvider }
export default useMediasoup
