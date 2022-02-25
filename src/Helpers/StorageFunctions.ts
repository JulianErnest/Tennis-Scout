import EncryptedStorage from 'react-native-encrypted-storage';
import {UserType} from '../State/Features/me/meSlice';

export function setUserType(userType: UserType) {
  return EncryptedStorage.setItem('userType', userType);
}

export function deleteUserType() {
  return EncryptedStorage.removeItem('userType');
}

export function getUserType() {
  return EncryptedStorage.getItem('userType');
}
