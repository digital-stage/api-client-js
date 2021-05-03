import { ChatMessage, ServerDeviceEvents, ServerDevicePayloads } from '@digitalstage/api-types'
import AdditionalReducerTypes from '../actions/AdditionalReducerTypes'

function reduceChatMessage(
    state: ChatMessage[] = [],
    action: {
        type: string
        payload: unknown
    }
): ChatMessage[] {
    switch (action.type) {
        case ServerDeviceEvents.StageLeft:
        case AdditionalReducerTypes.RESET: {
            return []
        }
        case ServerDeviceEvents.ChatMessageSend: {
            const chatMessage = action.payload as ServerDevicePayloads.ChatMessageSend
            return [...state, chatMessage]
        }
        default:
            return state
    }
}

export default reduceChatMessage
