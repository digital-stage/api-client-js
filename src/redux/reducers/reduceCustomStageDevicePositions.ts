import omit from 'lodash/omit'
import without from 'lodash/without'
import upsert from '../utils/upsert'
import AdditionalReducerTypes from '../actions/AdditionalReducerTypes'
import ServerDevicePayloads from '../../types/ServerDevicePayloads'
import ServerDeviceEvents from '../../types/ServerDeviceEvents'
import CustomStageDevicePositions from '../collections/CustomStageDevicePositions'
import CustomStageDevicePosition from '../../types/model/CustomStageDevicePosition'

const addCustomStageDevicePosition = (
    state: CustomStageDevicePositions,
    customStageDevicePosition: CustomStageDevicePosition
): CustomStageDevicePositions => ({
    ...state,
    byId: {
        ...state.byId,
        [customStageDevicePosition._id]: customStageDevicePosition,
    },
    byStageDevice: {
        ...state.byStageDevice,
        [customStageDevicePosition.stageDeviceId]: state.byStageDevice[
            customStageDevicePosition.stageDeviceId
        ]
            ? [
                  ...state.byStageDevice[customStageDevicePosition.stageDeviceId],
                  customStageDevicePosition._id,
              ]
            : [customStageDevicePosition._id],
    },
    byDevice: {
        ...state.byDevice,
        [customStageDevicePosition.deviceId]: state.byDevice[customStageDevicePosition.deviceId]
            ? [...state.byDevice[customStageDevicePosition.deviceId], customStageDevicePosition._id]
            : [customStageDevicePosition._id],
    },
    byDeviceAndStageDevice: {
        ...state.byDeviceAndStageDevice,
        [customStageDevicePosition.deviceId]: {
            ...state.byDeviceAndStageDevice[customStageDevicePosition.deviceId],
            [customStageDevicePosition.stageDeviceId]: customStageDevicePosition._id,
        },
    },
    allIds: upsert<string>(state.allIds, customStageDevicePosition._id),
})

function reduceCustomStageDevicePositions(
    state: CustomStageDevicePositions = {
        byId: {},
        byDevice: {},
        byStageDevice: {},
        byDeviceAndStageDevice: {},
        allIds: [],
    },
    action: {
        type: string
        payload: any
    }
): CustomStageDevicePositions {
    switch (action.type) {
        case ServerDeviceEvents.StageLeft:
        case AdditionalReducerTypes.RESET: {
            return {
                byId: {},
                byDevice: {},
                byStageDevice: {},
                byDeviceAndStageDevice: {},
                allIds: [],
            }
        }
        case ServerDeviceEvents.StageJoined: {
            const {
                customStageDevicePositions,
            } = action.payload as ServerDevicePayloads.StageJoined
            let updatedState = { ...state }
            if (customStageDevicePositions)
                customStageDevicePositions.forEach((customStageDevicePosition) => {
                    updatedState = addCustomStageDevicePosition(
                        updatedState,
                        customStageDevicePosition
                    )
                })
            return updatedState
        }
        case ServerDeviceEvents.CustomStageMemberPositionAdded: {
            const customStageDevicePosition = action.payload as ServerDevicePayloads.CustomStageDevicePositionAdded
            return addCustomStageDevicePosition(state, customStageDevicePosition)
        }
        case ServerDeviceEvents.CustomStageMemberPositionChanged: {
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
        case ServerDeviceEvents.CustomStageMemberPositionRemoved: {
            const id = action.payload as string
            if (state.byId[id]) {
                // TODO: Why is the line above necessary?
                const { stageDeviceId, deviceId } = state.byId[id]
                return {
                    ...state,
                    byId: omit(state.byId, id),
                    byStageDevice: {
                        ...state.byStageDevice,
                        [stageDeviceId]: without(state.byStageDevice[stageDeviceId], id),
                    },
                    byDevice: {
                        ...state.byDevice,
                        [deviceId]: without(state.byDevice[deviceId], id),
                    },
                    byDeviceAndStageDevice: {
                        ...state.byDeviceAndStageDevice,
                        [deviceId]: omit(state.byDeviceAndStageDevice[deviceId], stageDeviceId),
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

export default reduceCustomStageDevicePositions
