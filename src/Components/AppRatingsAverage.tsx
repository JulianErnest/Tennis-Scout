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
        <View style={[styles.circle, {left: 27 * myAverageRating.serve}]} />
        <Text style={[styles.myRating, {left: 27.2 * myAverageRating.serve}]}>
          {myAverageRating.serve}
        </Text>
        <Text
          style={[styles.otherRating, {left: 27.2 * otherAverageRating.serve}]}>
          {otherAverageRating.serve}
        </Text>
        <View
          style={[
            styles.circle,
            styles.gray,
            {left: 27 * otherAverageRating.serve},
          ]}
        />
      </View>
      <Text style={styles.label}>Forehand Rating Averages</Text>
      <View style={styles.line}>
        <View style={[styles.circle, {left: 27 * myAverageRating.forehand}]} />
        <Text
          style={[styles.myRating, {left: 27.2 * myAverageRating.forehand}]}>
          {myAverageRating.forehand}
        </Text>
        <Text
          style={[
            styles.otherRating,
            {left: 27.2 * otherAverageRating.forehand},
          ]}>
          {otherAverageRating.forehand}
        </Text>
        <View
          style={[
            styles.circle,
            styles.gray,
            {left: 27 * otherAverageRating.forehand},
          ]}
        />
      </View>
      <Text style={styles.label}>Backhand Averages</Text>
      <View style={styles.line}>
        <View style={[styles.circle, {left: 27 * myAverageRating.backhand}]} />
        <Text
          style={[styles.myRating, {left: 27.2 * myAverageRating.backhand}]}>
          {myAverageRating.backhand}
        </Text>
        <Text
          style={[
            styles.otherRating,
            {left: 27.2 * otherAverageRating.backhand},
          ]}>
          {otherAverageRating.backhand}
        </Text>
        <View
          style={[
            styles.circle,
            styles.gray,
            {left: 27 * otherAverageRating.backhand},
          ]}
        />
      </View>
      <Text style={styles.label}>Movement Averages</Text>
      <View style={styles.line}>
        <View style={[styles.circle, {left: 27 * myAverageRating.movement}]} />
        <Text
          style={[styles.myRating, {left: 27.2 * myAverageRating.movement}]}>
          {myAverageRating.movement}
        </Text>
        <Text
          style={[
            styles.otherRating,
            {left: 27.2 * otherAverageRating.movement},
          ]}>
          {otherAverageRating.movement}
        </Text>
        <View
          style={[
            styles.circle,
            styles.gray,
            {left: 27 * otherAverageRating.movement},
          ]}
        />
      </View>
      <Text style={styles.label}>Volley & Net Play Averages</Text>
      <View style={styles.line}>
        <View
          style={[styles.circle, {left: 27 * myAverageRating.volleyAndNetPlay}]}
        />
        <Text
          style={[
            styles.myRating,
            {left: 27.2 * myAverageRating.volleyAndNetPlay},
          ]}>
          {myAverageRating.volleyAndNetPlay}
        </Text>
        <Text
          style={[
            styles.otherRating,
            {left: 27.2 * otherAverageRating.volleyAndNetPlay},
          ]}>
          {otherAverageRating.volleyAndNetPlay}
        </Text>
        <View
          style={[
            styles.circle,
            styles.gray,
            {left: 27 * otherAverageRating.volleyAndNetPlay},
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
    marginTop: 35,
    fontSize: 20,
  },
  line: {
    height: 3,
    marginTop: 35,
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
  myRating: {
    fontSize: 13,
    position: 'absolute',
    color: Colors.primary,
    top: 20,
  },
  otherRating: {
    fontSize: 13,
    position: 'absolute',
    top: -30,
  },
});
