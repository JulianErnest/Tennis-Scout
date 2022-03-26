import {StyleSheet, View} from 'react-native';
import React from 'react';
import {Colors, GlobalStyles} from '../../Styles/GlobalStyles';
import AppDashboardLink from '../../Components/AppDashboardLink';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/Feather';

import {useAppDispatch} from '../../State/hooks';
import {deleteUserType} from '../../Helpers/StorageFunctions';
import {resetAccount} from '../../State/Features/account/accountSlice';
import {resetApplications} from '../../State/Features/applications/applicationsSlice';
import {resetMatch} from '../../State/Features/match/matchSlice';
import {resetMe} from '../../State/Features/me/meSlice';

const AdminDashboard = () => {
  const dispatch = useAppDispatch();
  function handleLogout() {
    dispatch(resetApplications());
    dispatch(resetAccount());
    dispatch(resetMatch());
    dispatch(resetMe());
    try {
      auth().signOut();
      deleteUserType();
    } catch (e) {
      console.log('Error logging out', e);
    }
  }
  return (
    <View style={GlobalStyles.centerView}>
      <View style={styles.logoutContainer}>
        <Icon
          onPress={handleLogout}
          name="log-out"
          color={Colors.primary}
          size={30}
        />
      </View>
      <AppDashboardLink
        route="CoachDetails"
        icon="users"
        label="All Coaches"
        navprops={{}}
      />
      <AppDashboardLink
        route="PendingApplications"
        icon="user-plus"
        label="Pending Applications"
        navprops={{}}
      />
      <AppDashboardLink
        route="MatchDetails"
        icon="file-text"
        label="All Matches"
        navprops={{}}
      />
    </View>
  );
};

export default AdminDashboard;

const styles = StyleSheet.create({
  logoutContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
});
