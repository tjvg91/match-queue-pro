import Button from "@/components/Button";
import TextInput from "@/components/Input";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Dimensions, Pressable, ScrollView, StyleSheet, View } from "react-native";
import z from "zod";
import HostCourt from "./court";
import HostQueue from "./queue";
import uuid from 'react-native-uuid';

import testData from '@/testData.json';
import { isMobileWidth, isPlayerInCourt, parseDoc } from "@/app/utils";
import useMQStore from "@/hooks/useStore";
import { useShallow } from "zustand/shallow";
import ShuttlecockSVG from "@/components/svg/Shuttlecock";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Ionicons from '@expo/vector-icons/Ionicons';

const schema = z.object({
  groupName: z.string().min(3, { error: "Minimum no. of characters is 3" }).max(20, { error: "Maximum no. of characaters is 20" }),
})

const isMobile = isMobileWidth();
const screenWidth = Dimensions.get('screen').width;

export default function HostHomeScreen() {
  const { activeGroup, activeSchedule, setActiveGroup, setActiveSchedule } = useMQStore(useShallow(s => ({
    activeGroup: s.activeGroup,
    setActiveGroup: s.setActiveGroup,
    activeSchedule: s.activeSchedule,
    setActiveSchedule: s.setActiveSchedule
  })))

  const [isCreate, setIsCreate] = useState(false);
  const [isFirstGroup, setFirstGroup] = useState(true);
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });
  const navigation = useNavigation();
  const [isStarted, setIsStarted] = useState(false);
  const [activeTab, setActiveTab] = useState<'queue' | 'court'>('queue');

  const insets = useSafeAreaInsets();

  const onCreate = (data: z.infer<typeof schema>) => {
    setFirstGroup(false);
    setIsCreate(false);
  }

  useEffect(() => {
    if(!activeGroup) {
      setActiveGroup?.(parseDoc(testData.group));
    }
  }, [])

  useEffect(() => {
    if(isStarted) {
      const tempSchedule = activeGroup?.schedules.find(sched => !sched.ended);
      if(tempSchedule) {
        const dummyCourts =  Array.apply(null, Array(Math.max(Math.min(Math.floor((tempSchedule.players?.length || 0) / 4), 2), 1))).map((y, i) => i + 1);
        dummyCourts.forEach(c => tempSchedule.courts?.push({
          id: uuid.v4(),
          createdAt: new Date()
        }))
        setActiveSchedule?.(tempSchedule);
      }
    }
  }, [isStarted])

  const renderHostCourt = () => (
    <HostCourt
      courts={activeSchedule?.courts?.filter(court => court.number != null) || []}
      onAddCourt={() => {
        const newCourt = {
          id: uuid.v4(),
          createdAt: new Date(),
          number: `${(activeSchedule?.courts?.filter(c => !!c.number?.length).length || 0) + 1} `
        }
        if(activeSchedule?.courts) {
          setActiveSchedule?.({
            ...activeSchedule,
            courts: [ ...activeSchedule.courts, newCourt]
          });
        } else {
          setActiveSchedule?.({
            ...activeSchedule!,
            courts: [newCourt]
          });
        }
      }}/>
  )

  const renderHostQueue = () => (
    <HostQueue
      courts={activeSchedule?.courts?.filter(court => court.number == null) || []}
      players={activeSchedule?.players?.filter(player => !activeSchedule.courts?.some(court => isPlayerInCourt(court, player))) || []}
      onCourtUpdate={(court) => {
        setActiveSchedule?.({
          ...activeSchedule!,
          courts: activeSchedule!.courts?.map(c => {
            if(c.id === court.id) return court;
            return c;
          }) || []
        })
      }}/>
  )

  const createGroup = () => (
    <>
      <View style={styles.createContainer}>
        <ThemedText type="bold" fontSize={40} style={{ marginBottom: 50 }}>
          Create your {isFirstGroup ? "first " : ""}group
        </ThemedText>
        <Controller
          control={control}
          name="groupName"
          render={({ field: { onChange, value } }) => {
            return <TextInput label="Group Name" value={value} onChangeText={onChange} error={errors?.groupName?.message} />;
          }} />
        <Button
          type="outline"
          text="Create"
          style={{ marginTop: 20, paddingVertical: 15 }}
          onPress={handleSubmit(onCreate)} />
      </View>
      {!isCreate && (<Button
        type="clear"
        text="I'll create later"
        onPress={() => setIsCreate(false)}/>
        )}
      <Button
        type="clear"
        fontSize={isMobile ? 12 : 16}
        text="I'll just play instead"
        onPress={() => navigation.navigate('Player')} />
    </>
  )

  const showGroupHome = () => {
    return (
      <>
        <View style={styles.homeContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <ThemedText
              type="bold" 
              fontSize={isMobile ? 30 : 36} 
              style={{ marginTop: isMobile ? 15 : 30, marginBottom: 50 }}>
              Shuttle Stars
            </ThemedText>
            <FontAwesomeIcon
              icon="refresh"
              size={isMobile ? 14 : 18}
              color={Colors.gradientStopperLight}
              style={{ marginLeft: 15, marginTop: isMobile ? -35 : -30 }}/>
          </View>
          
          <Button
            text="HOST NOW" 
            textColor={Colors.darkBlue}
            type="glow"
            onPress={() => setIsStarted(true)}
            fontSize={isMobile ? 15 : 20}
            style={{ marginTop: 10, paddingVertical: 15 }} />
        </View>
        <Button
          type="clear"
          style={{ marginTop: 20 }}
          text="I'll just play instead"
          fontSize={isMobile ? 12 : 20}
          onPress={() => navigation.navigate('Player')} />
      </>
    )
  }

  const showStartedView = () => {
    return (
      <View style={styles.startSubContainer}>
      {
        isMobile ? (
          <ScrollView style={{ overflowY: 'auto' }}>
            {activeTab === 'court' && renderHostCourt()}
            {activeTab === 'queue' && renderHostQueue()}
          </ScrollView>    
        ) : (
          <>
            {renderHostCourt()}
            {renderHostQueue()}
          </>
        )
      }
      { isMobile && (
        <View style={[styles.tabContainer, { paddingBottom: insets.bottom + 30, marginTop: -insets.bottom, transform: `translateY(${insets.bottom}px)` }]}>
          <Pressable
            style={[styles.tab, { marginTop: 15, borderRightWidth: 1, borderRightColor: Colors.label }]}
            onPress={() => activeTab !== "court" && setActiveTab("court")}>
            <Ionicons
              name="grid"
              size={25}
              color={activeTab === "court" ? Colors.blue : Colors.textColor}/>
            <ThemedText
              fontSize={13}
              color={activeTab === "court" ? Colors.blue : Colors.textColor}>Court</ThemedText>
          </Pressable>
          <Pressable style={styles.tab} onPress={() => activeTab !== "queue" && setActiveTab("queue")}>
            <ShuttlecockSVG
              size={48}
              color={activeTab === "queue" ? Colors.blue : Colors.textColor} />
            <ThemedText
              color={activeTab === "queue" ? Colors.blue : Colors.textColor}
              style={{ marginTop: -13 }}
              fontSize={13}>
                Queue
            </ThemedText>
          </Pressable>
        </View>

      ) }
      </View>
    )
  }


  return (
    <View style={[{
      ...styles.container,
      alignItems: isStarted ? 'flex-start' : 'center'
    }, { paddingTop: insets.top }]}>
      {isStarted && (
        <View style={styles.startContainer}>
          <View style={{ flexDirection: 'row', columnGap: 10, paddingTop: 20, paddingLeft: isMobile ? 15 : 0 }}>
            <ThemedText type="bold" fontSize={isMobile ? 20 : 30}>{testData.group.name}</ThemedText>
            <FontAwesomeIcon icon="clock-rotate-left" color={Colors.gradientStopperLight} size={ isMobile ? 15 : 25}/>
          </View>
          <View>
            <Button
              disabled
              style={{
                paddingVertical: isMobile ? 10 : 20,
                paddingHorizontal: 20,
                marginTop: 20,
              }}
              textColor={Colors.textColor}
              fontSize={isMobile ? 12 : 16}
              width="auto"
              text="End Schedule"/>
            </View>
        </View>
      )}
      {isCreate ? createGroup() : isStarted ? showStartedView() : showGroupHome()}
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createContainer: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginBottom: 20,
    width: '80%',
    maxWidth: 580
  },
  homeContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Colors.textColor,
    borderWidth: 2,
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxWidth: 580
  },
  startContainer: {
    paddingHorizontal: '3%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    columnGap: 10
  },
  startSubContainer: {
    width: '100%',
    flex: 1,
    justifyContent: 'flex-start',
    flexDirection: isMobile ? "column" : 'row',
    padding: 30
  },
  tabContainer: {
    backgroundColor: Colors.darkBlue,
    width: screenWidth,
    marginLeft: -30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  tab: {
    flexDirection: 'column',
    rowGap: 10,
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center'
  }
})