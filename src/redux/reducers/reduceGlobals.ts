import Cookie from 'js-cookie'
import { ServerDeviceEvents, ServerDevicePayloads, MediasoupDevice } from '@digitalstage/api-types'
import AdditionalReducerTypes from '../actions/AdditionalReducerTypes'
import Globals from '../collections/Globals'

function reduceGlobals(
    state: Globals = {
        ready: false,
        stageId: undefined,
        groupId: undefined,
        localDeviceId: undefined,
        localUserId: undefined,
    },
    action: {
        type: string
        payload: any
    }
): Globals {
    switch (action.type) {
        case AdditionalReducerTypes.RESET: {
            return {
                ready: false,
                stageId: undefined,
                stageMemberId: undefined,
                groupId: undefined,
                localDeviceId: undefined,
                localStageDeviceId: undefined,
                localUserId: undefined,
            }
        }
        case ServerDeviceEvents.Ready:
            return {
                ...state,
                ready: true,
            }
        case ServerDeviceEvents.StageJoined: {
            const { stageId, groupId, stageMemberId, stageDevices } =
                action.payload as ServerDevicePayloads.StageJoined
            if (state.localDeviceId) {
                const localStageDevice = stageDevices.find(
                    (stageDevice) => stageDevice.deviceId === state.localDeviceId
                )
                if (localStageDevice) {
                    return {
                        ...state,
                        stageId,
                        groupId,
                        stageMemberId,
                        localStageDeviceId: localStageDevice._id,
                    }
                }
            }
            return {
                ...state,
                stageId,
                groupId,
            }
        }
        case ServerDeviceEvents.StageLeft:
            return {
                ...state,
                stageId: undefined,
                groupId: undefined,
                stageMemberId: undefined,
                localStageDeviceId: undefined,
            }
        case ServerDeviceEvents.UserReady:
            return {
                ...state,
                localUserId: action.payload._id,
            }
        case ServerDeviceEvents.UserRemoved:
            if (
                state.localUserId &&
                state.localUserId === (action.payload as ServerDevicePayloads.UserRemoved)
            )
                return {
                    ...state,
                    localUserId: undefined,
                }
            return state
        case ServerDeviceEvents.LocalDeviceReady: {
            // Store cookie of uuid
            const payload =
                action.payload as ServerDevicePayloads.LocalDeviceReady as MediasoupDevice
            if (payload.uuid) {
                Cookie.set('device', payload.uuid)
            }
            return {
                ...state,
                localDeviceId: action.payload._id,
            }
        }
        case ServerDeviceEvents.StageDeviceAdded: {
            if (state.localDeviceId) {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                const { _id, deviceId } = action.payload as ServerDevicePayloads.StageDeviceAdded
                if (state.localDeviceId === deviceId)
                    return {
                        ...state,
                        localStageDeviceId: _id,
                    }
            }
            return state
        }
        default: {
            return state
        }
    }
}

export default reduceGlobals
