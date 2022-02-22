import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-redux';
import Toast from 'react-native-toast-message';

import {navigationRef} from './src/Navigation/NavigationUtils';
import store from './src/State/store';
import MainNavigator from './src/Navigation/MainNavigator';

const App = () => {
  return (
    <>
      <Provider store={store}>
        <NavigationContainer ref={navigationRef}>
          <MainNavigator />
        </NavigationContainer>
      </Provider>
      <Toast />
    </>
  );
};

export default App;
