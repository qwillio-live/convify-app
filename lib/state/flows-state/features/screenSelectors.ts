// selectors.ts
import { RootState } from '../store';
import { ScreenType } from './placeholderScreensSlice';

export const selectScreenNames = (state: RootState) =>
  state?.screen?.screens.map((screen:ScreenType) => screen?.screenName);
