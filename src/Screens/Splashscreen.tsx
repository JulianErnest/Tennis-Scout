import React, {useEffect} from 'react';
import SplashScreen from 'react-native-splash-screen';
import auth from '@react-native-firebase/auth';

import {useAppDispatch} from '../State/hooks';
import {
  checkUser,
  getLoggedInUser,
  setFetchingUser,
} from '../State/Features/me/meSlice';
import {
  getPlayerCSV,
  retrievePlayersFromStorage,
  shouldGetPlayersCSV,
} from '../State/Features/players/playersSlice';

const Splashscreen = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    (async () => {
      try {
        const shouldGetVal = await shouldGetPlayersCSV();
        if (shouldGetVal) {
          dispatch(getPlayerCSV());
        } else {
          // Loads player list from local storage to memory
          dispatch(retrievePlayersFromStorage());
        }
        const uid = auth().currentUser?.uid ?? '';
        if (uid && uid !== 'dZf0mHnlbAPP1nYENilCmPW0U2C3') {
          await dispatch(getLoggedInUser(uid));
        }
        await dispatch(checkUser());
      } catch (error) {
        console.log('Error fetching user', error);
      } finally {
        SplashScreen.hide();
        dispatch(setFetchingUser(false));
      }
    })();
  }, [dispatch]);

  return <></>;
};

export default Splashscreen;
