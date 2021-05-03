import SoundCard from '@digitalstage/api-types'

interface SoundCards {
    byId: {
        [id: string]: SoundCard
    }
    allIds: string[]
}

export default SoundCards
