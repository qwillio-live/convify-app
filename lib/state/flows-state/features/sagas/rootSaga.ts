import { all, takeLatest } from 'redux-saga/effects';
import applyThemeAndCycleScreens from './themeScreen.saga'; // Adjust the import path as needed

function* rootSaga() {
  yield all([
    takeLatest('APPLY_THEME_AND_CYCLE_SCREENS', applyThemeAndCycleScreens),
    // Add other sagas here using takeEvery, takeLatest, etc.
  ]);
}

export default rootSaga;
