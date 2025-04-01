import { FilterState } from "@/components/Header/Header";
import { atom } from "recoil";

export const isSidebarOpenAtom = atom<boolean>({
  key: "isSidebarAtom",
  default: window.localStorage.getItem('isSidebarOpen') === 'true',
});

export const darkModeAtom = atom<boolean>({
  key: "darkModeAtom",
  default: window.localStorage.getItem('darkMode') === 'true',
});

export const filtersAtom = atom<FilterState>({
  key: "filtersAtom",
  default: {
    status: { label: "Todos", value: "all" },
    sort: { label: "Más recientes", value: "recents" },
    search: "",
  },
});