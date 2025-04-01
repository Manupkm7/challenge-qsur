import { atom } from "recoil";

export const isSidebarOpenAtom = atom<boolean>({
  key: "isSidebarAtom",
  default: window.localStorage.getItem('isSidebarOpen') === 'true',
});