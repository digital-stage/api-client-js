import React, {createContext} from "react";
import {Provider} from "react-redux";
import {AuthContextProvider, useAuth} from "./useAuth";
import useApiConnection, {ApiConnectionProvider} from "./useApiConnection";
import { store } from "@digitalstage/api-client-js";

interface IDigitalStageContext {

}

const DigitalStageContext = createContext<IDigitalStageContext>({});

export const DigitalStageProvider = (props: { children: React.ReactNode; apiUrl: string, authUrl: string }) => {
  const {children, authUrl, apiUrl} = props;
  return (
    <Provider store={store}>
      <AuthContextProvider authUrl={authUrl}>
        <ApiConnectionProvider apiUrl={apiUrl}>
          {children}
        </ApiConnectionProvider>
      </AuthContextProvider>
    </Provider>)
}

const useDigitalStage = (): IDigitalStageContext => React.useContext<IDigitalStageContext>(DigitalStageContext);

export {
  useAuth,
  useApiConnection,
}

export default useDigitalStage;