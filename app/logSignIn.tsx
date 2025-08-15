import Button from '@/components/Button';
import TextInput from '@/components/Input';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useEffect, useState } from 'react';
import { Modal, StyleSheet, Switch, TouchableOpacity, View, Dimensions } from 'react-native';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from 'react-hook-form';
import ToastMessage from '@/components/ToastMessage';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { useShallow } from 'zustand/shallow';
import useMQStore from '@/hooks/useStore';
import Dialog from '@/components/Dialog';
import testData from '@/testData.json';
import { parseDoc } from './utils';

const schema = z.object({
  username: z.string().optional(),
  email: z.email({ error: "Email format is invalid" }).optional(),
  password: z.string().optional(),
  confirmPassword: z.string().optional(),
  hasPlayerCode: z.boolean().optional().default(false),
  playerCode: z.string().optional(),
  isNew: z.boolean().optional().default(false),
  isForgotPassword: z.boolean().optional().default(false),
}).refine(data => {
  if(data.isForgotPassword)
    return !!data.email;
  if(data.isNew)
    return (data.password === data.confirmPassword) &&
    ((data.hasPlayerCode && !!data.playerCode) ||
    (!data.hasPlayerCode && !!data.username))
  else 
    return !!data.email && !!data.password;
  
}).superRefine((data, ctx) => {
  console.log(data);
  if(!data.email) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Email is required",
      path: ['email']
    });
  }
  if(!data.isForgotPassword) {
    if(!data.password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Password is required",
        path: ['password']
      });
    } else if(data.password.length < 6) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Password must be at least 6 characters",  
        path: ['password']
      });
    }
    if(data.isNew) {
      if(!data.confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['confirmPassword'],
          message: "Re-typed password is required"
        });
      }
      if (data.hasPlayerCode && !data.playerCode) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['playerCode'],
          message: "Player code is required"
        });
      }
      if (!data.hasPlayerCode && !data.username) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['username'],
          message: "Username is required"
        });
      }
      if (data.password !== data.confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['confirmPassword', 'password'],
          message: "Passwords do not match"
        });
      }
    }
  }
  console.log("Validation successful");
});

