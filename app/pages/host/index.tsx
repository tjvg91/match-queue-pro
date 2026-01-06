import Button from "@/components/Button";
import TextInput from "@/components/Input";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Dimensions, Pressable, StyleSheet, View } from "react-native";
import z from "zod";
import HostCourt from "./court";
import HostQueue from "./queue";
import uuid from 'react-native-uuid';

import { getNextMissing, isMobileWidth, isPlayerInCourt } from "@/app/utils";
import useMQStore from "@/hooks/useStore";
import { useShallow } from "zustand/shallow";
import ShuttlecockSVG from "@/components/svg/Shuttlecock";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams, useRouter } from "expo-router";
import { Toast } from "toastify-react-native";
import Dialog from "@/components/Dialog";
import RadialTimer from "@/components/ui/radialTimer";
import { DraxScrollView } from "react-native-drax";

const schema = z.object({
  groupName: z.string().min(3, { error: "Minimum no. of characters is 3" }).max(30, { error: "Maximum no. of characaters is 30" }),
})

const isMobile = isMobileWidth();
const screenWidth = Dimensions.get('screen').width;

export default function HostHomeScreen() {
  const params = useLocalSearchParams();
  const { activeGroup, activeSchedule, setActiveGroup, setActiveSchedule, supabase, isLoading, setLoading: setLoading, user } = useMQStore(useShallow(s => ({
    activeGroup: s.activeGroup,
    setActiveGroup: s.setActiveGroup,
    activeSchedule: s.activeSchedule,
    setActiveSchedule: s.setActiveSchedule,
    isLoading: s.isLoading,
    setLoading: s.setLoading,
    supabase: s.supabase,
    user: s.user
  })))

  const [isDialogVisible, setDialogVisible] = useState(false);
  const [isCreate, setIsCreate] = useState(false);
  const [isFirstGroup, setFirstGroup] = useState(true);
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });
  const router = useRouter();
  const [isStarted, setIsStarted] = useState(params?.isStarted === 'true' || false);
  const [activeTab, setActiveTab] = useState<'queue' | 'court'>('queue');

  const insets = useSafeAreaInsets();

  const getActiveGroup = useCallback(async () => {
    const curGroup = await supabase?.rpc('get_managed_groups', {
                      p_user_id: user?.id
                    }).select('*');
    if(curGroup?.data && curGroup?.data.length) {
      setActiveGroup(curGroup?.data?.[0]);
      setIsCreate(false);
    } else {
      setIsCreate(true);
    }
  }, [setActiveGroup, supabase, user?.id])

  const onCreate = async (data: z.infer<typeof schema>) => {
    setLoading(true);

    const res = await supabase?.from('group').insert({
      id: uuid.v4(),
      name: data.groupName,
      managed_by: user?.id,
    }).select('*, user_group(group(*))').single();

    if(!res?.error) {
      const res2 = await supabase?.from('user_group').insert({
        id: uuid.v4(),
        user_id: user?.id,
        group_id: res?.data.id
      });

      if(!res2?.error) {
        Toast.success("Group created successfully.");
        getActiveGroup();
      }
    }

    setLoading(false);
  }

  const hostNow = async () => {
    setDialogVisible(false);

    setLoading(true);

    const res = await supabase?.rpc('create_schedule_with_courts', {
      p_group_id: activeGroup?.id,
      p_court_numbers: ["", "1"]
    }).select('*').single();
    if(!res?.error && res?.data) {

      setIsCreate(false);
      setIsStarted(true);
      setActiveSchedule(res?.data);
      
    }
    setLoading(false);
  }

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    getActiveGroup();
  }, [getActiveGroup])

  useEffect(() => {
    setIsCreate(!activeGroup);
    setFirstGroup(!activeGroup);
  }, [activeGroup]);

  const renderHostCourt = () => (
    <HostCourt
      courts={activeSchedule?.courts?.filter(court => court.number != null && court.number !== "") || []}
      onAddCourt={async () => {
        setLoading(true);
        const res = await supabase?.rpc('add_court_and_return_schedule', {
          p_schedule_id: activeSchedule?.id,
          p_number: getNextMissing(activeSchedule?.courts?.map(c => parseInt(c.number || "0")) || [])
        }).select('*').single();
        if(!res?.error && res?.data) {
          setActiveSchedule?.(res?.data);
        } else {
          console.log(res?.error);
        }
        setLoading(false);
      }}/>
  )

  const renderHostQueue = useCallback(() => {
    const filterPlayers = activeSchedule?.players?.filter(player => !activeSchedule.courts?.some(court => isPlayerInCourt(court, player))) || [];
    return (<HostQueue
      courts={activeSchedule?.courts?.filter(court => court.number == null || court.number === "") || []}
      players={filterPlayers}
    />)
  }, [activeSchedule])

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
            return <TextInput label="Group Name" value={value} onChangeText={onChange} error={errors?.groupName?.message} editable={!isLoading} darkMode />;
          }} />
        <Button
          type="outline"
          text="Create"
          loading={isLoading}
          disabled={isLoading}
          style={{ marginTop: 20, paddingVertical: 15 }}
          onPress={handleSubmit(onCreate)} />
      </View>
      {!isCreate && (<Button
        type="clear"
        disabled={isLoading}
        loading={isLoading}
        text="I'll create later"
        onPress={() => setIsCreate(false)}/>
        )}
      <Button
        type="clear"
        disabled={isLoading}
        fontSize={isMobile ? 12 : 16}
        text="I'll just play instead"
        onPress={() => router.replace('/pages/player')} />
      <Button
        type="clear"
        disabled={isLoading}
        fontSize={isMobile ? 12 : 16}
        text="Go back home"
        onPress={() => router.back()} />
    </>
  )

  const showGroupHome = () => {
    return (
      <>
        <View style={styles.homeContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <ThemedText
              type="bold" 
              fontSize={isMobile ? 23 : 28} 
              style={{ marginTop: isMobile ? 15 : 30, marginBottom: 50 }}>
              {activeGroup?.name}
            </ThemedText>
            {/*<FontAwesomeIcon
              icon="refresh"
              size={isMobile ? 14 : 18}
              color={Colors.gradientStopperLight}
              style={{ marginLeft: 15, marginTop: isMobile ? -35 : -30 }}/>*/}
          </View>
          
          <Button
            text="HOST NOW" 
            textColor={Colors.darkBlue}
            loading={isLoading}
            disabled={isLoading}
            type="glow"
            onPress={() => setDialogVisible(true)}
            fontSize={isMobile ? 15 : 20}
            style={{ marginTop: 10, paddingVertical: 15 }} />
        </View>
        <Button
          type="clear"
          style={{ marginTop: 20 }}
          text="I'll just play instead"
          disabled={isLoading}
          fontSize={isMobile ? 12 : 20}
          onPress={() => router.replace('/pages/player')} />
        <Button
          type="clear"
          fontSize={isMobile ? 12 : 16}
          text="Go back home"
          disabled={isLoading}
          onPress={() => router.back()} />
      </>
    )
  }

  const showStartedView = () => {
    return (
      <View style={styles.startSubContainer}>
      {
        isMobile ? (
          <View style={{ overflowY: 'auto', height: '100%' }}>
            {activeTab === 'court' && renderHostCourt()}
            {activeTab === 'queue' && renderHostQueue()}
          </View>    
        ) : (
          <>
            {renderHostCourt()}
            {renderHostQueue()}
          </>
        )
      }
      { isMobile && (
        <View style={[styles.tabContainer, { paddingBottom: insets.bottom, marginTop: -insets.bottom, transform: `translateY(${insets.bottom}px)` }]}>
          <Pressable
            style={[styles.tab, { marginTop: 15, borderRightWidth: 1, borderRightColor: Colors.label }]}
            onPress={() => activeTab !== "court" && setActiveTab("court")}
            disabled={isLoading}>
            <Ionicons
              name="grid"
              size={25}
              color={activeTab === "court" ? Colors.blue : Colors.textColor}/>
            <ThemedText
              fontSize={13}
              color={activeTab === "court" ? Colors.blue : Colors.textColor}>Court</ThemedText>
          </Pressable>
          <Pressable style={styles.tab} onPress={() => activeTab !== "queue" && setActiveTab("queue")} disabled={isLoading}>
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
          <View style={{ paddingTop: 20, paddingLeft: isMobile ? 15 : 0 }}>
            <Pressable onPress={() => console.log('group pressed')} style={{ flexDirection: 'row', alignItems: 'center', columnGap: 10 }}>
              <ThemedText type="bold" fontSize={isMobile ? 20 : 30}>{activeGroup?.name}</ThemedText>
              <FontAwesomeIcon icon="info-circle" color={Colors.gradientStopperLight} size={ isMobile ? 14 : 25} />
            </Pressable>
          </View>
        </View>
      )}
      {isCreate ? createGroup() : isStarted ? showStartedView() : showGroupHome()}

      <Dialog
        visible={isDialogVisible}
        onRequestClose={() => setDialogVisible(false)}>
        <ThemedText fontSize={20} type="bold" color={Colors.darkGray} style={{ marginBottom: 10, textAlign: 'center' }}>Hosting in</ThemedText>
        <RadialTimer duration={3} size={150} strokeWidth={15} strokeColor={Colors.secondary} fontSize={40} onFinish={() => hostNow()}/>
        <Button text="Cancel" type="clear" textColor={Colors.darkRed} style={{ marginTop: 20 }} onPress={() => setDialogVisible(false)} />
      </Dialog>
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
    maxWidth: 580,
    marginTop: -80
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
    maxWidth: 580,
    marginTop: -25
  },
  startContainer: {
    paddingHorizontal: '3%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    columnGap: 10,
  },
  startSubContainer: {
    width: '100%',
    flex: 1,
    justifyContent: 'flex-start',
    flexDirection: isMobile ? "column" : 'row',
    padding: 30,
    flexGrow: 1,
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