import { Outlet } from "react-router-dom"
import { AppSidebar } from "./components/Sidebar/Sidebar"
import { AppHeader, FilterState } from "./components/Header/Header"
import { useRecoilState } from "recoil"
import { filtersAtom } from "@/atoms/index"

function App() {
  const [filters, setFilters] = useRecoilState(filtersAtom)

  const handleFiltersChange = (filters: FilterState) => {
    setFilters(filters)
  }

  return (
    <div className='min-h-screen font-roboto h-screen flex flex-col md:flex-row bg-[#F1F1F1] p-[12px] '>
      <AppSidebar />
      <section className='flex-1 flex flex-col'>
        <AppHeader filters={filters} onFiltersChange={handleFiltersChange} />
        <Outlet />
      </section>

    </div>
  )
}

export default App
