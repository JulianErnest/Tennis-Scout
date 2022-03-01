import {StyleSheet, Text, ScrollView, View, SafeAreaView} from 'react-native';
import {Button} from 'react-native-paper';
import React, {useEffect, useRef, useState} from 'react';
import {Formik} from 'formik';
import auth from '@react-native-firebase/auth';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/Feather';

import {Colors, GlobalStyles} from '../Styles/GlobalStyles';
import {useAppDispatch, useAppSelector} from '../State/hooks';
import {
  AccountDetails,
  resetAccount,
  selectUserAccountDetails,
  updateAccount,
} from '../State/Features/account/accountSlice';
import AppDatePicker from '../Components/AppDatePicker';
import AppErrorText from '../Components/AppErrorText';
import AppInputLabel from '../Components/AppInputLabel';
import AppRadioButton from '../Components/AppRadioButton';
import {InitialValues} from '../State/Features/account/AccountConstants';
import {getLoggedInUser, resetMe} from '../State/Features/me/meSlice';
import {resetApplications} from '../State/Features/applications/applicationsSlice';
import {resetMatch} from '../State/Features/match/matchSlice';
import {deleteUserType} from '../Helpers/StorageFunctions';
import AppPreviousPlayersAccount from '../Components/AppPreviousPlayersAccount';

