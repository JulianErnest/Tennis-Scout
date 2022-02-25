import {StyleSheet} from 'react-native';

export const Colors = {
  primary: '#FF5757',
  dityWhite: '#AF9797',
  lightGray: '#EEEEEE',
};

export const GlobalStyles = StyleSheet.create({
  centerView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerTopView: {
    flex: 1,
    alignItems: 'center',
  },
  whiteDivider: {
    backgroundColor: Colors.dityWhite,
  },
});
