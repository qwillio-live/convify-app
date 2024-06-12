// hooks.ts
import { useAppSelector } from '../hooks';
import { selectScreenNames } from './screenSelectors';
import { RootState } from '../store';

export const useScreenNames = () => {
  return useAppSelector((state: RootState) => selectScreenNames(state));
};

export const useScreensLength = () => {
  return useAppSelector((state: RootState) => selectScreenNames(state)?.length);
}

