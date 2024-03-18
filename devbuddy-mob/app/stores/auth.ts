import {create} from 'zustand';

type AuthStore = {
  clientId: string;
  signedIn: boolean;
  signIn: () => void;
  signOut: () => void;
  setClientId: (id: string) => void;
};

export const useAuthStore = create<AuthStore>(set => ({
  clientId: '',
  signedIn: false,
  signIn: () => set({signedIn: true}),
  signOut: () => set({signedIn: false}),
  setClientId: (id: string) => set({clientId: id}),
}));
