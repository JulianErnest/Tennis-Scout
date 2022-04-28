import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import * as Yup from 'yup';
import AppInputLabel from '../../../Components/AppInputLabel';
import {Formik} from 'formik';
import Icon from 'react-native-vector-icons/Feather';
import {ActivityIndicator} from 'react-native-paper';
import {ADMIN} from '../../../secret';

import {selectEnableScroll} from '../../../State/Features/match/matchSlice';
import {useAppDispatch, useAppSelector} from '../../../State/hooks';
import AppSlider from '../../../Components/AppSlider';
import AppRadioButton from '../../../Components/AppRadioButton';
import {Colors} from '../../../Styles/GlobalStyles';
import AppDatePicker from '../../../Components/AppDatePicker';
import {MatchDetails} from '../../../State/Features/match/MatchTypes';
import {
  PlayerDataList,
  setSearchPlayerModalVisibility,
} from '../../../State/Features/players/playersSlice';
import AppPlayerList from '../../../Components/AppPlayerList';
import {
  deleteMatchFromPrivate,
  deleteMatchFromPublic,
  editMatchNotes,
  getCoachNotes,
} from '../../../State/Features/match/MatchSliceAsyncThunks';
import Toast from 'react-native-toast-message';
import {getUserId} from '../../../State/Features/me/meSlice';

