import { MdHome as HomeIcon } from '@react-icons/all-files/md/MdHome';
import { MdDashboard as DashboardIcon } from '@react-icons/all-files/md/MdDashboard';
import { MdPerson as PersonIcon } from '@react-icons/all-files/md/MdPerson';
import { MdSettings as SettingsIcon } from '@react-icons/all-files/md/MdSettings';
import { MdHelp as HelpIcon } from '@react-icons/all-files/md/MdHelp';
import { FaArrowRight as Arrow } from '@react-icons/all-files/fa/FaArrowRight';
import { isSidebarOpenAtom } from '../../atoms';
import { useRecoilState } from 'recoil';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import Button from '../Button';
import SidebarItem from './SidebarItem';

// Navigation items
const navItems = [
    {
        title: "Inicio",
        icon: HomeIcon,
        url: "/",
    },
    {
        title: "Dashboard",
        icon: DashboardIcon,
        url: "/dashboard",
    },
    {
        title: "Usuarios",
        icon: PersonIcon,
        url: "/users",
    },
    {
        title: "Configuración",
        icon: SettingsIcon,
        url: "/settings",
    },
    {
        title: "Ayuda",
        icon: HelpIcon,
        url: "/help",
    },
]

export function AppSidebar() {
    const [isSidebarOpen, setIsSidebarOpen] = useRecoilState(isSidebarOpenAtom);
    const [, setIsSidebarOpenStored] = useLocalStorage<boolean>('isSidebarOpen', !isSidebarOpen);


    const handleOnClickSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
        setIsSidebarOpenStored(!isSidebarOpen);
    };

    return (
        <aside className={`transition-all ${isSidebarOpen ? 'w-[280px]' : 'w-[80px]'}`}>
            <section className={`h-full flex flex-col justify-between items-center p-[10px] gap-y-[10px]`}>
                <div className='h-full flex flex-col gap-y-[10px] overflow-y-auto overflow-x-hidden'>
                    {/* Open/Close sidebar */}
                    <div className='flex items-center justify-between gap-[5px] pr-[4px]'>
                        <div className='flex-1 border border-[#0074B5]/20' />
                        <Button
                            variant='primary'
                            className={`w-[26px] max-h-[26px] flex items-center justify-center rounded-full cursor-pointer`}
                            onClick={handleOnClickSidebar}
                            data-testid='sidebar-handler-btn'
                        >
                            <Arrow color='white' size='10' strokeWidth='2' direction={isSidebarOpen ? 'left' : 'right'} />
                        </Button>
                    </div>

                    <div className={`flex flex-col ${isSidebarOpen ? 'w-[260px]' : 'w-[80px]'}`}>
                        {/* Navigation Items */}
                        <section className={`flex flex-col font-roboto w-full min-h-max gap-[5px] ${isSidebarOpen ? 'w-full items-start' : 'items-center'
                            }`}>
                            {navItems.map((item, index) => {
                                return (
                                    <SidebarItem
                                        key={index}
                                        route={item.url}
                                        onClick={() => { }}
                                        name={item.title}
                                        icon={<item.icon color='currentColor' size='24' />}
                                        testId={`sidebar-${item.title}-btn`}
                                    />
                                )
                            })}
                        </section>
                    </div>
                </div>
            </section>

        </aside>

    )
}
/**
 *         <Sidebar variant="inset" collapsible="icon">
            <SidebarHeader className="flex items-center p-4">
                <div className="flex items-center gap-2 cursor-pointer" onClick={toggleSidebar}>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <Menu className="h-4 w-4" />
                    </div>
                    <span className="font-semibold">Mi Aplicación</span>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Navegación</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild tooltip={item.title}>
                                        <a href={item.url}>
                                            <item.icon className="h-4 w-4" />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>Soporte</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild tooltip="Ayuda">
                                    <a href="/help">
                                        <HelpCircle className="h-4 w-4" />
                                        <span>Ayuda</span>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip="Cerrar sesión">
                            <a href="/logout">
                                <LogOut className="h-4 w-4" />
                                <span>Cerrar sesión</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
            <SidebarTrigger className="absolute right-4 top-4 md:hidden" />
        </Sidebar>
 * 
 * 
 */