import { User } from '@digitalstage/api-types'

interface Globals {
    stageId?: string
    groupId?: string
    localDeviceId?: string
    localUser?: User
    ready: boolean
}

export default Globals
