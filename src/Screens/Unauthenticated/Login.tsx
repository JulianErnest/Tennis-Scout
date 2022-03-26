import {Image, StyleSheet, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Button} from 'react-native-paper';
import Toast from 'react-native-toast-message';
import {Formik} from 'formik';
import * as Yup from 'yup';

import {Colors, GlobalStyles} from '../../Styles/GlobalStyles';
import AppInputLabel from '../../Components/AppInputLabel';
import {navigate} from '../../Navigation/NavigationUtils';
import {login} from '../../State/Features/me/meSlice';
import {useAppDispatch} from '../../State/hooks';
import AppErrorText from '../../Components/AppErrorText';
import {
  getSavedUserCredentials,
  saveUserCredentials,
} from '../../Helpers/StorageFunctions';

const Login = () => {
  const dispatch = useAppDispatch();
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(false);
  const formRef = useRef<any>();
  function handleRegister() {
    navigate('Register', {});
  }
  function handleForgot() {
    navigate('ForgotPassword', {});
  }

  async function handleLogin(email: string, password: string) {
    setLoading(true);
    try {
      const response = await dispatch(login({email, password})).unwrap();
      saveUserCredentials(email, password);
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

  useEffect(() => {
    (async () => {
      try {
        const savedCredentials = await getSavedUserCredentials();
        if (savedCredentials) {
          formRef.current.setValues(savedCredentials);
        }
      } catch (e) {
        console.log('Error getting/setting saved credentails');
      }
    })();
  }, []);

  const fields = {
    email: '',
    password: '',
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().required('Email should not be empty'),
    password: Yup.string().required('Password should not be empty'),
  });

  return (
    <View style={GlobalStyles.centerView}>
      <Image
        source={require('../../Assets/logo-full.png')}
        style={styles.image}
      />
      <Formik
        innerRef={formRef as any}
        initialValues={fields}
        onSubmit={form => handleLogin(form.email, form.password)}
        validationSchema={validationSchema}>
        {({handleChange, handleSubmit, errors, touched, values}) => (
          <>
            <AppInputLabel
              height={38}
              labelColor="black"
              label="Email"
              value={values.email}
              onChange={handleChange('email')}
              placeholder=""
              error={false}
              hideText={false}
              multiline={false}
            />
            {errors.email && touched.email && (
              <AppErrorText color="red" error={errors.email} />
            )}
            <AppInputLabel
              error={hasError}
              label="Password"
              onChange={handleChange('password')}
              value={values.password}
              placeholder=""
              labelColor={'black'}
              height={40}
              hideText={true}
              multiline={false}
            />
            {errors.password && touched.password && (
              <AppErrorText color="red" error={errors.password} />
            )}
            <Button
              loading={loading}
              onPress={handleSubmit}
              style={[styles.button, styles.login]}
              mode="contained">
              Login
            </Button>
            <Button
              onPress={handleRegister}
              labelStyle={styles.label}
              style={[styles.button, styles.register]}
              mode="outlined">
              Register
            </Button>
            <Button
              onPress={handleForgot}
              labelStyle={styles.label}
              style={[styles.button, styles.register]}
              mode="outlined">
              Forgot Password
            </Button>
          </>
        )}
      </Formik>
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
