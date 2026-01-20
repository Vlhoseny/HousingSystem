import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import logo from '@/assets/hurghada-logo.png';
import {
  LayoutDashboard,
  FileText,
  Building2,
  DoorOpen,
  Users,
  CreditCard,
  MessageSquareWarning,
  Bell,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const menuItems = [
  { icon: LayoutDashboard, label: 'لوحة التحكم', path: '/dashboard' },
  { icon: FileText, label: 'الطلبات', path: '/applications' },
  { icon: Building2, label: 'المباني', path: '/buildings' },
  { icon: DoorOpen, label: 'الغرف', path: '/rooms' },
  { icon: Users, label: 'الطلاب', path: '/students' },
  { icon: CreditCard, label: 'المدفوعات', path: '/payments' },
  { icon: MessageSquareWarning, label: 'الشكاوى', path: '/complaints' },
  { icon: Bell, label: 'الإشعارات', path: '/notifications' },
  { icon: Settings, label: 'الإعدادات', path: '/settings' },
];

interface SidebarContentProps {
  collapsed: boolean;
  onLogout: () => void;
}

function SidebarContent({ collapsed, onLogout }: SidebarContentProps) {
  const location = useLocation();
  
  return (
    <div className="flex flex-col h-full">
      {/* Logo Section */}
      <div className={cn(
        "flex items-center gap-3 px-4 py-6 border-b border-sidebar-border",
        collapsed && "justify-center px-2"
      )}>
        <img 
          src={logo} 
          alt="جامعة الغردقة" 
          className={cn("transition-all", collapsed ? "w-10 h-10" : "w-12 h-12")}
        />
        {!collapsed && (
          <div className="flex flex-col">
            <span className="font-bold text-sm text-sidebar-foreground">جامعة الغردقة</span>
            <span className="text-xs text-sidebar-foreground/70">إدارة الإسكان</span>
          </div>
        )}
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                "text-sidebar-foreground/80 hover:text-sidebar-foreground",
                "hover:bg-sidebar-accent",
                isActive && "bg-sidebar-primary text-sidebar-primary-foreground shadow-glow",
                collapsed && "justify-center px-2"
              )}
            >
              <item.icon className={cn("flex-shrink-0", collapsed ? "w-5 h-5" : "w-5 h-5")} />
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>
      
      {/* Logout Button */}
      <div className="p-4 border-t border-sidebar-border">
        <button
          onClick={onLogout}
          className={cn(
            "flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-all duration-200",
            "text-sidebar-foreground/80 hover:text-red-300 hover:bg-red-500/10",
            collapsed && "justify-center px-2"
          )}
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span className="text-sm font-medium">تسجيل الخروج</span>}
        </button>
      </div>
    </div>
  );
}

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { logout } = useAuth();
  
  return (
    <>
      {/* Desktop Sidebar */}
      <aside 
        className={cn(
          "hidden lg:flex flex-col bg-sidebar fixed right-0 top-0 h-screen z-40",
          "transition-all duration-300 ease-in-out",
          collapsed ? "w-[70px]" : "w-[260px]"
        )}
      >
        <SidebarContent collapsed={collapsed} onLogout={logout} />
        
        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "absolute -left-3 top-20 w-6 h-6 rounded-full",
            "bg-sidebar-primary text-sidebar-primary-foreground",
            "flex items-center justify-center shadow-lg",
            "hover:scale-110 transition-transform"
          )}
        >
          {collapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </aside>
      
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-sidebar z-40 flex items-center px-4 gap-4">
        <div className="flex items-center gap-3 ml-auto">
          <img src={logo} alt="جامعة الغردقة" className="w-8 h-8" />
          <span className="font-bold text-sm text-sidebar-foreground">إدارة الإسكان</span>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-sidebar-foreground">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[260px] p-0 bg-sidebar border-sidebar-border">
            <SidebarContent collapsed={false} onLogout={logout} />
          </SheetContent>
        </Sheet>
        
      </header>
    </>
  );
}
