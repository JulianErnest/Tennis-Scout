import React, {useEffect} from 'react';
import {Alert, Linking, Platform} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-redux';
import Toast from 'react-native-toast-message';
import DeviceInfo from 'react-native-device-info';

import {navigationRef} from './src/Navigation/NavigationUtils';
import store from './src/State/store';
import MainNavigator from './src/Navigation/MainNavigator';
import {getLatestVersion} from './src/State/Features/appVersion/appVersionSlice';

const App = () => {
  const checkDeviceVersion = () => {
    return DeviceInfo.getVersion();
  };

  const checkLatestVersion = async () => {
    const v = await getLatestVersion(Platform.OS);
    return v;
  };

  function handleUpdate() {
    if (Platform.OS === 'android') {
      Linking.openURL('market://details?id=googoo.android.btgps');
    } else {
      const link =
        'itms-apps://itunes.apple.com/app/apple-store/id1612769870?mt=8';
      Linking.canOpenURL(link).then(supported => {
        if (supported) {
          Linking.openURL(link);
        } else {
          console.log('asd');
        }
      });
    }
  }

  useEffect(() => {
    const bootstrapAsync = async () => {
      const myV = checkDeviceVersion();
      const latestV = await checkLatestVersion();
      if (!latestV) {
        return;
      }
      if (myV !== latestV) {
        Alert.alert(
          'New version is available',
          'New bug fixes and improvements await',
          [
            {
              text: 'No, thanks',
              onPress: () => console.log('Cancel Pressed'),
              style: 'destructive',
            },
            {
              text: 'Update',
              onPress: () => handleUpdate(),
              style: 'default',
            },
          ],
        );
      }
    };
    bootstrapAsync();
  }, []);

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
