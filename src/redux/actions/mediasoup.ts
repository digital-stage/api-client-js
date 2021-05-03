import { MediasoupAudioConsumer, MediasoupVideoConsumer } from '../collections/Mediasoup'
import AdditionalReducerTypes from './AdditionalReducerTypes'

const addMediasoupVideoConsumer = (consumer: MediasoupVideoConsumer) => ({
    type: AdditionalReducerTypes.ADD_MEDIASOUP_VIDEO_CONSUMER,
    payload: consumer,
})
const changeMediasoupVideoConsumer = (update: Partial<MediasoupVideoConsumer>) => ({
    type: AdditionalReducerTypes.CHANGE_MEDIASOUP_VIDEO_CONSUMER,
    payload: update,
})
const removeMediasoupVideoConsumer = (deviceId: string) => ({
    type: AdditionalReducerTypes.REMOVE_MEDIASOUP_VIDEO_CONSUMER,
    payload: deviceId,
})
const addMediasoupAudioConsumer = (consumer: MediasoupAudioConsumer) => ({
    type: AdditionalReducerTypes.ADD_MEDIASOUP_AUDIO_CONSUMER,
    payload: consumer,
})
const changeMediasoupAudioConsumer = (update: Partial<MediasoupAudioConsumer>) => ({
    type: AdditionalReducerTypes.CHANGE_MEDIASOUP_AUDIO_CONSUMER,
    payload: update,
})
const removeMediasoupAudioConsumer = (deviceId: string) => ({
    type: AdditionalReducerTypes.REMOVE_MEDIASOUP_AUDIO_CONSUMER,
    payload: deviceId,
})

const mediasoupActions = {
    addMediasoupVideoConsumer,
    changeMediasoupVideoConsumer,
    removeMediasoupVideoConsumer,
    addMediasoupAudioConsumer,
    changeMediasoupAudioConsumer,
    removeMediasoupAudioConsumer,
}
export default mediasoupActions
