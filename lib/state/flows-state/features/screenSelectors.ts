// selectors.ts
import { RootState } from '../store';
import { ScreenType } from './placeholderScreensSlice';

export const selectScreenNames = (flowId: string) => (state: RootState) =>
  state?.[flowId]?.screen?.screens.map((screen:ScreenType) => screen?.screenName);

export const selectScreenDetails = (flowId: string) => (state: RootState) =>
  state?.[flowId]?.screen?.screens.map((screen: ScreenType) => ({
    screenId: screen?.screenId,
    screenName: screen?.screenName,
  }))
