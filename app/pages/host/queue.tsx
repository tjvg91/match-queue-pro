import { Collapsible } from 'react-native-fast-collapsible';
import CourtComponent from "@/components/Court";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { Court, User } from "@/constants/types";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Modal, StyleSheet, Switch, TouchableOpacity, View } from "react-native";
import { Gesture, Pressable } from "react-native-gesture-handler";
import ReorderableList, { ReorderableListDragStartEvent, reorderItems, useReorderableDrag } from 'react-native-reorderable-list';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import Button from '@/components/Button';
import { queuePlayer, fetchColorByLevel, isPlayerInSchedule, isMobileWidth } from '@/app/utils';
import Dialog from '@/components/Dialog';
import CheckboxList from '@/components/CheckboxList';
import useMQStore from '@/hooks/useStore';
import { useShallow } from 'zustand/shallow';
import Hr from '@/components/ui/hr';
import Ionicons from '@expo/vector-icons/Ionicons';
import ShuttlecockSVG from '@/components/svg/Shuttlecock';
import UserDownloadSVG from '@/components/svg/UserDownload';

interface Props {
  courts?: Court[]
  players?: User[]
  onCourtUpdate?: (court: Court) => void
}

const isMobile = isMobileWidth();

export default function HostQueue({
  courts,
  players,
  onCourtUpdate
}: Props) {
  const { activeGroup } = useMQStore(useShallow(s => ({
    activeGroup: s.activeGroup
  })))

  const [isPlayersCollapsed, setPlayersCollapsed] = useState(true);
  const [isAddPlayerModalVisible, setAddPlayerModalVisible] = useState(false);
  const [playersData, setPlayersData] = useState(players);
  const [curCourts, setCurCourts] = useState(courts);
  
  const panGesture = useMemo(() => Gesture.Pan().activateAfterLongPress(520), []);

  const onPlayerSelect = (player: User) => {
    const targetCourt = courts?.find(qc => (
      qc.match?.[0].partners?.length || 0) < 3 &&
      (qc.match?.[0].partners?.flatMap(p => p.users || [])?.length || 0) < 4 &&
      qc.number == null
    );
    if(targetCourt) {
      const updatedCourt = queuePlayer(targetCourt, player);

      onCourtUpdate?.(updatedCourt);  
      setCurCourts(curCourts?.map(c => {
        if(c.id === updatedCourt.id) return updatedCourt;
        return c;
      }));
    }
  }

  const onPlayerInsert = (playerIds: string[]) => {
    playerIds.forEach(pId => {
      const pIdx = activeGroup!.players!.findIndex(p => p.id === pId);
      activeGroup!.players!
    }) 
  }

  const QueueItem = memo((player: User) => {
    const drag = useReorderableDrag();
    const colors = fetchColorByLevel(player.level.name);
    return (
      <Pressable
        onLongPress={drag}
        onPress={() => onPlayerSelect(player)}
        style={[
          styles.listItem,
          { backgroundColor: colors.bgColor }
        ]}>
        <View style={{ borderRadius: '50%', backgroundColor: colors.fgColor, padding: 5}}>
          <Ionicons name={player.sex === "male" ? "man" : "woman"} color={colors.bgColor} size={20}/>
        </View>
        <View style={{ justifyContent: 'center', rowGap: 3, marginTop: 1 }}>
          <ThemedText color={colors.fgColor} fontSize={isMobile ? 12 : 20} type="semiBold">{player.username}</ThemedText>    
          <View style={{ flexDirection: 'row' }}>
            <ThemedText color={Colors.darkGray} fontSize={isMobile ? 12 : 20} type="light">
              {player.gameCount}
            </ThemedText>
            <ShuttlecockSVG size={15} color={Colors.darkGray} style={{ marginTop: -3, marginLeft: -1 }} />
          </View>
        </View>
      </Pressable>
    );
  })

  QueueItem.displayName = "QueueItem"

  const onDragStart = useCallback((e: ReorderableListDragStartEvent) => {
    'worklet';
  }, []);

  const onDragEnd = useCallback(() => {
    'worklet';
  }, []);

  const addPlayerModal = () => (
    <Dialog
      visible={isAddPlayerModalVisible}
      onRequestClose={() => setAddPlayerModalVisible(false)}>
      <View style={{ flexDirection: 'column', columnGap: 10, overflowY: 'auto' }}>
        <CheckboxList
          data={activeGroup?.players?.filter(p => isPlayerInSchedule(activeGroup, p.id)).map(p => ({
            label: p.username,
            id: p.id
          })) || []}
        />

        <Hr color={Colors.gray} style={{ marginTop: 10 }}/>
        
        <View style={{ flex: 1, flexDirection: 'row', marginTop: 15 }}>
          <Button
            type="clear"
            text="Cancel"
            textColor={Colors.primary}
            style={{ width: '50%' }}
            onPress={() => setAddPlayerModalVisible(false)}/>
          <Button
            type="primary"
            text="Select"
            style={{ width: '50%' }}
            onPress={() => {
              setAddPlayerModalVisible(false);
            }}/>
        </View>
      </View>
      
    </Dialog>
  )

  useEffect(() => {
    setPlayersData(players);
  }, [players])

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'column', marginBottom: 20 }}>
        <ThemedText
          color={Colors.gradientStopperLight}
          fontSize={isMobile ? 13 : 16}
          style={{ marginBottom: -20 }}>Up Next</ThemedText>
        <View
          style={styles.court}>
          {curCourts?.map((c) => 
            <CourtComponent
              key={c.id}
              width={'100%'}
              mode="PRE-GAME"
              court={c}
              onMatchChanged={(court, match) => {
                onCourtUpdate?.({
                  ...court,
                  match: court.match?.map(m => {
                    if(m.id === match.id) return match;
                    return m;
                  })
                })
              }}/>
          )}
        </View>
      </View>
      
      <View style={{ width: '100%', height: 1, backgroundColor: Colors.label }} />

      <View style={{ width: '100%', flexDirection: 'column', flex: 1, flexGrow: 1, marginTop: 15, marginBottom: 10 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center', columnGap: 5, marginTop: -7.5 }}
            onPress={() => setPlayersCollapsed(!isPlayersCollapsed)}>
            <FontAwesomeIcon
              icon={!isPlayersCollapsed ? "caret-right" : "caret-down"}
              size={15}
              color={Colors.gradientStopperLight} />
            <ThemedText fontSize={16}>Players</ThemedText>
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', columnGap: 10, marginBottom: 5 }}>
            <Pressable
              onPress={() => setAddPlayerModalVisible(true)}>
              <Ionicons name="person-add" size={isMobile ? 20 : 25} color={Colors.gradientStopperLight} />
            </Pressable>
            <Pressable
              onPress={() => setAddPlayerModalVisible(true)}>
              <UserDownloadSVG size={isMobile ? 20 : 25} color={Colors.gradientStopperLight} />
            </Pressable>
          </View>
          
        </View>
        {/*height: dimensions.height - courtsContainerHeight - 320, */}

        <Collapsible
          isVisible={isPlayersCollapsed}>
          <ReorderableList
            data={playersData || []}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onReorder={({ from, to }) => {
              setPlayersData(data => reorderItems((data || []), from, to));
            }}
            renderItem={(data) => {
              return <QueueItem {...data.item} />
            }}
            style={{ width: '100%', height: '100%' }}
            panGesture={panGesture}
            scrollEnabled={false}
            keyExtractor={item => item.id}/>
        </Collapsible>
      </View>
      {addPlayerModal()}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: isMobile ? '100%' : '50%',
    paddingLeft: isMobile ? 0 : 15,
    borderLeftColor: Colors.label,
    borderLeftWidth: isMobile ? 0 : 1,
    borderStyle: 'solid',
    height: '100%',
    flexDirection: 'column'
  },
  court: {
    marginTop: 25,
    gap: 25,
  },
  listItem: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    alignItems: 'flex-start',
    padding: isMobile ? 12.5 : 20,
    backgroundColor: Colors.label,
    borderRadius: 10,
    marginVertical: 5,
    columnGap: 5
  }
})