export default function LogSignScreen() {
  const { control, handleSubmit, watch, setValue, reset, formState: { errors }} = useForm({
    resolver: zodResolver(schema),
  });
  const [isForgotPassword, setIsForgotPassword] = useState(watch("isForgotPassword") || false);
  const [hasAccount, setHasAccount] = useState(!watch("isNew"));
  const [hasPlayerCode, setHasPlayerCode] = useState(watch("hasPlayerCode"));
  const navigation = useNavigation();

  const { setIsAuthenticated, setUser } = useMQStore(useShallow((s) => ({
    setUser: s.setUser,
    setIsAuthenticated: s.setIsAuthenticated
  })))

  const onSubmit = (data: z.infer<typeof schema>) => {
    console.log(hasAccount ? "Logging in with data:" : "Signing up with data:", data);
    // Handle login logic here, e.g., call an API or Firebase auth
    reset();
    setUser?.(parseDoc(testData.user))
    setIsAuthenticated(true);
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Home" }]
      })
    )
  }

  const onForgotPassword = ({email} : z.infer<typeof schema>) => {
    console.log("Forgot password for email:", email);
    // Handle forgot password logic here, e.g., call an API or Firebase auth
    setIsForgotPassword(false);
    reset();
  }

  useEffect(() => {
    setValue("isNew", !hasAccount, {
      shouldValidate: false,
      shouldDirty: false,
      shouldTouch: false
    })
  }, [hasAccount]);

  useEffect(() => {
    setValue("hasPlayerCode", hasPlayerCode, {
      shouldValidate: false,
      shouldDirty: false,
      shouldTouch: false
    });
  }, [hasPlayerCode]);

  useEffect(() => {
    setValue("isForgotPassword", isForgotPassword, {
      shouldValidate: false,
      shouldDirty: false,
      shouldTouch: false
    });
  }, [isForgotPassword]);

  const loginComp = () => {
    return (
      <>
        <ThemedText
        fontSize={35}
          style={{ overflow: "visible", transform: "translateY(-10px)", lineHeight: 40 }}
          type="bold">
            Log In
          </ThemedText>

        <View style={{ marginTop: 50, width: '100%' }}>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <TextInput
                label="Email"
                value={value}
                onChangeText={onChange}
                error={errors.email?.message}
                keyboardType="email-address"
              />
            )}
            
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <TextInput
                label="Password"
                isPassword={true}
                value={value}
                onChangeText={onChange}
                error={errors.password?.message}
              />
            )}
          />
          <TouchableOpacity onPress={() => setIsForgotPassword(true)}>
            <ThemedText
              fontSize={11}
              color={Colors.label}
              style={{
                textAlign: "right",
                marginTop: -3,
                width: "auto",
              }}>
              Forgot Password
            </ThemedText>
          </TouchableOpacity>
        </View>

        <View style={{ justifyContent: "center", alignItems: "center", width: '100%' }}>
          <Button
            text="Log In"
            type="outline"
            onPress={handleSubmit(onSubmit)}
            fontSize={20}
            style={{ marginTop: 35, letterSpacing: 1.5 }} />
          <TouchableOpacity onPress={() => { setHasAccount(false); setHasPlayerCode(false);}}>
            <ThemedText
              fontSize={14}
              style={{
                textAlign: "center",
                marginTop: 20,
                fontWeight: 300
              }}>
              I don&apos;t have an account
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { setHasAccount(false); setHasPlayerCode(true); }}>
            <ThemedText
            fontSize={14}
              style={{
                textAlign: "center",
                marginTop: 15,
                fontWeight: 300
              }}>
              I want to claim my player code
            </ThemedText>
          </TouchableOpacity>
        </View>
      </>
    )
  }

  const signupComp = () => {
    return (
      <>
        <ThemedText
        fontSize={35}
          style={{ transform: "translateY(-10px)" }}
          type="bold">
          Sign Up
        </ThemedText>

        <View style={{ marginTop: 10, width: '100%' }}>

          {hasPlayerCode && <ToastMessage type="info" message="Ask for player code to claim your account." showClose={false} /> }

          <View style={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }}>
            <ThemedText fontSize={16} style={{ marginRight: 5 }}>Player Code</ThemedText>
            <Switch
              value={hasPlayerCode}
              onValueChange={setHasPlayerCode}
              trackColor={{ false: Colors.darkBlue, true: Colors.green }}
              thumbColor={Colors.textColor}
            />
          </View>
          
          {hasPlayerCode ? (
            <Controller
              control={control}
              name="playerCode"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  label="Player Code"
                  value={value}
                  onChangeText={onChange}
                  error={errors.playerCode?.message}
                />
              )}
            />
          ) : (
            <Controller
              control={control}
              name="username"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  label="Username"
                  value={value}
                  onChangeText={onChange}
                  error={errors.username?.message}
                />
              )}
            />
          )}

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <TextInput
                label="Email"
                value={value}
                onChangeText={onChange}
                error={errors.email?.message}
                keyboardType="email-address"
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <TextInput
                label="Password"
                isPassword={true}
                value={value}
                onChangeText={onChange}
                //@ts-ignore
                error={errors.password?.message || errors.confirmPassword?.password?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, value } }) => (
              <TextInput
                label="Re-type Password"
                isPassword={true}
                value={value}
                onChangeText={onChange}
                //@ts-ignore
                error={errors.confirmPassword?.message ?? errors.confirmPassword?.password?.message}
              />
            )}
          />
        </View>

        <View style={{ justifyContent: "center", alignItems: "center", width: '100%' }}>
          <Button
            text="Sign Up"
            type="outline"
            onPress={handleSubmit(onSubmit)}
            style={{ marginTop: 35, letterSpacing: 1.5 }} />
          <TouchableOpacity onPress={() => setHasAccount(true)}>
            <ThemedText
              fontSize={15}
              style={{
                textAlign: "center",
                marginTop: 20,
              }}
              type="link">
              I have an account
            </ThemedText>
          </TouchableOpacity>
        </View>
      </>
    )
  }

  return (
    <View style={styles.container}>
      <Dialog
        visible={isForgotPassword}
        onRequestClose={() => setIsForgotPassword(false)}>
          <TextInput
            label="Enter email"
            value={watch("email")}
            onChangeText={(text) => setValue("email", text, { shouldValidate: true })}
            error={errors.email?.message}
            darkMode={false}
            keyboardType="email-address"
          />
          <Button
            text="Continue"
            type="primary"
            onPress={handleSubmit(onForgotPassword)}
            style={{ marginTop: 20, letterSpacing: 1.5 }} />
            <Button
            text="Cancel"
            type="secondary"
            onPress={() => setIsForgotPassword(false)}
            style={{ marginTop: 20, letterSpacing: 1.5 }} />
      </Dialog>
      <View style={styles.subContainer}>
        <ThemedText fontSize={25} style={{ marginBottom: 10 }} type="extraLight">Welcome!</ThemedText>
        {hasAccount ? loginComp() : signupComp()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent', // Use transparent background to match DarkTheme
  },
  subContainer: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: '100%',
    paddingHorizontal: 50,
    maxWidth: 500,
  },
});