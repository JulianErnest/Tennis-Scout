import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import {RootState} from '../../hooks';
import {getUserType, setUserType} from '../../../Helpers/StorageFunctions';
import {ProfileInput} from '../../../Screens/CreateProfile';

export type RegisterParams = {
  email: string;
  password: string;
  confirmPassword: string;
};

export type LoginParams = {
  email: string;
  password: string;
};

export type PreviousPlayers = {
  firstName: string;
  lastName: string;
  startDate: Date;
  endDate: Date;
  gender: string;
};

export type LoggedInCoach = {
  dateAccepted: number;
  email: string;
  profileCreated: boolean;
  uid: number;
  coachFirstName: string;
  coachLastName: string;
  currentFirstName: string;
  currentLastName: string;
  currentStartDate: string;
  currentGender: string;
  previousPlayers: PreviousPlayers[];
  lastOpponentLastName: string;
  lastOpponentTournament: string;
};

export type UserType = 'admin' | 'coach' | '';

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
      if (user.uid === 'dZf0mHnlbAPP1nYENilCmPW0U2C3') {
        return {type: 'admin'};
      }
      const coach = await firestore().collection('Coaches').doc(user.uid).get();
      if (!coach.exists) {
        throw 'Account has not yet been approved';
      }
      const coachData = {...coach.data()};
      coachData.type = 'coach';
      return coachData;
    } catch (err: any) {
      console.log(err);
      if (err === 'Account has not yet been approved') {
        return thunkApi.rejectWithValue(err);
      }
      if (err.code === 'auth/invalid-email') {
        return thunkApi.rejectWithValue('That email address is invalid!');
      }
      if (err.code === 'auth/user-not-found') {
        return thunkApi.rejectWithValue('Account does not exist');
      }
      return thunkApi.rejectWithValue(
        'Unable to log-in at the moment, try again later.',
      );
    }
  },
);

export const checkUser = createAsyncThunk('meSlice/checkUser', async () => {
  try {
    const userType = await getUserType();
    return userType;
  } catch (e) {
    console.log('Error check user line 88 meSLice.tsx', e);
  }
});

export const getLoggedInUser = createAsyncThunk(
  'meSlice/getLoggedInUser',
  async (uid: string) => {
    console.log('Was called here, delete me later meSlice 127');
    try {
      const doc = await firestore().collection('Coaches').doc(uid).get();
      if (doc.exists) {
        return doc.data();
      }
    } catch (e) {
      console.log('Error get logged in user meSlice', e);
    }
  },
);

export const createProfile = createAsyncThunk(
  'meSlice/createProfile',
  async (params: ProfileInput, thunkApi) => {
    try {
      await firestore()
        .collection('Coaches')
        .doc(auth().currentUser?.uid)
        .update({
          coachFirstName: params.coachFirstName,
          coachLastName: params.coachLastName,
          currentFirstName: params.currentFirstName,
          currentLastName: params.currentLastName,
          currentStartDate: params.currentStartDate,
          currentGender: params.currentGender,
          previousPlayers: params.previousPlayers,
          profileCreated: true,
        });
      const doc = await firestore()
        .collection('Coaches')
        .doc(auth().currentUser?.uid)
        .get();
      return doc.data();
    } catch (e) {
      console.log(e);
      return thunkApi.rejectWithValue({err: 'Unable to create account'});
    }
  },
);

type InitialState = {
  loggingIn: boolean;
  userType: UserType;
  fetchingUser: boolean;
  profileCreated: false;
  currentUser: LoggedInCoach;
};

const initialState: InitialState = {
  loggingIn: false,
  userType: '',
  fetchingUser: true,
  profileCreated: false,
  currentUser: {
    dateAccepted: 0,
    email: '',
    profileCreated: false,
    uid: 0,
    coachFirstName: '',
    coachLastName: '',
    currentFirstName: '',
    currentLastName: '',
    currentStartDate: '',
    currentGender: '',
    previousPlayers: [],
    lastOpponentLastName: '',
    lastOpponentTournament: '',
  },
};

export const meSlice = createSlice({
  name: 'meSlice',
  initialState,
  reducers: {
    setFetchingUser(state, {payload}) {
      state.fetchingUser = payload;
    },
    setShowCreateProfile(state, {payload}) {
      state.profileCreated = payload;
    },
    resetMe(state) {
      Object.assign(state, initialState);
    },
  },
  extraReducers: builder => {
    builder.addCase(login.fulfilled, (state, {payload}) => {
      console.log('Login fulfilled payload', payload);
      if (payload?.type === 'coach') {
        state.profileCreated = payload.profileCreated;
      }
      setUserType(payload?.type);
      state.userType = payload?.type;
      state.loggingIn = false;
      Object.assign(state.currentUser, payload);
    });
    builder.addCase(checkUser.fulfilled, (state, {payload}) => {
      console.log(payload);
      state.userType = payload as UserType;
    });
    builder.addCase(createProfile.fulfilled, (state, {payload}) => {
      console.log('Create profile success payload meslice', payload);
      state.currentUser = payload as LoggedInCoach;
    });
    builder.addCase(getLoggedInUser.fulfilled, (state, {payload}) => {
      console.log('Create profile success payload meslice', payload);
      state.userType = 'coach';
      state.currentUser = payload as LoggedInCoach;
      state.profileCreated = payload?.profileCreated ?? false;
    });
  },
});

export const {setFetchingUser, resetMe} = meSlice.actions;

export const selectLoggingIn = (state: RootState) => state.meReducer.loggingIn;
export const selectUserType = (state: RootState) => state.meReducer.userType;
export const selectIsProfileCreated = (state: RootState) =>
  state.meReducer.profileCreated;
export const selectFetchingUser = (state: RootState) =>
  state.meReducer.fetchingUser;
export const selectUserDetails = (state: RootState) =>
  state.meReducer.currentUser;

export default meSlice.reducer;
