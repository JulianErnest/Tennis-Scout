import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import db from '@react-native-firebase/firestore';

import {getUserId} from '../me/meSlice';
import {RootState} from '../../hooks';
import {Total} from './PlayerConstants';
import {Rating, RatingKey} from './PlayerTypes';
import {MatchDetails} from '../match/MatchTypes';

type PlayerRating = {
  serve: number;
  forehand: number;
  backhand: number;
  movement: number;
  volleyAndNetPlay: number;
  coachId: string;
};

type InitialState = {
  otherAverageRating: Rating;
  myAverageRating: Rating;
  fetchingRating: boolean;
  myNumberOfNotes: number;
  otherNumberOfNotes: number;
  playerNotes: MatchDetails[];
  hasRating: boolean;
};

const playerRatingPath = (playerId: string) =>
  db().collection('Player_Rating').doc(playerId).collection('Ratings');
const publicPlayerNotesPath = (playerId: string) =>
  db().collection('Player_Matches').doc(playerId).collection('Public');
const matchesPath = () => db().collection('Matches');

export const getPlayerRatings = createAsyncThunk(
  'searchSlice/getRatings',
  async (playerId: string, thunkApi) => {
    try {
      const playerRatingCol = await playerRatingPath(playerId).get();
      return playerRatingCol.docs.map(x => x.data());
    } catch (e) {
      console.log('Error getting player Ratings', e);
      return thunkApi.rejectWithValue(
        'Unable to fetch ratings for this player',
      );
    }
  },
);

export const getAllPublicPlayerNotes = createAsyncThunk(
  'searchSlice/getNotes',
  async (playerId: string, thunkApi) => {
    console.log('Passed player id', playerId);
    try {
      const getNotes = await publicPlayerNotesPath(playerId).get();
      const notesIds = getNotes.docs.map(x => x.id);
      console.log(notesIds);
      const matches: MatchDetails[] = [];
      for (const id of notesIds) {
        const getMatch = await matchesPath().doc(id).get();
        const match = getMatch.data();
        matches.push({...match, matchId: id} as MatchDetails);
      }
      return matches;
    } catch (e) {
      console.log('Error getting player notes', e);
      return thunkApi.rejectWithValue('Unable to fetch notes for this player');
    }
  },
);

const initialState: InitialState = {
  otherAverageRating: {
    serve: 0,
    forehand: 0,
    backhand: 0,
    movement: 0,
    volleyAndNetPlay: 0,
  },
  myAverageRating: {
    serve: 0,
    forehand: 0,
    backhand: 0,
    movement: 0,
    volleyAndNetPlay: 0,
  },
  myNumberOfNotes: 0,
  otherNumberOfNotes: 0,
  fetchingRating: false,
  playerNotes: [],
  hasRating: false,
};

const searchSlice = createSlice({
  name: 'searchSlice',
  initialState,
  reducers: {
    resetSearch(state) {
      Object.assign(state, initialState);
    },
  },
  extraReducers: builder => {
    builder.addCase(getPlayerRatings.pending, state => {
      state.fetchingRating = true;
    });
    builder.addCase(getPlayerRatings.fulfilled, (state, action) => {
      if (action.payload.length > 0) {
        const myRating: PlayerRating[] = [];
        const otherRating: PlayerRating[] = [];
        const allRatings = action.payload as PlayerRating[];
        for (const rating of allRatings) {
          if (rating.coachId === getUserId()) {
            myRating.push(rating);
          } else {
            otherRating.push(rating);
          }
        }

        const myTotal = {...Total};
        const otherTotal = {...Total};
        for (let i = 0; i < myRating.length; i++) {
          console.log(myRating[i]);
          myTotal.serve += myRating[i].serve;
          myTotal.forehand += myRating[i].forehand;
          myTotal.backhand += myRating[i].backhand;
          myTotal.movement += myRating[i].movement;
          myTotal.volleyAndNetPlay += myRating[i].volleyAndNetPlay;
        }
        for (let i = 0; i < otherRating.length; i++) {
          otherTotal.serve += otherRating[i].serve;
          otherTotal.forehand += otherRating[i].forehand;
          otherTotal.backhand += otherRating[i].backhand;
          otherTotal.movement += otherRating[i].movement;
          otherTotal.volleyAndNetPlay += otherRating[i].volleyAndNetPlay;
        }

        state.myNumberOfNotes = myRating.length;
        state.otherNumberOfNotes = otherRating.length;

        for (const key of Object.keys(myTotal)) {
          const myAvg = (myTotal[key as RatingKey] /= myRating.length);
          const otherAvg = (otherTotal[key as RatingKey] /= otherRating.length);
          myTotal[key as RatingKey] = isNaN(myAvg) ? 0 : myAvg;
          otherTotal[key as RatingKey] = isNaN(otherAvg) ? 0 : otherAvg;
        }
        state.otherAverageRating = {...otherTotal};
        state.myAverageRating = {...myTotal};
        state.hasRating = true;
      } else {
        state.hasRating = false;
        state.otherAverageRating = {...initialState.otherAverageRating};
        state.myAverageRating = {...initialState.myAverageRating};
        state.myNumberOfNotes = 0;
        state.otherNumberOfNotes = 0;
      }
    });
    builder.addCase(getPlayerRatings.rejected, state => {
      state.fetchingRating = false;
    });
    builder.addCase(getAllPublicPlayerNotes.fulfilled, (state, action) => {
      state.playerNotes = action.payload;
    });
  },
});

export const {resetSearch} = searchSlice.actions;

export const selectFetchingRating = (state: RootState) =>
  state.searchReducer.fetchingRating;
export const selectMyRatingAverage = (state: RootState) =>
  state.searchReducer.myAverageRating;
export const selectOtherRatingAverage = (state: RootState) =>
  state.searchReducer.otherAverageRating;
export const selectMyNumberOfNotes = (state: RootState) =>
  state.searchReducer.myNumberOfNotes;
export const selectOtherNumberOfNotes = (state: RootState) =>
  state.searchReducer.otherNumberOfNotes;
export const selectPublicPlayerNotes = (state: RootState) =>
  state.searchReducer.playerNotes;
export const selectHasRating = (state: RootState) =>
  state.searchReducer.hasRating;

export default searchSlice.reducer;
