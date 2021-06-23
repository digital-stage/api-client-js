import Cookie from 'js-cookie'
import { MediasoupDevice, WebMediaDevice } from '@digitalstage/api-types'

const getInitialDevice = async (
    permanent: boolean
): Promise<Partial<Omit<MediasoupDevice, '_id'>>> => {
    const uuid = Cookie.get('device')
    if (navigator !== undefined) {
        const inputAudioDevices: WebMediaDevice[] = []
        const outputAudioDevices: WebMediaDevice[] = []
        const inputVideoDevices: WebMediaDevice[] = []
        const devices = await navigator.mediaDevices.enumerateDevices()
        devices.forEach((mediaDevice) => {
            switch (mediaDevice.kind) {
                case 'audioinput': {
                    inputAudioDevices.push({
                        id: mediaDevice.deviceId,
                        label: mediaDevice.label,
                    })
                    break
                }
                case 'audiooutput': {
                    outputAudioDevices.push({
                        id: mediaDevice.deviceId,
                        label: mediaDevice.label,
                    })
                    break
                }
                case 'videoinput': {
                    inputVideoDevices.push({
                        id: mediaDevice.deviceId,
                        label: mediaDevice.label,
                    })
                    break
                }
                default:
                    break
            }
        })
        return {
            uuid,
            requestSession: permanent && !uuid,
            type: 'mediasoup',
            inputAudioDevices,
            outputAudioDevices,
            inputVideoDevices,
            canAudio: outputAudioDevices.length > 0 || inputAudioDevices.length > 0,
            canVideo: inputVideoDevices.length > 0,
            receiveAudio: true,
        }
    }
    return {
        type: 'node',
        uuid,
        requestSession: permanent && !uuid,
        receiveAudio: true,
    }
}
export default getInitialDevice
