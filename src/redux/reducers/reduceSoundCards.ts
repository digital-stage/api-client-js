import omit from 'lodash/omit'
import { SoundCard, ServerDevicePayloads, ServerDeviceEvents } from '@digitalstage/api-types'
import SoundCards from '../collections/SoundCards'
import upsert from '../utils/upsert'

function reduceSoundCards(
    state: SoundCards = {
        byId: {},
        allIds: [],
    },
    action: {
        type: string
        payload: any
    }
): SoundCards {
    switch (action.type) {
        case ServerDeviceEvents.SoundCardAdded: {
            const soundCard: SoundCard = action.payload as ServerDevicePayloads.SoundCardAdded
            return {
                byId: {
                    ...state.byId,
                    [soundCard._id]: soundCard,
                },
                allIds: upsert<string>(state.allIds, soundCard._id),
            }
        }
        case ServerDeviceEvents.SoundCardChanged: {
            const soundCard = action.payload as ServerDevicePayloads.SoundCardChanged

            return {
                ...state,
                byId: {
                    ...state.byId,
                    [soundCard._id]: {
                        ...state.byId[soundCard._id],
                        ...soundCard,
                    },
                },
            }
        }
        case ServerDeviceEvents.SoundCardRemoved: {
            const removedId: string = action.payload as ServerDevicePayloads.SoundCardRemoved
            return {
                ...state,
                byId: omit(state.byId, removedId),
                allIds: state.allIds.filter((id) => id !== removedId),
            }
        }
        default:
            return state
    }
}

export default reduceSoundCards
