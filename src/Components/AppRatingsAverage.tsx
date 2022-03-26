import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

import {
  selectMyRatingAverage,
  selectOtherRatingAverage,
} from '../State/Features/players/searchSlice';
import {useAppSelector} from '../State/hooks';
import {Colors} from '../Styles/GlobalStyles';

const AppRatingsAverage = () => {
  const myAverageRating = useAppSelector(selectMyRatingAverage);
  const otherAverageRating = useAppSelector(selectOtherRatingAverage);
  return (
    <View style={styles.mainContainer}>
      <Text style={styles.label}>Serve Rating Averages</Text>
      <View style={styles.line}>
        <View style={[styles.circle, {left: 29 * myAverageRating.serve}]} />
        <View
          style={[
            styles.circle,
            styles.gray,
            {left: 29 * otherAverageRating.serve},
          ]}
        />
      </View>
      <Text style={styles.label}>Forehand Rating Averages</Text>
      <View style={styles.line}>
        <View style={[styles.circle, {left: 29 * myAverageRating.forehand}]} />
        <View
          style={[
            styles.circle,
            styles.gray,
            {left: 29 * otherAverageRating.forehand},
          ]}
        />
      </View>
      <Text style={styles.label}>Backhand Averages</Text>
      <View style={styles.line}>
        <View style={[styles.circle, {left: 29 * myAverageRating.backhand}]} />
        <View
          style={[
            styles.circle,
            styles.gray,
            {left: 29 * otherAverageRating.backhand},
          ]}
        />
      </View>
      <Text style={styles.label}>Movement Averages</Text>
      <View style={styles.line}>
        <View style={[styles.circle, {left: 29 * myAverageRating.forehand}]} />
        <View
          style={[
            styles.circle,
            styles.gray,
            {left: 29 * otherAverageRating.forehand},
          ]}
        />
      </View>
      <Text style={styles.label}>Volley & Net Play Averages</Text>
      <View style={styles.line}>
        <View style={[styles.circle, {left: 29 * myAverageRating.forehand}]} />
        <View
          style={[
            styles.circle,
            styles.gray,
            {left: 29 * otherAverageRating.forehand},
          ]}
        />
      </View>
    </View>
  );
};

export default AppRatingsAverage;

const styles = StyleSheet.create({
  circle: {
    width: 20,
    height: 20,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    position: 'absolute',
    top: -10,
  },
  gray: {
    backgroundColor: 'lightgray',
  },
  label: {
    marginTop: 30,
    fontSize: 20,
  },
  line: {
    height: 3,
    marginTop: 30,
    flex: 1,
    width: 290,
    backgroundColor: 'black',
    flexDirection: 'row',
  },
  mainContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});
