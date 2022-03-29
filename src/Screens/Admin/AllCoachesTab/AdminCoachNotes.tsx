import {FlatList, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import Icon from 'react-native-vector-icons/Feather';

import {useAppDispatch, useAppSelector} from '../../../State/hooks';
import {selectMatchNotes} from '../../../State/Features/match/matchSlice';
import {Colors} from '../../../Styles/GlobalStyles';
import {MatchDetails} from '../../../State/Features/match/MatchTypes';
import {getFormattedDate} from '../../../Helpers/DateFunctions';
import {navigate} from '../../../Navigation/NavigationUtils';
import {getCoachNotes} from '../../../State/Features/match/MatchSliceAsyncThunks';

const AdminCoachNotes = ({route}: any) => {
  console.log('Admin coach notes route', route);
  const dispatch = useAppDispatch();
  const matchNotes = useAppSelector(selectMatchNotes);

  useEffect(() => {
    dispatch(getCoachNotes(route.params));
  }, [dispatch, route.params]);

  function handleViewDetails(item: MatchDetails) {
    navigate('EditNote', {...item, type: 'edit'});
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
          <Text style={styles.contentText}>
            {item.tournamentName} {'  -  '}
            {getFormattedDate(new Date(item.tournamentDate))}
          </Text>
          <Text style={styles.labelText}>Date Inputted</Text>
          <Text style={styles.contentText}>
            {getFormattedDate(new Date(item.dateCreated))}
          </Text>
          <Text style={styles.labelText}>Inputted by</Text>
          <Text style={styles.contentText}>{item.coachLastName}</Text>
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

export default AdminCoachNotes;

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
