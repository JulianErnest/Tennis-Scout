import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {FieldArray, Field} from 'formik';
import {Colors} from '../Styles/GlobalStyles';
import Icon from 'react-native-vector-icons/Feather';

import AppDatePicker from './AppDatePicker';
import AppInputLabel from './AppInputLabel';
import AppRadioButton from './AppRadioButton';
import {PreviousPlayers} from '../State/Features/me/meSlice';
import AppErrorText from './AppErrorText';

type AppPreviousPlayersProps = {
  values: any;
  setValues: any;
  handleChange: any;
  errors: any;
  setFieldValue: any;
  touched: any;
};

const AppPreviousPlayersAccount = ({
  values,
  setValues,
  handleChange,
  errors,
  setFieldValue,
  touched,
}: AppPreviousPlayersProps) => {
  function removePreviousPlayer(i: number) {
    const previousPlayers = [...values.previousPlayers];
    previousPlayers.splice(i, 1);
    setValues({...values, previousPlayers});
  }
  return (
    <>
      <FieldArray name="previousPlayers">
        {() =>
          values.previousPlayers.map((player: PreviousPlayers, i: number) => {
            let err;
            let touch;
            if (errors.previousPlayers) {
              err = errors.previousPlayers[i];
            }
            if (touched.previousPlayers) {
              touch = touched.previousPlayers[i];
            }
            return (
              <View key={i}>
                <Icon
                  style={styles.removeIcon}
                  name="x"
                  color="black"
                  size={30}
                  onPress={() => removePreviousPlayer(i)}
                />
                <View style={styles.iconContainer} />
                <Field name="firstName">
                  {({field}: any) => (
                    <AppInputLabel
                      height={38}
                      labelColor="black"
                      label="First Name"
                      value={player.firstName}
                      onChange={handleChange(`previousPlayers.${i}.firstName`)}
                      placeholder=""
                      error={errors.currentFirstName !== ''}
                    />
                  )}
                </Field>
                {err && err.firstName && touch && touch.firstName && (
                  <AppErrorText color="black" error={err.firstName} />
                )}
                <Field name="lastName">
                  {({field}: any) => (
                    <AppInputLabel
                      height={38}
                      labelColor="black"
                      label="Last Name"
                      value={player.lastName}
                      onChange={handleChange(`previousPlayers.${i}.lastName`)}
                      placeholder=""
                      error={errors.currentLastName !== ''}
                    />
                  )}
                </Field>
                {err && err.lastName && touch && touch.lastName && (
                  <AppErrorText color="black" error={err.lastName} />
                )}
                <Field name="startDate">
                  {({}) => (
                    <AppDatePicker
                      date={new Date(player.startDate) ?? new Date()}
                      setDate={date => {
                        setFieldValue(
                          `previousPlayers.${i}.startDate`,
                          date.getTime(),
                        );
                      }}
                      key={i}
                      label="Start Date"
                      labelColor="black"
                      value={player.startDate}
                    />
                  )}
                </Field>
                {err && err.startDate && touch && touch.startDate && (
                  <AppErrorText color="black" error="Start Date is required" />
                )}
                <Field name="endDate">
                  {({}) => (
                    <AppDatePicker
                      date={new Date(player.endDate) ?? new Date()}
                      setDate={date => {
                        setFieldValue(
                          `previousPlayers.${i}.endDate`,
                          date.getTime(),
                        );
                      }}
                      key={i}
                      label="End Date"
                      labelColor="black"
                      value={player.endDate}
                    />
                  )}
                </Field>
                {err && err.endDate && touch && touch.endDate && (
                  <AppErrorText color="black" error="End Date is required" />
                )}
                <Text style={styles.genderLabel}>Gender</Text>
                <View style={styles.genderRow}>
                  <Field name="gender">
                    {({}) => (
                      <>
                        <AppRadioButton
                          checked={player.gender === 'male'}
                          checkedColor={Colors.primary}
                          label={'Male'}
                          labelColor={'black'}
                          onPress={() =>
                            setFieldValue(`previousPlayers.${i}.gender`, 'male')
                          }
                        />
                        <AppRadioButton
                          checked={player.gender === 'female'}
                          checkedColor={Colors.primary}
                          label={'Female'}
                          labelColor={'black'}
                          onPress={() =>
                            setFieldValue(
                              `previousPlayers.${i}.gender`,
                              'female',
                            )
                          }
                        />
                      </>
                    )}
                  </Field>
                </View>
                {err && err.gender && touch && touch.gender && (
                  <AppErrorText color="black" error={err.gender} />
                )}
              </View>
            );
          })
        }
      </FieldArray>
    </>
  );
};

export default AppPreviousPlayersAccount;

const styles = StyleSheet.create({
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
  iconContainer: {
    position: 'absolute',
    right: 0,
  },
  removeIcon: {
    alignSelf: 'center',
  },
});