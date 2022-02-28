import {SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import * as Yup from 'yup';
import Icon from 'react-native-vector-icons/Feather';
import {Formik} from 'formik';

import {Colors, GlobalStyles} from '../Styles/GlobalStyles';
import AppInputLabel from '../Components/AppInputLabel';
import {Button, Divider} from 'react-native-paper';
import AppRadioButton from '../Components/AppRadioButton';
import AppDatePicker from '../Components/AppDatePicker';
import {createProfile, PreviousPlayers} from '../State/Features/me/meSlice';
import AppPreviousPlayers from '../Components/AppPreviousPlayers';
import AppErrorText from '../Components/AppErrorText';
import {useAppDispatch} from '../State/hooks';

export type ProfileInput = {
  coachFirstName: string;
  coachLastName: string;
  currentFirstName: string;
  currentLastName: string;
  currentStartDate: number;
  currentGender: string;
  previousPlayers: PreviousPlayers[];
};

const CreateProfile = () => {
  const dispatch = useAppDispatch();
  const initialValues = {
    coachFirstName: '',
    coachLastName: '',
    currentFirstName: '',
    currentLastName: '',
    currentStartDate: 0,
    currentGender: '',
    previousPlayers: [] as PreviousPlayers[],
  };

  const CreateProfileSchema = Yup.object().shape({
    coachFirstName: Yup.string().required('First name is required'),
    coachLastName: Yup.string().required('Last name is required'),
    currentFirstName: Yup.string().required('First name is required'),
    currentLastName: Yup.string().required('Last name is required'),
    currentStartDate: Yup.number().required('Start date is required'),
    currentGender: Yup.string().required('Gender is required'),
    previousPlayers: Yup.array().of(
      Yup.object().shape({
        firstName: Yup.string().required('First name is required'),
        lastName: Yup.string().required('Last name is required'),
        startDate: Yup.number().required('Start date is required'),
        endDate: Yup.number().required('End date is required'),
        gender: Yup.string().required('Gender is required'),
      }),
    ),
  });

  function submitProfile(values: ProfileInput) {
    dispatch(createProfile(values));
  }

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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        style={styles.scrollView}>
        <Text style={styles.introText}>Let's set up your info</Text>
        <Formik
          validationSchema={CreateProfileSchema}
          initialValues={initialValues}
          onSubmit={values => submitProfile(values)}>
          {({
            handleChange,
            handleSubmit,
            values,
            errors,
            setFieldValue,
            setValues,
            touched,
          }) => {
            return (
              <>
                <Text style={styles.bigText}>Your Information</Text>
                <AppInputLabel
                  height={38}
                  labelColor="white"
                  label="First Name"
                  value={values.coachFirstName}
                  onChange={handleChange('coachFirstName')}
                  placeholder=""
                  error={errors.coachLastName !== ''}
                />
                {errors.coachFirstName && touched.coachFirstName && (
                  <AppErrorText color="white" error={errors.coachFirstName} />
                )}
                <AppInputLabel
                  height={38}
                  labelColor="white"
                  label="Last Name"
                  value={values.coachLastName}
                  onChange={handleChange('coachLastName')}
                  placeholder=""
                  error={errors.coachLastName !== ''}
                />
                {errors.coachLastName && touched.coachLastName && (
                  <AppErrorText color="white" error={errors.coachLastName} />
                )}
                <Text style={styles.bigText}>Current Player</Text>
                <AppInputLabel
                  height={38}
                  labelColor="white"
                  label="First Name"
                  value={values.currentFirstName}
                  onChange={handleChange('currentFirstName')}
                  placeholder=""
                  error={errors.currentFirstName !== ''}
                />
                {errors.currentFirstName && touched.currentFirstName && (
                  <AppErrorText color="white" error={errors.currentFirstName} />
                )}
                <AppInputLabel
                  height={38}
                  labelColor="white"
                  label="Last Name"
                  value={values.currentLastName}
                  onChange={handleChange('currentLastName')}
                  placeholder=""
                  error={errors.currentLastName !== ''}
                />
                {errors.currentLastName && touched.currentLastName && (
                  <AppErrorText color="white" error={errors.currentLastName} />
                )}
                <AppDatePicker
                  date={new Date(values.currentStartDate)}
                  setDate={date => {
                    setFieldValue('currentStartDate', date.getTime());
                  }}
                  label="Start Date"
                  labelColor="white"
                  value={values.currentStartDate}
                />
                {errors.currentStartDate && touched.currentStartDate && (
                  <AppErrorText color="white" error="Start Date is required" />
                )}
                <Text style={styles.genderLabel}>Gender</Text>
                <View style={styles.genderRow}>
                  <AppRadioButton
                    checked={values.currentGender === 'male'}
                    checkedColor={Colors.dityWhite}
                    label={'Male'}
                    labelColor={'white'}
                    onPress={() => setFieldValue('currentGender', 'male')}
                  />
                  <AppRadioButton
                    checked={values.currentGender === 'female'}
                    checkedColor={Colors.dityWhite}
                    label={'Female'}
                    labelColor={'white'}
                    onPress={() => setFieldValue('currentGender', 'female')}
                  />
                </View>
                {errors.currentGender && touched.currentGender && (
                  <AppErrorText color="white" error={errors.currentGender} />
                )}
                <Text style={styles.bigText}>Previous Player/s</Text>
                <AppPreviousPlayers
                  touched={touched}
                  values={values}
                  setValues={setValues}
                  handleChange={handleChange}
                  errors={errors}
                  setFieldValue={setFieldValue}
                />
                <Icon
                  name="plus"
                  color="white"
                  size={20}
                  onPress={() => addPreviousPlayer(values, setValues)}
                />
                <Divider style={GlobalStyles.whiteDivider} />
                <Button
                  style={styles.button}
                  onPress={handleSubmit}
                  mode="contained"
                  color="white">
                  Confirm
                </Button>
              </>
            );
          }}
        </Formik>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateProfile;

const styles = StyleSheet.create({
  bigText: {
    marginVertical: 30,
    fontSize: 25,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    marginTop: 20,
    width: 250,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
  },
  contentContainer: {
    width: '100%',
    alignItems: 'center',
  },
  datePicker: {
    width: 320,
    height: 260,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
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
  introText: {
    color: 'white',
    fontSize: 15,
    marginTop: 15,
    textAlign: 'center',
  },
  scrollView: {
    width: '100%',
  },
});
