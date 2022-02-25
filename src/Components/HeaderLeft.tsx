import {Image, StyleSheet} from 'react-native';
import React from 'react';

const HeaderLeft = () => {
  return (
    <Image source={require('../Assets/logo-white.png')} style={styles.image} />
  );
};

export default HeaderLeft;

const styles = StyleSheet.create({
  image: {
    width: 70,
    height: 70,
  },
});
