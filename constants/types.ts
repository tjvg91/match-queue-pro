export interface LevelCategory {
  id: string;
  name: string;
  createdAt: Date;
}

export interface Level {
  id: string;
  category: LevelCategory;
  name: string;
  level: number;
  createdAt: Date;
}

export interface User {
  id: string;
  username: string;
  email?: string;
  sex?: 'male' | 'female'
  password?: string;
  level: Level;
  order?: number;
  gameCount?: number;
  createdAt: Date;
  verified?: boolean;
}

export interface MQStore {
  isAuthenticated: boolean;
  user?: User;
  errorMessages?: string[];
  activeGroup?: Group
  activeSchedule?: Schedule

  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setErrorMessages?: (errorMessages: string[]) => void;
  clearErrorMessages?: () => void;
  setUser?: (user: User) => void;
  clearUser?: () => void;
  setActiveGroup?: (group: Group) => void
  setActiveSchedule?: (schedule: Schedule) => void
}

export interface Partner {
  id: string; 
  users?: User[];
  score?: number;
  result?: "W" | "L";
  createdAt: Date;
}

export interface Match {
  id: string;
  ended?: boolean;
  partners?: Partner[];
  createdAt: Date;
}

export interface Court {
  id: string;
  number?: string;
  match?: Match[];
  createdAt: Date;
}

export interface Schedule {
  id: string;
  ended?: boolean;
  players?: User[];
  courts?: Court[];
}

export interface Group {
  id: string;
  name: string;
  levelCategory: LevelCategory;
  schedules: Schedule[];
  players: User[];
  lastPlayed: Date;
  createdAt: Date;
}

export type CourtMode = "PRE-GAME" | "IN-GAME" | "POST-GAME" | "PLACEHOLDER";