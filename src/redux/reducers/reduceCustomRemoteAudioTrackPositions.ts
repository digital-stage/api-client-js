import omit from 'lodash/omit'
import without from 'lodash/without'
import {
    ServerDevicePayloads,
    ServerDeviceEvents,
    CustomRemoteAudioTrackPosition,
} from '@digitalstage/api-types'
import AdditionalReducerTypes from '../actions/AdditionalReducerTypes'
import upsert from '../utils/upsert'
import CustomRemoteAudioTrackPositions from '../collections/CustomRemoteAudioTrackPositions'

const addCustomRemoteAudioTrackPosition = (
    state: CustomRemoteAudioTrackPositions,
    customRemoteAudioTrack: CustomRemoteAudioTrackPosition
): CustomRemoteAudioTrackPositions => ({
    ...state,
    byId: {
        ...state.byId,
        [customRemoteAudioTrack._id]: customRemoteAudioTrack,
    },
    byRemoteAudioTrack: {
        ...state.byRemoteAudioTrack,
        [customRemoteAudioTrack.remoteAudioTrackId]: upsert<string>(
            state.byRemoteAudioTrack[customRemoteAudioTrack.remoteAudioTrackId],
            customRemoteAudioTrack._id
        ),
    },
    byDevice: {
        ...state.byDevice,
        [customRemoteAudioTrack.deviceId]: upsert<string>(
            state.byDevice[customRemoteAudioTrack.deviceId],
            customRemoteAudioTrack._id
        ),
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

function reduceCustomRemoteAudioTrackPositions(
    state: CustomRemoteAudioTrackPositions = {
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
): CustomRemoteAudioTrackPositions {
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
                customRemoteAudioTrackPositions,
            } = action.payload as ServerDevicePayloads.StageJoined
            let updatedState = { ...state }
            if (customRemoteAudioTrackPositions)
                customRemoteAudioTrackPositions.forEach((customRemoteAudioTrack) => {
                    updatedState = addCustomRemoteAudioTrackPosition(
                        updatedState,
                        customRemoteAudioTrack
                    )
                })
            return updatedState
        }
        case ServerDeviceEvents.CustomRemoteAudioTrackPositionAdded: {
            const customGroup = action.payload as ServerDevicePayloads.CustomRemoteAudioTrackPositionAdded
            return addCustomRemoteAudioTrackPosition(state, customGroup)
        }
        case ServerDeviceEvents.CustomRemoteAudioTrackPositionChanged: {
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
        case ServerDeviceEvents.CustomRemoteAudioTrackPositionRemoved: {
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

export default reduceCustomRemoteAudioTrackPositions
