import {Platform} from 'react-native';
import storage from '@react-native-firebase/storage';
import rnfs from 'react-native-fs';
import db from '@react-native-firebase/firestore';
import EncryptedStorage from 'react-native-encrypted-storage';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

import {RootState} from '../../hooks';
import {getUserId} from '../me/meSlice';
import {FormValues} from '../match/MatchTypes';

const coachPlayerNotesPath = (coachId: string, opponentId: string) =>
  db()
    .collection('Coach_Player_Notes')
    .doc(coachId)
    .collection('Opponents')
    .doc(opponentId)
    .collection('Matches');
const PLAYERLIST_FILENAME = 'playerList.csv';
const playerRatingsPath = db().collection('Player_Rating');
const LAST_RETRIEVE_TIMESTAMP_KEY = 'LASTRETRIEVETIMESTAMP';
const STORED_PLAYERS_KEY = 'PLAYERLIST';
const last_upload_timestamp_collection = db()
  .collection('Player')
  .doc('timestamp');

export type PlayerDataList = {
  ranking_date: string;
  rank: string;
  player_id: string;
  player_first_name: string;
  player_surname: string;
  player_full_name: string;
};

const PlayerDataListHeaders = [
  'ranking_date',
  'rank',
  'player_id',
  'player_first_name',
  'player_surname',
  'player_full_name',
];

// Creates new reference to all of the matches of the coach against a player
export async function setPlayerMatches(params: FormValues, id: string) {
  try {
    await coachPlayerNotesPath(getUserId(), params.playerId).doc(id).set({
      matchId: true,
    });
  } catch (e) {}
}

// Create new rating entry
export async function ratePlayer(params: FormValues) {
  try {
    await playerRatingsPath.doc(params.playerId).collection('Ratings').add({
      serve: params.serve.rating,
      forehand: params.forehand.rating,
      backhand: params.backhand.rating,
      movement: params.movement.rating,
      volleyAndNetPlay: params.volleysAndNetPlay.rating,
      coachId: getUserId(),
    });
  } catch (e) {
    console.log('Error getting update player ratings', e);
  }
}

export async function shouldGetPlayersCSV() {
  try {
    const timestampDoc = await last_upload_timestamp_collection.get();
    const serverUploadTime = timestampDoc.data() as any;
    const getLastRetrieveTime = await EncryptedStorage.getItem(
      LAST_RETRIEVE_TIMESTAMP_KEY,
    );
    if (!getLastRetrieveTime) {
      await EncryptedStorage.setItem(
        LAST_RETRIEVE_TIMESTAMP_KEY,
        JSON.stringify(serverUploadTime.time),
      );
      return true;
    }
    if (+getLastRetrieveTime !== +serverUploadTime.time) {
      await EncryptedStorage.setItem(
        LAST_RETRIEVE_TIMESTAMP_KEY,
        JSON.stringify(serverUploadTime.time),
      );
      return true;
    }
    return false;
  } catch (e) {
    console.log('Error getting players CSV', e);
    return false;
  }
}

export const getPlayerCSV = createAsyncThunk(
  'playerSlice/getPlayerCSV',
  async (_, thunkApi) => {
    try {
      // TODO tomorrow, check if csv exists and delete to avoid duplicates
      let path = '';
      if (Platform.OS === 'ios') {
        path = `${rnfs.DocumentDirectoryPath}/${PLAYERLIST_FILENAME}`;
      } else {
        path = `${rnfs.DocumentDirectoryPath}/${PLAYERLIST_FILENAME}`;
      }
      const hasPrevious = await rnfs.exists(path);
      if (hasPrevious) {
        console.log('Has previously downloaded', hasPrevious);
        rnfs.unlink(path);
      }
      // Get csv from firebase storage
      const url = await storage()
        .ref('playerData/Player List update.csv')
        .getDownloadURL();
      // Download csv file
      const hasdownloaded = await rnfs.downloadFile({
        fromUrl: url,
        toFile: path,
      }).promise;
      console.log('Has successfully downloaded', hasdownloaded);
      const playerCsv = await rnfs.readFile(path, 'utf8');
      const rows = playerCsv.slice(playerCsv.indexOf('\n') + 1).split('\n');
      const arr = rows.map(row => {
        if (row) {
          const values = row.split(',');
          const el = PlayerDataListHeaders.reduce(
            (object: any, header, index) => {
              object[header] = values[index];
              return object;
            },
            {},
          );
          return el;
        }
      });
      await EncryptedStorage.setItem(STORED_PLAYERS_KEY, JSON.stringify(arr));
      thunkApi.dispatch(setPlayers(arr));
      return arr;
    } catch (e) {
      console.log('Error getting players CSV', e);
    }
  },
);

export const retrievePlayersFromStorage = createAsyncThunk(
  'playerSlice/retrieve',
  async (_, thunkApi) => {
    try {
      const getStoredPlayers = await EncryptedStorage.getItem(
        STORED_PLAYERS_KEY,
      );
      if (getStoredPlayers) {
        const storedPlayers = JSON.parse(getStoredPlayers);
        thunkApi.dispatch(setPlayers(storedPlayers));
      }
    } catch (e) {
      console.log(
        'Line 125 playersSlice line 125, Error retrieving players from loal storage',
        e,
      );
    }
  },
);

type InitialState = {
  players: PlayerDataList[];
  searchPlayerModalVisibility: boolean;
  filteredPlayers: PlayerDataList[];
};

const initialState: InitialState = {
  players: [],
  searchPlayerModalVisibility: false,
  filteredPlayers: [],
};

const playersSlice = createSlice({
  name: 'playersSlice',
  initialState,
  reducers: {
    setPlayers(state, action) {
      state.players = action.payload;
      if (!state.players[state.players.length - 1]) {
        state.players.pop();
      }
    },
    setSearchPlayerModalVisibility(state, action) {
      state.searchPlayerModalVisibility = action.payload;
    },
    setFilteredPlayers(state, action) {
      console.log(action.payload);
      const q: PlayerDataList[] = [...state.players];
      state.filteredPlayers = q.filter(x =>
        x.player_full_name.toUpperCase().includes(action.payload.toUpperCase()),
      );
    },
  },
});

export const {setPlayers, setSearchPlayerModalVisibility, setFilteredPlayers} =
  playersSlice.actions;

export const selectPlayers = (state: RootState) => state.playerReducer.players;
export const selectSearchPlayerModalVisibility = (state: RootState) =>
  state.playerReducer.searchPlayerModalVisibility;
export const selectFilteredPlayers = (state: RootState) =>
  state.playerReducer.filteredPlayers;

export default playersSlice.reducer;
