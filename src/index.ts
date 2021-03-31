import useDigitalStage, {DigitalStageProvider} from "./hooks/useDigitalStage";
import registerSocketHandler from "./redux/registerSocketHandler";
import store from "./redux/store";
import getInitialDevice from "./utils/getInitialDevice";
import { ReducerAction } from "./redux/actions";
import { RootReducer } from "./redux/reducers";
import { AuthUser, useAuth } from "./hooks/useAuth";
import useConnection from "./hooks/useConnection";
import {useSelector} from "react-redux";

export * from './types';

export type {
  RootReducer,
  ReducerAction,
  AuthUser
}

export const useStageSelector = <T>(
  selector: (state: RootReducer) => T,
  equalityFn?: (left: T, right: T) => boolean
): T => useSelector<RootReducer, T>(selector, equalityFn);

export {
  // React specific
  DigitalStageProvider,
  useDigitalStage,
  useConnection,
  useAuth,
  // Redux specific
  registerSocketHandler,
  store,
  // Helpers
  getInitialDevice
}