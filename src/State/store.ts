import {configureStore} from '@reduxjs/toolkit';
import meReducer from './Features/meSlice';

const store = configureStore({
  reducer: {
    meReducer,
  },
});

export default store;
