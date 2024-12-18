import { configureStore, combineReducers } from "@reduxjs/toolkit"
import { persistStore, persistReducer } from "redux-persist"
import createSagaMiddleware from "redux-saga"
import rootSaga from "./features/sagas/rootSaga"
import screensReducer from "./features/placeholderScreensSlice"
import themeReducer from "./features/theme/globalThemeSlice"
import newThemeReducer from "./features/theme/globalewTheme"
import newScreeReducer from "./features/newScreens"
import storage from "@/lib/redux-persist-storage"

const sagaMiddleware = createSagaMiddleware()

const persistConfig = {
  key: "root",
  storage,
}
const rootReducer = combineReducers({
  screen: screensReducer,
  theme: themeReducer,
  newTheme: newThemeReducer,
  newScreens: newScreeReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const makeStore = () => {
  const store = configureStore({
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ["persist/PERSIST"],
        },
      }).concat(sagaMiddleware),
    reducer: persistedReducer,
  })
  const persistor = persistStore(store)
  sagaMiddleware.run(rootSaga)
  return { store, persistor }
}

// Configure the non-persistent store
export const makeNoPersistStore = () => {
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(sagaMiddleware),
  })
  sagaMiddleware.run(rootSaga)
  return store
}

// Type definitions for stores and dispatch
export type AppStore = ReturnType<typeof makeStore>["store"]
export type AppPersistor = ReturnType<typeof makeStore>["persistor"]
export type AppNoPersistStore = ReturnType<typeof makeNoPersistStore>
export type RootState = ReturnType<AppStore["getState"]>
export type AppDispatch = AppStore["dispatch"]
