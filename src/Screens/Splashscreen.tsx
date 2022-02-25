import React, {useEffect} from 'react';
import SplashScreen from 'react-native-splash-screen';
import auth from '@react-native-firebase/auth';

import {useAppDispatch} from '../State/hooks';
import {
  checkUser,
  getLoggedInUser,
  setFetchingUser,
} from '../State/Features/me/meSlice';

const Splashscreen = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    (async () => {
      const uid = auth().currentUser?.uid ?? '';
      if (uid && uid !== 'dZf0mHnlbAPP1nYENilCmPW0U2C3') {
        await dispatch(getLoggedInUser(uid));
      }
      await dispatch(checkUser());
      SplashScreen.hide();
      dispatch(setFetchingUser(false));
    })();
  }, [dispatch]);

  return <></>;
};

export default Splashscreen;
