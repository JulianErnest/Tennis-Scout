import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';

import Confirm from '../Screens/Confirm';
import Login from '../Screens/Login';
import Register from '../Screens/Register';

const Stack = createNativeStackNavigator();

const UnauthenticatedNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="Confirm" component={Confirm} />
    </Stack.Navigator>
  );
};

export default UnauthenticatedNavigation;
