import {Text, StyleSheet} from 'react-native';
import React from 'react';

const AppErrorText = ({error}: {error: string}) => {
  return <Text style={styles.error}>{error}</Text>;
};

export default AppErrorText;

const styles = StyleSheet.create({
  error: {
    color: 'red',
    marginTop: -20,
    marginBottom: 15,
  },
});
