import { call, put, select } from 'redux-saga/effects';
import { GlobalThemeState, setPartialStyles } from '../theme/globalThemeSlice';
import { setSelectedScreen, resetScreensState,setEditorLoad } from '../placeholderScreensSlice';
import { PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';

function* applyThemeAndCycleScreens(action: PayloadAction<any>) {
  const originalSelectedScreen: number = yield select((state: RootState) => state?.screen?.selectedScreen);
  console.log("SAGA ORIGINAL WAS: ", originalSelectedScreen)
  const screens: any[] = yield select((state: RootState) => state?.screen?.screens);

  // Set partial theme styles
  yield put(setPartialStyles(action.payload));

  // Cycle through all screens
  for (let i = 0; i < screens.length; i++) {
    yield put(setSelectedScreen(i));
    yield put(setEditorLoad(screens[i])); // Ensure editor load is set for each screen
    yield call(delay, 200); // Adding delay if needed to simulate the time taken for each screen update
  }

  // Reset to the original selected screen
  yield put(setSelectedScreen(originalSelectedScreen));
  yield put(setEditorLoad(screens[originalSelectedScreen])); // Ensure the editor load is reset correctly
}

// Helper delay function
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// Export the saga
export default applyThemeAndCycleScreens;
