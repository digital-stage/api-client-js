import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import {
    IAnalyserNode,
    IAudioContext,
    IAudioNode,
    IGainNode,
    IMediaStreamAudioSourceNode,
    IOscillatorNode,
    IPannerNode,
} from 'standardized-audio-context'
import {
    AudioTrack,
    CustomAudioTrackVolume,
    CustomGroupVolume,
    CustomStageDeviceVolume,
    CustomStageMemberVolume,
    Group,
    StageDevice,
    StageMember,
} from '@digitalstage/api-types'
import useStageDevicePosition from './useStageDevicePosition'
import useStageSelector from '../useStageSelector'
import useMediasoup from '../useMediasoup'
import useAudioContext from '../useAudioContext'
import useAudioTrackPosition from './useAudioTrackPosition'

interface AudioRenderContext {
    analyser: {
        [id: string]: IAnalyserNode<IAudioContext>
    }
    setAnalyser: React.Dispatch<React.SetStateAction<{ [p: string]: IAnalyserNode<IAudioContext> }>>
}

const Context = createContext<AudioRenderContext>({
    analyser: {},
    setAnalyser: () => {
        throw new Error('Please wrap your DOM tree inside an AudioRenderProvider')
    },
})

const AudioTrackRenderer = ({
    audioTrackId,
    audioContext,
    destination,
    deviceId,
}: {
    audioTrackId: string
    audioContext: IAudioContext
    destination: IAudioNode<IAudioContext>
    deviceId: string
}): JSX.Element => {
    const audioTrack = useStageSelector<AudioTrack>((state) => state.audioTracks.byId[audioTrackId])
    const customVolume = useStageSelector<CustomAudioTrackVolume | undefined>((state) =>
        state.customAudioTrackVolumes.byDeviceAndAudioTrack[deviceId] &&
        state.customAudioTrackVolumes.byDeviceAndAudioTrack[deviceId][audioTrackId]
            ? state.customAudioTrackVolumes.byId[
                  state.customAudioTrackVolumes.byDeviceAndAudioTrack[deviceId][audioTrackId]
              ]
            : undefined
    )
    const { audioConsumers, audioProducers } = useMediasoup()
    const audioRef = useRef<HTMLAudioElement>(null)
    const [track, setTrack] = useState<MediaStreamTrack>()
    const [sourceNode, setSourceNode] = useState<IMediaStreamAudioSourceNode<IAudioContext>>()
    const [pannerNode] = useState<IPannerNode<IAudioContext>>(() => {
        const node = audioContext.createPanner()
        node.panningModel = 'HRTF'
        node.distanceModel = 'linear'
        node.maxDistance = 10000
        node.refDistance = 1
        node.rolloffFactor = 10
        node.coneInnerAngle = 45
        node.coneOuterAngle = 90
        node.coneOuterGain = 0.3
        return node
    })
    const [gainNode] = useState<IGainNode<IAudioContext>>(audioContext.createGain())
    const position = useAudioTrackPosition({ audioTrack, deviceId })

    useEffect(() => {
        if (audioTrack.deviceId === deviceId) {
            // use local producer instead
            setTrack((prev) => {
                if (!prev && audioProducers[audioTrackId]) {
                    const { track: t } = audioProducers[audioTrackId]
                    if (t !== null) return t
                }
                return prev
            })
        } else {
            // use consumers
            setTrack((prev) => {
                if (!prev && audioConsumers[audioTrackId]) {
                    return audioConsumers[audioTrackId].track
                }
                return prev
            })
        }
    }, [audioTrackId, audioConsumers, audioProducers, audioTrack.deviceId, deviceId])

    useEffect(() => {
        if (audioRef.current && audioContext && track) {
            const stream = new MediaStream([track])
            audioRef.current.srcObject = stream
            audioRef.current.autoplay = true
            audioRef.current.muted = true
            audioRef.current.play().catch((err) => console.error(err))
            const source = audioContext.createMediaStreamSource(stream)
            setSourceNode(source)
        }
    }, [audioRef, track, audioContext])

    useEffect(() => {
        if (sourceNode && pannerNode) {
            sourceNode.connect(pannerNode)
            return () => {
                sourceNode.disconnect(pannerNode)
            }
        }
        return undefined
    }, [sourceNode, pannerNode])

    useEffect(() => {
        if (pannerNode && gainNode) {
            pannerNode.connect(gainNode)
            return () => {
                pannerNode.disconnect(gainNode)
            }
        }
        return undefined
    }, [pannerNode, gainNode])

    useEffect(() => {
        if (gainNode && destination) {
            gainNode.connect(destination)
            return () => {
                gainNode.disconnect(destination)
            }
        }
        return undefined
    }, [gainNode, destination])

    useEffect(() => {
        if (audioContext && gainNode) {
            if (customVolume?.muted) {
                gainNode.gain.setValueAtTime(0, audioContext.currentTime)
            } else if (customVolume?.volume) {
                gainNode.gain.setValueAtTime(customVolume.volume, audioContext.currentTime)
            } else if (audioTrack.muted) {
                gainNode.gain.setValueAtTime(0, audioContext.currentTime)
            } else {
                gainNode.gain.setValueAtTime(audioTrack.volume, audioContext.currentTime)
            }
        }
    }, [
        audioContext,
        gainNode,
        audioTrack.volume,
        audioTrack.muted,
        customVolume?.volume,
        customVolume?.muted,
    ])

    useEffect(() => {
        if (audioContext && pannerNode) {
            pannerNode.positionX.setValueAtTime(position.x, audioContext.currentTime)
            pannerNode.positionY.setValueAtTime(position.y, audioContext.currentTime)
            pannerNode.positionZ.setValueAtTime(position.z, audioContext.currentTime)
            pannerNode.orientationX.setValueAtTime(position.rX, audioContext.currentTime)
            pannerNode.orientationY.setValueAtTime(position.rY, audioContext.currentTime)
            pannerNode.orientationZ.setValueAtTime(position.rZ, audioContext.currentTime)
            if (position.directivity === 'cardoid') {
                // eslint-disable-next-line no-param-reassign
                pannerNode.coneInnerAngle = 90
                // eslint-disable-next-line no-param-reassign
                pannerNode.coneOuterAngle = 360
            } else {
                // eslint-disable-next-line no-param-reassign
                pannerNode.coneInnerAngle = 45
                // eslint-disable-next-line no-param-reassign
                pannerNode.coneOuterAngle = 90
                pannerNode.coneOuterGain = 0.3
            }
            console.log(
                'Switched node to ',
                position.x,
                position.y,
                position.z,
                position.rX,
                position.rY,
                position.rZ
            )
        }
    }, [audioContext, pannerNode, position])

    return (
        <audio ref={audioRef}>
            <track kind="captions" />
        </audio>
    )
}

