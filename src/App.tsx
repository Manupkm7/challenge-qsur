import { Outlet } from 'react-router-dom';

import { useRecoilState, useSetRecoilState, useRecoilValue } from 'recoil';
import { darkModeAtom, filtersAtom, isNewCardModalOpenAtom } from '@/atoms/index';
import { FilterState } from './types/common';

import { AppSidebar } from './components/Sidebar/Sidebar';
import { AppHeader } from './components/Header/Header';

function App() {
  const [filters, setFilters] = useRecoilState(filtersAtom);
  const dark = useRecoilValue(darkModeAtom);

  const setIsNewCardModalOpen = useSetRecoilState(isNewCardModalOpenAtom);

  const handleFiltersChange = (filters: FilterState) => {
    setFilters(filters);
  };

  return (
    <div
      className={`min-h-screen font-roboto h-screen flex flex-col md:flex-row ${dark ? 'bg-[#30302f] text-white' : 'bg-white'}`}
      data-testid="app"
    >
      <AppSidebar />
      <section className="flex-1 flex flex-col">
        <AppHeader
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onNewClick={() => setIsNewCardModalOpen(true)}
        />
        <Outlet />
      </section>
    </div>
  );
}

export default App;
