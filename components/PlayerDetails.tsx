import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { z } from 'zod';
import RadioSwitch from './RadioSwitch';
import TextInput from './Input';
import { ThemedText } from './ThemedText';
import { Picker } from '@react-native-picker/picker';
import { Level, Option, User } from '@/constants/types';
import useMQStore from '@/hooks/useStore';
import { useShallow } from 'zustand/shallow';
import { Colors } from '@/constants/Colors';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import Button from './Button';
import uuid from 'react-native-uuid';
import { fetchColorByLevel } from '@/app/utils';

const playerDetailsSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  sex: z.enum(['male', 'female'], {
    error: "Sex is required"
  }),
  level: z.string().min(1, 'Level must be at least 1'),
  isFull: z.boolean().default(false),
  hideEmail: z.boolean().default(false),
  email: z.email().optional().default(''),
}).refine(data => {
  if(data.isFull || !data.hideEmail) {
    return !!data.email
  }
  return true;
}, {
  message: "Email is required",
  path: ["email"],  // attach error to email field
});

type Props = {
  existingUser: User | null
  userId?: string
  isFull?: boolean
  hideEmail?: boolean
  onSuccess: (details: z.infer<typeof playerDetailsSchema>) => void
}

export const PlayerDetails: React.FC<Props> = ({ existingUser = null, userId, isFull = false, hideEmail = false, onSuccess }) => {
  const { control, handleSubmit, setValue, formState: { errors }, getValues} = useForm({
    resolver: zodResolver(playerDetailsSchema),
    defaultValues: {
      username: existingUser?.username,
      sex: existingUser?.sex,
      level: existingUser?.level?.id,
      email: existingUser?.email,
      isFull,
      hideEmail
    }
  });
  const { supabase, isLoading, setLoading } = useMQStore(useShallow(s => ({
    supabase: s.supabase,
    isLoading: s.isLoading,
    setLoading: s.setLoading
  })));

  const [options, setOptions] = useState<Option[]>([]);

  const onSubmit = async ({sex, level}: z.infer<typeof playerDetailsSchema>) => {
    if(hideEmail) {
      onSuccess(getValues());
      return
    }
    setLoading(true);
    if(userId) {  
      const res = await supabase?.from('user').update({ sex: sex, player_code: userId }).eq('id', userId).select('*');
      if(!res?.error) {
        const userLevel = (await supabase?.from('user_level').select().eq('user_id', userId).single())?.data;
        if(userLevel) {
          const res2 = await supabase?.from('user_level').update({ level_id: level }).eq('user_id', userId);
          if(!res2?.error) {
            onSuccess(getValues());
          }
        } else {
          const res2 = await supabase?.from('user_level').insert({ id: uuid.v4(), user_id: userId, level_id: level });
          if(!res2?.error) {
            onSuccess(getValues());
          }
        }
        
      }
    } else {
      const res = await supabase?.from('user').insert({ id: uuid.v4(), sex, player_code: userId }).eq('id', userId).select('*');
      if(!res?.error) {
        const res2 = await supabase?.from('user_level').insert({ id: uuid.v4(), user_id: userId, level_id: level });
        if(!res2?.error) {
          onSuccess(getValues());
        }
      }
    }
    setLoading(false);
  }

  useEffect(() => {
    const getLevels = async () => {
      const res = await supabase?.from('level').select('*').order('level', { ascending: true });
      setOptions(res?.data?.map((level: Level) => ({
        label: level.name,
        value: level.id
      })) || [])
    }
    getLevels();
  }, [supabase])

  useEffect(() => {
    if(existingUser?.username) {
      setValue("username", existingUser.username);
    }
    if(existingUser?.level?.id) {
      setValue("level", existingUser.level.id);
    }
    if(existingUser?.email) {
      setValue("email", existingUser.email);
    }
    if(existingUser?.sex) {
      setValue("sex", existingUser.sex);
    }
  }, [existingUser, setValue])

  return (
    <View style={styles.container}>
      <View style={styles.subContainer}>
        <Controller
          control={control}
          name="username"
          render={({ field: { onChange, value} }) => (
            <TextInput
              label="Username"
              style={styles.input}
              value={value}
              editable={!existingUser?.username && !isLoading}
              onChangeText={onChange}
              error={errors.username?.message}
            />
          )}/>
      </View>
      
      {
        !hideEmail && (
          <View style={styles.subContainer}>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value} }) => (
                <TextInput
                  label="email"
                  style={styles.input}
                  value={value || ""}
                  editable={!existingUser?.username && !isLoading}
                  onChangeText={onChange}
                  error={errors.email?.message}
                />
              )}/>
          </View>
        )
      }
      
      
      <View style={styles.subContainer}>
        <ThemedText>Sex</ThemedText>
        <Controller
          control={control}
          name="sex"
          render={({ field: { onChange, value} }) => (
            <RadioSwitch
              options={[{
                label: "Male",
                value: "male"
              }, {
                label: "Female",
                value: "female"
              }]}
              disabled={isLoading}
              value={value}
              onChange={onChange}
              error={errors.sex?.message}
            />
          )}
        />
        
      </View>

      <View style={styles.subContainer}>
        <ThemedText>Level</ThemedText>
        <Controller
          control={control}
          name="level"
          render={({ field: { onChange, value} }) => (
            <Picker
              selectedValue={value}
              onValueChange={onChange}
              placeholder="Select level"
              mode="dialog"
              enabled={!isLoading}>
              {
                options.map(opt => {
                  const color = fetchColorByLevel(opt.label);
                  return <Picker.Item key={opt.value} label={opt.label} value={opt.value} color={color.bgColor}/>
                })
              }
            </Picker>
          )}
        />
        
      </View>

      <Button
        text="Save"
        type="outline"
        onPress={handleSubmit(onSubmit)}
        disabled={isLoading}
        loading={isLoading}
        style={{ marginTop: 25, letterSpacing: 1.5 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: '100%' },
  subContainer: {
    marginTop: 20
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginBottom: 12,
    padding: 8,
  },
});