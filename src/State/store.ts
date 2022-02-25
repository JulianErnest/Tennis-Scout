import {configureStore} from '@reduxjs/toolkit';
import meReducer from './Features/me/meSlice';
import applicationsReducer from './Features/applications/applicationsSlice';
const store = configureStore({
  reducer: {
    meReducer,
    applicationsReducer,
  },
});

export default store;