const StageDeviceRenderer = ({
    stageDeviceId,
    audioContext,
    destination,
    deviceId,
}: {
    stageDeviceId: string
    audioContext: IAudioContext
    destination: IAudioNode<IAudioContext>
    deviceId: string
}): JSX.Element => {
    // return (<>{audioTrackIds.map(audioTrackId => <AudioTrackRenderer audioTrackId={audioTrackId} audioContext={audioContext}/>)}</>)
    const stageDevice = useStageSelector<StageDevice>(
        (state) => state.stageDevices.byId[stageDeviceId]
    )
    const customVolume = useStageSelector<CustomStageDeviceVolume | undefined>((state) =>
        state.customStageDeviceVolumes.byDeviceAndStageDevice[deviceId] &&
        state.customStageDeviceVolumes.byDeviceAndStageDevice[deviceId][stageDeviceId]
            ? state.customStageDeviceVolumes.byId[
                  state.customStageDeviceVolumes.byDeviceAndStageDevice[deviceId][stageDeviceId]
              ]
            : undefined
    )
    const audioTrackIds = useStageSelector(
        (state) => state.audioTracks.byStageDevice[stageDeviceId] || []
    )
    const [pannerNode] = useState<IPannerNode<IAudioContext>>(() => {
        const node = audioContext.createPanner()
        node.panningModel = 'HRTF'
        node.distanceModel = 'linear'
        node.maxDistance = 10000
        node.refDistance = 1
        node.rolloffFactor = 10
        return node
    })
    const [gainNode] = useState<IGainNode<IAudioContext>>(audioContext.createGain())
    const [oscillator, setOscillator] = useState<IOscillatorNode<IAudioContext>>()
    const position = useStageDevicePosition({ stageDeviceId, deviceId })

    useEffect(() => {
        if (audioContext) {
            console.log('Creating oscillator')
            const node = audioContext.createOscillator()
            node.type = 'square'
            node.frequency.setValueAtTime(
                Math.floor(Math.random() * 1000) + 300,
                audioContext.currentTime
            ) // value in hertz
            // node.start()
            setOscillator(node)
        }
    }, [audioContext])

    useEffect(() => {
        if (oscillator && pannerNode) {
            oscillator.connect(pannerNode)
            return () => {
                oscillator.disconnect(pannerNode)
            }
        }
        return undefined
    }, [oscillator, pannerNode])

    useEffect(() => {
        if (pannerNode && gainNode) {
            pannerNode.connect(gainNode)
            return () => {
                pannerNode.disconnect(gainNode)
            }
        }
        return undefined
    }, [pannerNode, gainNode])

    useEffect(() => {
        if (gainNode && destination) {
            gainNode.connect(destination)
            return () => {
                gainNode.disconnect(destination)
            }
        }
        return undefined
    }, [gainNode, destination])

    useEffect(() => {
        if (audioContext && gainNode) {
            if (customVolume?.muted) {
                gainNode.gain.setValueAtTime(0, audioContext.currentTime)
            } else if (customVolume?.volume) {
                gainNode.gain.setValueAtTime(customVolume.volume, audioContext.currentTime)
            } else if (stageDevice.muted) {
                gainNode.gain.setValueAtTime(0, audioContext.currentTime)
            } else {
                gainNode.gain.setValueAtTime(stageDevice.volume, audioContext.currentTime)
            }
        }
    }, [
        audioContext,
        gainNode,
        stageDevice.volume,
        stageDevice.muted,
        customVolume?.volume,
        customVolume?.muted,
    ])

    useEffect(() => {
        if (audioContext && pannerNode) {
            pannerNode.positionX.setValueAtTime(position.x, audioContext.currentTime)
            pannerNode.positionY.setValueAtTime(position.y, audioContext.currentTime)
            pannerNode.positionZ.setValueAtTime(position.z, audioContext.currentTime)
            pannerNode.orientationX.setValueAtTime(position.rX, audioContext.currentTime)
            pannerNode.orientationY.setValueAtTime(position.rY, audioContext.currentTime)
            pannerNode.orientationZ.setValueAtTime(position.rZ, audioContext.currentTime)
            if (position.directivity === 'cardoid') {
                // eslint-disable-next-line no-param-reassign
                pannerNode.coneInnerAngle = 90
                // eslint-disable-next-line no-param-reassign
                pannerNode.coneOuterAngle = 360
            } else {
                // eslint-disable-next-line no-param-reassign
                pannerNode.coneInnerAngle = 45
                // eslint-disable-next-line no-param-reassign
                pannerNode.coneOuterAngle = 90
                pannerNode.coneOuterGain = 0.3
            }
            console.log(
                'Switched node to ',
                position.x,
                position.y,
                position.z,
                position.rX,
                position.rY,
                position.rZ
            )
        }
    }, [audioContext, pannerNode, position])

    return (
        <>
            {audioTrackIds.map((audioTrackId) => (
                <AudioTrackRenderer
                    key={audioTrackId}
                    audioTrackId={audioTrackId}
                    audioContext={audioContext}
                    destination={gainNode}
                    deviceId={deviceId}
                />
            ))}
        </>
    )
}
const StageMemberRenderer = ({
    stageMemberId,
    audioContext,
    destination,
    deviceId,
}: {
    stageMemberId: string
    audioContext: IAudioContext
    destination: IAudioNode<IAudioContext>
    deviceId: string
}): JSX.Element => {
    const stageDeviceIds = useStageSelector(
        (state) => state.stageDevices.byStageMember[stageMemberId] || []
    )
    const stageMember = useStageSelector<StageMember>(
        (state) => state.stageMembers.byId[stageMemberId]
    )
    const customVolume = useStageSelector<CustomStageMemberVolume | undefined>((state) =>
        state.customStageMemberVolumes.byDeviceAndStageMember[deviceId] &&
        state.customStageMemberVolumes.byDeviceAndStageMember[deviceId][stageMemberId]
            ? state.customStageMemberVolumes.byId[
                  state.customStageMemberVolumes.byDeviceAndStageMember[deviceId][stageMemberId]
              ]
            : undefined
    )
    const [gainNode] = useState<IGainNode<IAudioContext>>(audioContext.createGain())

    useEffect(() => {
        if (destination && gainNode) {
            gainNode.connect(destination)
            return () => {
                gainNode.disconnect(destination)
            }
        }
        return undefined
    }, [gainNode, destination])

    useEffect(() => {
        if (audioContext && gainNode) {
            if (customVolume?.muted) {
                gainNode.gain.setValueAtTime(0, audioContext.currentTime)
            } else if (customVolume?.volume) {
                gainNode.gain.setValueAtTime(customVolume.volume, audioContext.currentTime)
            } else if (stageMember.muted) {
                gainNode.gain.setValueAtTime(0, audioContext.currentTime)
            } else {
                gainNode.gain.setValueAtTime(stageMember.volume, audioContext.currentTime)
            }
        }
    }, [
        audioContext,
        gainNode,
        stageMember.volume,
        stageMember.muted,
        customVolume?.volume,
        customVolume?.muted,
    ])

    return (
        <>
            {stageDeviceIds.map((stageDeviceId) => (
                <StageDeviceRenderer
                    key={stageDeviceId}
                    stageDeviceId={stageDeviceId}
                    audioContext={audioContext}
                    destination={gainNode}
                    deviceId={deviceId}
                />
            ))}
        </>
    )
}
const GroupRenderer = ({
    groupId,
    audioContext,
    destination,
    deviceId,
}: {
    groupId: string
    audioContext: IAudioContext
    destination: IAudioNode<IAudioContext>
    deviceId: string
}): JSX.Element => {
    const stageMemberIds = useStageSelector((state) => state.stageMembers.byGroup[groupId] || [])
    const group = useStageSelector<Group>((state) => state.groups.byId[groupId])
    const customVolume = useStageSelector<CustomGroupVolume | undefined>((state) =>
        state.customGroupVolumes.byDeviceAndGroup[deviceId] &&
        state.customGroupVolumes.byDeviceAndGroup[deviceId][groupId]
            ? state.customGroupVolumes.byId[
                  state.customGroupVolumes.byDeviceAndGroup[deviceId][groupId]
              ]
            : undefined
    )
    const [gainNode] = useState<IGainNode<IAudioContext>>(audioContext.createGain())

    useEffect(() => {
        if (destination && gainNode) {
            gainNode.connect(destination)
            return () => {
                gainNode.disconnect(destination)
            }
        }
        return undefined
    }, [gainNode, destination])

    useEffect(() => {
        if (audioContext && gainNode) {
            if (customVolume?.muted) {
                gainNode.gain.setValueAtTime(0, audioContext.currentTime)
            } else if (customVolume?.volume) {
                gainNode.gain.setValueAtTime(customVolume.volume, audioContext.currentTime)
            } else if (group.muted) {
                gainNode.gain.setValueAtTime(0, audioContext.currentTime)
            } else {
                gainNode.gain.setValueAtTime(group.volume, audioContext.currentTime)
            }
        }
    }, [
        audioContext,
        gainNode,
        group.volume,
        group.muted,
        customVolume?.volume,
        customVolume?.muted,
    ])

    return (
        <>
            {stageMemberIds.map((stageMemberId) => (
                <StageMemberRenderer
                    key={stageMemberId}
                    stageMemberId={stageMemberId}
                    audioContext={audioContext}
                    destination={gainNode}
                    deviceId={deviceId}
                />
            ))}
        </>
    )
}

