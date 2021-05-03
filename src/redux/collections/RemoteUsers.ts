import User from '@digitalstage/api-types'

interface RemoteUsers {
    byId: {
        [id: string]: User
    }
    allIds: string[]
}

export default RemoteUsers
