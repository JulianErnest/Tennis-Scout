export type Rating = {
  serve: number;
  forehand: number;
  backhand: number;
  movement: number;
  volleyAndNetPlay: number;
};

export type RatingKey = keyof Rating;
