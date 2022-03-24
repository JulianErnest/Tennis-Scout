import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
} from 'react-native';
import React, {useState} from 'react';
import * as Yup from 'yup';
import {Button} from 'react-native-paper';
import Toast from 'react-native-toast-message';

import {Colors} from '../Styles/GlobalStyles';
import AppInputLabel from '../Components/AppInputLabel';
import {navigate} from '../Navigation/NavigationUtils';
import {useAppDispatch} from '../State/hooks';
import {register, RegisterParams} from '../State/Features/me/meSlice';
import {Formik} from 'formik';
import AppErrorText from '../Components/AppErrorText';
import {ScrollView} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';

const Login = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const initialValues: RegisterParams = {
    email: '',
    playerFirstName: '',
    playerLastName: '',
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
    playerFirstName: Yup.string().required('Player first name is required'),
    playerLastName: Yup.string().required('Player last name is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm password is required'),
  });

  function gotoLogin() {
    navigate('Login', {});
  }

  async function confirmRegister(values: RegisterParams) {
    setLoading(true);
    const {email, password, confirmPassword, playerFirstName, playerLastName} =
      values;
    try {
      await dispatch(
        register({
          email,
          playerFirstName,
          playerLastName,
          password,
          confirmPassword,
        }),
      ).unwrap();
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

  async function handleGotoLink() {
    const opened = await Linking.openURL(
      'https://pdfhost.io/v/SOq535NyM_Tennis_Scout_DDSA_Mobile_end_user_licence_agreement',
    );
    console.log(opened);
  }

  return (
    <SafeAreaView>
      <Formik
        validationSchema={SignupSchema}
        initialValues={initialValues}
        onSubmit={values => confirmRegister(values)}>
        {({handleChange, handleSubmit, values, errors, touched}) => {
          return (
            <>
              <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Image
                  source={require('../Assets/logo-full.png')}
                  style={styles.image}
                />
                <AppInputLabel
                  labelColor="black"
                  label="Email"
                  value={values.email}
                  onChange={handleChange('email')}
                  placeholder=""
                  error={errors.email !== ''}
                  height={40}
                  hideText={false}
                  multiline={false}
                />
                {errors.email && touched.email && (
                  <AppErrorText color="red" error={errors.email} />
                )}
                <AppInputLabel
                  labelColor="black"
                  label="First Name of Current Player"
                  value={values.playerFirstName}
                  onChange={handleChange('playerFirstName')}
                  placeholder=""
                  error={errors.playerLastName !== ''}
                  height={40}
                  hideText={false}
                  multiline={false}
                />
                {errors.playerFirstName && touched.playerFirstName && (
                  <AppErrorText color="red" error={errors.playerFirstName} />
                )}
                <AppInputLabel
                  labelColor="black"
                  label="Last Name of Current Player"
                  value={values.playerLastName}
                  onChange={handleChange('playerLastName')}
                  placeholder=""
                  error={errors.playerLastName !== ''}
                  height={40}
                  hideText={false}
                  multiline={false}
                />
                {errors.playerLastName && touched.playerLastName && (
                  <AppErrorText color="red" error={errors.playerLastName} />
                )}
                <Text style={styles.messageText}>
                  DDSA admins will need to verify that you are coaching this
                  player, and may contact your email as part of this process.
                  Your account is pending until this approval occurs. Note this
                  app is only available to coaches that have a player competing
                  in ATP, WTA and ITF level events and have ranking points
                </Text>
                <AppInputLabel
                  labelColor="black"
                  label="Password"
                  value={values.password}
                  onChange={handleChange('password')}
                  placeholder=""
                  error={errors.password !== ''}
                  height={40}
                  hideText={true}
                  textContentType={'oneTimeCode'}
                  multiline={false}
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
                  textContentType={'oneTimeCode'}
                  hideText={true}
                  multiline={false}
                />
                {errors.confirmPassword && touched.confirmPassword && (
                  <AppErrorText color="red" error={errors.confirmPassword} />
                )}
                <View style={styles.row}>
                  <TouchableOpacity
                    onPress={() => setChecked(!checked)}
                    style={!checked ? styles.checked : styles.unchecked}
                  />
                  <Text style={styles.agreeText} onPress={handleGotoLink}>
                    I agree to the end user license agreement.
                  </Text>
                </View>
                <Text onPress={() => gotoLogin()} style={styles.toLogin}>
                  Already have an account?
                </Text>
                <Button
                  labelStyle={styles.buttonLabel}
                  disabled={loading || !checked}
                  loading={loading}
                  onPress={handleSubmit}
                  style={styles.button}
                  mode="contained">
                  Register
                </Button>
              </ScrollView>
            </>
          );
        }}
      </Formik>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  agreeText: {
    textAlign: 'left',
    marginLeft: 10,
    width: 200,
    textDecorationLine: 'underline',
    textDecorationColor: Colors.primary,
  },
  button: {
    width: 220,
    backgroundColor: Colors.primary,
    marginTop: 30,
  },
  buttonLabel: {
    color: 'white',
  },
  checked: {
    backgroundColor: 'lightgray',
    width: 20,
    height: 20,
    borderRadius: 5,
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
  messageText: {
    width: 270,
    fontSize: 10,
    fontStyle: 'italic',
    textAlign: 'justify',
    marginBottom: 20,
  },
  register: {
    borderColor: Colors.primary,
  },
  row: {
    flexDirection: 'row',
    width: 270,
  },
  scroll: {
    marginTop: 20,
  },
  scrollContainer: {
    alignItems: 'center',
    paddingBottom: 70,
    marginVertical: 50,
  },
  unchecked: {
    backgroundColor: Colors.primary,
    width: 20,
    height: 20,
    borderRadius: 5,
  },
  toLogin: {
    marginTop: 20,
    width: 270,
    color: Colors.primary,
  },
});