const ListenerRenderer = ({
    audioContext,
    stageDeviceId,
    deviceId,
}: {
    audioContext: IAudioContext
    stageDeviceId: string
    deviceId: string
}): JSX.Element | null => {
    const position = useStageDevicePosition({ stageDeviceId, deviceId })

    useEffect(() => {
        if (audioContext) {
            console.log('[AudioRenderer] Changed position of listener')
            audioContext.listener.positionX.setValueAtTime(position.x, audioContext.currentTime)
            audioContext.listener.positionY.setValueAtTime(position.y, audioContext.currentTime)
            audioContext.listener.positionZ.setValueAtTime(position.z, audioContext.currentTime)
            audioContext.listener.forwardX.setValueAtTime(position.rX, audioContext.currentTime)
            audioContext.listener.forwardY.setValueAtTime(position.rY, audioContext.currentTime)
            audioContext.listener.forwardZ.setValueAtTime(position.rZ, audioContext.currentTime)
        }
    }, [audioContext, position])

    return null
}

const StageRenderer = ({
    stageId,
    audioContext,
    destination,
    deviceId,
}: {
    stageId: string
    audioContext: IAudioContext
    destination: IAudioNode<IAudioContext>
    deviceId: string
}): JSX.Element => {
    const groupIds = useStageSelector((state) => state.groups.byStage[stageId] || [])
    const localStageDeviceId = useStageSelector<string | undefined>(
        (state) =>
            state.stageDevices.byStageAndDevice[stageId] &&
            state.stageDevices.byStageAndDevice[stageId][deviceId]
    )

    return (
        <>
            {localStageDeviceId && (
                <ListenerRenderer
                    audioContext={audioContext}
                    stageDeviceId={localStageDeviceId}
                    deviceId={deviceId}
                />
            )}
            {groupIds.map((groupId) => (
                <GroupRenderer
                    key={groupId}
                    groupId={groupId}
                    audioContext={audioContext}
                    destination={destination}
                    deviceId={deviceId}
                />
            ))}
        </>
    )
}

const AudioRenderProvider = ({ children }: { children: React.ReactNode }) => {
    const [analyser, setAnalyser] = useState<{ [id: string]: IAnalyserNode<IAudioContext> }>({})
    const stageId = useStageSelector<string | undefined>((state) => state.globals.stageId)
    const { audioContext, started, destination } = useAudioContext()
    const localDeviceId = useStageSelector<string | undefined>(
        (state) => state.globals.localDeviceId
    )

    return (
        <Context.Provider value={{ analyser, setAnalyser }}>
            {children}
            {stageId && localDeviceId && audioContext && started && destination && (
                <StageRenderer
                    stageId={stageId}
                    audioContext={audioContext}
                    destination={destination}
                    deviceId={localDeviceId}
                />
            )}
        </Context.Provider>
    )
}

const useAudioRenderer = () => useContext(Context)

export { AudioRenderProvider }

export default useAudioRenderer
