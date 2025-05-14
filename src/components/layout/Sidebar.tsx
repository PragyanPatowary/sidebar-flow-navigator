
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { 
  BarChart, 
  ChevronLeft, 
  ChevronRight,
  Box
} from "lucide-react";
import { cn } from "@/lib/utils";

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
        <NavItem to="/products" icon={Box} label="Products" isOpen={isOpen} />
      </nav>
    </div>
  );
};
