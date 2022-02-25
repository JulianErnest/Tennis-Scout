/* eslint-disable react-native/no-inline-styles */
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';

type AppRadioButtonProps = {
  checked: Boolean;
  checkedColor: string;
  label: string;
  labelColor: string;
  onPress: () => void;
};

const AppRadioButton = ({
  checked,
  checkedColor,
  label,
  labelColor,
  onPress,
}: AppRadioButtonProps) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onPress}
        style={[
          styles.button,
          {backgroundColor: checked ? checkedColor : 'white'},
        ]}
      />
      <Text style={[{color: labelColor}, styles.label]}>{label}</Text>
    </View>
  );
};

export default AppRadioButton;

const styles = StyleSheet.create({
  button: {
    width: 14,
    height: 14,
    borderRadius: 10,
  },
  container: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    marginHorizontal: 20,
    fontSize: 16,
  },
});
