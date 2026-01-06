import { Colors } from '@/constants/Colors';
import { Court, CourtMode, Match, User } from '@/constants/types';
import { COURT_DIMENSIONS_RATIO } from '@/constants/values';
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, DimensionValue, Pressable, findNodeHandle } from 'react-native';
import { ThemedText } from './ThemedText';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import CourtPlayer from './CourtPlayer';
import { isMobileWidth } from '@/app/utils';
import useMQStore from '@/hooks/useStore';
import { useShallow } from 'zustand/shallow';
import { Draggable, DraggableState, Droppable } from 'react-native-reanimated-dnd';

interface Props {
  court?: Court
  width: DimensionValue,
  mode?: CourtMode,
  onMatchChanged?: (court: Court, match: Match, userId: string) => void
  onAddCourt?: () => void
  onAssignCourt?: (match: Match) => void
}

const isMobile = isMobileWidth();

const CourtComponent: React.FC<Props> = ({ court, width, mode = "IN-GAME", onMatchChanged, onAddCourt, onAssignCourt }) => {
  const [courtHeight, setCourtHeight] = useState(0);
  const [currentMatch, setCurrentMatch] = useState<Match | null>(court?.matches?.find(match => !match.ended) || null);
  const [dragState, setDragState] = useState<DraggableState>(DraggableState.IDLE);

  const { isLoading } = useMQStore(useShallow(s => ({
    isLoading: s.isLoading
  })))

  const courtStyle = StyleSheet.create({
    width,
    height: courtHeight,
    borderStyle: mode !== "PLACEHOLDER" ? 'solid' : 'dashed',
    flexDirection: mode === "PLACEHOLDER" ? 'column' : 'row',
    rowGap: mode === "PLACEHOLDER" ? 10 : undefined,
    zIndex: dragState === DraggableState.DRAGGING ? 1001 : 1000
  });

  useEffect(() => {
    if (court) {
      setCurrentMatch(court.matches?.find(match => !match.ended) || null)
    }
  }, [court])

  const showPlayer = (user: User, partnerIndex: number) => {
    return (
      <CourtPlayer
        user={user}
        key={user.id}
        disabled={mode !== "PRE-GAME"}
        onPress={(userId) => {
          const newMatch = {
            ...currentMatch!,
            partners: currentMatch?.partners?.map((partner, pIndex) => {
              if (pIndex === partnerIndex) {
                const newPartner = {
                  ...partner,
                  users: partner.users?.filter(u => u.id !== userId)
                }
                return newPartner;
              } else return partner
            })
          };
          setCurrentMatch(newMatch);
          onMatchChanged?.(court!, newMatch!, userId);
        }
      } />
    )
  }

  const renderMidButton = () => {
    const isDisabled = (currentMatch?.partners?.length || 0) < 2 ||
                        (currentMatch?.partners?.flatMap(p => p.users).length || 0) < 4;
    const label = mode === "PRE-GAME" ? 
                (<FontAwesomeIcon icon="play" color={Colors.textColor2} size={15} style={{ opacity: isDisabled ? 0.7 : 1 }}/>) : 
                (<ThemedText type="bold" fontSize={isMobile ? 18 : 25}>{court?.number || ""}</ThemedText>)
    
    if(mode === "PRE-GAME") {
      return (
        <Pressable
          style={styles.courtNumber}
          onPress={() => onAssignCourt?.(currentMatch!)}
          disabled={isLoading || isDisabled}>
          {label}
        </Pressable>
      );
    }
    else if(mode === "IN-GAME")
      return <View style={styles.courtNumber}>{label}</View>;
    else
      return null;
  }

  return (
    <Draggable data={court} onStateChange={setDragState} dragDisabled={!court?.number}>
      <Droppable droppableId={court?.id} onDrop={console.log} dropDisabled={!court?.number}>
        <View 
          style={[styles.container, courtStyle]}
          onLayout={(event) => {
            const { width: w } = event.nativeEvent.layout;
            setCourtHeight(w * COURT_DIMENSIONS_RATIO);
          }}>
          {
            mode === "PLACEHOLDER" ? (
              <Pressable
                onPress={() => onAddCourt?.()}
                style={{ flex: 1, justifyContent: 'center', alignItems: 'center', rowGap: 7.5, opacity: isLoading ? 0.5 : 1 }}
                disabled={isLoading}
              >
                <FontAwesomeIcon icon="plus-circle" size={28} color={Colors.textColor}/>
                <ThemedText fontSize={isMobile ? 18 : 24} style={{ marginTop: 10 }}>Add Court</ThemedText>
              </Pressable>
            ) : (
              <>
                {renderMidButton()}

                <View style={{ ...styles.court, height: courtHeight }}>
                {
                  currentMatch?.partners?.at(0)?.users?.map(user => showPlayer(user, 0))
                }
                </View>
                <View style={{ ...styles.court, height: courtHeight }}>
                {
                  currentMatch?.partners?.at(1)?.users?.map(user => showPlayer(user, 1))
                }
                </View>
              </>
            )
          }
        </View>
      </Droppable>
    </Draggable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.darkGreen,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: Colors.textColor,
    width: '100%',
    flexDirection: 'row',
    position: 'relative',
  },
  courtNumber: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    zIndex: 4,
    transform: 'translate(-50%,-50%)',
    borderRadius: '50%',
    borderWidth: 3,
    borderStyle: 'solid',
    borderColor: Colors.textColor,
    width: isMobile ? 40 : 50,
    height: isMobile ? 40 : 50,
    backgroundColor: Colors.darkGreen,
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
    //paddingVertical: 11,
    //paddingHorizontal: isMobile ? 13 : 15
  },
  court: {
    width: '50%',
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: Colors.textColor,
    justifyContent: 'center',
    alignItems: 'center',
    rowGap: 20
  },
  levelContainer: {
    borderRadius: '50%',
    backgroundColor: Colors.darkBlue,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5
  },
  dashedStyle: {
    backgroundImage: 'repeating-linear-gradient(0deg, #333333, #333333 17px, transparent 17px, transparent 27px, #333333 27px), repeating-linear-gradient(90deg, #333333, #333333 17px, transparent 17px, transparent 27px, #333333 27px), repeating-linear-gradient(180deg, #333333, #333333 17px, transparent 17px, transparent 27px, #333333 27px), repeating-linear-gradient(270deg, #333333, #333333 17px, transparent 17px, transparent 27px, #333333 27px)',
    backgroundSize: '3px 100%, 100% 3px, 3px 100% , 100% 3px',
    backgroundPosition: '0 0, 0 0, 100% 0, 0 100%',
    backgroundRepeat: 'no-repeat',
  }
});

export default CourtComponent;