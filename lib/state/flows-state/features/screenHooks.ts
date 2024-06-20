// hooks.ts
import { useAppSelector } from '../hooks';
import { selectScreenDetails, selectScreenNames, selectSelectedCompoenent } from './screenSelectors';
import { RootState } from '../store';

export const useScreenNames = () => {
  return useAppSelector((state: RootState) => selectScreenDetails(state));
};

export const useScreensLength = () => {
  return useAppSelector((state: RootState) => selectScreenNames(state)?.length);
}

export const useSelectedComponent = () => {
  return useAppSelector((state: RootState) => selectSelectedCompoenent(state));
}
