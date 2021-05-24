import { Action, AnyAction } from 'redux'
import { ServerDeviceEvents, ServerDevicePayloads, User } from '@digitalstage/api-types'
import stageActions from './stageActions'
import deviceActions from './deviceActions'
import AdditionalReducerTypes from './AdditionalReducerTypes'
import mediasoupActions from './mediasoup'

export interface ReducerAction extends AnyAction {
    type: string | AdditionalReducerTypes
    payload?: any
}

const changeUser = (user: Partial<User>): ReducerAction => ({
    type: ServerDeviceEvents.UserChanged,
    payload: user,
})
const handleUserReady = (user: ServerDevicePayloads.UserReady): ReducerAction => ({
    type: ServerDeviceEvents.UserReady,
    payload: user,
})
const setReady = (): ReducerAction => ({
    type: ServerDeviceEvents.Ready,
})

const handleStageJoined = (payload: ServerDevicePayloads.StageJoined): ReducerAction => ({
    type: ServerDeviceEvents.StageJoined,
    payload,
})
const handleStageLeft = (): ReducerAction => ({
    type: ServerDeviceEvents.StageLeft,
})

const reset = (): Action<AdditionalReducerTypes> => ({
    type: AdditionalReducerTypes.RESET,
})

const allActions = {
    server: {
        changeUser,
        handleUserReady,
        handleStageJoined,
        handleStageLeft,
        setReady,
    },
    client: {
        reset,
        mediasoupActions,
    },
    stageActions,
    deviceActions,
}
export default allActions
