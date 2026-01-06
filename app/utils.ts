import { Colors } from "@/constants/Colors";
import { Court, Group, Match, Schedule, User } from "@/constants/types";
import { ParamListBase, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationOptions, NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Dimensions } from "react-native";
import { camelCase } from 'lodash';
import uuid from 'react-native-uuid';


export const screenOptions : NativeStackNavigationOptions | ((props: {
    route: RouteProp<ParamListBase, string>;
    navigation: NativeStackNavigationProp<ParamListBase, string, undefined>;
    theme: ReactNavigation.Theme;
}) => NativeStackNavigationOptions) = {
  headerStyle: { backgroundColor: 'transparent' },
  headerShown: false
}

export function cssStringToObject(css: string): Record<string, string> {
  const result: Record<string, string> = {};

  css.split(";").map(rule => rule.trim()).filter(Boolean).forEach(rule => {
    const [property, value] = rule.split(":").map(part => part.trim());
    if (property && value !== undefined) {
      result[property] = value;
    }
  });

  return result;
}

export function isMobileWidth(): boolean {
  return Dimensions.get("window").width < 768;
}

export function parseDoc<T>(object: any): T {
  return JSON.parse(JSON.stringify(object));
}

export function fetchColorByLevel(name: string) {
  switch(name?.toLowerCase()) {
    case "expert":
      return {
        bgColor: Colors.red,
        fgColor: Colors.darkRed
      };
    case "intermediate":
      return {
        bgColor: Colors.blue,
        fgColor: Colors.darkBlue
      }
    case "beginner":
    default:
      return {
        bgColor: Colors.gradientStopperLight,
        fgColor: Colors.darkGreen
      }
  }
}

export function isNullOrEmpty(arr?: any[]) {
  return !arr || !arr.length;
}

export function isPlayerInCourt(court: Court, player: User) {
  return court.matches?.some(match => match.partners?.some(partner => partner?.users?.some(user => user.id === player.id)))
}

export function queuePlayer(court: Court, user: User) {
  const tempCourt = {...court};

  if(isNullOrEmpty(tempCourt.matches)) {
    const match: Match = {
      id: uuid.v4(),
      partners: [],
      ended: false,
      createdAt: new Date()
    }
    tempCourt.matches = [];
    tempCourt.matches.push(match);
  }
  const lastMatchIndex = (tempCourt.matches?.length || 1) - 1;

  if(isNullOrEmpty(tempCourt.matches![lastMatchIndex].partners))
    tempCourt.matches![lastMatchIndex].partners = [];
  if(tempCourt.matches![lastMatchIndex].partners!.length < 3) {
    //let lastPartnersIndex = (tempCourt!.match![lastMatchIndex].partners?.length || 1) - 1;
    let lastPartnersIndex = 0;
    
    if(tempCourt.matches![lastMatchIndex].partners!.length > 0) {
        lastPartnersIndex = (tempCourt!.matches![lastMatchIndex].partners?.findIndex(part => (part.users?.length || 0) < 2)) || 0;
        if(lastPartnersIndex === -1)
          lastPartnersIndex = (tempCourt!.matches![lastMatchIndex].partners?.length || 1) - 1;
    }

    if(tempCourt.matches![lastMatchIndex].partners![lastPartnersIndex] == null) {
      tempCourt.matches![lastMatchIndex].partners![lastPartnersIndex] = {
        id: uuid.v4(),
        users: [],
        createdAt: new Date()
      }
    }

    if(isNullOrEmpty(tempCourt.matches![lastMatchIndex].partners![lastPartnersIndex]?.users)) {
      tempCourt.matches![lastMatchIndex].partners![lastPartnersIndex].users = []
    }
    if(tempCourt.matches![lastMatchIndex].partners![lastPartnersIndex].users!.length < 2)
      tempCourt.matches![lastMatchIndex].partners![lastPartnersIndex].users?.push(user);
    else {
      tempCourt.matches![lastMatchIndex].partners!.push({
        id: uuid.v4(),
        users: [],
        createdAt: new Date()
      });
      lastPartnersIndex = (tempCourt!.matches![lastMatchIndex].partners?.length || 1) - 1;
      tempCourt.matches![lastMatchIndex].partners![lastPartnersIndex].users?.push(user);
    }
  }
  return tempCourt;
}

export function isPlayerInSchedule(userId: string, schedule?: Schedule) {
  return schedule?.players?.some(qp => qp.id === userId)
  
}

export function camelizeKeys(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(v => camelizeKeys(v));
  } else if (obj != null && obj.constructor === Object) {
    return Object.keys(obj).reduce(
      (result, key) => ({
        ...result,
        [camelCase(key)]: camelizeKeys(obj[key]),
      }),
      {},
    );
  }
  return obj;
};

export function toSnakeCase(str: string): string {
  return str
    .replace(/([A-Z])/g, "_$1") // insert underscore before capital letters
    .replace(/[-\s]+/g, "_") // replace spaces/dashes with underscores
    .toLowerCase()
    .replace(/^_+/, ""); // remove leading underscores
}

export function keysToSnakeCase<T>(obj: T): any {
  if (Array.isArray(obj)) {
    return obj.map(keysToSnakeCase);
  } else if (obj !== null && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [
        toSnakeCase(k),
        keysToSnakeCase(v),
      ])
    );
  }
  return obj;
}

export function getNextMissing(arr: number[]): number {
  if (arr.length === 0) return 1; // if empty, start at 1

  const sorted = [...arr].sort((a, b) => a - b);

  for (let i = sorted[0]; i <= sorted[sorted.length - 1]; i++) {
    if (!sorted.includes(i)) {
      return i; // return first missing
    }
  }

  // if no missing numbers, return next in sequence
  return sorted[sorted.length - 1] + 1;
}

export function darkenColor(hex: string, percent: number): string {
  // Clamp and sanitize
  const p = Math.min(Math.max(percent, 0), 100);
  let clean = hex.replace("#", "");

  // Support shorthand #abc
  if (clean.length === 3) {
    clean = clean.split("").map(c => c + c).join("");
  }
  if (clean.length !== 6) {
    throw new Error(`Invalid hex color: ${hex}`);
  }

  const num = parseInt(clean, 16);
  let r = (num >> 16) & 0xff;
  let g = (num >> 8) & 0xff;
  let b = num & 0xff;

  const factor = 1 - p / 100;

  r = Math.round(r * factor);
  g = Math.round(g * factor);
  b = Math.round(b * factor);

  return (
    "#" +
    [r, g, b]
      .map(x => x.toString(16).padStart(2, "0"))
      .join("")
      .toLowerCase()
  );
}

