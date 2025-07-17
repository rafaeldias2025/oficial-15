import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import { mainMenuItems, bottomMenuItems, MenuItem } from './menuConfig';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (value: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileOpen(false); // Fecha menu no mobile após navegação
  };

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const isParentActive = (item: MenuItem) => {
    if (item.subItems) {
      return item.subItems.some(subItem => 
        subItem.path && isActive(subItem.path)
      );
    }
    return false;
  };

  const renderMenuItem = (item: MenuItem, level = 0) => {
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isExpanded = expandedItems.includes(item.id);
    const itemIsActive = item.path ? isActive(item.path) : isParentActive(item);

    return (
      <div key={item.id} className="mb-1">
        <button
          onClick={() => {
            if (hasSubItems) {
              toggleExpanded(item.id);
            } else if (item.path) {
              handleNavigation(item.path);
            }
          }}
          className={`menu-item ${
            itemIsActive ? 'menu-item-active' : 'menu-item-inactive'
          } ${level > 0 ? 'ml-4' : ''} ${isCollapsed ? 'justify-center' : 'justify-between'} group`}
        >
          <div className="flex items-center space-x-3">
            <item.icon 
              size={20} 
              className={`${itemIsActive ? 'text-white' : 'text-muted-foreground'} ${
                isCollapsed ? '' : 'flex-shrink-0'
              }`}
            />
            {!isCollapsed && (
              <>
                <span className="font-medium truncate">{item.label}</span>
                {item.badge && (
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    typeof item.badge === 'number'
                      ? 'bg-destructive text-destructive-foreground'
                      : 'bg-secondary text-secondary-foreground'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </div>
          
          {!isCollapsed && hasSubItems && (
            <div className="flex-shrink-0">
                {isExpanded ? (
                  <ChevronUp size={16} className="text-muted-foreground" />
                ) : (
                  <ChevronDown size={16} className="text-muted-foreground" />
                )}
            </div>
          )}
        </button>

        {/* Sub Items */}
        {!isCollapsed && hasSubItems && isExpanded && (
          <div className="mt-1 space-y-1">
            {item.subItems!.map(subItem => renderMenuItem(subItem, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 ${
          isCollapsed ? 'w-16' : 'w-64'
        } bg-background border-r border-border transition-all duration-300 ease-in-out`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className={`sidebar-header ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
            {!isCollapsed && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">JS</span>
                </div>
                <div>
                  <h2 className="font-semibold text-foreground text-sm">
                    Jornada dos Sonhos
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Health Dashboard
                  </p>
                </div>
              </div>
            )}
            
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          </div>

          {/* Navigation */}
          <nav className="sidebar-nav">
            <div className="space-y-6">
              {/* Main Menu */}
              <div>
                {!isCollapsed && (
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Menu Principal
                  </h3>
                )}
                <div className="space-y-1">
                  {mainMenuItems.map(item => renderMenuItem(item))}
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-border"></div>

              {/* Bottom Menu */}
              <div>
                {!isCollapsed && (
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Configurações
                  </h3>
                )}
                <div className="space-y-1">
                  {bottomMenuItems.map(item => renderMenuItem(item))}
                </div>
              </div>
            </div>
          </nav>

          {/* User Profile */}
          {!isCollapsed && (
            <div className="sidebar-footer">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">JD</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm truncate">
                    João Doe
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    joao@exemplo.com
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
