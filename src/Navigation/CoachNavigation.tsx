import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather';

import HeaderLeft from '../Components/HeaderLeft';
import {Colors} from '../Styles/GlobalStyles';
import {useAppSelector} from '../State/hooks';
import {selectIsProfileCreated} from '../State/Features/me/meSlice';
import MatchNotes from '../Screens/Coach/CreateNoteTab/CreateNote';
import UpdateAccount from '../Screens/Coach/AccountTab/UpdateAccount';
import AllNotes from '../Screens/Coach/AllNotesTab/AllNotes';
import CreateProfile from '../Screens/Coach/Common/CreateProfile';
import CoachDashboard from '../Screens/Coach/DashboardTab/CoachDashboard';
import AllPlayerNotes from '../Screens/Coach/SearchTab/AllPlayerNotes';
import SearchOpponent from '../Screens/Coach/SearchTab/SearchOpponent';
import EditNote from '../Screens/Coach/Common/EditNote';

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
          } else if (route.name === 'AllNotesStack') {
            iconName = 'database';
          } else if (route.name === 'SearchOpponentStack') {
            iconName = 'search';
          } else {
            iconName = 'user';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}>
      <Tab.Screen name="CoachDashboard" component={CoachDashboard} />
      <Tab.Screen name="MatchNotes" component={MatchNotes} />
      <Tab.Screen name="AllNotesStack" component={AllNotesStack} />
      <Tab.Screen name="SearchOpponentStack" component={SearchOpponentStack} />
      <Tab.Screen name="UpdateAccount" component={UpdateAccount} />
    </Tab.Navigator>
  );
};

const Stack = createNativeStackNavigator();

const SearchOpponentStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="SearchOpponent" component={SearchOpponent} />
      <Stack.Screen name="PlayerAllNotes" component={AllPlayerNotes} />
      <Stack.Screen name="EditNote" component={EditNote} />
    </Stack.Navigator>
  );
};

const AllNotesStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="AllNotes" component={AllNotes} />
      <Stack.Screen name="EditNote" component={EditNote} />
    </Stack.Navigator>
  );
};

export default CoachNavigation;
