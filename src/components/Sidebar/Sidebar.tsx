// React
import React from 'react';

// Recoil
import { useRecoilState, useRecoilValue } from 'recoil';
import { darkModeAtom, isSidebarOpenAtom } from '../../atoms';

// Librerías externas
import { clsx } from 'clsx';

// Hooks
import { useLocalStorage } from '../../hooks/useLocalStorage';

// Componentes
import Button from '../Button';
import SidebarItem from './SidebarItem';

// Iconos o SVGs
import { MdHome as HomeIcon } from '@react-icons/all-files/md/MdHome';
import { MdDashboard as DashboardIcon } from '@react-icons/all-files/md/MdDashboard';
import { MdHistory as HistoryIcon } from '@react-icons/all-files/md/MdHistory';
import { MdSettings as SettingsIcon } from '@react-icons/all-files/md/MdSettings';
import { MdHelp as HelpIcon } from '@react-icons/all-files/md/MdHelp';
import { MdDehaze as MenuIcon } from '@react-icons/all-files/md/MdDehaze';

/**
 * Barra lateral con navegación principal.
 */

// Navigation items
const navItems = [
  {
    title: 'Inicio',
    icon: HomeIcon,
    url: '/',
  },
  {
    title: 'Dashboard',
    icon: DashboardIcon,
    url: 'dashboard',
  },
  {
    title: 'Historial',
    icon: HistoryIcon,
    url: 'history',
  },
  {
    title: 'Configuración',
    icon: SettingsIcon,
    url: 'settings',
  },
];

export function AppSidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useRecoilState(isSidebarOpenAtom);
  const dark = useRecoilValue(darkModeAtom);
  const [, setIsSidebarOpenStored] = useLocalStorage<boolean>('isSidebarOpen', !isSidebarOpen);

  const handleOnClickSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    setIsSidebarOpenStored(!isSidebarOpen);
  };

  return (
    <aside
      className={`transition-all ${isSidebarOpen ? 'w-[280px]' : 'w-[80px]'} ${dark ? 'bg-[#0c0c0c] text-white' : 'bg-white'}`}
    >
      <section
        className={`h-full flex flex-col justify-between items-center p-[10px] gap-y-[10px] border-r`}
      >
        <div className="h-full flex flex-col gap-y-[10px] overflow-y-auto overflow-x-hidden">
          {/* Open/Close sidebar */}
          <div className="flex items-center justify-between gap-[5px] px-[12px]">
            {isSidebarOpen && <p className="text-lg font-medium">Gestion de Items</p>}

            <Button
              variant="secondary"
              className={`w-[26px] max-h-[26px] flex items-center justify-center rounded-full cursor-pointer !bg-transparent border-none`}
              onClick={handleOnClickSidebar}
              testId="sidebar-handler-btn"
            >
              <MenuIcon color="#279AF1" size="20" strokeWidth="1" />
            </Button>
          </div>

          <div className={`flex flex-col ${isSidebarOpen ? 'w-[260px]' : 'w-[80px]'}`}>
            {/* Navigation Items */}
            <section
              className={`flex flex-col font-roboto w-full min-h-max gap-[5px] ${
                isSidebarOpen ? 'w-full items-start' : 'items-center'
              }`}
            >
              {navItems.map((item, index) => {
                return (
                  <SidebarItem
                    key={index}
                    route={item.url}
                    dark={dark}
                    onClick={() => {}}
                    name={item.title}
                    icon={<item.icon color="currentColor" size="24" />}
                    testId={`sidebar-${item.title}-btn`}
                  />
                );
              })}
              <div className="px-3 mt-4">
                {isSidebarOpen ? (
                  <label
                    className={clsx(
                      'flex rounded-2xl text-lg',
                      dark ? 'text-white' : 'text-[#0074B5]'
                    )}
                  >
                    Soporte
                  </label>
                ) : null}
                <SidebarItem
                  route="/help"
                  onClick={() => {}}
                  name="Ayuda"
                  dark={dark}
                  icon={<HelpIcon color="currentColor" size="24" />}
                  className="px-0"
                  testId={`sidebar-soporte-btn`}
                />
              </div>
            </section>
          </div>
        </div>
      </section>
    </aside>
  );
}
