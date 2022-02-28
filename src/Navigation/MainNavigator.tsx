import React from 'react';
import auth from '@react-native-firebase/auth';

import {useAppSelector} from '../State/hooks';
import {selectFetchingUser, selectUserType} from '../State/Features/me/meSlice';
import AdminNavigation from './AdminNavigation';
import UnauthenticatedNavigation from './UnauthenticatedNavigation';
import Splashscreen from '../Screens/Splashscreen';
import CoachNavigation from './CoachNavigation';
import SplashScreen from 'react-native-splash-screen';

const MainNavigator = () => {
  const userType = useAppSelector(selectUserType);
  const fetchingUser = useAppSelector(selectFetchingUser);
  console.log('Current user', auth().currentUser)
  console.log('userType', userType)
  if (fetchingUser) {
    return <Splashscreen />;
  }

  let navigation;

  if (!userType || !auth().currentUser) {
    navigation = <UnauthenticatedNavigation />;
  } else if (userType === 'admin') {
    navigation = <AdminNavigation />;
  } else {
    navigation = <CoachNavigation />;
  }

  return navigation;
};

export default MainNavigator;
