import {
  configureStore,
  combineReducers,
  type ThunkAction,
  type Action,
} from '@reduxjs/toolkit';
import logger from 'redux-logger';
import themeReducer from './features/theme-slice';
import commonReducer from './features/common';

const rootReducer = combineReducers({
  theme: themeReducer,
  common: commonReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => {
    return !__IS_PRODUCTION__
      ? getDefaultMiddleware().concat(logger)
      : getDefaultMiddleware();
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export * from './features/common';
export * from './features/theme-slice';
