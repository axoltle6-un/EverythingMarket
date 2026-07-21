import { create } from "zustand";
import type { View } from "../store";

interface Prefs {
  liveUpdates: boolean;
  reducedMotion: boolean;
  defaultView: View;
  settingsOpen: boolean;
  notificationsOpen: boolean;

  setLiveUpdates: (b: boolean) => void;
  setReducedMotion: (b: boolean) => void;
  setDefaultView: (v: View) => void;
  setSettingsOpen: (b: boolean) => void;
  setNotificationsOpen: (b: boolean) => void;
}

export const usePrefs = create<Prefs>((set) => ({
  liveUpdates: true,
  reducedMotion: false,
  defaultView: "dashboard",
  settingsOpen: false,
  notificationsOpen: false,
  setLiveUpdates: (b) => set({ liveUpdates: b }),
  setReducedMotion: (b) => set({ reducedMotion: b }),
  setDefaultView: (v) => set({ defaultView: v }),
  setSettingsOpen: (b) => set({ settingsOpen: b }),
  setNotificationsOpen: (b) => set({ notificationsOpen: b }),
}));
