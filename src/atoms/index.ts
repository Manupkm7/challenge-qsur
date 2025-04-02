import { CardProductProps } from "@/components/Cards/CardProduct";
import { FilterState } from "@/types/common";
import { atom } from "recoil";

export const isSidebarOpenAtom = atom<boolean>({
  key: "isSidebarAtom",
  default: window.localStorage.getItem('isSidebarOpen') === 'true',
});

export const darkModeAtom = atom<boolean>({
  key: "darkModeAtom",
  default: window.localStorage.getItem('darkMode') === 'true',
});

export const viewModeAtom = atom<"grid" | "list">({
  key: "viewModeAtom",
  default: "grid",
});

export const filtersAtom = atom<FilterState>({
  key: "filtersAtom",
  default: {
    status: { label: "Todos", value: "all" },
    sort: { label: "Más recientes", value: "recents" },
    search: "",
  },
});

export const cardsAtom = atom<Omit<CardProductProps, "viewMode">[]>({
  key: "cardsAtom",
  default: [],
});

export const isNewCardModalOpenAtom = atom<boolean>({
  key: "isNewCardModalOpenAtom",
  default: false,
});

export const currentPageAtom = atom<number>({
  key: "currentPageAtom",
  default: 0,
});

export const totalPagesAtom = atom<number>({
  key: "totalPagesAtom",
  default: 0,
});

export const itemsPerPageAtom = atom<number>({
  key: "itemsPerPageAtom",
  default: 10,
});

