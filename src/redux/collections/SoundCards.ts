import SoundCard from '../../types/model/SoundCard'

interface SoundCards {
    byId: {
        [id: string]: SoundCard
    }
    allIds: string[]
}

export default SoundCards
