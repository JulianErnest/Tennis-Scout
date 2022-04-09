import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import db from '@react-native-firebase/firestore';
import {PreviousPlayers} from '../me/meSlice';
import {RootState} from '../../hooks';

export const updateAccount = createAsyncThunk(
  'accountSlice/update',
  async (params: AccountDetails) => {
    try {
      await db().collection('Coaches').doc(params.uid).update({
        email: params.email,
        coachFirstName: params.coachFirstName,
        coachLastName: params.coachLastName,
        currentFirstName: params.currentFirstName,
        currentLastName: params.currentLastName,
        currentStartDate: params.currentStartDate,
        currentGender: params.currentGender,
        previousPlayers: params.previousPlayers,
      });
      return true;
    } catch (e) {
      console.log('Error updating account accountSlice', e);
      return false;
    }
  },
);

export const getUserDetails = createAsyncThunk(
  'accountSlice/get',
  async (uid: string, thunkApi) => {
    try {
      const doc = await db().collection('Coaches').doc(uid).get();
      return {...doc.data(), uid};
    } catch (e) {
      console.log('Error getting account accountSlice', e);
      return thunkApi.rejectWithValue({err: 'Cant get user details'});
    }
  },
);

export type AccountDetails = {
  email: string;
  coachFirstName: string;
  coachLastName: string;
  currentFirstName: string;
  currentLastName: string;
  currentStartDate: number;
  currentGender: string;
  uid: string;
  previousPlayers: PreviousPlayers[];
};

type InitialState = {
  userAccountDetails: AccountDetails;
  allCoaches: AccountDetails[];
};

const initialState: InitialState = {
  userAccountDetails: {
    email: '',
    coachFirstName: '',
    coachLastName: '',
    currentFirstName: '',
    currentLastName: '',
    currentStartDate: 0,
    currentGender: '',
    uid: '',
    previousPlayers: [],
  },
  allCoaches: [],
};

const accountSlice = createSlice({
  name: 'accountSlice',
  initialState,
  reducers: {
    setAccountDetails(state, {payload}) {
      console.log('Set account details payload', payload);
      state.userAccountDetails = {
        email: payload.email,
        coachFirstName: payload.coachFirstName,
        coachLastName: payload.coachLastName,
        currentFirstName: payload.currentFirstName,
        currentLastName: payload.currentLastName,
        currentStartDate: payload.currentStartDate,
        currentGender: payload.currentGender,
        previousPlayers: payload.previousPlayers,
        uid: payload.uid,
      };
    },
    setAllCoaches(state, action) {
      state.allCoaches = action.payload;
    },
    resetAccount(state) {
      Object.assign(state.userAccountDetails, initialState);
    },
  },
  extraReducers: builder => {
    builder.addCase(getUserDetails.fulfilled, (state, {payload}) => {
      Object.assign(state.userAccountDetails, payload);
    });
  },
});

export const {setAccountDetails, resetAccount, setAllCoaches} =
  accountSlice.actions;

export default accountSlice.reducer;

export const selectUserAccountDetails = (state: RootState) =>
  state.accountReducer.userAccountDetails;
export const selectAllCoaches = (state: RootState) =>
  state.accountReducer.allCoaches;
