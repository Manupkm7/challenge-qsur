import { Outlet } from "react-router-dom"
import { AppSidebar } from "./components/Sidebar/Sidebar"
import { AppHeader } from "./components/Header/Header"

function App() {

  return (
    <div className='min-h-screen font-roboto h-screen flex flex-col md:flex-row bg-[#F1F1F1] p-[12px] '>
      <AppSidebar/>
      <section className='flex-1 flex flex-col'>
        <AppHeader/>
        <Outlet />
      </section>

    </div>
  )
}

export default App
