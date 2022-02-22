import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Feather';

import {Colors, GlobalStyles} from '../Styles/GlobalStyles';
import {Button} from 'react-native-paper';
import {navigate} from '../Navigation/NavigationUtils';

const Confirm = () => {
  function handleConfirm() {
    navigate('Login', {});
  }

  return (
    <View style={GlobalStyles.centerView}>
      <Text style={styles.boldText}>Account sent for approval</Text>
      <Icon name="check" style={styles.icon} />
      <Text style={styles.text}>
        Account needs to be approved before you can access the app.
      </Text>
      <Button
        onPress={() => handleConfirm()}
        mode="contained"
        style={styles.button}>
        Confirm
      </Button>
    </View>
  );
};

export default Confirm;

const styles = StyleSheet.create({
  boldText: {
    fontSize: 21,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: Colors.primary,
    marginVertical: 20,
    width: 150,
  },
  icon: {
    color: Colors.primary,
    fontSize: 100,
    marginVertical: 20,
  },
  text: {
    marginVertical: 20,
    width: 270,
  },
});
