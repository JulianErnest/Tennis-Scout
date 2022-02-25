import {Text, StyleSheet} from 'react-native';
import React from 'react';

const AppErrorText = ({error, color}: {error: string; color: string}) => {
  return <Text style={[styles.error, {color: color}]}>{error}</Text>;
};

export default AppErrorText;

const styles = StyleSheet.create({
  error: {
    color: 'red',
    marginTop: -20,
    marginBottom: 15,
  },
});
