import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';

import Confirm from '../Screens/Unauthenticated/Confirm';
import ForgotPassword from '../Screens/Unauthenticated/ForgotPassword';
import Login from '../Screens/Unauthenticated/Login';
import Register from '../Screens/Unauthenticated/Register';

const Stack = createNativeStackNavigator();

const UnauthenticatedNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="Confirm" component={Confirm} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
    </Stack.Navigator>
  );
};

export default UnauthenticatedNavigation;
