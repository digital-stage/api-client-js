import useDigitalStage, { DigitalStageProvider } from './hooks/useDigitalStage';
import registerSocketHandler from './redux/registerSocketHandler';
import store from './redux/store';
import getInitialDevice from './utils/getInitialDevice';
import { ReducerAction } from './redux/actions';
import { RootReducer } from './redux/reducers';
import { AuthUser, useAuth } from './hooks/useAuth';
import useConnection from './hooks/useConnection';
import useStageSelector from './hooks/useStageSelector';

export * from './types';

export type { RootReducer, ReducerAction, AuthUser };

export {
  // React specific
  DigitalStageProvider,
  useDigitalStage,
  useConnection,
  useAuth,
  useStageSelector,
  // Redux specific
  registerSocketHandler,
  store,
  // Helpers
  getInitialDevice,
};
