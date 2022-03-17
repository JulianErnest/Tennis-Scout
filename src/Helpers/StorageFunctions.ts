import EncryptedStorage from 'react-native-encrypted-storage';
import {FormValues} from '../State/Features/match/MatchTypes';
import {UserType} from '../State/Features/me/meSlice';

const USER_CREDENTIALS_KEY = 'userCredentials';
const USER_TYPE_KEY = 'userType';
const MATCH_NOTES_KEY = 'matchNotes';

export async function saveUserCredentials(email: string, password: string) {
  try {
    await EncryptedStorage.setItem(
      USER_CREDENTIALS_KEY,
      JSON.stringify({email, password}),
    );
    return true;
  } catch (e) {
    console.log('Error saving user credentials StorageFunctions', e);
    return false;
  }
}

export async function getSavedUserCredentials() {
  try {
    const userCredentials = await EncryptedStorage.getItem(
      USER_CREDENTIALS_KEY,
    );
    if (userCredentials) {
      return JSON.parse(userCredentials);
    } else {
      return false;
    }
  } catch (e) {
    console.log('Error getting user credentials StorageFunctions', e);
  }
}

export function setUserType(userType: UserType) {
  return EncryptedStorage.setItem(USER_TYPE_KEY, userType);
}

export function deleteUserType() {
  return EncryptedStorage.removeItem(USER_TYPE_KEY);
}

export function getUserType() {
  return EncryptedStorage.getItem(USER_TYPE_KEY);
}

export async function saveMatchNotes(values: FormValues) {
  try {
    await EncryptedStorage.setItem(MATCH_NOTES_KEY, JSON.stringify(values));
    return true;
  } catch (e) {
    console.log('Save match notes error storagefunctions', e);
    return false;
  }
}

export async function getMatchNotes() {
  try {
    const saved = await EncryptedStorage.getItem(MATCH_NOTES_KEY);
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
  const match = await getMatchNotes();
  if (match) {
    return await EncryptedStorage.removeItem(MATCH_NOTES_KEY);
  }
}
