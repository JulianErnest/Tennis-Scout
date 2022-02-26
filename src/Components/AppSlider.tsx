import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Slider from '@react-native-community/slider';
import {Colors} from '../Styles/GlobalStyles';
import {useAppDispatch} from '../State/hooks';
import {setEnableScroll} from '../State/Features/match/matchSlice';

type AppSliderProps = {
  value: number;
  handleValueChange: (val: number) => void;
  disabled: boolean;
  label: string;
};

const AppSlider = (props: AppSliderProps) => {
  const {handleValueChange} = props;
  const dispatch = useAppDispatch();
  return (
    <View style={styles.container}>
      {props.label !== '' && (
        <Text>
          {props.label}: {props.value}/10
        </Text>
      )}
      <Slider
        step={1}
        value={props.value}
        disabled={props.disabled}
        onValueChange={value => handleValueChange(value)}
        onSlidingStart={() => dispatch(setEnableScroll(true))}
        style={styles.slider}
        minimumValue={1}
        maximumValue={10}
        minimumTrackTintColor={Colors.primary}
      />
    </View>
  );
};

export default AppSlider;

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  slider: {
    width: 300,
    height: 40,
  },
});
