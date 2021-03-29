import React, {createContext, useEffect, useState} from "react";
import {useStore} from "react-redux";
import {useAuth} from "./useAuth";
import {ITeckosClient, TeckosClient, TeckosClientWithJWT} from "teckos-client";
import {registerSocketHandler, getInitialDevice} from "@digitalstage/api-client-js";
import {debug} from "debug";

const d = debug("api-connection");

interface IApiConnectionContext {
  socket?: ITeckosClient
}

const ApiConnectionContext = createContext<IApiConnectionContext>({});

const useApiConnection = (): IApiConnectionContext => React.useContext<IApiConnectionContext>(ApiConnectionContext);

export const ApiConnectionProvider = (props: { children: React.ReactNode; apiUrl: string }) => {
  const {token} = useAuth();
  const store = useStore();
  const [socket, setSocket] = useState<TeckosClient>();
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
          setSocket(socket);
        })
    }
  }, [store, token]);

  useEffect(() => {
    if (socket) {
      return () => {
        socket.removeAllListeners();
        socket.disconnect();
      }
    }
  }, [socket])

  return (
    <ApiConnectionContext.Provider value={{
      socket
    }}>
      {children}
    </ApiConnectionContext.Provider>
  )
}

export default useApiConnection;