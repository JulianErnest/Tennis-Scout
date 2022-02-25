import {View} from 'react-native';
import React from 'react';
import {GlobalStyles} from '../Styles/GlobalStyles';
import AppDashboardLink from '../Components/AppDashboardLink';

const AdminDashboard = () => {
  return (
    <View style={GlobalStyles.centerView}>
      <AppDashboardLink route="AllCoaches" icon="users" label="All Coaches" />
      <AppDashboardLink
        route="PendingApplications"
        icon="user-plus"
        label="Pending Applications"
      />
      <AppDashboardLink
        route="AllMatches"
        icon="file-text"
        label="All Matches"
      />
    </View>
  );
};

export default AdminDashboard;
