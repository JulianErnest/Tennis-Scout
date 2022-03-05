import {FlatList, StyleSheet, Text, TextInput, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/Feather';
import auth from '@react-native-firebase/auth';
import {debounce} from 'lodash';

import {useAppDispatch, useAppSelector} from '../State/hooks';
import {
  fetchMatchNotes,
  selectFilteredNotes,
  selectHasFetchedNotes,
  setFilteredNotes,
} from '../State/Features/match/matchSlice';
import {Colors} from '../Styles/GlobalStyles';
import {getFormattedDate} from '../Helpers/DateFunctions';
import {MatchDetails} from '../State/Features/match/MatchTypes';
import {navigate} from '../Navigation/NavigationUtils';

const SearchOpponent = () => {
  const dispatch = useAppDispatch();
  const hasFetchedd = useAppSelector(selectHasFetchedNotes);
  const filtered = useAppSelector(selectFilteredNotes);
  const [filter, setFilter] = useState('');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceLoadData = useCallback(debounce(fetchData, 1000), []);

  useEffect(() => {
    if (!hasFetchedd) {
      dispatch(fetchMatchNotes(auth().currentUser?.uid as string));
    }
    debounceLoadData(filter);
  }, [filter, debounceLoadData, hasFetchedd, dispatch]);

  function fetchData(keywords: string) {
    dispatch(setFilteredNotes(keywords));
  }

  function handleViewDetails(item: MatchDetails) {
    navigate('MatchNotes', {...item, type: 'edit'});
  }

  return (
    <View>
      <TextInput
        value={filter}
        style={styles.search}
        onChangeText={t => setFilter(t)}
      />
      <FlatList
        style={styles.list}
        data={filtered}
        keyExtractor={data => data.dateCreated.toString()}
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
      <Text />
    </View>
  );
};

export default SearchOpponent;

const styles = StyleSheet.create({
  contentText: {
    fontWeight: '700',
    fontSize: 17,
    marginVertical: 3,
    marginHorizontal: 10,
    color: 'white',
  },
  search: {
    width: 320,
    height: 50,
    alignSelf: 'center',
    marginVertical: 40,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  labelText: {
    color: Colors.lightGray,
    fontWeight: '400',
    fontSize: 14,
    marginVertical: 4,
    marginHorizontal: 10,
  },
  list: {
    marginBottom: 150,
  },
  previewContainer: {
    width: 300,
    height: 170,
    backgroundColor: Colors.primary,
    marginVertical: 15,
    alignSelf: 'center',
  },
  viewDetails: {
    color: 'white',
    marginBottom: 10,
    marginTop: 'auto',
    alignSelf: 'center',
  },
});
