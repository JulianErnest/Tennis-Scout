import {StyleSheet, Text, View} from 'react-native';
import {TextInput} from 'react-native-paper';
import React from 'react';

import {Colors} from '../Styles/GlobalStyles';

type AppInputLabelProps = {
  labelColor: string;
  label: string;
  placeholder: string;
  value: string;
  error: boolean;
  onChange: (text: string) => void;
};

const AppInputLabel = (props: AppInputLabelProps) => {
  const {value, onChange, error} = props;
  return (
    <View>
      <Text style={{color: props.labelColor}}>{props.label}</Text>
      <TextInput
        error={error}
        placeholder={props.placeholder}
        style={styles.textInput}
        onChangeText={text => onChange(text)}
        theme={{colors: {primary: Colors.primary}}}
        value={value}
      />
    </View>
  );
};

export default AppInputLabel;

const styles = StyleSheet.create({
  textInput: {
    width: 270,
    marginVertical: 20,
    height: 50,
    borderWidth: 0.3,
    borderColor: Colors.primary,
  },
});
