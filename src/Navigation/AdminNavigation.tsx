import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather';
import {createStackNavigator} from '@react-navigation/stack';

import AdminDashboard from '../Screens/AdminDashboard';
import HeaderLeft from '../Components/HeaderLeft';
import {Colors} from '../Styles/GlobalStyles';
import PendingApplications from '../Screens/PendingApplications';
import AllMatches from '../Screens/AllMatches';
import AllCoaches from '../Screens/AllCoaches';
import UpdateAccount from '../Screens/UpdateAccount';
import AllNotes from '../Screens/AllNotes';
import MatchNotes from '../Screens/MatchNotes';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const AllCoachesStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="CoachestList" component={AllCoaches} />
      <Stack.Screen name="CoachProfile" component={UpdateAccount} />
      <Stack.Screen name="CoachNotes" component={AllNotes} />
    </Stack.Navigator>
  );
};

const AllMatchesStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="MatchesList" component={AllMatches} />
      <Stack.Screen name="NoteDetails" component={MatchNotes} />
    </Stack.Navigator>
  );
};

const AdminNavigation = () => {
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
          if (route.name === 'AdminDashboard') {
            iconName = 'home';
          } else if (route.name === 'CoachDetails') {
            iconName = 'users';
          } else if (route.name === 'PendingApplications') {
            iconName = 'user-plus';
          } else {
            iconName = 'file-text';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}>
      <Tab.Screen name="AdminDashboard" component={AdminDashboard} />
      <Tab.Screen name="CoachDetails" component={AllCoachesStack} />
      <Tab.Screen name="PendingApplications" component={PendingApplications} />
      <Tab.Screen name="MatchDetails" component={AllMatchesStack} />
    </Tab.Navigator>
  );
};

export default AdminNavigation;
