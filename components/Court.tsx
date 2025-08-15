import { Colors } from '@/constants/Colors';
import { Court, CourtMode, Match, User } from '@/constants/types';
import { COURT_DIMENSIONS_RATIO } from '@/constants/values';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { View, StyleSheet, DimensionValue, Pressable } from 'react-native';
import { ThemedText } from './ThemedText';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import CourtPlayer from './CourtPlayer';
import { isMobileWidth } from '@/app/utils';

interface Props {
  court?: Court
  width: DimensionValue,
  mode?: CourtMode,
  onMatchChanged?: (court: Court, match: Match) => void
  onAddCourt?: () => void
}

const isMobile = isMobileWidth();

const CourtComponent: React.FC<Props> = ({ court, width, mode = "IN-GAME", onMatchChanged, onAddCourt }) => {
  const courtRef = useRef<View>(null);
  const [courtHeight, setCourtHeight] = useState(0);
  const [currentMatch, setCurrentMatch] = useState<Match | null>(null);

  useLayoutEffect(() => {
    courtRef?.current?.measure((x, y, w, h, screenX, screenY) => {
      setCourtHeight(w * COURT_DIMENSIONS_RATIO)
    });
  }, [width, courtRef?.current])

  const courtStyle = StyleSheet.create({
    width,
    height: courtHeight,
    borderStyle: mode !== "PLACEHOLDER" ? 'solid' : 'dashed',
    flexDirection: mode === "PLACEHOLDER" ? 'column' : 'row',
    rowGap: mode === "PLACEHOLDER" ? 10 : undefined
  });

  useEffect(() => {
    if (court) {
      setCurrentMatch(court.match?.find(match => !match.ended) || null)
    }
  }, [court])

  useEffect(() => {
    onMatchChanged?.(court!, currentMatch!);
  }, [currentMatch])

  const showPlayer = (user: User, partnerIndex: number) => {
    return (
      <CourtPlayer
        user={user}
        key={user.id}
        onPress={(userId) => {
          setCurrentMatch({
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
          })
        }
      } />
    )
  }

  return (
    <View ref={courtRef} style={[styles.container, courtStyle]}>
      {
        mode === "PLACEHOLDER" ? (
          <Pressable
            onPress={() => onAddCourt?.()}
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center', rowGap: 7.5 }}
          >
            <FontAwesomeIcon icon="plus-circle" size={28} color={Colors.textColor} />
            <ThemedText fontSize={isMobile ? 18 : 24} style={{ marginTop: 10 }}>Add Court</ThemedText>
          </Pressable>
        ) : (
          <>
            {
              mode === "IN-GAME" && (
                <View style={styles.courtNumber}>
                  <ThemedText type="bold" fontSize={isMobile ? 15 : 25}>{court?.number || ""}</ThemedText>
                </View>
              )
            }

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
    paddingVertical: 11,
    paddingHorizontal: isMobile ? 13 : 15
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