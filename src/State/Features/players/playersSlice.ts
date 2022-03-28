import {Platform} from 'react-native';
import storage from '@react-native-firebase/storage';
import rnfs from 'react-native-fs';
import db from '@react-native-firebase/firestore';
import EncryptedStorage from 'react-native-encrypted-storage';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

import {RootState} from '../../hooks';
import {getUserId} from '../me/meSlice';
import {FormValues} from '../match/MatchTypes';

const PLAYERLIST_FILENAME = 'playerList.csv';

const LAST_RETRIEVE_TIMESTAMP_KEY = 'LASTRETRIEVETIMESTAMP';
const STORED_PLAYERS_KEY = 'PLAYERLIST';
const STORED_CUSTOM_PLAYERS_KEY = 'CUSTOM_PLAYERLIST';
const MAX_EXISTING_FILTER = 30;

const playerRatingsPath = db().collection('Player_Rating');
const last_upload_timestamp_collection = db()
  .collection('Player')
  .doc('timestamp');
const coachCustomPlayers = () => {
  return db().collection('Custom_Players');
};

export type PlayerDataList = {
  ranking_date?: string;
  rank?: string;
  player_id: string;
  player_first_name: string;
  player_surname: string;
  player_full_name: string;
};

export type SavedCustomPlayer = {
  player_first_name: string;
  player_surname: string;
  player_full_name: string;
  player_id: string;
};

const PlayerDataListHeaders = [
  'ranking_date',
  'rank',
  'player_id',
  'player_first_name',
  'player_surname',
  'player_full_name',
];

// Generate custom player id
export function generatePlayerId() {
  return `C${Math.trunc(Math.random() * 100000)}`;
}

export async function saveCustomPlayer(params: FormValues) {
  const newCustomPlayer = {
    player_first_name: params.opponentFirstName,
    player_surname: params.opponentLastName,
    player_full_name: `${params.opponentFirstName} ${params.opponentLastName}`,
    player_id: params.playerId,
  } as SavedCustomPlayer;
  console.log('New custom player', newCustomPlayer);
  try {
    await coachCustomPlayers().doc(params.playerId).set(newCustomPlayer);
    const getSavedCustom = await EncryptedStorage.getItem(
      STORED_CUSTOM_PLAYERS_KEY,
    );
    if (getSavedCustom) {
      const customPlayers = JSON.parse(getSavedCustom) as SavedCustomPlayer[];
      customPlayers.push(newCustomPlayer);
      await EncryptedStorage.setItem(
        STORED_CUSTOM_PLAYERS_KEY,
        JSON.stringify(customPlayers),
      );
    } else {
      await EncryptedStorage.setItem(
        STORED_CUSTOM_PLAYERS_KEY,
        JSON.stringify([newCustomPlayer]),
      );
    }
  } catch (e) {
    console.log('Error saving custom player', e);
  }
}

export const getCustomPlayers = createAsyncThunk(
  'playerSlice/getCustomPlayers',
  async (_, thunkApi) => {
    try {
      const getCustomPlayersDB = await coachCustomPlayers().get();
      let arr: SavedCustomPlayer[] = [];
      for (const doc of getCustomPlayersDB.docs) {
        const customPlayer = doc.data();
        const savedCustom: SavedCustomPlayer = {
          player_first_name: customPlayer.player_first_name,
          player_surname: customPlayer.player_surname,
          player_full_name: customPlayer.player_full_name,
          player_id: customPlayer.player_id,
        };
        arr.push(savedCustom);
      }
      EncryptedStorage.setItem(STORED_CUSTOM_PLAYERS_KEY, JSON.stringify(arr));
      thunkApi.dispatch(setCustomPlayers(arr));
    } catch (e) {
      console.log('Error getting custom players', e);
    }
  },
);

export const getCustomPlayersFromLocal = createAsyncThunk(
  'playerSlice/getCustomPlayersLocal',
  async (_, thunkApi) => {
    try {
      const getStored = await EncryptedStorage.getItem(
        STORED_CUSTOM_PLAYERS_KEY,
      );
      if (getStored) {
        const stored = JSON.parse(getStored);
        thunkApi.dispatch(setCustomPlayers(stored));
      }
    } catch (e) {
      console.log('Error getting custom players from local', e);
    }
  },
);

export async function removeCustomPlayersFromLocal() {
  try {
    const storedPlayers = await EncryptedStorage.getItem(
      STORED_CUSTOM_PLAYERS_KEY,
    );
    if (storedPlayers) {
      EncryptedStorage.removeItem(STORED_CUSTOM_PLAYERS_KEY);
    }
  } catch (e) {
    console.log('Error removing custom players from local', e);
  }
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
    console.log('Timestamp doc shouldgetplayerCSV', timestampDoc);
    const serverUploadTime = timestampDoc.data() as any;
    console.log('Server upload time', serverUploadTime);
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
      const getCustomPlayersStorage = await EncryptedStorage.getItem(
        STORED_CUSTOM_PLAYERS_KEY,
      );
      if (getCustomPlayersStorage) {
        const storedCustomPlayers = JSON.parse(getCustomPlayersStorage);
        thunkApi.dispatch(setCustomPlayers(storedCustomPlayers));
      }
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
  customPlayers: PlayerDataList[];
  searchPlayerModalVisibility: boolean;
  filteredPlayers: PlayerDataList[];
};

const initialState: InitialState = {
  players: [],
  searchPlayerModalVisibility: false,
  filteredPlayers: [],
  customPlayers: [],
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
    setCustomPlayers(state, action) {
      state.customPlayers = action.payload;
    },
    setSearchPlayerModalVisibility(state, action) {
      state.searchPlayerModalVisibility = action.payload;
    },
    setFilteredPlayers(state, action) {
      console.log(action.payload);
      const keyword = action.payload.toUpperCase();
      const q1: PlayerDataList[] = [...state.players];
      const q2: PlayerDataList[] = [...state.customPlayers];
      const filteredExisting: PlayerDataList[] = [];
      const filteredCustom: PlayerDataList[] = [];
      let filteredExistingCount = 0;
      for (
        let i = 0;
        i < q1.length && filteredExistingCount < MAX_EXISTING_FILTER;
        i++
      ) {
        if (q1[i].player_full_name.toUpperCase().includes(keyword)) {
          filteredExisting.push(q1[i]);
          filteredExistingCount++;
        }
      }
      for (let i = 0; i < q2.length; i++) {
        if (q2[i].player_full_name.toUpperCase().includes(keyword)) {
          filteredCustom.push(q2[i]);
        }
      }
      state.filteredPlayers = filteredCustom.concat(filteredExisting);
    },
    addCustomPlayerToList(state, action) {
      const {payload} = action;
      const newCustomPlayer = {
        player_first_name: payload.opponentFirstName,
        player_surname: payload.opponentLastName,
        player_full_name: `${payload.opponentFirstName} ${payload.opponentLastName}`,
        player_id: payload.playerId,
      } as SavedCustomPlayer;
      state.customPlayers.push(newCustomPlayer);
    },
  },
});

export const {
  setPlayers,
  setSearchPlayerModalVisibility,
  setFilteredPlayers,
  setCustomPlayers,
  addCustomPlayerToList,
} = playersSlice.actions;

export const selectPlayers = (state: RootState) => state.playerReducer.players;
export const selectSearchPlayerModalVisibility = (state: RootState) =>
  state.playerReducer.searchPlayerModalVisibility;
export const selectFilteredPlayers = (state: RootState) =>
  state.playerReducer.filteredPlayers;

export default playersSlice.reducer;
