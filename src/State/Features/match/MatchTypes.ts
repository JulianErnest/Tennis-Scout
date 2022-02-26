export type OpponentArea = {
  rating: number;
  notes: string;
};

export type NetFrequency = 'Rarely' | 'Sometimes' | 'Always';

export type FormValues = {
  opponentFirstName: string;
  opponentLastName: string;
  tournamentName: string;
  tournamentDate: number;
  serve: OpponentArea;
  forehand: OpponentArea;
  backhand: OpponentArea;
  movement: OpponentArea;
  volleys: OpponentArea;
  netPlay: OpponentArea;
  netFrequency: NetFrequency;
  isShareable: boolean;
  generalComments: string;
};

export type MatchDetails = FormValues & {
  dateCreated: number;
  matchId: string;
  coachId: string;
};

export type InitialState = {
  enableScroll: boolean;
  matchNotes: MatchDetails[];
  filteredNotes: MatchDetails[];
  hasFetchedNotes: boolean;
  notesLength: number;
};
