import { ChatMessages } from "../collections/ChatMessages";
import ServerDeviceEvents from "../../types/ServerDeviceEvents";
import ServerDevicePayloads from "../../types/ServerDevicePayloads";
import AdditionalReducerTypes from "../actions/AdditionalReducerTypes";

function reduceChatMessage(
  state: ChatMessages = [],
  action: {
    type: string;
    payload: unknown;
  }
): ChatMessages {
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
