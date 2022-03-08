import {FlatList, Platform, StyleSheet, Text, View} from 'react-native';
import db from '@react-native-firebase/firestore';
import rnfs from 'react-native-fs';
import {PermissionsAndroid} from 'react-native';
import Toast from 'react-native-toast-message';

import React, {useEffect} from 'react';
import {MatchDetails} from '../State/Features/match/MatchTypes';
import {useAppDispatch, useAppSelector} from '../State/hooks';
import {
  selectMatchNotes,
  setAdminMatches,
} from '../State/Features/match/matchSlice';
import {Colors, GlobalStyles} from '../Styles/GlobalStyles';
import {Button} from 'react-native-paper';
import {getFormattedDate} from '../Helpers/DateFunctions';
import {navigate} from '../Navigation/NavigationUtils';

const AllMatches = () => {
  const dispatch = useAppDispatch();
  const allMatches = useAppSelector(selectMatchNotes);
  useEffect(() => {
    (() => {
      const subscription = db()
        .collection('Matches')
        .onSnapshot(snap => {
          const matches: MatchDetails[] = [];
          snap &&
            snap.forEach(doc =>
              matches.push(doc.data() as unknown as MatchDetails),
            );
          dispatch(setAdminMatches(matches));
        });
      return subscription;
    })();
  }, [dispatch]);

  async function handleDownload() {
    let granted = true;
    if (Platform.OS === 'android') {
      let req = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );
      if (req !== PermissionsAndroid.RESULTS.GRANTED) {
        granted = false;
      }
    }
    if (granted) {
      const fileName = `${Date.now()}.csv`;
      const androidPath = `${rnfs.DownloadDirectoryPath}/${fileName}`;
      const iosPath = `${rnfs.DocumentDirectoryPath}/${fileName}`;
      console.log(androidPath);
      console.log(iosPath);
      const headerString =
        "Coach Name,Coach's player,Opponent,Match Date,Tournament,General Notes,Serve Rating,Serve Notes,Forehand Rating,Forehand Notes,Backhand Rating,Backhand Notes,Movement Rating,Movement Notes,Come to the net?,Volley Rating,Volley Notes\n";
      const valuesString = allMatches
        .map(
          x =>
            `${x.coachFirstName} ${x.coachLastName},${x.playerFirstName} ${
              x.playerLastName
            },${x.opponentFirstName} ${x.opponentLastName},${getFormattedDate(
              new Date(x.tournamentDate),
            )},${x.tournamentName},${x.generalComments},${x.serve.rating},${
              x.serve.notes
            },${x.forehand.rating},${x.forehand.notes},${x.backhand.rating},${
              x.backhand.notes
            },${x.movement.rating},${x.movement.notes},${x.netFrequency},${
              x.volleys.rating
            },${x.volleys.notes}\n`,
        )
        .join('');
      const csvString = `${headerString}${valuesString}`;
      console.log(csvString);
      try {
        if (Platform.OS === 'android') {
          await rnfs.writeFile(androidPath, csvString, 'utf8');
        } else {
          console.log(iosPath);
          await rnfs.writeFile(iosPath, csvString, 'utf8');
        }
        Toast.show({
          type: 'success',
          text1: 'Successfully saved match details',
          autoHide: true,
          visibilityTime: 2000,
        });
      } catch (e) {
        console.log(e);
        Toast.show({
          type: 'error',
          text1: 'Unable to download file',
          autoHide: true,
          visibilityTime: 2000,
        });
      }
    }
  }

  function handleViewFullDetails(item: MatchDetails) {
    navigate('NoteDetails', item);
  }

  return (
    <View style={GlobalStyles.centerTopView}>
      <Button mode="contained" style={styles.button} onPress={handleDownload}>
        Download All
      </Button>
      <FlatList
        contentContainerStyle={styles.flatListContainer}
        style={styles.flatList}
        data={allMatches}
        renderItem={({item, index}) => (
          <View key={index} style={styles.container}>
            <View style={styles.infoContainer}>
              <Text style={styles.label}>Matchup: </Text>
              <Text style={styles.content}>
                {item.playerLastName + ' vs ' + item.opponentLastName}
              </Text>
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.label}>Tournament: </Text>
              <Text style={styles.content}>{item.tournamentName}</Text>
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.label}>Tournament: </Text>
              <Text style={styles.content}>
                {getFormattedDate(new Date(item.dateCreated))}
              </Text>
            </View>
            <Text
              onPress={() => handleViewFullDetails(item)}
              style={styles.link}>
              Full details
            </Text>
          </View>
        )}
      />
    </View>
  );
};

export default AllMatches;

const styles = StyleSheet.create({
  button: {
    alignSelf: 'flex-end',
    color: 'white',
    backgroundColor: Colors.primary,
    marginRight: 20,
    marginTop: 20,
    width: 200,
  },
  container: {
    padding: 10,
    width: 300,
    height: 130,
    borderColor: Colors.primary,
    borderWidth: 1,
    marginVertical: 20,
  },
  content: {
    color: Colors.primary,
    marginVertical: 5,
  },
  flatListContainer: {
    alignItems: 'center',
  },
  infoContainer: {
    flexDirection: 'row',
  },
  flatList: {
    width: '100%',
  },
  label: {
    marginVertical: 5,
  },
  link: {
    color: Colors.primary,
    alignSelf: 'center',
    marginTop: 'auto',
  },
});
