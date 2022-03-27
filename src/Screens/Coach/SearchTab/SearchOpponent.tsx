import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Button, TextInput} from 'react-native-paper';

import {useAppDispatch, useAppSelector} from '../../../State/hooks';
import {Colors} from '../../../Styles/GlobalStyles';
import {navigate} from '../../../Navigation/NavigationUtils';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {
  PlayerDataList,
  setSearchPlayerModalVisibility,
} from '../../../State/Features/players/playersSlice';
import AppPlayerList from '../../../Components/AppPlayerList';
import {
  getPlayerRatings,
  selectHasRating,
  selectMyNumberOfNotes,
  selectOtherNumberOfNotes,
} from '../../../State/Features/players/searchSlice';
import AppRatingsAverage from '../../../Components/AppRatingsAverage';

const SearchOpponent = () => {
  const dispatch = useAppDispatch();
  const [searchPlayer, setSearchPlayer] = useState<PlayerDataList>();
  // const fetchingRating = useAppSelector(selectFetchingRating);
  const myNumberOfNotes = useAppSelector(selectMyNumberOfNotes);
  const otherNumberOfNotes = useAppSelector(selectOtherNumberOfNotes);
  const hasRating = useAppSelector(selectHasRating);

  function handleSearchModalOpen() {
    dispatch(setSearchPlayerModalVisibility(true));
  }

  useEffect(() => {}, []);

  function handlePlayerPress(player: PlayerDataList) {
    setSearchPlayer(player);
    dispatch(setSearchPlayerModalVisibility(false));
    dispatch(getPlayerRatings(player.player_id));
  }

  function handleViewAllNotesPress() {
    navigate('PlayerAllNotes', {player: searchPlayer});
  }

  function handleAddNotePress() {
    navigate('CreateNote', {player: searchPlayer});
  }

  return (
    <>
      <AppPlayerList onPlayerPress={player => handlePlayerPress(player)} />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.pageLabel}>Search Opponent</Text>
        <TouchableOpacity onPress={handleSearchModalOpen}>
          <TextInput
            disabled
            value={`${searchPlayer?.player_full_name ?? 'Select a player'} ${
              searchPlayer?.player_id ?? ''
            }`}
            theme={{colors: {primary: Colors.primary}}}
            style={styles.selectPlayerContainer}
          />
        </TouchableOpacity>
        {searchPlayer && (
          <>
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.numberText}>
                  Number of notes entered by You
                </Text>
              </View>
              <View style={styles.col}>
                <Text style={styles.numberText}>
                  Number of notes entered by others
                </Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.number}>{myNumberOfNotes}</Text>
              </View>
              <View style={styles.col}>
                <Text style={styles.number}>{otherNumberOfNotes}</Text>
              </View>
            </View>
            {hasRating ? (
              <>
                <View style={styles.row}>
                  <View style={[styles.circle, styles.primaryBg]} />
                  <Text>Your rating</Text>
                  <View style={[styles.circle, styles.grayBg]} />
                  <Text>All ratings</Text>
                </View>
                <AppRatingsAverage />
              </>
            ) : (
              <Text style={styles.ratingText}>NO RATING EXISTS</Text>
            )}
            <Button
              disabled={!searchPlayer}
              style={styles.button}
              labelStyle={styles.buttonLabel}
              mode="contained"
              onPress={hasRating ? handleViewAllNotesPress : handleAddNotePress}
              theme={{colors: {primary: Colors.primary}}}>
              {hasRating ? 'See full notes' : 'Add notes'}
            </Button>
          </>
        )}
      </ScrollView>
    </>
  );
};

export default SearchOpponent;

const styles = StyleSheet.create({
  button: {
    marginVertical: 40,
  },
  buttonLabel: {
    color: 'white',
  },
  circle: {
    width: 25,
    height: 25,
    borderRadius: 50,
    marginHorizontal: 20,
  },
  col: {
    flexBasis: '50%',
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
  },
  grayBg: {
    backgroundColor: 'lightgray',
  },
  number: {
    fontSize: 40,
    textAlign: 'center',
  },
  numberText: {
    fontSize: 17,
    textAlign: 'center',
  },
  pageLabel: {
    fontSize: 25,
    fontWeight: '700',
  },
  primaryBg: {
    backgroundColor: Colors.primary,
  },
  ratingText: {
    color: Colors.primary,
    fontSize: 30,
    textAlign: 'center',
    marginTop: 100,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginTop: 20,
  },
  selectPlayerContainer: {
    width: 270,
    backgroundColor: '#e7e7e7',
    height: 38,
    borderWidth: 0.3,
    borderColor: Colors.primary,
    paddingLeft: 10,
    marginBottom: 10,
    marginTop: 20,
    flexDirection: 'row',
  },
});
