import {StyleSheet, Text, ScrollView, View, SafeAreaView} from 'react-native';
import {Button} from 'react-native-paper';
import React, {useEffect, useRef} from 'react';
import {Formik} from 'formik';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/Feather';

import {Colors, GlobalStyles} from '../../../Styles/GlobalStyles';
import {useAppDispatch} from '../../../State/hooks';
import {
  AccountDetails,
  updateAccount,
} from '../../../State/Features/account/accountSlice';
import AppDatePicker from '../../../Components/AppDatePicker';
import AppErrorText from '../../../Components/AppErrorText';
import AppInputLabel from '../../../Components/AppInputLabel';
import AppRadioButton from '../../../Components/AppRadioButton';
import {PreviousPlayers} from '../../../State/Features/me/meSlice';
import AppPreviousPlayersAccount from '../../../Components/AppPreviousPlayersAccount';

type UpdateCoachProfileAdminProps = {
  route: {
    params: {
      profile: AccountDetails;
    };
  };
};

const UpdateCoachProfileAdmin = ({route}: UpdateCoachProfileAdminProps) => {
  const dispatch = useAppDispatch();
  const formRef = useRef<any>();

  function addPreviousPlayer(values: any, setValues: any) {
    const playerObject: PreviousPlayers = {
      firstName: '',
      lastName: '',
      startDate: 0,
      endDate: 0,
      gender: '',
    };
    const previousPlayers = [...values.previousPlayers];
    previousPlayers.push(playerObject);
    setValues({...values, previousPlayers});
  }

  useEffect(() => {
    formRef.current.setValues(route.params.profile);
  }, [route.params.profile]);

  async function handleUpdateAccount(values: AccountDetails) {
    const val = await dispatch(updateAccount(values)).unwrap();
    Toast.show({
      type: !val ? 'error' : 'success',
      text1: !val
        ? 'Unable to update coach profile'
        : 'Successfully updated coach profile',
      autoHide: true,
      visibilityTime: 2000,
    });
  }

  return (
    <SafeAreaView style={GlobalStyles.centerTopView}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        style={styles.scrollView}>
        <Formik
          onSubmit={values => handleUpdateAccount(values)}
          innerRef={formRef as any}
          initialValues={route.params.profile}>
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
              <Text style={styles.bigText}>Coach Info</Text>
              <AppInputLabel
                height={38}
                labelColor="black"
                label="Email"
                value={values.email}
                onChange={() => null}
                placeholder=""
                error={errors.coachLastName !== ''}
                hideText={false}
                multiline={false}
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
                multiline={false}
              />
              {errors.coachFirstName && touched.coachFirstName && (
                <AppErrorText
                  color="black"
                  error={errors.coachFirstName as string}
                />
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
                multiline={false}
              />
              {errors.coachLastName && touched.coachLastName && (
                <AppErrorText
                  color="black"
                  error={errors.coachLastName as string}
                />
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
                multiline={false}
              />
              {errors.currentFirstName && touched.currentFirstName && (
                <AppErrorText
                  color="black"
                  error={errors.currentFirstName as string}
                />
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
                multiline={false}
              />
              {errors.currentLastName && touched.currentLastName && (
                <AppErrorText
                  color="black"
                  error={errors.currentLastName as string}
                />
              )}
              <AppDatePicker
                date={new Date(values.currentStartDate)}
                setDate={date => {
                  setFieldValue('currentStartDate', date.getTime());
                }}
                label="Start Date"
                labelColor="black"
                value={values.currentStartDate}
                maximumDate={new Date()}
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
                <AppErrorText
                  color="black"
                  error={errors.currentGender as string}
                />
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
              <Icon
                name="plus"
                color={Colors.primary}
                size={20}
                onPress={() => addPreviousPlayer(values, setValues)}
              />
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

export default UpdateCoachProfileAdmin;

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
    marginTop: 30,
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
    color: 'black',
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
