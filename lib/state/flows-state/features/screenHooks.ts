// hooks.ts
import { useAppSelector } from '../hooks';
import { selectScreenDetails, selectScreenNames } from './screenSelectors';
import { RootState } from '../store';

export const useScreenNames = () => {
  return useAppSelector((state: RootState) => selectScreenDetails(state));
};

export const useScreensLength = () => {
  return useAppSelector((state: RootState) => selectScreenNames(state)?.length);
}

