import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather';

import HeaderLeft from '../Components/HeaderLeft';
import {Colors} from '../Styles/GlobalStyles';
import {useAppSelector} from '../State/hooks';
import {selectIsProfileCreated} from '../State/Features/me/meSlice';
import CreateProfile from '../Screens/CreateProfile';
import CoachDashboard from '../Screens/CoachDashboard';
import AllNotes from '../Screens/AllNotes';
import MatchNotes from '../Screens/MatchNotes';
import SearchOpponent from '../Screens/SearchOpponent';
import UpdateAccount from '../Screens/UpdateAccount';

const Tab = createBottomTabNavigator();

const CoachNavigation = () => {
  const profileCreated = useAppSelector(selectIsProfileCreated);

  if (!profileCreated) {
    return <CreateProfile />;
  }

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerLeft: HeaderLeft,
        headerStyle: {backgroundColor: Colors.primary},
        title: 'Tennis Scout',
        headerTitleStyle: {color: 'white'},
        tabBarActiveTintColor: Colors.primary,
        tabBarShowLabel: false,
        tabBarInactiveTintColor: Colors.dityWhite,
        tabBarIcon: ({color, size}) => {
          let iconName;
          if (route.name === 'CoachDashboard') {
            iconName = 'home';
          } else if (route.name === 'MatchNotes') {
            iconName = 'edit';
          } else if (route.name === 'AllNotes') {
            iconName = 'database';
          } else if (route.name === 'SearchOpponent') {
            iconName = 'search';
          } else {
            iconName = 'user';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}>
      <Tab.Screen name="CoachDashboard" component={CoachDashboard} />
      <Tab.Screen name="MatchNotes" component={MatchNotes} />
      <Tab.Screen name="AllNotes" component={AllNotes} />
      <Tab.Screen name="SearchOpponent" component={SearchOpponent} />
      <Tab.Screen name="UpdateAccount" component={UpdateAccount} />
    </Tab.Navigator>
  );
};

export default CoachNavigation;
