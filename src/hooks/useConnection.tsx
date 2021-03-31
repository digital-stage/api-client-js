import React, {createContext, useEffect, useState} from "react";
import {useStore} from "react-redux";
import {useAuth} from "./useAuth";
import {ITeckosClient, TeckosClient, TeckosClientWithJWT} from "teckos-client";
import {debug} from "debug";
import registerSocketHandler from "../redux/registerSocketHandler";
import getInitialDevice from "../utils/getInitialDevice";

const d = debug("connection");

type IApiConnectionContext = ITeckosClient | undefined;

const ApiConnectionContext = createContext<IApiConnectionContext>(undefined);

const useConnection = (): IApiConnectionContext => React.useContext<IApiConnectionContext>(ApiConnectionContext);

export const ApiConnectionProvider = (props: { children: React.ReactNode; apiUrl: string }) => {
  const {token} = useAuth();
  const store = useStore();
  const [connection, setConnection] = useState<TeckosClient>();
  const {children, apiUrl} = props;

  useEffect(() => {
    d("useEffect");
    if (store && token) {
      getInitialDevice()
        .then(initialDevice => {
          const socket = new TeckosClientWithJWT(apiUrl, {
              reconnection: true,
              timeout: 1000,
            }, token,
            {
              device: initialDevice,
            });
          registerSocketHandler(store, socket);
          socket.on("connect", () => d("Connected"));
          socket.on("disconnect", () => d("Disconnected"));
          socket.on("reconnect", () => d("Reconnected"));
          d("Connecting...");
          socket.connect();
          setConnection(socket);
        })
    }
  }, [store, token]);

  useEffect(() => {
    if (connection) {
      return () => {
        connection.removeAllListeners();
        connection.disconnect();
      }
    }
    return;
  }, [connection])

  return (
    <ApiConnectionContext.Provider value={connection}>
      {children}
    </ApiConnectionContext.Provider>
  )
}

export default useConnection;