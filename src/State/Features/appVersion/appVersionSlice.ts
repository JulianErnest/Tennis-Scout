import {createSlice} from '@reduxjs/toolkit';
import db from '@react-native-firebase/firestore';

const ANDROID_PATH = db().collection('Version').doc('Android');
const IOS_PATH = db().collection('Version').doc('iOS');

import {InitialState} from './types';

const initialState: InitialState = {};

export const getLatestVersion = async (os: string) => {
  try {
    let version = '';
    if (os === 'ios') {
      const iosVersion = (await IOS_PATH.get()).data() as any;
      version = iosVersion.version as unknown as string;
    }
    if (os === 'android') {
      const androidVersion = (await ANDROID_PATH.get()).data() as any;
      version = androidVersion.version as unknown as string;
    }
    return version;
  } catch (e: any) {
    return null;
  }
};

const appVersionSlice = createSlice({
  name: 'appVersionSlice',
  initialState,
  reducers: {},
});

export default appVersionSlice.reducer;
