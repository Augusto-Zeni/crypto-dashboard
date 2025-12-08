import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar'
import { faContao } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  LayoutDashboard,
  Coins,
  Briefcase,
  ArrowLeftRight,
} from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'
import { CurrencySelector } from '@/components/CurrencySelector'
import { Link, useLocation } from 'react-router-dom'

const menuItems = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    url: '/',
  },
  {
    title: 'Detalhes da Moeda',
    icon: Coins,
    url: '/detalhes-moeda',
  },
  {
    title: 'Portfólio',
    icon: Briefcase,
    url: '/portfolio',
  },
  {
    title: 'Comparação',
    icon: ArrowLeftRight,
    url: '/comparacao',
  },
]

export function AppSidebar() {
  const location = useLocation()

  return (
    <Sidebar variant="floating" collapsible="icon" side="left">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <FontAwesomeIcon icon={faContao} className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Crypto Dashboard</span>
                  <span className="truncate text-xs">Dashboard de Criptomoedas</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location.pathname === item.url
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title} isActive={isActive}>
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex flex-col gap-2 p-2">
          <CurrencySelector />
          <ThemeToggle />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
