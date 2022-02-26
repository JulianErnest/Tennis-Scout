import {configureStore} from '@reduxjs/toolkit';
import meReducer from './Features/me/meSlice';
import applicationsReducer from './Features/applications/applicationsSlice';
import matchReducer from './Features/match/matchSlice';

const store = configureStore({
  reducer: {
    meReducer,
    applicationsReducer,
    matchReducer,
  },
});

export default store;
