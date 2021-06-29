import React, { createContext, useContext } from 'react'
import { Consumer } from 'mediasoup-client/lib/Consumer'
import { Producer } from 'mediasoup-client/lib/Producer'
import { ITeckosClient, TeckosClient } from 'teckos-client'
import debug from 'debug'
import { connect } from 'react-redux'
import {
    MediasoupAudioTrack,
    MediasoupVideoTrack,
    MediasoupDevice,
    MediasoupStage,
    ClientDeviceEvents,
} from '@digitalstage/api-types'
import mediasoupClient from 'mediasoup-client'
import { Device as MDevice } from 'mediasoup-client/lib/Device'
import { ApiConnectionContext } from '../useConnection'
import { RootReducer } from '../../redux/reducers'
import {
    createWebRTCTransport,
    getRTPCapabilities,
    publishProducer,
    createConsumer,
    createProducer,
    getAudioTracks,
    resumeConsumer,
    getVideoTracks,
    closeConsumer,
    stopProducer,
} from './util'

const report = debug('useMediasoup')

const reportError = report.extend('error')

export interface IMediasoupContext {
    connected: boolean
    videoConsumers: {
        [videoTrackId: string]: Consumer
    }
    audioConsumers: {
        [audioTrackId: string]: Consumer
    }
    videoProducers: {
        [localVideoTrackId: string]: Producer
    }
    audioProducers: {
        [localAudioTrackId: string]: Producer
    }
}

const MediasoupContext = createContext<IMediasoupContext>({
    connected: false,
    videoProducers: {},
    videoConsumers: {},
    audioProducers: {},
    audioConsumers: {},
})

function mapStateToProps(state: RootReducer): {
    localDevice?: MediasoupDevice
    stage?: MediasoupStage
    videoTracks: MediasoupVideoTrack[]
    audioTracks: MediasoupAudioTrack[]
} {
    const localDevice = state.globals.localDeviceId
        ? state.devices.byId[state.globals.localDeviceId]
        : undefined
    const stage = state.globals.stageId ? state.stages.byId[state.globals.stageId] : undefined
    if (
        localDevice &&
        localDevice.type === 'mediasoup' &&
        stage &&
        (stage?.videoType === 'mediasoup' || stage?.audioType === 'mediasoup') &&
        stage.mediasoup
    ) {
        const videoTracks = (
            stage.videoType === 'mediasoup' && state.videoTracks.byStage[stage._id]
                ? state.videoTracks.byStage[stage._id]
                      .map((id) => state.videoTracks.byId[id])
                      .filter((track) => track.type === 'mediasoup')
                : []
        ) as MediasoupVideoTrack[]
        const audioTracks = (
            stage.audioType === 'mediasoup' && state.audioTracks.byStage[stage._id]
                ? state.audioTracks.byStage[stage._id]
                      .map((id) => state.audioTracks.byId[id])
                      .filter((track) => track.type === 'mediasoup')
                : []
        ) as MediasoupAudioTrack[]
        return {
            localDevice: localDevice as MediasoupDevice,
            stage: stage as MediasoupStage,
            videoTracks,
            audioTracks,
        }
    }
    return {
        videoTracks: [],
        audioTracks: [],
    }
}
interface InternalMediasoupProviderProps {
    children: React.ReactNode
    localDevice?: MediasoupDevice
    stage?: MediasoupStage
    videoTracks: MediasoupVideoTrack[]
    audioTracks: MediasoupAudioTrack[]
    apiConnection?: ITeckosClient
}
type InternalMediasoupProviderState = {
    device?: mediasoupClient.Device
    routerConnection?: ITeckosClient
    sendTransport?: mediasoupClient.types.Transport
    receiveTransport?: mediasoupClient.types.Transport
} & Omit<IMediasoupContext, "connected">

class MediasoupProviderWithProps extends React.Component<
    InternalMediasoupProviderProps,
    InternalMediasoupProviderState
