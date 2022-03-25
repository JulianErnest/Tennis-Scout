export type OpponentArea = {
  rating: number;
  notes: string;
};

export type NetFrequency = 'Rarely' | 'Sometimes' | 'Always';

export type FormValues = {
  playerId: string;
  useExistingPlayer?: boolean;
  playerFirstName?: string;
  playerLastName?: string;
  opponentFirstName: string;
  opponentLastName: string;
  tournamentName: string;
  tournamentDate: number;
  serve: OpponentArea;
  forehand: OpponentArea;
  backhand: OpponentArea;
  movement: OpponentArea;
  volleysAndNetPlay: OpponentArea;
  netFrequency: NetFrequency;
  isShareable: boolean;
  generalComments: string;
};

export type MatchDetails = FormValues & {
  dateCreated: number;
  matchId: string;
  coachId: string;
  coachFirstName: string;
  coachLastName: string;
};

export type InitialState = {
  enableScroll: boolean;
  matchNotes: MatchDetails[];
  filteredNotes: MatchDetails[];
  hasFetchedNotes: boolean;
  notesLength: number;
};
