import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import db from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import {RootState} from '../../hooks';
import {FormValues, InitialState, MatchDetails} from './MatchTypes';

export const submitMatchNotes = createAsyncThunk(
  'match/submit',
  async (params: FormValues, thunkApi) => {
    try {
      const state = thunkApi.getState() as RootState;
      await db()
        .collection('Matches')
        .add({
          ...params,
          playerFirstName: state.meReducer.currentUser.currentFirstName,
          playerLastName: state.meReducer.currentUser.currentLastName,
          dateCreated: Date.now(),
          coachId: auth().currentUser?.uid,
          coachFirstName: state.meReducer.currentUser.coachFirstName,
          coachLastName: state.meReducer.currentUser.coachLastName,
        });
      await db().collection('Coaches').doc(auth().currentUser?.uid).update({
        lastOpponentLastName: params.opponentLastName,
        lastOpponentTournament: params.tournamentName,
      });
      return true;
    } catch (error) {
      console.log('Error submit match notes matchinputslice', error);
      return false;
    }
  },
);

export const editMatchNotes = createAsyncThunk(
  'match/edit',
  async (params: MatchDetails, thunkApi) => {
    try {
      const state = thunkApi.getState() as RootState;
      await db().collection('Matches').doc(params.matchId).update(params);
      if (state.matchReducer.matchNotes[0].matchId === params.matchId) {
        await db().collection('Coaches').doc(params.coachId).update({
          lastOpponentLastName: params.opponentLastName,
          lastOpponentTournament: params.tournamentName,
        });
      }
      return true;
    } catch (e) {
      console.log('Error editting match notes', e);
      return false;
    }
  },
);

export const fetchMatchNotes = createAsyncThunk(
  'match/fetch',
  async (coachId: string) => {
    try {
      const data = await db()
        .collection('Matches')
        .where('coachId', '==', coachId)
        .get();
      const notes: MatchDetails[] = [];
      data.docs.forEach(x =>
        notes.push({...x.data(), matchId: x.id} as MatchDetails),
      );
      return notes;
    } catch (e) {
      console.log('Error fetching notes matchSlice', e);
    }
  },
);

const initialState: InitialState = {
  enableScroll: true,
  matchNotes: [],
  filteredNotes: [],
  hasFetchedNotes: false,
  notesLength: 0,
};

export const matchSlice = createSlice({
  name: 'match',
  initialState,
  reducers: {
    setEnableScroll(state, {payload}) {
      state.enableScroll = payload;
    },
    setMatches(state, {payload}: {payload: MatchDetails[]}) {
      if (!state.hasFetchedNotes) {
        state.hasFetchedNotes = true;
      }
      state.matchNotes = payload.sort(
        (a, b) => a.dateCreated - b.dateCreated,
      ) as MatchDetails[];
    },
    setFilteredNotes(state, {payload}) {
      const q: MatchDetails[] = [...state.matchNotes];
      console.log(q);
      state.filteredNotes = q.filter(
        x =>
          x.opponentFirstName.toUpperCase().includes(payload.toUpperCase()) ||
          x.opponentLastName.toUpperCase().includes(payload.toUpperCase()),
      );
    },
    setAdminMatches(state, {payload}: {payload: MatchDetails[]}) {
      if (!state.hasFetchedNotes) {
        state.hasFetchedNotes = true;
      }
      state.matchNotes = payload.sort(
        (a, b) => a.dateCreated - b.dateCreated,
      ) as MatchDetails[];
    },
    resetMatch(state) {
      Object.assign(state, initialState);
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchMatchNotes.fulfilled, (state, {payload}) => {
      if (!state.hasFetchedNotes) {
        state.hasFetchedNotes = true;
      }
      state.matchNotes = payload?.sort(
        (a, b) => a.dateCreated - b.dateCreated,
      ) as MatchDetails[];
    });
  },
});

export const {
  setEnableScroll,
  setMatches,
  setFilteredNotes,
  resetMatch,
  setAdminMatches,
} = matchSlice.actions;

export default matchSlice.reducer;

export const selectEnableScroll = (state: RootState) =>
  state.matchReducer.enableScroll;
export const selectMatchNotes = (state: RootState) =>
  state.matchReducer.matchNotes;
export const selectFilteredNotes = (state: RootState) =>
  state.matchReducer.filteredNotes;
export const selectHasFetchedNotes = (state: RootState) =>
  state.matchReducer.hasFetchedNotes;
