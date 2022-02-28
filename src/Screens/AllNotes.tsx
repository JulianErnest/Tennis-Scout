import {FlatList, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import db from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/Feather';
import auth from '@react-native-firebase/auth';

import {useAppDispatch, useAppSelector} from '../State/hooks';
import {selectMatchNotes, setMatches} from '../State/Features/match/matchSlice';
import {Colors} from '../Styles/GlobalStyles';
import {MatchDetails} from '../State/Features/match/MatchTypes';
import {getFormattedDate} from '../Helpers/DateFunctions';
import {navigate} from '../Navigation/NavigationUtils';

const AllNotes = ({route}: any) => {
  const dispatch = useAppDispatch();
  const matchNotes = useAppSelector(selectMatchNotes);
  useEffect(() => {
    console.log(route.params);
    const uid = route.params?.coachId ?? auth().currentUser?.uid;
    const subscription = db()
      .collection('Matches')
      .where('coachId', '==', uid)
      .onSnapshot(data => {
        const notes: MatchDetails[] = [];
        data.docs.forEach(x =>
          notes.push({...x.data(), matchId: x.id} as MatchDetails),
        );
        dispatch(setMatches(notes));
      });
    return subscription;
  }, [dispatch, route.params]);

  function handleViewDetails(item: MatchDetails) {
    navigate('MatchNotes', {...item, type: 'edit'});
  }

  return (
    <FlatList
      style={styles.flatList}
      data={matchNotes}
      renderItem={({item, index}) => (
        <View key={index} style={styles.previewContainer}>
          <Text style={styles.contentText}>
            vs {' ' + item.opponentLastName}
          </Text>
          <Text style={styles.labelText}>{item.matchId}</Text>
          <Text style={styles.contentText}>
            {item.tournamentName} {'  -  '}
            {getFormattedDate(new Date(item.tournamentDate))}
          </Text>
          <Text style={styles.labelText}>Date Inputted</Text>
          <Text style={styles.contentText}>
            {getFormattedDate(new Date(item.dateCreated))}
          </Text>
          <Text
            style={styles.viewDetails}
            onPress={() => handleViewDetails(item)}>
            {'View Details '}
            <Icon name="external-link" color="white" />
          </Text>
        </View>
      )}
    />
  );
};

export default AllNotes;

const styles = StyleSheet.create({
  contentText: {
    fontWeight: '700',
    fontSize: 17,
    marginVertical: 3,
    marginHorizontal: 10,
    color: 'white',
  },
  flatList: {
    alignSelf: 'center',
    marginTop: 20,
  },
  labelText: {
    color: Colors.lightGray,
    fontWeight: '400',
    fontSize: 14,
    marginVertical: 4,
    marginHorizontal: 10,
  },
  previewContainer: {
    width: 300,
    height: 170,
    backgroundColor: Colors.primary,
    marginVertical: 15,
  },
  viewDetails: {
    color: 'white',
    marginBottom: 10,
    marginTop: 'auto',
    alignSelf: 'center',
  },
});
