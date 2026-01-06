import { SupabaseClient } from "@supabase/supabase-js";

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
  supabase: SupabaseClient<any, "public", any> | undefined
  isLoading: boolean

  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setErrorMessages: (errorMessages: string[]) => void;
  clearErrorMessages?: () => void;
  setUser: (user?: User) => void;
  clearUser?: () => void;
  setActiveGroup: (group?: Group) => void
  setActiveSchedule: (schedule?: Schedule) => void
  setSupabase: (client: SupabaseClient<any, "public", any>) => void
  setLoading: (loading: boolean) => void
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
  startedAt?: Date;
  ended?: boolean;
  partners?: Partner[];
  createdAt: Date;
}

export interface Court {
  id: string;
  number?: string;
  matches?: Match[];
  createdAt: Date;
}

export interface Schedule {
  id: string;
  endedAt?: Date;
  players?: User[];
  courts?: Court[];
  group: Group;
  createdAt: Date;
}

export interface Group {
  id: string;
  name: string;
  levelCategory: LevelCategory;
  schedules: Schedule[];
  players: User[];
  managedBy: string | User;
  lastPlayed: Date;
  createdAt: Date;
}

export interface Option {
 label: string,
  value: string 
}

export type CourtMode = "PRE-GAME" | "IN-GAME" | "POST-GAME" | "PLACEHOLDER";

export type ToastType = 'success' | 'error' | 'info' | 'warning';