> {
    constructor(props: InternalMediasoupProviderProps) {
        super(props)
        this.state = {
            videoConsumers: {},
            videoProducers: {},
            audioConsumers: {},
            audioProducers: {},
        }
    }

    componentDidMount() {
        // Connect directly
        const { stage } = this.props
        const { routerConnection } = this.state
        if (stage && !routerConnection) {
            report('Connecting to an available stage')
            this.connect(`${stage.mediasoup.url}:${stage.mediasoup.port}`)
        }
    }

    componentDidUpdate(
        prevProps: Readonly<InternalMediasoupProviderProps>,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        prevState: Readonly<InternalMediasoupProviderState>,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        snapshot?: any
    ) {
        const { routerConnection, sendTransport } = this.state
        const { stage, localDevice, apiConnection, audioTracks, videoTracks } = this.props

        if (stage) {
            if (!routerConnection) {
                // Stage is available, but not yet connected
                report('Connecting to an available stage')
                this.connect(`${stage.mediasoup.url}:${stage.mediasoup.port}`)
            } else if (prevProps.stage && prevProps.stage.mediasoup !== stage.mediasoup) {
                // Router URL has changed, disconnect (will reconnect on the next cycle)
                report('Disconnecting in favor of connecting to new router')
                this.disconnect().catch((err) => reportError(err))
            }
        } else if (routerConnection) {
            // Stage is not available, but connected to router, so disconnect
            report('Disconnecting caused by leaving a stage')
            this.disconnect().catch((err) => reportError(err))
        }

        // PRODUCER HANDLING
        if (routerConnection && sendTransport && apiConnection && stage && localDevice) {
            if (
                !prevProps.localDevice ||
                prevProps.localDevice.sendVideo !== localDevice.sendVideo
            ) {
                if (localDevice.sendVideo) {
                    this.shareVideo().catch((err) => reportError(err))
                } else {
                    this.stopSharingVideo().catch((err) => reportError(err))
                }
            } else if (
                localDevice.sendVideo &&
                prevProps.localDevice.inputVideoDeviceId !== localDevice.inputVideoDeviceId
            ) {
                this.stopSharingVideo()
                    .then(() => this.shareVideo())
                    .catch((err) => reportError(err))
            }

            if (
                !prevProps.localDevice ||
                prevProps.localDevice.sendAudio !== localDevice.sendAudio
            ) {
                if (localDevice.sendAudio) {
                    this.shareAudio().catch((err) => reportError(err))
                } else {
                    this.stopSharingAudio().catch((err) => reportError(err))
                }
            } else if (
                localDevice.sendAudio &&
                (prevProps.localDevice.inputAudioDeviceId !== localDevice.inputAudioDeviceId ||
                    prevProps.localDevice.autoGainControl !== localDevice.autoGainControl ||
                    prevProps.localDevice.echoCancellation !== localDevice.echoCancellation ||
                    prevProps.localDevice.noiseSuppression !== localDevice.noiseSuppression ||
                    prevProps.localDevice.sampleRate !== localDevice.sampleRate)
            ) {
                this.stopSharingAudio()
                    .then(() => this.shareAudio())
                    .catch((err) => reportError(err))
            }
        }

        // CONSUMER HANDLING
        if (
            (localDevice && !prevProps.localDevice) ||
            prevProps.localDevice?.receiveAudio !== localDevice?.receiveAudio ||
            prevProps.audioTracks.length !== audioTracks.length
        ) {
            this.refreshAudioConsumers()
        }
        if (
            (localDevice && !prevProps.localDevice) ||
            prevProps.localDevice?.receiveVideo !== localDevice?.receiveVideo ||
            prevProps.videoTracks.length !== videoTracks.length
        ) {
            this.refreshVideoConsumers()
        }
    }

    componentWillUnmount() {
        this.disconnect().catch((err) => reportError(err))
    }

    private refreshAudioConsumers = (): void => {
        const { audioTracks, localDevice } = this.props
        const { audioConsumers } = this.state
        this.refreshConsumers(audioConsumers, audioTracks, !!localDevice?.receiveAudio)
            .then((consumers) => this.setState({ audioConsumers: consumers }))
            .catch((err) => reportError(err))
    }

    private refreshVideoConsumers = (): void => {
        const { videoTracks, localDevice } = this.props
        const { videoConsumers } = this.state
        this.refreshConsumers(videoConsumers, videoTracks, !!localDevice?.receiveVideo)
            .then((consumers) => this.setState({ videoConsumers: consumers }))
            .catch((err) => reportError(err))
    }

    private refreshConsumers = async (
        consumers: {
            [id: string]: Consumer
        },
        tracks: MediasoupAudioTrack[] | MediasoupVideoTrack[],
        consume: boolean
    ) => {
        const { routerConnection, device, receiveTransport } = this.state
        const { apiConnection, stage } = this.props
        if (apiConnection && stage && routerConnection && device && receiveTransport && consume) {
            const filteredConsumers: {
                [audioTrackId: string]: Consumer
            } = Object.keys(consumers).reduce((prev, trackId) => {
                if (!tracks.find((track) => track._id === trackId)) {
                    // Remove consumer
                    closeConsumer(routerConnection, consumers[trackId])
                    return prev
                }
                return {
                    ...prev,
                    [trackId]: consumers[trackId],
                }
            }, {})
            const addedConsumers = await tracks
                .filter((track) => !consumers[track._id])
                .reduce(async (prev, track) => {
                    const consumer = await createConsumer(
                        routerConnection,
                        device,
                        receiveTransport,
                        track.producerId
                    )
                    if (consumer.paused) await resumeConsumer(routerConnection, consumer)
                    return {
                        ...prev,
                        [track._id]: consumer,
                    }
                }, {})
            return {
                ...filteredConsumers,
                ...addedConsumers,
            }
        }
        if (routerConnection) {
            await Promise.all(
                Object.keys(consumers).map((trackId) =>
                    closeConsumer(routerConnection, consumers[trackId]).catch((err) =>
                        reportError(err)
                    )
                )
            )
        }
        return {}
    }

    private connect = (routerUrl: string) => {
        report(`Connecting to router ${routerUrl}`)
        const conn = new TeckosClient(routerUrl, {
            reconnection: true,
        })
        conn.on('connect_error', (error) => {
            reportError(error)
            return this.disconnect().catch((err) => reportError(err))
        })
        conn.on('connect_timeout', (error) => {
            reportError(error)
            return this.disconnect().catch((err) => reportError(err))
        })
        conn.on('connect', () => {
            report(`Connected to router ${routerUrl}`)
            const device = new MDevice()
            return getRTPCapabilities(conn)
                .then((rtpCapabilities) => device.load({ routerRtpCapabilities: rtpCapabilities }))
                .then(() =>
                    Promise.all([
                        createWebRTCTransport(conn, device, 'send'),
                        createWebRTCTransport(conn, device, 'receive'),
                    ])
                )
                .then((transports) =>
                    this.setState({
                        device,
                        sendTransport: transports[0],
                        receiveTransport: transports[1],
                    })
                )
        })
        conn.connect()
        this.setState({
            routerConnection: conn,
        })
    }

    private disconnect = (): Promise<any> => {
        report(`Disconnecting`)
        // First stop sharing and consuming
        return (
            Promise.all([this.stopSharingVideo(), this.stopSharingAudio()])
                // Then close the connection in the correct order
                .finally(() => {
                    const { sendTransport, receiveTransport, routerConnection } = this.state
                    if (sendTransport) sendTransport.close()
                    if (receiveTransport) receiveTransport.close()
                    if (routerConnection) {
                        routerConnection.disconnect()
                        routerConnection.close()
                        report(`Disconnected from router`)
                    }
                    this.setState({
                        sendTransport: undefined,
                        receiveTransport: undefined,
                        routerConnection: undefined,
                    })
                })
        )
    }

    private shareVideo = async (): Promise<any> => {
        const { stage, localDevice, apiConnection } = this.props
        const { sendTransport } = this.state
        if (apiConnection && stage && sendTransport && localDevice) {
            const videoTracks = await getVideoTracks(localDevice.inputVideoDeviceId)
            videoTracks.map(async (videoTrack) => {
                const producer = await createProducer(sendTransport, videoTrack)
                if (producer.paused) {
                    report(`Producer ${producer.id} is paused`)
                    producer.resume()
                }
                const localProducer = await publishProducer(apiConnection, stage._id, producer)
                report(`Published video ${producer.id}`)
                const { videoProducers } = this.state
                return this.setState({
                    videoProducers: {
                        ...videoProducers,
                        [localProducer._id]: producer,
                    },
                })
            })
        }
    }

    private stopSharingVideo = async (): Promise<any> => {
        const { apiConnection } = this.props
        const { routerConnection, videoProducers } = this.state
        await Object.keys(videoProducers).map(async (id) => {
            // Inform api server (if available)
            if (apiConnection) apiConnection.emit(ClientDeviceEvents.RemoveVideoTrack, id)
            // Inform router if connected
            if (routerConnection)
                await stopProducer(routerConnection, videoProducers[id]).catch((err) =>
                    reportError(err)
                )
        })
        this.setState({ videoProducers: {} })
    }

    private shareAudio = async (): Promise<any> => {
        const { stage, localDevice, apiConnection } = this.props
        const { sendTransport } = this.state
        if (apiConnection && stage && sendTransport && localDevice) {
            const audioTracks = await getAudioTracks({
                inputAudioDeviceId: localDevice.inputAudioDeviceId,
                autoGainControl: localDevice.autoGainControl,
                echoCancellation: localDevice.echoCancellation,
                noiseSuppression: localDevice.noiseSuppression,
                sampleRate: localDevice.sampleRate,
            })
            audioTracks.map(async (videoTrack) => {
                const producer = await createProducer(sendTransport, videoTrack)
                if (producer.paused) {
                    report(`Producer ${producer.id} is paused`)
                    // producer.resume()
                }
                const localProducer = await publishProducer(apiConnection, stage._id, producer)
                report(`Published audio ${producer.id}`)
                const { audioProducers } = this.state
                return this.setState({
                    audioProducers: {
                        ...audioProducers,
                        [localProducer._id]: producer,
                    },
                })
            })
        }
    }

    private stopSharingAudio = async (): Promise<any> => {
        const { apiConnection } = this.props
        const { routerConnection, audioProducers } = this.state
        await Object.keys(audioProducers).map(async (id) => {
            if (apiConnection) apiConnection.emit(ClientDeviceEvents.RemoveAudioTrack, id)
            if (routerConnection)
                await stopProducer(routerConnection, audioProducers[id]).catch((err) =>
                    reportError(err)
                )
        })
        this.setState({ videoProducers: {} })
    }

    render() {
        const { children } = this.props
        const { routerConnection, audioConsumers, audioProducers, videoConsumers, videoProducers } = this.state

        return (
            <MediasoupContext.Provider
                value={{
                    connected: !!routerConnection,
                    audioConsumers,
                    audioProducers,
                    videoConsumers,
                    videoProducers,
                }}
            >
                {children}
            </MediasoupContext.Provider>
        )
    }
}

const MediasoupProvider = connect(mapStateToProps)(
    (props: {
        children: React.ReactNode
        localDevice?: MediasoupDevice
        stage?: MediasoupStage
        videoTracks: MediasoupVideoTrack[]
        audioTracks: MediasoupAudioTrack[]
    }) => (
        <ApiConnectionContext.Consumer>
            {(apiConnection) => (
                // eslint-disable-next-line react/jsx-props-no-spreading
                <MediasoupProviderWithProps apiConnection={apiConnection} {...props} />
            )}
        </ApiConnectionContext.Consumer>
    )
)

const useMediasoup = (): IMediasoupContext => useContext<IMediasoupContext>(MediasoupContext)

export { MediasoupProvider }
export default useMediasoup
