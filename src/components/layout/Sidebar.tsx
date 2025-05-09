
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { 
  BarChart, 
  Users, 
  ChevronLeft, 
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Briefcase,
  TrendingUp,
  Wrench
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  isOpen: boolean;
}

interface SubMenuProps {
  title: string;
  icon: React.ElementType;
  isOpen: boolean;
  children: React.ReactNode;
}

const NavItem = ({ to, icon: Icon, label, isOpen }: NavItemProps) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center px-4 py-3 text-sidebar-foreground hover:bg-sidebar-accent group rounded-md transition-colors",
          isActive && "bg-sidebar-accent text-sidebar-accent-foreground"
        )
      }
    >
      <Icon className="h-5 w-5 shrink-0" />
      {isOpen && <span className="ml-3">{label}</span>}
    </NavLink>
  );
};

const SubMenu = ({ title, icon: Icon, isOpen, children }: SubMenuProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-1">
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger className="flex w-full items-center px-4 py-3 text-sidebar-foreground hover:bg-sidebar-accent group rounded-md transition-colors">
          <Icon className="h-5 w-5 shrink-0" />
          {isOpen && (
            <>
              <span className="ml-3 flex-1 text-left">{title}</span>
              {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </>
          )}
        </CollapsibleTrigger>
        <CollapsibleContent>
          {isOpen && <div className="pl-4 mt-1 space-y-1">{children}</div>}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
  return (
    <div 
      className={cn(
        "bg-sidebar h-full overflow-y-auto border-r border-sidebar-border transition-all duration-300 ease-in-out",
        isOpen ? "w-64" : "w-16"
      )}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
        {isOpen ? (
          <h1 className="text-xl font-semibold text-sidebar-foreground">HR Dashboard</h1>
        ) : (
          <div className="w-full flex justify-center">
            <span className="text-xl font-bold text-sidebar-foreground">H</span>
          </div>
        )}
        <button 
          onClick={toggleSidebar} 
          className="p-1 rounded-md hover:bg-sidebar-accent text-sidebar-foreground"
        >
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      <nav className="space-y-1 px-2 py-4">
        <NavItem to="/" icon={BarChart} label="Dashboard" isOpen={isOpen} />
        
        <SubMenu title="Human Resource" icon={Users} isOpen={isOpen}>
          <NavLink
            to="/users"
            className={({ isActive }) =>
              cn(
                "flex items-center px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent rounded-md transition-colors text-sm",
                isActive && "bg-sidebar-accent text-sidebar-accent-foreground"
              )
            }
          >
            <Briefcase className="h-4 w-4 shrink-0" />
            <span className="ml-2">Employee Management</span>
          </NavLink>
          <NavLink
            to="/sales"
            className={({ isActive }) =>
              cn(
                "flex items-center px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent rounded-md transition-colors text-sm",
                isActive && "bg-sidebar-accent text-sidebar-accent-foreground"
              )
            }
          >
            <TrendingUp className="h-4 w-4 shrink-0" />
            <span className="ml-2">Sales Employee Management</span>
          </NavLink>
          <NavLink
            to="/service"
            className={({ isActive }) =>
              cn(
                "flex items-center px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent rounded-md transition-colors text-sm",
                isActive && "bg-sidebar-accent text-sidebar-accent-foreground"
              )
            }
          >
            <Wrench className="h-4 w-4 shrink-0" />
            <span className="ml-2">Service Engineer Management</span>
          </NavLink>
        </SubMenu>
      </nav>
    </div>
  );
};
