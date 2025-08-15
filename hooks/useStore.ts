import { Group, MQStore } from '@/constants/types';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage'

// Define the store
const useMQStore = create(
  persist<MQStore>(
    (set) => ({
      isAuthenticated: false,
      user: undefined,
      setIsAuthenticated: (isAuthenticated: boolean) => set({ isAuthenticated }),
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: undefined }),

      errorMessages: [],
      setErrorMessages: (errorMessages: string[]) => set({ errorMessages }),
      clearErrorMessages: () => set({ errorMessages: [] }),

      activeGroup: undefined,
      setActiveGroup: (activeGroup: Group) => set({ activeGroup })
    }),
    {
      name: "match-queue-storage", // name of the item in storage
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);

export default useMQStore;