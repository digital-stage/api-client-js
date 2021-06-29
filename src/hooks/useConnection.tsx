import React, { createContext, useEffect, useState } from 'react'
import { useStore } from 'react-redux'
import { ITeckosClient, TeckosClient, TeckosClientWithJWT } from 'teckos-client'
import { debug } from 'debug'
import { useAuth } from './useAuth'
import registerSocketHandler from '../redux/registerSocketHandler'
import getInitialDevice from '../utils/getInitialDevice'
import {ClientDeviceEvents} from "@digitalstage/api-types";
import AdditionalReducerTypes from "../redux/actions/AdditionalReducerTypes";
import allActions from "../redux/actions";

const d = debug('connection')
const err = d.extend('error')

export type IApiConnectionContext = ITeckosClient | undefined

export const ApiConnectionContext = createContext<IApiConnectionContext>(undefined)

const useConnection = (): IApiConnectionContext =>
    React.useContext<IApiConnectionContext>(ApiConnectionContext)

export const ApiConnectionProvider = (props: { children: React.ReactNode; apiUrl: string }) => {
    const { token } = useAuth()
    const store = useStore()
    const [connection, setConnection] = useState<TeckosClient>()
    const { children, apiUrl } = props

    useEffect(() => {
        if (store && token) {
            let socket: TeckosClient
            getInitialDevice(true)
                .then((initialDevice) => {
                     socket = new TeckosClientWithJWT(
                        apiUrl,
                        {
                            reconnection: true,
                            timeout: 1000,
                        },
                        token,
                        {
                            device: initialDevice,
                        }
                    )
                    socket.setMaxListeners(100)
                    registerSocketHandler(store, socket)
                    socket.on('connect', () => d('Connected'))
                    socket.on('disconnect', () => d('Disconnected'))
                    socket.on('reconnect', () => d('Reconnected'))
                    d('Connecting...')
                    socket.connect()
                    setConnection(socket)
                    return socket
                })
                .catch((error) => err(error))
            return () => {
                if(socket) {
                    socket.removeAllListeners()
                    socket.disconnect()
                    store.dispatch(allActions.client.reset())
                }
            }
        }
        return undefined
    }, [store, token, apiUrl])

    return (
        <ApiConnectionContext.Provider value={connection}>{children}</ApiConnectionContext.Provider>
    )
}

export default useConnection
