import React, { createContext } from 'react'
import { Provider } from 'react-redux'
import { AuthContextProvider } from './useAuth'
import { ApiConnectionProvider } from './useConnection'
import store from '../redux/store'
import { MediasoupProvider } from './useMediasoup'

interface IDigitalStageContext {}

const DigitalStageContext = createContext<IDigitalStageContext>({})

export const DigitalStageProvider = (props: {
    children: React.ReactNode
    apiUrl: string
    authUrl: string
}) => {
    const { children, authUrl, apiUrl } = props
    return (
        <Provider store={store}>
            <AuthContextProvider authUrl={authUrl}>
                <ApiConnectionProvider apiUrl={apiUrl}>
                    <MediasoupProvider>{children}</MediasoupProvider>
                </ApiConnectionProvider>
            </AuthContextProvider>
        </Provider>
    )
}

const useDigitalStage = (): IDigitalStageContext =>
    React.useContext<IDigitalStageContext>(DigitalStageContext)

export default useDigitalStage
