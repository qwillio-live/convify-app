import { configureStore } from '@reduxjs/toolkit'
import screensReducer from './features/placeholderScreensSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      screen: screensReducer,
    },
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
