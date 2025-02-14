export interface Player {
  id: string;
  name: string;
  points: number;
  gamesPlayed: number;
  gamesWon: number;
}

export interface Match {
  id: string;
  date: string;
  team1: {
    players: string[];
    score: number;
  };
  team2: {
    players: string[];
    score: number;
  };
  completed: boolean;
}