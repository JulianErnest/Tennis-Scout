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
import {getUserId} from '../../../State/Features/me/meSlice';

type NoteViewProps = {
  item: MatchDetails;
  index: number;
};

const MyNote = ({item, index}: NoteViewProps) => {
  function handleViewDetails(match: MatchDetails) {
    navigate('EditNote', {...match, type: 'cant-edit'});
  }
  return (
    <View key={index} style={styles.previewContainer}>
      <Text style={[styles.contentText, styles.white]}>
        vs {' ' + item.opponentLastName}
      </Text>
      <Text style={[styles.contentText, styles.white]}>
        {item.tournamentName} {'  -  '}
        {getFormattedDate(new Date(item.tournamentDate))}
      </Text>
      <Text style={[styles.labelText, styles.white]}>Date Inputted</Text>
      <Text style={[styles.contentText, styles.white]}>
        {getFormattedDate(new Date(item.dateCreated))}
      </Text>
      <Text style={[styles.labelText, styles.white]}>Inputted by</Text>
      <Text style={[styles.contentText, styles.white]}>You</Text>
      <Text
        style={[styles.viewDetails, styles.white]}
        onPress={() => handleViewDetails(item)}>
        {'View Details '}
        <Icon name="external-link" color="white" />
      </Text>
    </View>
  );
};

const OtherCoachNote = ({item, index}: NoteViewProps) => {
  function handleViewDetails(match: MatchDetails) {
    navigate('EditNote', {...match, type: 'cant-edit'});
  }
  return (
    <View key={index} style={styles.previewOtherContainer}>
      <Text style={styles.contentText}>vs {' ' + item.opponentLastName}</Text>
      <Text style={styles.contentText}>
        {item.tournamentName} {'  -  '}
        {getFormattedDate(new Date(item.tournamentDate))}
      </Text>
      <Text style={styles.labelText}>Date Inputted</Text>
      <Text style={styles.contentText}>
        {getFormattedDate(new Date(item.dateCreated))}
      </Text>
      <Text style={[styles.labelText]}>Inputted by</Text>
      <Text
        style={
          styles.contentText
        }>{`${item.coachFirstName} ${item.coachLastName}`}</Text>
      <Text
        style={[styles.viewDetails]}
        onPress={() => handleViewDetails(item)}>
        {'View Details '}
        <Icon name="external-link" color={Colors.primary} />
      </Text>
    </View>
  );
};

const AllPlayerNotes = ({route}: any) => {
  console.log(route);
  const dispatch = useAppDispatch();
  const notes = useAppSelector(selectPublicPlayerNotes);

  useEffect(() => {
    dispatch(getAllPublicPlayerNotes(route.params.player.player_id));
  }, [dispatch, route.params.player.player_id]);

  return (
    <View style={styles.container}>
      <Text style={styles.mainText}>
        All Public notes of player: {route.params.player.player_full_name}
      </Text>
      <FlatList
        style={styles.list}
        data={notes}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({item, index}) => {
          if (item.coachId === getUserId()) {
            return <MyNote item={item} index={index} />;
          } else {
            return <OtherCoachNote item={item} index={index} />;
          }
        }}
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
    fontWeight: '400',
    fontSize: 14,
    marginVertical: 4,
    marginHorizontal: 10,
  },
  list: {
    paddingBottom: 150,
    width: '100%',
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
    height: 200,
    backgroundColor: Colors.primary,
    marginVertical: 15,
    alignSelf: 'center',
  },
  previewOtherContainer: {
    width: 300,
    height: 200,
    backgroundColor: 'lightgray',
    marginVertical: 15,
    alignSelf: 'center',
  },
  primary: {
    color: Colors.primary,
  },
  white: {
    color: 'white',
  },
  viewDetails: {
    marginBottom: 10,
    marginTop: 'auto',
    alignSelf: 'center',
  },
});
