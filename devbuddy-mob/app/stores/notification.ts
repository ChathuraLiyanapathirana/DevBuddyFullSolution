import {create} from 'zustand';

type NotificationStore = {
  notification: string | undefined;
  refresh: boolean;
  setNotification: (message: string | undefined) => void;
  setRefresh: () => void;
  notificationReceived: string | undefined;
  setNotificationReceived: (id: string | undefined) => void;
};

export const useNotificationStore = create<NotificationStore>(set => ({
  notification: undefined,
  refresh: false,
  notificationReceived: undefined,
  setRefresh: () => set(state => ({refresh: !state.refresh})),
  setNotification: (message: string | undefined) =>
    set({notification: message}),
  setNotificationReceived: (id: string | undefined) =>
    set({notificationReceived: id}),
}));
