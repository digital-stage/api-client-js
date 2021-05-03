import omit from 'lodash/omit'
import without from 'lodash/without'
import { ServerDeviceEvents, ServerDevicePayloads } from '@digitalstage/api-types'
import LocalVideoTracks from '../collections/LocalVideoTracks'
import upsert from '../utils/upsert'

function reduceLocalVideoTracks(
    state: LocalVideoTracks = {
        byId: {},
        allIds: [],
    },
    action: {
        type: string
        payload: any
    }
): LocalVideoTracks {
    switch (action.type) {
        case ServerDeviceEvents.LocalVideoTrackAdded: {
            const localVideoTrack = action.payload as ServerDevicePayloads.LocalVideoTrackAdded
            return {
                byId: {
                    ...state.byId,
                    [localVideoTrack._id]: localVideoTrack,
                },
                allIds: upsert<string>(state.allIds, localVideoTrack._id),
            }
        }
        case ServerDeviceEvents.LocalVideoTrackChanged: {
            return {
                ...state,
                byId: {
                    ...state.byId,
                    [action.payload._id]: {
                        ...state.byId[action.payload._id],
                        ...(action.payload as ServerDevicePayloads.LocalVideoTrackChanged),
                    },
                },
            }
        }
        case ServerDeviceEvents.LocalVideoTrackRemoved: {
            const id = action.payload as ServerDevicePayloads.LocalVideoTrackRemoved
            if (!state.byId[id]) {
                return state
            }
            return {
                ...state,
                byId: omit(state.byId, id),
                allIds: without<string>(state.allIds, id),
            }
        }
        default:
            return state
    }
}

export default reduceLocalVideoTracks
