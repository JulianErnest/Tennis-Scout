import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import ReactNativeModal from 'react-native-modal';
import Icon from 'react-native-vector-icons/Feather';
import {debounce} from 'lodash';

import {useAppDispatch, useAppSelector} from '../State/hooks';
import {
  PlayerDataList,
  selectFilteredPlayers,
  selectSearchPlayerModalVisibility,
  setFilteredPlayers,
  setSearchPlayerModalVisibility,
} from '../State/Features/players/playersSlice';
import {TextInput} from 'react-native-paper';
import {Colors} from '../Styles/GlobalStyles';

type AppPlayerListProps = {
  onPlayerPress: (playerDetails: PlayerDataList) => void;
};

const AppPlayerList = ({onPlayerPress}: AppPlayerListProps) => {
  const dispatch = useAppDispatch();
  const [search, setSearch] = useState('');
  const selectFilteredPlayerList = useAppSelector(selectFilteredPlayers);
  const searchPlayerModalVisibility = useAppSelector(
    selectSearchPlayerModalVisibility,
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceLoadData = useCallback(debounce(filterPlayers, 1000), []);

  useEffect(() => {
    debounceLoadData(search);
  }, [search, debounceLoadData, dispatch]);

  function filterPlayers(keywords: string) {
    dispatch(setFilteredPlayers(keywords));
  }

  function handleBackdropPress() {
    dispatch(setSearchPlayerModalVisibility(false));
  }
  return (
    <ReactNativeModal
      style={styles.mainContainer}
      isVisible={searchPlayerModalVisibility}
      animationInTiming={500}
      onBackdropPress={handleBackdropPress}>
      <View style={styles.searchContainer}>
        <TextInput
          value={search}
          onChangeText={t => setSearch(t)}
          theme={{colors: {primary: Colors.primary}}}
        />
        <TouchableOpacity>
          <Icon name="search" style={styles.icon} />
        </TouchableOpacity>
      </View>
      <FlatList
        contentContainerStyle={styles.contentContainer}
        style={styles.container}
        data={selectFilteredPlayerList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) => (
          <>
            <TouchableOpacity
              style={styles.player}
              onPress={() => onPlayerPress(item)}
              key={index}>
              <Text style={styles.fullName}>{item.player_full_name}</Text>
              <Text style={styles.playerId}>{item.player_id}</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
          </>
        )}
      />
    </ReactNativeModal>
  );
};

export default AppPlayerList;

const styles = StyleSheet.create({
  contentContainer: {
    width: '100%',
  },
  container: {
    backgroundColor: 'white',
    width: '90%',
  },
  divider: {
    width: '90%',
    height: 1,
    backgroundColor: Colors.primary,
  },
  fullName: {
    fontSize: 20,
    flex: 1,
  },
  icon: {
    color: Colors.primary,
    fontSize: 20,
    position: 'absolute',
    right: 20,
    top: '25%',
  },
  mainContainer: {
    backgroundColor: 'white',
    width: '100%',
    position: 'absolute',
    height: '90%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    bottom: 0,
    margin: 0,
    padding: 0,
  },
  player: {
    marginVertical: 30,
    flexDirection: 'row',
  },
  playerId: {
    marginRight: 20,
  },
  searchContainer: {
    marginTop: 30,
    width: '90%',
    alignSelf: 'center',
  },
});
