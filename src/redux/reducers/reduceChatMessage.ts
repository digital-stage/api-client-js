import { ChatMessage, ServerDeviceEvents, ServerDevicePayloads } from '@digitalstage/api-types'
import AdditionalReducerTypes from '../actions/AdditionalReducerTypes'

function reduceChatMessage(
    state: Array<ChatMessage> = [],
    action: {
        type: string
        payload: unknown
    }
): Array<ChatMessage> {
    switch (action.type) {
        case ServerDeviceEvents.StageLeft:
        case AdditionalReducerTypes.RESET: {
            return []
        }
        case ServerDeviceEvents.ChatMessageSend: {
            const msg = action.payload as ServerDevicePayloads.ChatMessageSend
            return [...state, msg]
        }
        default:
            return state
    }
}

export default reduceChatMessage
