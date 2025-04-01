import { Outlet } from "react-router-dom"
import { AppSidebar } from "./components/Sidebar/Sidebar"

function App() {

  return (
    <div className='min-h-screen font-roboto h-screen flex flex-col md:flex-row bg-[#F1F1F1] p-[12px] gap-4'>
      <AppSidebar/>
      <section className='ml-[10px] flex-1 flex flex-col'>
        <Outlet />
      </section>

    </div>
  )
}

export default App
