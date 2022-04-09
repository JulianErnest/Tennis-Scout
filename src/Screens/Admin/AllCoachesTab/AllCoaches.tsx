import {FlatList, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import db from '@react-native-firebase/firestore';

import {useAppDispatch, useAppSelector} from '../../../State/hooks';
import {
  AccountDetails,
  selectAllCoaches,
  setAccountDetails,
  setAllCoaches,
} from '../../../State/Features/account/accountSlice';
import {Colors} from '../../../Styles/GlobalStyles';
import {Button} from 'react-native-paper';
import {navigate} from '../../../Navigation/NavigationUtils';

const AllCoaches = () => {
  const dispatch = useAppDispatch();
  const allCoaches = useAppSelector(selectAllCoaches);
  useEffect(() => {
    const subscription = db()
      .collection('Coaches')
      .onSnapshot(snap => {
        const coaches: AccountDetails[] = [];
        snap && snap.forEach(doc => coaches.push(doc.data() as AccountDetails));
        dispatch(setAllCoaches(coaches));
      });
    return subscription;
  }, [dispatch]);

  function handleProfilePress(profile: AccountDetails) {
    dispatch(setAccountDetails(profile));
    navigate('CoachProfile', {profile});
  }

  function handleNotePress(uid: string) {
    navigate('CoachNotes', uid);
  }

  return (
    <View>
      <FlatList
        style={styles.flatList}
        data={allCoaches}
        keyExtractor={data => data.email}
        renderItem={({item, index}) => (
          <View key={index}>
            <View style={styles.container} key={index}>
              <View style={styles.row}>
                <Text style={styles.label}>Name: </Text>
                <Text style={styles.content}>
                  {item.coachFirstName + ' ' + item.coachLastName}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Email: </Text>
                <Text style={styles.content}>{item.email}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Current Player: </Text>
                <Text style={styles.content}>
                  {item.currentFirstName + ' ' + item.currentLastName}
                </Text>
              </View>
              <View style={styles.buttonsRow}>
                <Button
                  onPress={() => handleProfilePress(item)}
                  labelStyle={styles.buttonLabel}
                  mode="contained"
                  style={styles.button}>
                  Profile
                </Button>
                <Button
                  onPress={() => handleNotePress(item.uid as string)}
                  labelStyle={styles.buttonLabel}
                  mode="contained"
                  style={styles.button}>
                  Notes
                </Button>
              </View>
            </View>
            <View style={styles.divider} />
          </View>
        )}
      />
    </View>
  );
};

export default AllCoaches;

const styles = StyleSheet.create({
  button: {
    width: 100,
    backgroundColor: Colors.primary,
  },
  buttonsRow: {
    marginTop: 20,
    flexDirection: 'row',
    width: 300,
    flex: 1,
    justifyContent: 'space-around',
  },
  buttonLabel: {
    fontSize: 14,
  },
  container: {
    marginHorizontal: 20,
  },
  divider: {
    width: 300,
    height: 1,
    backgroundColor: Colors.primary,
    alignSelf: 'center',
    marginVertical: 20,
  },
  flatList: {
    padding: 20,
    marginTop: 30,
  },
  label: {
    color: 'black',
    fontSize: 17,
  },
  content: {
    color: Colors.primary,
    fontSize: 17,
  },
  row: {
    flexDirection: 'row',
    marginVertical: 3,
  },
});
