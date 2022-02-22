import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import {RootState} from '../hooks';

export type RegisterParams = {
  email: string;
  password: string;
  confirmPassword: string;
};

export type LoginParams = {
  email: string;
  password: string;
};

export const register = createAsyncThunk(
  'meSLice/register',
  async (params: RegisterParams, thunkApi) => {
    try {
      const signUp = await auth().createUserWithEmailAndPassword(
        params.email,
        params.password,
      );
      const {user} = signUp;
      await firestore().collection('Applications').doc(user.uid).set({
        uid: user.uid,
        email: params.email,
        applicationDate: Date.now(),
      });
      await auth().signOut();
      return true;
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        return thunkApi.rejectWithValue(
          'That email address is already in use!',
        );
      }
      if (err.code === 'auth/invalid-email') {
        return thunkApi.rejectWithValue('That email address is invalid!');
      }
      return thunkApi.rejectWithValue(
        'Unable to log-in at the moment, try again later.',
      );
    }
  },
);

export const login = createAsyncThunk(
  'meSLice/register',
  async (params: LoginParams, thunkApi) => {
    try {
      const signUp = await auth().signInWithEmailAndPassword(
        params.email,
        params.password,
      );
      const {user} = signUp;
      const coach = await firestore().collection('Coaches').doc(user.uid).get();
      if (!coach.exists) {
        throw 'Account has not yet been approved';
      }
      await auth().signOut();
      return true;
    } catch (err: any) {
      if (err === 'Account has not yet been approved') {
        return thunkApi.rejectWithValue(err);
      }
      if (err.code === 'auth/invalid-email') {
        return thunkApi.rejectWithValue('That email address is invalid!');
      }
      return thunkApi.rejectWithValue(
        'Unable to log-in at the moment, try again later.',
      );
    }
  },
);

type InitialState = {
  loggingIn: boolean;
};

const initialState: InitialState = {
  loggingIn: false,
};

export const meSlice = createSlice({
  name: 'meSlice',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(register.pending, (state, _) => {
      state.loggingIn = true;
    });
    builder.addCase(register.fulfilled, (state, _) => {
      state.loggingIn = false;
    });
    builder.addCase(register.rejected, (state, _) => {
      state.loggingIn = false;
    });
  },
});

export const selectLoggingIn = (state: RootState) => state.meReducer.loggingIn;

export default meSlice.reducer;
