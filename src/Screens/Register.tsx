import {Image, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import * as Yup from 'yup';
import {Button} from 'react-native-paper';
import Toast from 'react-native-toast-message';

import {Colors, GlobalStyles} from '../Styles/GlobalStyles';
import AppInputLabel from '../Components/AppInputLabel';
import {navigate} from '../Navigation/NavigationUtils';
import {useAppDispatch} from '../State/hooks';
import {register, RegisterParams} from '../State/Features/me/meSlice';
import {Formik} from 'formik';
import AppErrorText from '../Components/AppErrorText';

const Login = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const initialValues: RegisterParams = {
    email: '',
    password: '',
    confirmPassword: '',
  };

  const SignupSchema = Yup.object().shape({
    email: Yup.string()
      .required('Email is required')
      .email('Invalid email format'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password is too short'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm password is required'),
  });

  function gotoLogin() {
    navigate('Login', {});
  }

  async function confirmRegister(values: RegisterParams) {
    setLoading(true);
    const {email, password, confirmPassword} = values;
    try {
      await dispatch(register({email, password, confirmPassword})).unwrap();
      navigate('Confirm', {});
    } catch (e) {
      Toast.show({
        type: 'error',
        text1: e as string,
        visibilityTime: 3000,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={GlobalStyles.centerView}>
      <Image source={require('../Assets/logo-full.png')} style={styles.image} />
      <Formik
        validationSchema={SignupSchema}
        initialValues={initialValues}
        onSubmit={values => confirmRegister(values)}>
        {({handleChange, handleSubmit, values, errors, touched}) => {
          return (
            <>
              <AppInputLabel
                labelColor="black"
                label="Email"
                value={values.email}
                onChange={handleChange('email')}
                placeholder=""
                error={errors.email !== ''}
                height={40}
              />
              {errors.email && touched.email && (
                <AppErrorText color="red" error={errors.email} />
              )}
              <AppInputLabel
                labelColor="black"
                label="Password"
                value={values.password}
                onChange={handleChange('password')}
                placeholder=""
                error={errors.password !== ''}
                height={40}
              />
              {errors.password && touched.password && (
                <AppErrorText color="red" error={errors.password} />
              )}
              <AppInputLabel
                labelColor="black"
                label="Confirm Password"
                value={values.confirmPassword}
                onChange={handleChange('confirmPassword')}
                placeholder=""
                error={errors.confirmPassword !== ''}
                height={40}
              />
              {errors.confirmPassword && touched.confirmPassword && (
                <AppErrorText color="red" error={errors.confirmPassword} />
              )}
              <Text onPress={() => gotoLogin()} style={styles.toLogin}>
                Already have an account?
              </Text>
              <Button
                disabled={loading}
                loading={loading}
                onPress={handleSubmit}
                style={styles.button}
                mode="contained">
                Register
              </Button>
            </>
          );
        }}
      </Formik>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  button: {
    width: 220,
    backgroundColor: Colors.primary,
    marginTop: 30,
  },
  image: {
    width: 200,
    resizeMode: 'contain',
    height: 180,
    marginBottom: 15,
    marginTop: -50,
  },
  label: {
    color: Colors.primary,
  },
  register: {
    borderColor: Colors.primary,
  },
  toLogin: {
    marginRight: 100,
    color: Colors.primary,
  },
});
