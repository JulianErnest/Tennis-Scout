import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import DatePicker from 'react-native-date-picker';
import Icon from 'react-native-vector-icons/Feather';

import {Colors} from '../Styles/GlobalStyles';
import {getFormattedDate} from '../Helpers/DateFunctions';

type AppDatePickerProps = {
  label: string;
  labelColor: string;
  setDate: (date: Date) => void;
  value: number;
  date: Date;
};

const AppDatePicker = (props: AppDatePickerProps) => {
  const {setDate} = props;
  const [seen, setSeen] = useState(false);
  return (
    <>
      {seen && (
        <DatePicker
          modal
          mode="date"
          open={seen}
          date={props.date}
          onConfirm={selectedDate => setDate(selectedDate)}
          onCancel={() => setSeen(false)}
        />
      )}
      <View>
        <Text style={{color: props.labelColor}}>{props.label}</Text>
        <View style={styles.container}>
          <Text>{props.date && getFormattedDate(props.date)}</Text>
          <Icon
            style={styles.icon}
            name="calendar"
            onPress={() => setSeen(true)}
          />
        </View>
      </View>
    </>
  );
};

export default AppDatePicker;

const styles = StyleSheet.create({
  container: {
    width: 270,
    marginVertical: 20,
    height: 38,
    borderWidth: 0.3,
    borderColor: Colors.primary,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    justifyContent: 'space-between',
  },
  datePicker: {
    backgroundColor: 'white',
    marginRight: 220,
    width: 270,
  },
  icon: {
    color: Colors.primary,
    fontSize: 20,
  },
  picker: {},
});
