import { Colors } from "@/constants/Colors";
import { Court, Group, Match, User } from "@/constants/types";
import { Dimensions } from "react-native";
import uuid from 'react-native-uuid';

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
  switch(name) {
    case "advanced":
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
  return court.match?.some(match => match.partners?.some(partner => partner?.users?.some(user => user.id === player.id)))
}

export function queuePlayer(court: Court, user: User) {
  const tempCourt = {...court};

  if(isNullOrEmpty(tempCourt.match)) {
    const match: Match = {
      id: uuid.v4(),
      partners: [],
      ended: false,
      createdAt: new Date()
    }
    tempCourt.match = [];
    tempCourt.match.push(match);
  }
  const lastMatchIndex = (tempCourt.match?.length || 1) - 1;

  if(isNullOrEmpty(tempCourt.match![lastMatchIndex].partners))
    tempCourt.match![lastMatchIndex].partners = [];
  if(tempCourt.match![lastMatchIndex].partners!.length < 3) {
    //let lastPartnersIndex = (tempCourt!.match![lastMatchIndex].partners?.length || 1) - 1;
    let lastPartnersIndex = 0;
    
    if(tempCourt.match![lastMatchIndex].partners!.length > 0) {
        lastPartnersIndex = (tempCourt!.match![lastMatchIndex].partners?.findIndex(part => (part.users?.length || 0) < 2)) || 0;
        if(lastPartnersIndex === -1)
          lastPartnersIndex = (tempCourt!.match![lastMatchIndex].partners?.length || 1) - 1;
    }

    if(tempCourt.match![lastMatchIndex].partners![lastPartnersIndex] == null) {
      tempCourt.match![lastMatchIndex].partners![lastPartnersIndex] = {
        id: uuid.v4(),
        users: [],
        createdAt: new Date()
      }
    }

    if(isNullOrEmpty(tempCourt.match![lastMatchIndex].partners![lastPartnersIndex]?.users)) {
      tempCourt.match![lastMatchIndex].partners![lastPartnersIndex].users = []
    }
    if(tempCourt.match![lastMatchIndex].partners![lastPartnersIndex].users!.length < 2)
      tempCourt.match![lastMatchIndex].partners![lastPartnersIndex].users?.push(user);
    else {
      tempCourt.match![lastMatchIndex].partners!.push({
        id: uuid.v4(),
        users: [],
        createdAt: new Date()
      });
      lastPartnersIndex = (tempCourt!.match![lastMatchIndex].partners?.length || 1) - 1;
      tempCourt.match![lastMatchIndex].partners![lastPartnersIndex].users?.push(user);
    }
  }
  return tempCourt;
}

export function isPlayerInSchedule(group: Group, userId: string) {
  return !group.schedules.find(sched => !sched.ended)!.players?.some(qp => qp.id === userId)
  
}