import ChatMessage from '../../types/model/ChatMessage';
import ServerDeviceEvents from '../../types/ServerDeviceEvents';
import ServerDevicePayloads from '../../types/ServerDevicePayloads';
import AdditionalReducerTypes from '../actions/AdditionalReducerTypes';

function reduceChatMessage(
  state: ChatMessage[] = [],
  action: {
    type: string;
    payload: unknown;
  }
): ChatMessage[] {
  switch (action.type) {
    case ServerDeviceEvents.StageLeft:
    case AdditionalReducerTypes.RESET: {
      return [];
    }
    case ServerDeviceEvents.ChatMessageSend: {
      const chatMessage = action.payload as ServerDevicePayloads.ChatMessageSend;
      return [...state, chatMessage];
    }
    default:
      return state;
  }
}

export default reduceChatMessage;
