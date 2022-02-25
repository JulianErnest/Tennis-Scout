import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import db from '@react-native-firebase/firestore';
import {RootState} from '../../hooks';

export const acceptApplication = createAsyncThunk(
  'applicationSlice/accept',
  async (application: Application) => {
    try {
      await db().collection('Coaches').doc(application.uid).set({
        email: application.email,
        uid: application.uid,
        profileCreated: false,
        dateAccepted: Date.now(),
      });
      await db().collection('Applications').doc(application.uid).delete();
      return true;
    } catch (e) {
      console.log('Accept application error applicationslice.tsx', e);
      return false;
    }
  },
);

export const rejectApplication = createAsyncThunk(
  'applicationSlice/decline',
  async (application: Application) => {
    try {
      await db().collection('Applications').doc(application.uid).delete();
      return true;
    } catch (e) {
      console.log('Rejec application error applicationSlice.tsx', e);
      return false;
    }
  },
);

export type Application = {
  email: string;
  uid: string;
  applicationDate: number;
};

type InitialState = {
  applications: Application[];
};

const initialState: InitialState = {
  applications: [],
};

const applicationsSlice = createSlice({
  name: 'applicationsSlice',
  initialState,
  reducers: {
    setApplications(state, {payload}) {
      state.applications = payload;
    },
  },
  extraReducers: builder => {},
});

export default applicationsSlice.reducer;

export const {setApplications} = applicationsSlice.actions;

export const selectApplications = (state: RootState) =>
  state.applicationsReducer.applications;
