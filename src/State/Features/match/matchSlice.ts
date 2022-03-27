import {createSlice} from '@reduxjs/toolkit';

import {RootState} from '../../hooks';
import {getCoachNotes} from './MatchSliceAsyncThunks';
import {InitialState, MatchDetails} from './MatchTypes';

export type Visibility = 'Public' | 'Private';

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
        (a, b) => b.dateCreated - a.dateCreated,
      ) as MatchDetails[];
    },
    resetMatch(state) {
      Object.assign(state, initialState);
    },
  },
  extraReducers: builder => {
    builder.addCase(getCoachNotes.fulfilled, (state, action) => {
      state.matchNotes = action.payload.sort(
        (a, b) => b.dateCreated - a.dateCreated,
      );
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