const EditNote = ({route}: any) => {
  const [uploading, setUploading] = useState(false);
  const dispatch = useAppDispatch();
  const scrollEnabled = useAppSelector(selectEnableScroll);
  const formRef = useRef<any>();
  const MatchNotesSchema = Yup.object().shape({
    opponentFirstName: Yup.string().required('First name is required'),
    opponentLastName: Yup.string().required('Last name is required'),
    tournamentName: Yup.string().required('Tournament name is required'),
    tournamentDate: Yup.number().required('Tournament date is required'),
    netFrequency: Yup.string().required('Net frequency is required'),
  });

  function handleSelectedPlayer(player: PlayerDataList) {
    dispatch(setSearchPlayerModalVisibility(false));
    formRef.current.setFieldValue(
      'opponentFirstName',
      player.player_first_name,
    );
    formRef.current.setFieldValue('opponentLastName', player.player_surname);
    formRef.current.setFieldValue('playerId', player.player_id);
  }

  async function handleSubmitForm(values: MatchDetails) {
    try {
      if (!route.params.isShareable && values.isShareable) {
        await deleteMatchFromPrivate(values.playerId, values.matchId);
        route.params.isShareable = true;
      }
      // If it was shareable before and is not shareable now
      if (route.params.isShareable && !values.isShareable) {
        await deleteMatchFromPublic(values.playerId, values.matchId);
        route.params.isShareable = false;
      }
      const sent = await dispatch(editMatchNotes(values));
      Toast.show({
        type: sent ? 'success' : 'error',
        text1: sent
          ? 'Successfully updated match notes'
          : 'Unable to update match notes, try again later.',
        visibilityTime: 3000,
        autoHide: true,
      });
      const uid = getUserId();
      if (uid !== ADMIN) {
        await dispatch(getCoachNotes(getUserId()));
      }
    } catch (e) {
      console.log('Error submitting form', e);
      setUploading(false);
    }
  }

  useEffect(() => {
    formRef.current.setValues(route.params);
  }, [route.params]);

  return (
    <>
      <AppPlayerList onPlayerPress={player => handleSelectedPlayer(player)} />
      <View>
        <ActivityIndicator
          style={styles.loading}
          animating={uploading}
          color="gray"
        />
        <ScrollView
          scrollEnabled={scrollEnabled}
          contentContainerStyle={styles.container}>
          <Formik
            innerRef={formRef as any}
            validationSchema={MatchNotesSchema}
            initialValues={route.params as MatchDetails}
            onSubmit={values => handleSubmitForm(values)}>
            {({handleSubmit, handleChange, values, setFieldValue}) => (
              <>
                <AppInputLabel
                  disabled={values.useExistingPlayer}
                  height={38}
                  label="Opponent First Name"
                  labelColor="black"
                  onChange={handleChange('opponentFirstName')}
                  placeholder={''}
                  value={values.opponentFirstName}
                  error={false}
                  hideText={false}
                  multiline={false}
                />
                <AppInputLabel
                  disabled={values.useExistingPlayer}
                  height={38}
                  label="Opponent Last Name"
                  labelColor="black"
                  onChange={handleChange('opponentLastName')}
                  placeholder={''}
                  value={values.opponentLastName}
                  error={false}
                  hideText={false}
                  multiline={false}
                />
                <AppInputLabel
                  height={38}
                  label="Tournament Name"
                  labelColor="black"
                  onChange={handleChange('tournamentName')}
                  placeholder={''}
                  value={values.tournamentName}
                  error={false}
                  hideText={false}
                  multiline={false}
                />
                <AppDatePicker
                  date={new Date(values.tournamentDate) ?? new Date()}
                  setDate={date => {
                    setFieldValue('tournamentDate', date.getTime());
                  }}
                  label="Start Date"
                  labelColor="black"
                  value={values.tournamentDate}
                  maximumDate={new Date()}
                />
                <Text style={styles.instruction}>
                  Rate each area of the opponent during the match 1-10
                </Text>
                <View style={styles.sliderLabel}>
                  <Text style={styles.sliderLabelText}>Terrible</Text>
                  <Text style={styles.sliderLabelText}>Fair</Text>
                  <Text style={styles.sliderLabelText}>Excellent</Text>
                </View>
                <AppSlider
                  label=""
                  value={5.5}
                  handleValueChange={() => null}
                  disabled={true}
                />
                <Text style={styles.optionalNotes}>Notes are optional</Text>
                <Text style={styles.bigText}>Serve</Text>
                <AppSlider
                  label="Rating"
                  value={values.serve.rating}
                  handleValueChange={val =>
                    setFieldValue('serve', {...values.serve, rating: val})
                  }
                  disabled={false}
                />
                <AppInputLabel
                  height={70}
                  label="Notes"
                  labelColor="black"
                  onChange={val =>
                    setFieldValue('serve', {...values.serve, notes: val})
                  }
                  placeholder={''}
                  value={values.serve.notes}
                  error={false}
                  hideText={false}
                  multiline={true}
                />
                <Text style={styles.bigText}>Forehand</Text>
                <AppSlider
                  label="Rating"
                  value={values.forehand.rating}
                  handleValueChange={val =>
                    setFieldValue('forehand', {...values.forehand, rating: val})
                  }
                  disabled={false}
                />
                <AppInputLabel
                  height={70}
                  label="Notes"
                  labelColor="black"
                  onChange={val =>
                    setFieldValue('forehand', {...values.forehand, notes: val})
                  }
                  placeholder={''}
                  value={values.forehand.notes}
                  error={false}
                  hideText={false}
                  multiline={true}
                />

                <Text style={styles.bigText}>Backhand</Text>
                <AppSlider
                  label="Rating"
                  value={values.backhand.rating}
                  handleValueChange={val =>
                    setFieldValue('backhand', {...values.backhand, rating: val})
                  }
                  disabled={false}
                />
                <AppInputLabel
                  height={70}
                  label="Notes"
                  labelColor="black"
                  onChange={val =>
                    setFieldValue('backhand', {...values.backhand, notes: val})
                  }
                  placeholder={''}
                  value={values.backhand.notes}
                  error={false}
                  hideText={false}
                  multiline={true}
                />

                <Text style={styles.bigText}>Movement</Text>
                <AppSlider
                  label="Rating"
                  value={values.movement.rating}
                  handleValueChange={val =>
                    setFieldValue('movement', {...values.movement, rating: val})
                  }
                  disabled={false}
                />
                <AppInputLabel
                  height={70}
                  label="Notes"
                  labelColor="black"
                  onChange={val =>
                    setFieldValue('movement', {...values.movement, notes: val})
                  }
                  placeholder={''}
                  value={values.movement.notes}
                  error={false}
                  hideText={false}
                  multiline={true}
                />

                <Text style={styles.bigText}>Volleys & Net Play</Text>
                <AppSlider
                  label="Rating"
                  value={values.volleysAndNetPlay.rating}
                  handleValueChange={val =>
                    setFieldValue('volleysAndNetPlay', {
                      ...values.volleysAndNetPlay,
                      rating: val,
                    })
                  }
                  disabled={false}
                />
                <AppInputLabel
                  height={70}
                  label="Notes"
                  labelColor="black"
                  onChange={val =>
                    setFieldValue('volleysAndNetPlay', {
                      ...values.volleysAndNetPlay,
                      notes: val,
                    })
                  }
                  placeholder={''}
                  value={values.volleysAndNetPlay.notes}
                  error={false}
                  hideText={false}
                  multiline={true}
                />

                <Text style={styles.bigText}>Frequency of going to net</Text>
                <View style={styles.radioContainer}>
                  <AppRadioButton
                    checked={values.netFrequency === 'Rarely'}
                    checkedColor={Colors.primary}
                    label={'Rarely'}
                    labelColor={'black'}
                    onPress={() => setFieldValue('netFrequency', 'Rarely')}
                  />
                  <AppRadioButton
                    checked={values.netFrequency === 'Sometimes'}
                    checkedColor={Colors.primary}
                    label={'Sometimes'}
                    labelColor={'black'}
                    onPress={() => setFieldValue('netFrequency', 'Sometimes')}
                  />
                  <AppRadioButton
                    checked={values.netFrequency === 'Always'}
                    checkedColor={Colors.primary}
                    label={'Always'}
                    labelColor={'black'}
                    onPress={() => setFieldValue('netFrequency', 'Always')}
                  />
                </View>
                <Text style={styles.bigText}>
                  Share scout publicly to other users
                </Text>
                <View style={styles.radioContainer}>
                  <AppRadioButton
                    checked={values.isShareable}
                    checkedColor={Colors.primary}
                    label={'Yes'}
                    labelColor={'black'}
                    onPress={() => setFieldValue('isShareable', true)}
                  />
                  <AppRadioButton
                    checked={!values.isShareable}
                    checkedColor={Colors.primary}
                    label={'No'}
                    labelColor={'black'}
                    onPress={() => setFieldValue('isShareable', false)}
                  />
                  <View />
                </View>
                <Text style={styles.bigText}>General Comments</Text>
                <AppInputLabel
                  labelColor={'black'}
                  label={''}
                  placeholder={''}
                  value={values.generalComments}
                  error={false}
                  height={70}
                  onChange={handleChange('generalComments')}
                  hideText={false}
                  multiline={true}
                />
                {route.params.type !== 'cant-edit' && (
                  <View style={styles.actionContainer}>
                    <Text onPress={handleSubmit}>
                      <Icon
                        name="check-circle"
                        color={Colors.primary}
                        size={20}
                      />
                      {'  '}
                      <Text style={styles.actions}>Edit</Text>
                    </Text>
                  </View>
                )}
              </>
            )}
          </Formik>
        </ScrollView>
      </View>
    </>
  );
};

export default EditNote;

const styles = StyleSheet.create({
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  actions: {
    color: 'black',
  },
  bigText: {
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 10,
    color: 'black',
  },
  container: {
    padding: 30,
    marginBottom: 100,
  },
  instruction: {
    fontWeight: 'bold',
    fontSize: 17,
    textAlign: 'center',
    color: 'black',
  },
  loading: {
    flex: 1,
    position: 'absolute',
    top: '50%',
    left: '45%',
    zIndex: 10,
  },
  optionalNotes: {
    textAlign: 'center',
    marginTop: 10,
    color: 'black',
  },
  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  selectPlayerContainer: {
    width: 270,
    backgroundColor: '#e7e7e7',
    height: 38,
    borderWidth: 0.3,
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10,
    marginBottom: 10,
    flexDirection: 'row',
  },
  selectPlayerLeft: {
    flex: 1,
  },
  selectPlayerRight: {
    marginRight: 10,
    color: Colors.primary,
  },
  sliderLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  sliderLabelText: {
    fontWeight: 'bold',
    color: 'black',
  },
});
