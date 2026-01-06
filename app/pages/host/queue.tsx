import CourtComponent from "@/components/Court";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { Court, Schedule, User } from "@/constants/types";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Gesture, Pressable } from "react-native-gesture-handler";
import ReorderableList, { ReorderableListDragStartEvent, reorderItems, useReorderableDrag } from 'react-native-reorderable-list';
import Button from '@/components/Button';
import { queuePlayer, fetchColorByLevel, isPlayerInSchedule, isMobileWidth, camelizeKeys, keysToSnakeCase } from '@/app/utils';
import Dialog from '@/components/Dialog';
import CheckboxList from '@/components/CheckboxList';
import useMQStore from '@/hooks/useStore';
import { useShallow } from 'zustand/shallow';
import Hr from '@/components/ui/hr';
import Ionicons from '@expo/vector-icons/Ionicons';
import ShuttlecockSVG from '@/components/svg/Shuttlecock';
import UserDownloadSVG from '@/components/svg/UserDownload';
import { MQCollapsible } from '@/components/Collapsible';
import { PlayerDetails } from "@/components/PlayerDetails";
import { Toast } from "toastify-react-native";
import uuid from 'react-native-uuid';

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
  const { supabase, activeGroup, setActiveGroup, activeSchedule, setActiveSchedule, isLoading, setLoading } = useMQStore(useShallow(s => ({    
    supabase: s.supabase,
    activeGroup: s.activeGroup,
    setActiveGroup: s.setActiveGroup,
    activeSchedule: s.activeSchedule,
    setActiveSchedule: s.setActiveSchedule,
    isLoading: s.isLoading,
    setLoading: s.setLoading
  })))

  const [isPlayersVisible, setPlayersVisible] = useState(true);
  const [isAddPlayerModalVisible, setAddPlayerModalVisible] = useState(false);
  const [isCreatePlayerModalVisible, setCreatePlayerModalVisible] = useState(false);
  const [playersData, setPlayersData] = useState(players);
  const [curCourts, setCurCourts] = useState(courts);

  const [tempChecked, setTempChecked] = useState<string[]>([]);
  
  const panGesture = useMemo(() => Gesture.Pan().activateAfterLongPress(520), []);

  const onPlayerSelect = async (player: User) => {
    const targetCourt = courts?.find(qc => (
      qc.matches == null || !qc.matches.length || ((qc.matches?.[0].partners?.length || 0) < 3 &&
      (qc.matches?.[0].partners?.flatMap(p => p.users || [])?.length || 0) < 4 &&
      (qc.number == null || qc.number === "")))
    );

    if(targetCourt) {
      const updatedCourt = queuePlayer(targetCourt, player);

      const res = await supabase?.rpc('upsert_court_with_matches', {
        'court_data': keysToSnakeCase(updatedCourt),
        'schedule_id': activeSchedule?.id || ''
      });
      
      if(!res?.error && updatedCourt && res?.data) {
        setActiveSchedule?.({
          ...activeSchedule!,
          courts: activeSchedule!.courts?.map(c => {
            if(c.id === updatedCourt.id) return updatedCourt;
            return c;
          }) || []
        });
        onCourtUpdate?.(updatedCourt);  
        setCurCourts(curCourts?.map(c => {
          if(c.id === updatedCourt.id) return updatedCourt;
          return c;
        }));
      }
    }
    
  }

  const QueueItem = memo((player: User) => {
    const drag = useReorderableDrag();
    const colors = fetchColorByLevel(player.level?.name);
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

  const createPlayerModal = () => (
    <Dialog
      dark
      showClose
      visible={isCreatePlayerModalVisible}
      onRequestClose={() => setCreatePlayerModalVisible(false)}>
      <PlayerDetails hideEmail existingUser={null} onSuccess={async (data) => {
        setLoading(true);
        const res = await supabase?.rpc('add_user_to_schedule', {
          p_schedule_id: activeSchedule?.id || '',
          p_username: data.username,
          p_sex: data.sex,
          p_level_id: data.level,
        }).select('*').single();
        console.log(res);
        if(res?.error) {
          Toast.error(res?.error.message || "An error occurred while creating the player.");
        } else if(res?.data?.['error']) {
          Toast.error(res.data['error'] || "An error occurred while creating the player.");
        } else {
          const newUser = camelizeKeys(res?.data) as User;
          
          const tempSchedPlayers = activeSchedule?.players?.length ? [
            ...activeSchedule?.players,
            newUser
          ] : [newUser];
          setActiveSchedule({
            ...activeSchedule,
            players: tempSchedPlayers
          });

          const tempGroupPlayers = activeGroup?.players?.length ? [
            ...activeGroup?.players,
            newUser
          ] : [newUser];
          setActiveGroup({
            ...activeGroup,
            players: tempGroupPlayers
          });

          setCreatePlayerModalVisible(false);
          Toast.success("Player created and added to queue.")
        }
        setLoading(false);
      }} />
    </Dialog>
  )

  const addPlayerModal = () => {
    const list = activeGroup?.players?.filter(p => !isPlayerInSchedule(p.id, activeSchedule)).map(p => ({
      label: p.username,
      id: p.id
    })) || [];

    return (<Dialog
      visible={isAddPlayerModalVisible}
      onRequestClose={() => setAddPlayerModalVisible(false)}>
      <View style={{ flexDirection: 'column', columnGap: 10, overflowY: 'auto', marginHorizontal: -10 }}>
        {
          !!list.length ? (
            <>
              <CheckboxList
                data={list}
                onChange={setTempChecked}
              />

              <Hr color={Colors.gray} style={{ marginTop: 20 }}/>
              
              <View style={{ flex: 1, flexDirection: 'row', marginTop: 10, marginBottom: -10 }}>
                <Button
                  type="clear"
                  text="Cancel"
                  textColor={Colors.primary}
                  style={{ width: '50%' }}
                  onPress={() => setAddPlayerModalVisible(false)}
                  disabled={isLoading}/>
                <Button
                  type="primary"
                  text="Select"
                  style={{ width: '50%' }}
                  onPress={async () => {
                    if(tempChecked.length) {
                      setLoading(true);
                      const res = await supabase?.from('user_schedule').insert(tempChecked.map(checked => ({
                        id: uuid.v4(),
                        user_id: checked,
                        schedule_id: activeSchedule?.id
                      })))
                      if(!res?.error) {
                        if(activeSchedule?.players?.length) {
                          setActiveSchedule({
                            ...activeSchedule,
                            players: [
                              ...activeSchedule?.players,
                              ...tempChecked.map(checked => activeGroup!.players.find(pl => pl.id === checked))
                            ]
                          })
                        } else {
                          setActiveSchedule({
                            ...activeSchedule,
                            players: tempChecked.map(checked => activeGroup!.players.find(pl => pl.id === checked))
                          })
                        }
                        setAddPlayerModalVisible(false);
                        Toast.success("Player added to queue.");
                      } else {
                        console.log(res.error);
                        Toast.error(res.error.message || res.error.details);
                      }
                      setLoading(false);
                    }
                  }}
                  disabled={isLoading || tempChecked.length === 0}/>
              </View>
            </>
          ) : (
            <View style={{ rowGap: 20 }}>
              <ThemedText color={Colors.darkGray} style={{ textAlign: 'center' }}>All players are in queue</ThemedText>
              <Button
                type="primary"
                text="Cancel"
                textColor={Colors.textColor}
                onPress={() => setAddPlayerModalVisible(false)}
                disabled={isLoading}/>
            </View>
          )
        }
      </View>
      
    </Dialog>);
  }

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
              onMatchChanged={async (court, match, userId) => {
                const updatedCourt = {
                  ...court,
                  matches: court.matches?.map(m => {
                    if(m.id === match.id) return match;
                    return m;
                  })
                };
                
                if(updatedCourt) {
                  const res = await supabase?.rpc('remove_user_from_court', {
                    'p_user_id': userId
                  });

                  console.log(res);

                  if(!res?.error && !!res?.data) {
                    const player = activeGroup?.players.find(p => p.id === userId)!;
                    setActiveSchedule?.({
                      ...activeSchedule!,
                      courts: activeSchedule!.courts?.map(c => 
                        c.id === res.data.id ? res.data : c
                      ) || [],
                    })
                    setPlayersData([...(playersData || []), player]);
                  }
                }
              }}
              onAssignCourt={async (match) => {
                const res = await supabase?.rpc('assign_match_to_court', {
                  'p_match_id': match.id,
                  'p_schedule_id': activeSchedule?.id
                });
                console.log(res);
                if(!res?.error) {
                  console.log(res?.data);
                  setActiveSchedule(res?.data);
                }
              }}/>
          )}
        </View>
      </View>
      
      <View style={{ width: '100%', height: 1, backgroundColor: Colors.label }} />
      
      <MQCollapsible
        title="Players"
        isVisible={isPlayersVisible}
        setVisible={setPlayersVisible}
        headerRight={(
          <View style={{ flexDirection: 'row', columnGap: 10, marginBottom: 5 }}>
            <Pressable
              onPress={() => setCreatePlayerModalVisible(true)}>
              <Ionicons name="person-add" size={isMobile ? 20 : 25} color={Colors.gradientStopperLight} />
            </Pressable>
            <Pressable
              onPress={() => setAddPlayerModalVisible(true)}>
              <UserDownloadSVG size={isMobile ? 20 : 25} color={Colors.gradientStopperLight} />
            </Pressable>
          </View>
        )}>
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
          scrollEnabled={true}
          showsVerticalScrollIndicator={true}
          keyExtractor={item => item.id}/>
      </MQCollapsible>
      {addPlayerModal()}
      {createPlayerModal()}
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