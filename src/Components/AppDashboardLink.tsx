import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import React from 'react';
import {Colors} from '../Styles/GlobalStyles';
import {navigate} from '../Navigation/NavigationUtils';

type AppDashboardLinkProps = {
  icon: string;
  label: string;
  route: string;
  navprops: {};
};

const AppDashboardLink = ({
  icon,
  label,
  route,
  navprops,
}: AppDashboardLinkProps) => {
  return (
    <View style={styles.mainContainer}>
      <TouchableOpacity
        onPress={() => navigate(route, navprops)}
        style={styles.container}>
        <Icon style={styles.icon} name={icon} />
      </TouchableOpacity>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

export default AppDashboardLink;

const styles = StyleSheet.create({
  container: {
    width: 150,
    height: 130,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    color: 'white',
    fontSize: 50,
  },
  label: {
    marginTop: 5,
    fontSize: 15,
    textAlign: 'center',
    color: 'black',
  },
  mainContainer: {
    margin: 15,
    width: 150,
  },
});
