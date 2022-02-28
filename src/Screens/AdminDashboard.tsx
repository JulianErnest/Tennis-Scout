import {View} from 'react-native';
import React from 'react';
import {GlobalStyles} from '../Styles/GlobalStyles';
import AppDashboardLink from '../Components/AppDashboardLink';

const AdminDashboard = () => {
  return (
    <View style={GlobalStyles.centerView}>
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
