import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import auth from '@react-native-firebase/auth';

import {Colors} from '../Styles/GlobalStyles';
import {useAppDispatch, useAppSelector} from '../State/hooks';
import {selectUserDetails} from '../State/Features/me/meSlice';
import AppDashboardLink from '../Components/AppDashboardLink';
import {
  fetchMatchNotes,
  selectMatchNotes,
} from '../State/Features/match/matchSlice';
import {setAccountDetails} from '../State/Features/account/accountSlice';

const CoachDashboard = () => {
  const dispatch = useAppDispatch();
  const userDetails = useAppSelector(selectUserDetails);
  const uid = auth().currentUser?.uid;
  const matchNotes = useAppSelector(selectMatchNotes);
  useEffect(() => {
    dispatch(fetchMatchNotes(uid as string));
    dispatch(setAccountDetails(userDetails));
  }, [dispatch, uid, userDetails]);
  return (
    <View style={styles.container}>
      <Text style={styles.coachNameAndPlayer}>
        {userDetails.coachFirstName + ' '}
        {userDetails.coachLastName + ' '}
        of
        {' ' + userDetails.currentFirstName + ' '}
        {userDetails.currentLastName}
      </Text>
      <View style={[styles.row, styles.headerInfo]}>
        <View style={[styles.column, styles.headerInfoContainer]}>
          <Text style={styles.lightText}>Number of opponent notes entered</Text>
          <Text style={styles.number}>{matchNotes.length}</Text>
        </View>
        <View style={[styles.column, styles.headerInfoContainer]}>
          <Text style={styles.lightText}>Last Entry</Text>
          {matchNotes.length === 0 ? (
            <Text style={styles.versusName}>No entry yet</Text>
          ) : (
            <>
              <Text style={styles.versusName}>
                {`vs ${userDetails.lastOpponentLastName}`}
              </Text>
              <Text style={styles.versusTournament}>
                {userDetails.lastOpponentTournament ?? ''}
              </Text>
            </>
          )}
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.column}>
          <AppDashboardLink
            navprops={{coachId: uid, type: 'create'}}
            icon={'edit'}
            label={'Enter Match Notes'}
            route={'MatchNotes'}
          />
        </View>
        <View style={styles.column}>
          <AppDashboardLink
            navprops={{coachId: uid}}
            icon={'database'}
            label={'View All Notes'}
            route={'AllNotes'}
          />
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.column}>
          <AppDashboardLink
            navprops={{}}
            icon={'search'}
            label={'Search Opponent'}
            route={'SearchOpponent'}
          />
        </View>
        <View style={styles.column}>
          <AppDashboardLink
            navprops={{coachId: uid}}
            icon={'user'}
            label={'View All Notes'}
            route={'Update Account'}
          />
        </View>
      </View>
    </View>
  );
};

export default CoachDashboard;

const styles = StyleSheet.create({
  coachNameAndPlayer: {
    textAlign: 'left',
    width: '100%',
    marginLeft: 30,
    fontSize: 20,
  },
  column: {
    flexBasis: '50%',
    justifyContent: 'flex-start',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 30,
  },
  headerInfo: {
    marginLeft: 15,
    marginTop: 40,
  },
  lightText: {
    fontWeight: '400',
    color: 'black',
  },
  number: {
    fontSize: 30,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  row: {
    marginVertical: 9,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  versusName: {
    fontWeight: 'bold',
    fontSize: 22,
    color: Colors.primary,
  },
  versusTournament: {
    fontWeight: 'bold',
    fontSize: 23,
    color: Colors.primary,
  },
  headerInfoContainer: {
    height: 50,
    marginBottom: 20,
  },
});
