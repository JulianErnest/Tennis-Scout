import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather';

import AdminDashboard from '../Screens/AdminDashboard';
import HeaderLeft from '../Components/HeaderLeft';
import {Colors} from '../Styles/GlobalStyles';
import PendingApplications from '../Screens/PendingApplications';
import AllMatches from '../Screens/AllMatches';

const Tab = createBottomTabNavigator();

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
          } else if (route.name === 'AllCoaches') {
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
      <Tab.Screen name="AllCoaches" component={AllMatches} />
      <Tab.Screen name="PendingApplications" component={PendingApplications} />
      <Tab.Screen name="AllMatches" component={AllMatches} />
    </Tab.Navigator>
  );
};

export default AdminNavigation;
