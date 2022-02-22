import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SplashScreen from 'react-native-splash-screen';

import Login from '../Screens/Login';
import Register from '../Screens/Register';
import Confirm from '../Screens/Confirm';

const Stack = createNativeStackNavigator();

const MainNavigator = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="Confirm" component={Confirm} />
    </Stack.Navigator>
  );
};

export default MainNavigator;
