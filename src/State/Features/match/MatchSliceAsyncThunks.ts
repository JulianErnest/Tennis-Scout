import {createAsyncThunk} from '@reduxjs/toolkit';
import db from '@react-native-firebase/firestore';

import {RootState} from '../../hooks';
import {getUserId} from '../me/meSlice';
import {ratePlayer} from '../players/playersSlice';
import {FormValues, MatchDetails} from './MatchTypes';

const playerMatchesPath = (playerId: string, shareable: boolean) =>
  db()
    .collection('Player_Matches')
    .doc(playerId)
    .collection(shareable ? 'Public' : 'Private');

const coachPlayerNotesPath = (coachId: string) =>
  db().collection('Coach_Player_Notes').doc(coachId).collection('Notes');

const matchesPath = () => db().collection('Matches');
const playerRatingsPath = (playerId: string, matchId: string) =>
  db()
    .collection('Player_Rating')
    .doc(playerId)
    .collection('Notes')
    .doc(matchId);

export const submitMatchNotes = createAsyncThunk(
  'match/submit',
  async (params: FormValues, thunkApi) => {
    try {
      const state = thunkApi.getState() as RootState;
      const match = await db()
        .collection('Matches')
        .add({
          ...params,
          playerFirstName: state.meReducer.currentUser.currentFirstName,
          playerLastName: state.meReducer.currentUser.currentLastName,
          dateCreated: Date.now(),
          coachId: getUserId(),
          coachFirstName: state.meReducer.currentUser.coachFirstName,
          coachLastName: state.meReducer.currentUser.coachLastName,
        });
      await Promise.all([
        // Updates last note for the dashboard
        await db().collection('Coaches').doc(getUserId()).update({
          lastOpponentLastName: params.opponentLastName,
          lastOpponentTournament: params.tournamentName,
        }),
        // Creates new reference to all of the player's matches
        await playerMatchesPath(params.playerId, params.isShareable)
          .doc(match.id)
          .set({
            matchId: true,
          }),
        await addCoachNote(match.id),
        await ratePlayer(params),
      ]);
      return true;
    } catch (error) {
      console.log('Error submit match notes matchinputslice', error);
      return thunkApi.rejectWithValue(
        'Unable to create match note at the moment',
      );
    }
  },
);

export const editMatchNotes = createAsyncThunk(
  'match/edit',
  async (params: MatchDetails, thunkApi) => {
    try {
      await db().collection('Matches').doc(params.matchId).update(params);
      await playerRatingsPath(params.playerId, params.matchId).update({
        serve: params.serve.rating,
        forehand: params.forehand.rating,
        backhand: params.backhand.rating,
        movement: params.movement.rating,
        volleyAndNetPlay: params.volleysAndNetPlay.rating,
      });
      return true;
    } catch (e) {
      console.log('Error editting match notes', e);
      thunkApi.rejectWithValue(false);
    }
  },
);

export const getCoachNotes = createAsyncThunk(
  'match/getCoachNotes',
  async (coachId: string, thunkApi) => {
    try {
      const getCoachNoteIds = await coachPlayerNotesPath(coachId).get();
      const coachNoteIds = getCoachNoteIds.docs.map(x => x.id);
      const matches: MatchDetails[] = [];
      for (const id of coachNoteIds) {
        const getMatch = await matchesPath().doc(id).get();
        const match = getMatch.data();
        matches.push({...match, matchId: id} as MatchDetails);
      }
      return matches;
    } catch (e) {
      console.log('Error gettign coach notes', e);
      return thunkApi.rejectWithValue('Unable to get notes');
    }
  },
);

// Creates new reference to all of the matches of the coach
export async function addCoachNote(id: string) {
  try {
    await coachPlayerNotesPath(getUserId()).doc(id).set({
      matchId: true,
    });
  } catch (e) {
    console.log('Error adding coach note', e);
  }
}

export async function deleteMatchFromPublic(playerId: string, matchId: string) {
  try {
    await playerMatchesPath(playerId, true).doc(matchId).delete();
    await playerMatchesPath(playerId, false).doc(matchId).set({matchId: true});
  } catch (e) {
    console.log('Error deleting match from public', e);
  }
}

export async function deleteMatchFromPrivate(
  playerId: string,
  matchId: string,
) {
  try {
    await playerMatchesPath(playerId, false).doc(matchId).delete();
    await playerMatchesPath(playerId, true).doc(matchId).set({matchId: true});
  } catch (e) {
    console.log('Error deleting match from private', e);
  }
}
