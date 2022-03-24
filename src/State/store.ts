import {configureStore} from '@reduxjs/toolkit';
import meReducer from './Features/me/meSlice';
import applicationsReducer from './Features/applications/applicationsSlice';
import matchReducer from './Features/match/matchSlice';
import accountReducer from './Features/account/accountSlice';
import playerReducer from './Features/players/playersSlice';

const store = configureStore({
  reducer: {
    meReducer,
    applicationsReducer,
    matchReducer,
    accountReducer,
    playerReducer,
  },
});

export default store;
