import {Image, StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import {Button} from 'react-native-paper';
import Toast from 'react-native-toast-message';

import {Colors, GlobalStyles} from '../Styles/GlobalStyles';
import AppInputLabel from '../Components/AppInputLabel';
import {navigate} from '../Navigation/NavigationUtils';
import {login} from '../State/Features/me/meSlice';
import {useAppDispatch} from '../State/hooks';

const Login = () => {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleRegister() {
    navigate('Register', {});
  }

  async function handleLogin() {
    setLoading(true);
    try {
      const response = await dispatch(login({email, password})).unwrap();
      console.log(response);
    } catch (e) {
      setHasError(true);
      Toast.show({
        type: 'error',
        text1: e as string,
        visibilityTime: 3000,
      });
      setLoading(false);
    }
  }

  return (
    <View style={GlobalStyles.centerView}>
      <Image source={require('../Assets/logo-full.png')} style={styles.image} />
      <AppInputLabel
        error={hasError}
        label="Email"
        value={email}
        onChange={text => setEmail(text)}
        placeholder=""
        labelColor={'black'}
        height={40}
        hideText={false}
      />
      <AppInputLabel
        error={hasError}
        label="Password"
        value={password}
        onChange={text => setPassword(text)}
        placeholder=""
        labelColor={'black'}
        height={40}
        hideText={true}
      />
      <Button
        loading={loading}
        onPress={() => handleLogin()}
        style={[styles.button, styles.login]}
        mode="contained">
        Login
      </Button>
      <Button
        onPress={() => handleRegister()}
        labelStyle={styles.label}
        style={[styles.button, styles.register]}
        mode="outlined">
        Register
      </Button>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  button: {
    width: 220,
    marginVertical: 10,
  },
  image: {
    width: 200,
    resizeMode: 'contain',
    height: 180,
    marginBottom: 40,
  },
  label: {
    color: Colors.primary,
  },
  login: {
    backgroundColor: Colors.primary,
  },
  register: {
    borderColor: Colors.primary,
  },
});
