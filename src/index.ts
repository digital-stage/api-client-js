import useDigitalStage, { DigitalStageProvider } from './hooks/useDigitalStage'
import registerSocketHandler from './redux/registerSocketHandler'
import store from './redux/store'
import getInitialDevice from './utils/getInitialDevice'
import { ReducerAction } from './redux/actions'
import { AuthError, AuthUser, ErrorCodes, useAuth } from './hooks/useAuth'
import useConnection from './hooks/useConnection'
import useStageSelector from './hooks/useStageSelector'
import useMediasoup from './hooks/useMediasoup'

export * from '@digitalstage/api-types'
export * from './redux/reducers'

export type { ReducerAction, AuthUser }

export {
    // React specific
    DigitalStageProvider,
    useDigitalStage,
    useConnection,
    useMediasoup,
    useAuth,
    ErrorCodes,
    AuthError,
    useStageSelector,
    // Redux specific
    registerSocketHandler,
    store,
    // Helpers
    getInitialDevice,
}
