import {FlatList, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import db from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/Feather';
import Toast from 'react-native-toast-message';

import {
  Application,
  setApplications,
  selectApplications,
  acceptApplication,
  rejectApplication,
} from '../State/Features/applications/applicationsSlice';
import {useAppDispatch, useAppSelector} from '../State/hooks';
import {Colors, GlobalStyles} from '../Styles/GlobalStyles';

const PendingApplications = () => {
  const dispatch = useAppDispatch();
  const applications = useAppSelector(selectApplications);
  useEffect(() => {
    (() => {
      const subscription = db()
        .collection('Applications')
        .onSnapshot(snapshot => {
          let docs: Application[] = [];
          snapshot.forEach(doc => docs.push(doc.data() as Application));
          dispatch(setApplications(docs));
        });
      return subscription;
    })();
  }, [dispatch]);

  async function handleAccept(application: Application) {
    const res = await dispatch(acceptApplication(application)).unwrap();
    Toast.show({
      type: res ? 'success' : 'error',
      text1: res
        ? 'Application accepted succesfully'
        : 'Unable to accept application, try again later',
      visibilityTime: 2000,
    });
  }

  async function handleReject(application: Application) {
    const res = await dispatch(rejectApplication(application)).unwrap();
    Toast.show({
      type: res ? 'success' : 'error',
      text1: res
        ? 'Application rejected succesfully'
        : 'Unable to reject application, try again later',
      visibilityTime: 2000,
    });
  }

  return (
    <View style={GlobalStyles.centerTopView}>
      <FlatList
        style={styles.flatList}
        data={applications}
        keyExtractor={data => data.email}
        renderItem={({item}) => (
          <View style={styles.container}>
            <Text style={styles.email}>Email: {item.email}</Text>
            <View style={styles.actionsRow}>
              <Icon
                style={styles.icon}
                onPress={() => handleAccept(item)}
                name="check"
                color="white"
                size={25}
              />
              <Icon
                style={styles.icon}
                name="x"
                onPress={() => handleReject(item)}
                color="white"
                size={25}
              />
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default PendingApplications;

const styles = StyleSheet.create({
  actionsRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  container: {
    width: 300,
    height: 100,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 15,
    borderRadius: 15,
  },
  email: {
    color: 'white',
  },
  icon: {
    marginHorizontal: 30,
  },
  flatList: {
    marginTop: 50,
  },
});
