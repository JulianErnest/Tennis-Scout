import {FlatList, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import Icon from 'react-native-vector-icons/Feather';

import {useAppDispatch, useAppSelector} from '../../../State/hooks';
import {Colors} from '../../../Styles/GlobalStyles';
import {getFormattedDate} from '../../../Helpers/DateFunctions';
import {MatchDetails} from '../../../State/Features/match/MatchTypes';
import {navigate} from '../../../Navigation/NavigationUtils';
import {
  getAllPublicPlayerNotes,
  selectPublicPlayerNotes,
} from '../../../State/Features/players/searchSlice';

const AllPlayerNotes = ({route}: any) => {
  console.log(route);
  const dispatch = useAppDispatch();
  const notes = useAppSelector(selectPublicPlayerNotes);

  useEffect(() => {
    dispatch(getAllPublicPlayerNotes(route.params.player.player_id));
  }, [dispatch, route.params.player.player_id]);

  function handleViewDetails(item: MatchDetails) {
    navigate('EditNote', {...item, type: 'edit'});
  }

  return (
    <View style={styles.container}>
      <Text style={styles.mainText}>
        All Public notes of player: {route.params.player.player_full_name}
      </Text>
      <FlatList
        style={styles.list}
        data={notes}
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

export default AllPlayerNotes;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
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
    paddingBottom: 150,
  },
  mainText: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 20,
    fontWeight: 'bold',
    width: 250,
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
