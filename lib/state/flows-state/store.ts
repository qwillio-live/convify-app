import { configureStore,combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import screensReducer from './features/placeholderScreensSlice';
import themeReducer from './features/theme/globalThemeSlice';

const persistConfig = {
  key: 'root',
  storage,
};
const rootReducer = combineReducers({
  screen: screensReducer,
  theme: themeReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () => {
  const store = configureStore({
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware(
        {
          serializableCheck: {
            ignoredActions: ['persist/PERSIST'],
          },
        }
      ),
    reducer:persistedReducer,
  });
  const persistor = persistStore(store);
  return { store, persistor };
};

export type AppStore = ReturnType<typeof makeStore>['store'];
export type AppPersistor = ReturnType<typeof makeStore>['persistor'];
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
