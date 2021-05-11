import { Store } from 'redux'
import { TeckosClient } from 'teckos-client'
import Cookie from 'js-cookie'
import {
    ClientDeviceEvents,
    MediasoupDevice,
    ServerDeviceEvents,
    ServerDevicePayloads,
} from '@digitalstage/api-types'
import allActions from './actions'

const registerSocketHandler = (store: Store, socket: TeckosClient): TeckosClient => {
    // socket.setMaxListeners(70);
    socket.on('disconnect', () => {
        // Cleanup
        store.dispatch(allActions.client.reset())
    })

    socket.on(ServerDeviceEvents.Ready, () => {
        store.dispatch(allActions.server.setReady())
    })

    socket.on(
        ServerDeviceEvents.LocalDeviceReady,
        (payload: ServerDevicePayloads.LocalDeviceReady) => {
            store.dispatch(allActions.deviceActions.server.handleLocalDeviceReady(payload))
            // Store device for later
            if (payload.requestSession && payload.uuid) {
                Cookie.set('device', payload.uuid)
            }
            // Set default media device selections if necessary
            const device = payload as MediasoupDevice
            let update = {}
            if (!device.inputVideoDeviceId && device.inputVideoDevices.length > 0) {
                update = {
                    ...update,
                    // Prefer default device
                    inputVideoDeviceId: device.inputVideoDevices.find((d) => d.id === 'default')
                        ? 'default'
                        : device.inputVideoDevices[0].id,
                }
            }
            if (!device.inputAudioDeviceId && device.inputAudioDevices.length > 0) {
                update = {
                    ...update,
                    // Prefer default device
                    inputAudioDeviceId: device.inputAudioDevices.find((d) => d.id === 'default')
                        ? 'default'
                        : device.inputAudioDevices[0].id,
                }
            }
            if (!device.outputAudioDeviceId && device.outputAudioDevices.length > 0) {
                update = {
                    ...update,
                    // Prefer default device
                    outputAudioDeviceId: device.outputAudioDevices.find((d) => d.id === 'default')
                        ? 'default'
                        : device.outputAudioDevices[0].id,
                }
            }
            if (Object.keys(update).length > 0) {
                socket.emit(ClientDeviceEvents.ChangeDevice, {
                    _id: device._id,
                    ...update,
                })
            }
        }
    )

    socket.on(ServerDeviceEvents.UserReady, (payload: ServerDevicePayloads.UserReady) => {
        store.dispatch(allActions.server.handleUserReady(payload))
    })

    socket.on(ServerDeviceEvents.UserChanged, (payload: ServerDevicePayloads.UserChanged) => {
        store.dispatch(allActions.server.changeUser(payload))
    })

    socket.on(ServerDeviceEvents.DeviceAdded, (payload: ServerDevicePayloads.DeviceAdded) => {
        store.dispatch(allActions.deviceActions.server.addDevice(payload))
    })
    socket.on(ServerDeviceEvents.DeviceChanged, (payload: ServerDevicePayloads.DeviceChanged) => {
        store.dispatch(allActions.deviceActions.server.changeDevice(payload))
    })
    socket.on(ServerDeviceEvents.DeviceRemoved, (payload: ServerDevicePayloads.DeviceRemoved) => {
        store.dispatch(allActions.deviceActions.server.removeDevice(payload))
    })

    socket.on(
        ServerDeviceEvents.RemoteUserAdded,
        (payload: ServerDevicePayloads.RemoteUserAdded) => {
            store.dispatch(allActions.stageActions.server.addRemoteUser(payload))
        }
    )

    socket.on(
        ServerDeviceEvents.RemoteUserChanged,
        (payload: ServerDevicePayloads.RemoteUserChanged) => {
            store.dispatch(allActions.stageActions.server.changeRemoteUser(payload))
        }
    )

    socket.on(
        ServerDeviceEvents.RemoteUserRemoved,
        (payload: ServerDevicePayloads.RemoteUserRemoved) => {
            store.dispatch(allActions.stageActions.server.removeRemoteUser(payload))
        }
    )

    socket.on(
        ServerDeviceEvents.ChatMessageSend,
        (payload: ServerDevicePayloads.ChatMessageSend) => {
            store.dispatch(allActions.stageActions.server.messageSent(payload))
        }
    )

    socket.on(ServerDeviceEvents.StageAdded, (payload: ServerDevicePayloads.StageAdded) => {
        store.dispatch(allActions.stageActions.server.addStage(payload))
    })
    socket.on(ServerDeviceEvents.StageJoined, (payload: ServerDevicePayloads.StageJoined) => {
        store.dispatch(allActions.server.handleStageJoined(payload))
    })
    socket.on(ServerDeviceEvents.StageLeft, () => {
        store.dispatch(allActions.server.handleStageLeft())
    })
    socket.on(ServerDeviceEvents.StageChanged, (payload: ServerDevicePayloads.StageChanged) => {
        store.dispatch(allActions.stageActions.server.changeStage(payload))
    })
    socket.on(ServerDeviceEvents.StageRemoved, (payload: ServerDevicePayloads.StageRemoved) => {
        store.dispatch(allActions.stageActions.server.removeStage(payload))
    })

    socket.on(ServerDeviceEvents.GroupAdded, (payload: ServerDevicePayloads.GroupAdded) => {
        store.dispatch(allActions.stageActions.server.addGroup(payload))
    })
    socket.on(ServerDeviceEvents.GroupChanged, (payload: ServerDevicePayloads.GroupChanged) => {
        store.dispatch(allActions.stageActions.server.changeGroup(payload))
    })
    socket.on(ServerDeviceEvents.GroupRemoved, (payload: ServerDevicePayloads.GroupRemoved) => {
        store.dispatch(allActions.stageActions.server.removeGroup(payload))
    })

    socket.on(
        ServerDeviceEvents.CustomGroupVolumeAdded,
        (payload: ServerDevicePayloads.CustomGroupVolumeAdded) => {
            store.dispatch(allActions.stageActions.server.addCustomGroupVolume(payload))
        }
    )
    socket.on(
        ServerDeviceEvents.CustomGroupVolumeChanged,
        (payload: ServerDevicePayloads.CustomGroupVolumeChanged) => {
            store.dispatch(allActions.stageActions.server.changeCustomGroupVolume(payload))
        }
    )
    socket.on(
        ServerDeviceEvents.CustomGroupVolumeRemoved,
        (payload: ServerDevicePayloads.CustomGroupVolumeRemoved) => {
            store.dispatch(allActions.stageActions.server.removeCustomGroupVolume(payload))
        }
    )
    socket.on(
        ServerDeviceEvents.CustomGroupPositionAdded,
        (payload: ServerDevicePayloads.CustomGroupPositionAdded) => {
            store.dispatch(allActions.stageActions.server.addCustomGroupPosition(payload))
        }
    )
    socket.on(
        ServerDeviceEvents.CustomGroupPositionChanged,
        (payload: ServerDevicePayloads.CustomGroupPositionChanged) => {
            store.dispatch(allActions.stageActions.server.changeCustomGroupPosition(payload))
        }
    )
    socket.on(
        ServerDeviceEvents.CustomGroupPositionRemoved,
        (payload: ServerDevicePayloads.CustomGroupPositionRemoved) => {
            store.dispatch(allActions.stageActions.server.removeCustomGroupPosition(payload))
        }
    )

    socket.on(
        ServerDeviceEvents.StageMemberAdded,
        (payload: ServerDevicePayloads.StageMemberAdded) => {
            store.dispatch(allActions.stageActions.server.addStageMember(payload))
        }
    )
    socket.on(
        ServerDeviceEvents.StageMemberChanged,
        (payload: ServerDevicePayloads.StageMemberChanged) => {
            store.dispatch(allActions.stageActions.server.changeStageMember(payload))
        }
    )
    socket.on(
        ServerDeviceEvents.StageMemberRemoved,
        (payload: ServerDevicePayloads.StageMemberRemoved) => {
            store.dispatch(allActions.stageActions.server.removeStageMember(payload))
        }
    )

    socket.on(
        ServerDeviceEvents.CustomStageMemberVolumeAdded,
        (payload: ServerDevicePayloads.CustomStageMemberVolumeAdded) => {
            store.dispatch(allActions.stageActions.server.addCustomStageMemberVolume(payload))
        }
    )
    socket.on(
        ServerDeviceEvents.CustomStageMemberVolumeChanged,
        (payload: ServerDevicePayloads.CustomStageMemberVolumeChanged) => {
            store.dispatch(allActions.stageActions.server.changeCustomStageMemberVolume(payload))
        }
    )
    socket.on(
        ServerDeviceEvents.CustomStageMemberVolumeRemoved,
        (payload: ServerDevicePayloads.CustomStageMemberVolumeRemoved) => {
            store.dispatch(allActions.stageActions.server.removeCustomStageMemberVolume(payload))
        }
    )
    socket.on(
        ServerDeviceEvents.CustomStageMemberPositionAdded,
        (payload: ServerDevicePayloads.CustomStageMemberPositionAdded) => {
            store.dispatch(allActions.stageActions.server.addCustomStageMemberPosition(payload))
        }
    )
    socket.on(
        ServerDeviceEvents.CustomStageMemberPositionChanged,
        (payload: ServerDevicePayloads.CustomStageMemberPositionChanged) => {
            store.dispatch(allActions.stageActions.server.changeCustomStageMemberPosition(payload))
        }
    )
    socket.on(
        ServerDeviceEvents.CustomStageMemberPositionRemoved,
        (payload: ServerDevicePayloads.CustomStageMemberPositionRemoved) => {
            store.dispatch(allActions.stageActions.server.removeCustomStageMemberPosition(payload))
        }
    )

    socket.on(
        ServerDeviceEvents.StageDeviceAdded,
        (payload: ServerDevicePayloads.StageDeviceAdded) => {
            store.dispatch(allActions.stageActions.server.addStageDevice(payload))
        }
    )
    socket.on(
        ServerDeviceEvents.StageDeviceChanged,
        (payload: ServerDevicePayloads.StageDeviceChanged) => {
            store.dispatch(allActions.stageActions.server.changeStageDevice(payload))
        }
    )
    socket.on(
        ServerDeviceEvents.StageDeviceRemoved,
        (payload: ServerDevicePayloads.StageDeviceRemoved) => {
            store.dispatch(allActions.stageActions.server.removeStageDevice(payload))
        }
    )

    socket.on(
        ServerDeviceEvents.CustomStageDeviceVolumeAdded,
        (payload: ServerDevicePayloads.CustomStageDeviceVolumeAdded) => {
            store.dispatch(allActions.stageActions.server.addCustomStageDeviceVolume(payload))
        }
    )
    socket.on(
        ServerDeviceEvents.CustomStageDeviceVolumeChanged,
        (payload: ServerDevicePayloads.CustomStageDeviceVolumeChanged) => {
            store.dispatch(allActions.stageActions.server.changeCustomStageDeviceVolume(payload))
        }
    )
    socket.on(
        ServerDeviceEvents.CustomStageDeviceVolumeRemoved,
        (payload: ServerDevicePayloads.CustomStageDeviceVolumeRemoved) => {
            store.dispatch(allActions.stageActions.server.removeCustomStageDeviceVolume(payload))
        }
    )
    socket.on(
        ServerDeviceEvents.CustomStageDevicePositionAdded,
        (payload: ServerDevicePayloads.CustomStageDevicePositionAdded) => {
            store.dispatch(allActions.stageActions.server.addCustomStageDevicePosition(payload))
        }
    )
    socket.on(
        ServerDeviceEvents.CustomStageDevicePositionChanged,
        (payload: ServerDevicePayloads.CustomStageDevicePositionChanged) => {
            store.dispatch(allActions.stageActions.server.changeCustomStageDevicePosition(payload))
        }
    )
    socket.on(
        ServerDeviceEvents.CustomStageDevicePositionRemoved,
        (payload: ServerDevicePayloads.CustomStageDevicePositionRemoved) => {
            store.dispatch(allActions.stageActions.server.removeCustomStageDevicePosition(payload))
        }
    )

    socket.on(
        ServerDeviceEvents.VideoTrackAdded,
        (payload: ServerDevicePayloads.VideoTrackAdded) => {
            store.dispatch(allActions.stageActions.server.addVideoTrack(payload))
        }
    )
    socket.on(
        ServerDeviceEvents.VideoTrackChanged,
        (payload: ServerDevicePayloads.VideoTrackChanged) => {
            store.dispatch(allActions.stageActions.server.changeVideoTrack(payload))
        }
    )
    socket.on(
        ServerDeviceEvents.VideoTrackRemoved,
        (payload: ServerDevicePayloads.VideoTrackRemoved) => {
            store.dispatch(allActions.stageActions.server.removeVideoTrack(payload))
        }
    )

    socket.on(
        ServerDeviceEvents.AudioTrackAdded,
        (payload: ServerDevicePayloads.AudioTrackAdded) => {
            store.dispatch(allActions.stageActions.server.addAudioTrack(payload))
        }
    )
    socket.on(
        ServerDeviceEvents.AudioTrackChanged,
        (payload: ServerDevicePayloads.AudioTrackChanged) => {
            store.dispatch(allActions.stageActions.server.changeAudioTrack(payload))
        }
    )
    socket.on(
        ServerDeviceEvents.AudioTrackRemoved,
        (payload: ServerDevicePayloads.AudioTrackRemoved) => {
            store.dispatch(allActions.stageActions.server.removeAudioTrack(payload))
        }
    )

    socket.on(
        ServerDeviceEvents.CustomAudioTrackVolumeAdded,
        (payload: ServerDevicePayloads.CustomAudioTrackVolumeAdded) => {
            store.dispatch(allActions.stageActions.server.addCustomAudioTrackVolume(payload))
        }
    )
    socket.on(
        ServerDeviceEvents.CustomAudioTrackVolumeChanged,
        (payload: ServerDevicePayloads.CustomAudioTrackVolumeChanged) => {
            store.dispatch(allActions.stageActions.server.changeCustomAudioTrackVolume(payload))
        }
    )
    socket.on(
        ServerDeviceEvents.CustomAudioTrackVolumeRemoved,
        (payload: ServerDevicePayloads.CustomAudioTrackVolumeRemoved) => {
            store.dispatch(allActions.stageActions.server.removeCustomAudioTrackVolume(payload))
        }
    )
    socket.on(
        ServerDeviceEvents.CustomAudioTrackPositionAdded,
        (payload: ServerDevicePayloads.CustomAudioTrackPositionAdded) => {
            store.dispatch(allActions.stageActions.server.addCustomAudioTrackPosition(payload))
        }
    )
    socket.on(
        ServerDeviceEvents.CustomAudioTrackPositionChanged,
        (payload: ServerDevicePayloads.CustomAudioTrackPositionChanged) => {
            store.dispatch(allActions.stageActions.server.changeCustomAudioTrackPosition(payload))
        }
    )
    socket.on(
        ServerDeviceEvents.CustomAudioTrackPositionRemoved,
        (payload: ServerDevicePayloads.CustomAudioTrackPositionRemoved) => {
            store.dispatch(allActions.stageActions.server.removeCustomAudioTrackPosition(payload))
        }
    )

    socket.on(ServerDeviceEvents.SoundCardAdded, (payload: ServerDevicePayloads.SoundCardAdded) =>
        store.dispatch({
            type: ServerDeviceEvents.SoundCardAdded,
            payload,
        })
    )
    socket.on(
        ServerDeviceEvents.SoundCardChanged,
        (payload: ServerDevicePayloads.SoundCardChanged) =>
            store.dispatch({
                type: ServerDeviceEvents.SoundCardChanged,
                payload,
            })
    )
    socket.on(
        ServerDeviceEvents.SoundCardRemoved,
        (payload: ServerDevicePayloads.SoundCardRemoved) =>
            store.dispatch({
                type: ServerDeviceEvents.SoundCardRemoved,
                payload,
            })
    )

    return socket
}

export default registerSocketHandler
