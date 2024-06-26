import { all, takeEvery, takeLatest } from 'redux-saga/effects';
import applyThemeAndCycleScreens,{applyThemeBackgroundAndCycleScreens,applyHeaderPosition} from './themeScreen.saga'; // Adjust the import path as needed

function* rootSaga() {
  console.log("APPLY HEADER POSITION: ")

  yield all([
    takeEvery('APPLY_THEME_BACKGROUND_AND_CYCLE_SCREENS', applyThemeBackgroundAndCycleScreens),
    takeLatest('APPLY_THEME_AND_CYCLE_SCREENS', applyThemeAndCycleScreens),
    takeEvery('APPLY_HEADER_POSITION', applyHeaderPosition),
    // Add other sagas here using takeEvery, takeLatest, etc.
  ]);
}

export default rootSaga;