const UpdateAccount = ({route}: any) => {
  const dispatch = useAppDispatch();
  const accountDetails = useAppSelector(selectUserAccountDetails);
  const [currPassword, setCurrPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [reauthSuccess, setReauthSuccess] = useState(false);
  const formRef = useRef<any>();
  const userType = route.params?.type;
  console.log(accountDetails);

  useEffect(() => {
    formRef.current.setValues(accountDetails);
  }, [accountDetails]);

  async function handleUpdateAccount(values: AccountDetails) {
    const coachId =
      route.params?.type === 'admin'
        ? route.params.uid
        : auth().currentUser?.uid;
    const val = await dispatch(updateAccount({...values, coachId})).unwrap();
    !route.params?.type && getLoggedInUser(coachId);
    Toast.show({
      type: !val ? 'error' : 'success',
      text1: !val
        ? 'Unable to update coach profile'
        : 'Successfully updated coach profile',
      autoHide: true,
      visibilityTime: 2000,
    });
  }

  async function handleEnterCurrPassword() {
    const emailCred = auth.EmailAuthProvider.credential(
      accountDetails.email,
      currPassword,
    );
    try {
      await auth().currentUser?.reauthenticateWithCredential(emailCred);
      setReauthSuccess(true);
    } catch (e) {
      console.log('Update account error', e);
      Toast.show({
        type: 'error',
        text1: 'Password is invalid',
        autoHide: true,
        visibilityTime: 2000,
      });
    }
  }

  async function handleUpdatePassword() {
    try {
      await auth().currentUser?.updatePassword(newPassword);
      Toast.show({
        type: 'success',
        text1: 'Successfully changed password',
        autoHide: true,
        visibilityTime: 2000,
      });
      setReauthSuccess(false);
      setCurrPassword('');
      setNewPassword('');
    } catch (e) {
      console.log(e);
    }
  }

  async function logout() {
    dispatch(resetApplications());
    dispatch(resetAccount());
    dispatch(resetMatch());
    dispatch(resetMe());
    try {
      auth().signOut();
      deleteUserType();
    } catch (e) {
      console.log('Error logging out', e);
    }
  }

  return (
    <SafeAreaView style={GlobalStyles.centerTopView}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        style={styles.scrollView}>
        <Icon name="log-out" style={styles.logoutIcon} onPress={logout} />
        <Text style={styles.heading}>Account Info</Text>
        {userType !== 'admin' && (
          <>
            <Text style={styles.bigText}>Change password</Text>
            <AppInputLabel
              height={38}
              labelColor="black"
              label="Enter current password to begin"
              value={currPassword}
              onChange={t => setCurrPassword(t)}
              placeholder=""
              error={false}
              hideText={true}
            />
          </>
        )}
        {userType !== 'admin' && !reauthSuccess && (
          <Button
            style={styles.button}
            onPress={handleEnterCurrPassword}
            mode="contained"
            color="black">
            Confirm
          </Button>
        )}
        {userType !== 'admin' && reauthSuccess && (
          <>
            <AppInputLabel
              height={38}
              labelColor="black"
              label="New Password"
              value={newPassword}
              onChange={t => setNewPassword(t)}
              placeholder=""
              error={false}
              hideText={true}
            />
            <Button
              style={styles.button}
              onPress={handleUpdatePassword}
              mode="contained"
              color="black">
              Update Password
            </Button>
          </>
        )}
        <Formik
          onSubmit={values => handleUpdateAccount(values)}
          innerRef={formRef as any}
          initialValues={InitialValues}>
          {({
            values,
            handleSubmit,
            handleChange,
            errors,
            touched,
            setFieldValue,
            setValues,
          }) => (
            <>
              <Text style={styles.bigText}>My Info</Text>
              <AppInputLabel
                height={38}
                labelColor="black"
                label="Email"
                value={accountDetails.email}
                onChange={() => null}
                placeholder=""
                error={errors.coachLastName !== ''}
                hideText={false}
              />
              <AppInputLabel
                height={38}
                labelColor="black"
                label="First Name"
                value={values.coachFirstName}
                onChange={handleChange('coachFirstName')}
                placeholder=""
                error={errors.coachLastName !== ''}
                hideText={false}
              />
              {errors.coachFirstName && touched.coachFirstName && (
                <AppErrorText color="black" error={errors.coachFirstName} />
              )}
              <AppInputLabel
                height={38}
                labelColor="black"
                label="Last Name"
                value={values.coachLastName}
                onChange={handleChange('coachLastName')}
                placeholder=""
                error={errors.coachLastName !== ''}
                hideText={false}
              />
              {errors.coachLastName && touched.coachLastName && (
                <AppErrorText color="black" error={errors.coachLastName} />
              )}
              <Text style={styles.bigText}>Current Player</Text>
              <AppInputLabel
                height={38}
                labelColor="black"
                label="First Name"
                value={values.currentFirstName}
                onChange={handleChange('currentFirstName')}
                placeholder=""
                error={errors.currentFirstName !== ''}
                hideText={false}
              />
              {errors.currentFirstName && touched.currentFirstName && (
                <AppErrorText color="black" error={errors.currentFirstName} />
              )}
              <AppInputLabel
                height={38}
                labelColor="black"
                label="Last Name"
                value={values.currentLastName}
                onChange={handleChange('currentLastName')}
                placeholder=""
                error={errors.currentLastName !== ''}
                hideText={false}
              />
              {errors.currentLastName && touched.currentLastName && (
                <AppErrorText color="black" error={errors.currentLastName} />
              )}
              <AppDatePicker
                date={new Date(values.currentStartDate)}
                setDate={date => {
                  setFieldValue('currentStartDate', date.getTime());
                }}
                label="Start Date"
                labelColor="black"
                value={values.currentStartDate}
              />
              {errors.currentStartDate && touched.currentStartDate && (
                <AppErrorText color="black" error="Start Date is required" />
              )}
              <Text style={styles.genderLabel}>Gender</Text>
              <View style={styles.genderRow}>
                <AppRadioButton
                  checked={values.currentGender === 'male'}
                  checkedColor={Colors.primary}
                  label={'Male'}
                  labelColor={'black'}
                  onPress={() => setFieldValue('currentGender', 'male')}
                />
                <AppRadioButton
                  checked={values.currentGender === 'female'}
                  checkedColor={Colors.primary}
                  label={'Female'}
                  labelColor={'black'}
                  onPress={() => setFieldValue('currentGender', 'female')}
                />
              </View>
              {errors.currentGender && touched.currentGender && (
                <AppErrorText color="black" error={errors.currentGender} />
              )}
              <Text style={styles.bigText}>Previous Player/s</Text>
              {values.previousPlayers && (
                <AppPreviousPlayersAccount
                  touched={touched}
                  values={values}
                  setValues={setValues}
                  handleChange={handleChange}
                  errors={errors}
                  setFieldValue={setFieldValue}
                />
              )}
              <Button
                style={styles.button}
                onPress={handleSubmit}
                mode="contained"
                color="black">
                Update
              </Button>
            </>
          )}
        </Formik>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UpdateAccount;

const styles = StyleSheet.create({
  bigText: {
    marginVertical: 30,
    fontSize: 25,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  contentContainer: {
    alignItems: 'center',
  },
  button: {
    width: 200,
    height: 40,
    marginBottom: 30,
    backgroundColor: Colors.primary,
  },
  heading: {
    fontSize: 17,
    color: Colors.primary,
    marginTop: 20,
  },
  genderLabel: {
    width: 270,
    textAlign: 'left',
    color: 'white',
  },
  genderRow: {
    flexDirection: 'row',
    width: 270,
    marginTop: 20,
    marginBottom: 40,
  },
  logoutIcon: {
    color: Colors.primary,
    position: 'absolute',
    fontSize: 20,
    top: 20,
    right: 20,
  },
  scrollView: {
    width: '100%',
  },
});
