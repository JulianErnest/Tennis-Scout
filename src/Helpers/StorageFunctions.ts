import EncryptedStorage from 'react-native-encrypted-storage';
import {FormValues} from '../State/Features/match/MatchTypes';
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

export async function saveMatchNotes(values: FormValues) {
  try {
    await EncryptedStorage.setItem('matchNotes', JSON.stringify(values));
    return true;
  } catch (e) {
    console.log('Save match notes error storagefunctions', e);
    return false;
  }
}

export async function getMatchNotes() {
  try {
    const saved = await EncryptedStorage.getItem('matchNotes');
    if (saved) {
      return JSON.parse(saved);
    }
    return false;
  } catch (e) {
    console.log('Get match notes error storagefunctions', e);
    return false;
  }
}

export async function deleteMatchNotes() {
  await EncryptedStorage.removeItem('matchNotes');
}
