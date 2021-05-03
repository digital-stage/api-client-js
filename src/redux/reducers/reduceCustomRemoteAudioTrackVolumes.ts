import omit from 'lodash/omit'
import without from 'lodash/without'
import {
    ServerDevicePayloads,
    ServerDeviceEvents,
    CustomRemoteAudioTrackVolume,
} from '@digitalstage/api-types'
import upsert from '../utils/upsert'
import AdditionalReducerTypes from '../actions/AdditionalReducerTypes'
import CustomRemoteAudioTrackVolumes from '../collections/CustomRemoteAudioTrackVolumes'

const addCustomRemoteAudioTrackVolume = (
    state: CustomRemoteAudioTrackVolumes,
    customRemoteAudioTrack: CustomRemoteAudioTrackVolume
): CustomRemoteAudioTrackVolumes => ({
    ...state,
    byId: {
        ...state.byId,
        [customRemoteAudioTrack._id]: customRemoteAudioTrack,
    },
    byRemoteAudioTrack: {
        ...state.byRemoteAudioTrack,
        [customRemoteAudioTrack.remoteAudioTrackId]: state.byRemoteAudioTrack[
            customRemoteAudioTrack.remoteAudioTrackId
        ]
            ? [
                  ...state.byRemoteAudioTrack[customRemoteAudioTrack.remoteAudioTrackId],
                  customRemoteAudioTrack._id,
              ]
            : [customRemoteAudioTrack._id],
    },
    byDevice: {
        ...state.byDevice,
        [customRemoteAudioTrack.deviceId]: state.byDevice[customRemoteAudioTrack.deviceId]
            ? [...state.byDevice[customRemoteAudioTrack.deviceId], customRemoteAudioTrack._id]
            : [customRemoteAudioTrack._id],
    },
    byDeviceAndRemoteAudioTrack: {
        ...state.byDeviceAndRemoteAudioTrack,
        [customRemoteAudioTrack.deviceId]: {
            ...state.byDeviceAndRemoteAudioTrack[customRemoteAudioTrack.deviceId],
            [customRemoteAudioTrack.remoteAudioTrackId]: customRemoteAudioTrack._id,
        },
    },
    allIds: upsert<string>(state.allIds, customRemoteAudioTrack._id),
})

function reduceCustomRemoteAudioTrackVolumes(
    state: CustomRemoteAudioTrackVolumes = {
        byId: {},
        byDevice: {},
        byRemoteAudioTrack: {},
        byDeviceAndRemoteAudioTrack: {},
        allIds: [],
    },
    action: {
        type: string
        payload: any
    }
): CustomRemoteAudioTrackVolumes {
    switch (action.type) {
        case ServerDeviceEvents.StageLeft:
        case AdditionalReducerTypes.RESET: {
            return {
                byId: {},
                byDevice: {},
                byRemoteAudioTrack: {},
                byDeviceAndRemoteAudioTrack: {},
                allIds: [],
            }
        }
        case ServerDeviceEvents.StageJoined: {
            const {
                customRemoteAudioTrackVolumes,
            } = action.payload as ServerDevicePayloads.StageJoined
            let updatedState = { ...state }
            if (customRemoteAudioTrackVolumes)
                customRemoteAudioTrackVolumes.forEach((customRemoteAudioTrack) => {
                    updatedState = addCustomRemoteAudioTrackVolume(
                        updatedState,
                        customRemoteAudioTrack
                    )
                })
            return updatedState
        }
        case ServerDeviceEvents.CustomRemoteAudioTrackVolumeAdded: {
            const customGroup = action.payload as ServerDevicePayloads.CustomRemoteAudioTrackVolumeAdded
            return addCustomRemoteAudioTrackVolume(state, customGroup)
        }
        case ServerDeviceEvents.CustomRemoteAudioTrackVolumeChanged: {
            return {
                ...state,
                byId: {
                    ...state.byId,
                    [action.payload._id]: {
                        ...state.byId[action.payload._id],
                        ...action.payload,
                    },
                },
            }
        }
        case ServerDeviceEvents.CustomRemoteAudioTrackVolumeRemoved: {
            const id = action.payload as string
            if (state.byId[id]) {
                // TODO: Why is the line above necessary?
                const { remoteAudioTrackId, deviceId } = state.byId[id]
                return {
                    ...state,
                    byId: omit(state.byId, id),
                    byRemoteAudioTrack: {
                        ...state.byRemoteAudioTrack,
                        [remoteAudioTrackId]: without(
                            state.byRemoteAudioTrack[remoteAudioTrackId],
                            id
                        ),
                    },
                    byDevice: {
                        ...state.byDevice,
                        [deviceId]: without(state.byDevice[deviceId], id),
                    },
                    byDeviceAndRemoteAudioTrack: {
                        ...state.byDeviceAndRemoteAudioTrack,
                        [deviceId]: omit(
                            state.byDeviceAndRemoteAudioTrack[deviceId],
                            remoteAudioTrackId
                        ),
                    },
                    allIds: without<string>(state.allIds, id),
                }
            }
            return state
        }
        default:
            return state
    }
}

export default reduceCustomRemoteAudioTrackVolumes
