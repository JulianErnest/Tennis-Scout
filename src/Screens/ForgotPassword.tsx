import {SafeAreaView, StyleSheet, Text} from 'react-native';
import React, {useState} from 'react';
import {Button, TextInput} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Feather';

import {Colors, GlobalStyles} from '../Styles/GlobalStyles';
import {useAppDispatch} from '../State/hooks';
import {resetPassword} from '../State/Features/me/meSlice';

const ForgotPassword = () => {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  function handleSendEmail() {
    dispatch(resetPassword(email));
  }
  return (
    <SafeAreaView style={GlobalStyles.centerTopView}>
      <Icon name="inbox" style={styles.icon} />
      <Text style={styles.bigText}>Forgot your password</Text>
      <Text style={styles.smallText}>
        Enter the email address you used to register, and we'll send you
        instructions to reset your password.
      </Text>
      <TextInput
        keyboardType="email-address"
        value={email}
        onChangeText={t => setEmail(t)}
        style={styles.input}
        theme={{colors: {primary: Colors.primary}}}
        placeholder="youremail@mail.com"
      />
      <Button
        disabled={email.length === 0}
        onPress={handleSendEmail}
        labelStyle={styles.label}
        mode="contained"
        color={Colors.primary}
        style={styles.button}>
        Send
      </Button>
    </SafeAreaView>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  bigText: {
    fontWeight: '700',
    fontSize: 25,
    marginTop: 20,
  },
  button: {
    marginTop: 20,
    width: 330,
  },
  icon: {
    color: Colors.primary,
    fontSize: 120,
    marginTop: 100,
  },
  input: {
    height: 50,
    width: 330,
    marginTop: 40,
  },
  label: {
    color: 'white',
  },
  smallText: {
    textAlign: 'center',
    marginHorizontal: 20,
    marginTop: 20,
    fontWeight: '100',
  },
});
