import {FormValues} from './MatchTypes';

export const initialFormValues: FormValues = {
  opponentFirstName: '',
  opponentLastName: '',
  tournamentName: '',
  tournamentDate: Date.now(),
  serve: {
    rating: 0,
    notes: '',
  },
  forehand: {
    rating: 0,
    notes: '',
  },
  backhand: {
    rating: 0,
    notes: '',
  },
  movement: {
    rating: 0,
    notes: '',
  },
  volleys: {
    rating: 0,
    notes: '',
  },
  netPlay: {
    rating: 0,
    notes: '',
  },
  netFrequency: 'Rarely',
  isShareable: false,
  generalComments: '',
};
