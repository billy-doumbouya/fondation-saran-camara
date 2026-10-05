import { create } from "zustand";

interface AdminUIState {
  sidebarOpen: boolean;
  activeImageUploadIds: string[];
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setImageUploadInProgress: (id: string, inProgress: boolean) => void;
}

export const useAdminUIStore = create<AdminUIState>((set) => ({
  sidebarOpen: false,
  activeImageUploadIds: [],
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setImageUploadInProgress: (id, inProgress) =>
    set((state) => {
      const isActive = state.activeImageUploadIds.includes(id);
      if (isActive === inProgress) return state;
      return {
        activeImageUploadIds: inProgress
          ? [...state.activeImageUploadIds, id]
          : state.activeImageUploadIds.filter((activeId) => activeId !== id),
      };
    }),
}));

interface LogoTapState {
  taps: number;
  registerTap: () => boolean; // returns true when threshold reached
  reset: () => void;
}

const TAP_THRESHOLD = 5;
const TAP_WINDOW_MS = 2500;
let lastTapAt = 0;

export const useLogoTapStore = create<LogoTapState>((set, get) => ({
  taps: 0,
  registerTap: () => {
    const now = Date.now();
    if (now - lastTapAt > TAP_WINDOW_MS) {
      set({ taps: 1 });
    } else {
      set({ taps: get().taps + 1 });
    }
    lastTapAt = now;
    const reached = get().taps >= TAP_THRESHOLD;
    if (reached) set({ taps: 0 });
    return reached;
  },
  reset: () => set({ taps: 0 }),
}));

interface ChatUIState {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const useChatUIStore = create<ChatUIState>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
}));

interface ContactFabState {
  expanded: boolean;
  toggleExpanded: () => void;
  setExpanded: (expanded: boolean) => void;
}

export const useContactFabStore = create<ContactFabState>((set) => ({
  expanded: false,
  toggleExpanded: () => set((s) => ({ expanded: !s.expanded })),
  setExpanded: (expanded) => set({ expanded }),
}));
