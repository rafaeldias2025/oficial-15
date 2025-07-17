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
          className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-all duration-200 group ${
            itemIsActive
              ? 'bg-primary text-white shadow-md'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
          } ${level > 0 ? 'ml-4' : ''} ${isCollapsed ? 'justify-center' : 'justify-between'}`}
        >
          <div className="flex items-center space-x-3">
            <item.icon 
              size={20} 
              className={`${itemIsActive ? 'text-white' : 'text-gray-500 dark:text-gray-400'} ${
                isCollapsed ? '' : 'flex-shrink-0'
              }`}
            />
            {!isCollapsed && (
              <>
                <span className="font-medium truncate">{item.label}</span>
                {item.badge && (
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    typeof item.badge === 'number'
                      ? 'bg-red-500 text-white'
                      : 'bg-green-500 text-white'
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
                <ChevronUp size={16} className="text-gray-400" />
              ) : (
                <ChevronDown size={16} className="text-gray-400" />
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
        } bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} p-4 border-b border-gray-200 dark:border-gray-700`}>
            {!isCollapsed && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">JS</span>
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900 dark:text-white text-sm">
                    Jornada dos Sonhos
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Health Dashboard
                  </p>
                </div>
              </div>
            )}
            
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 overflow-y-auto sidebar-scroll">
            <div className="space-y-6">
              {/* Main Menu */}
              <div>
                {!isCollapsed && (
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                    Menu Principal
                  </h3>
                )}
                <div className="space-y-1">
                  {mainMenuItems.map(item => renderMenuItem(item))}
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 dark:border-gray-700"></div>

              {/* Bottom Menu */}
              <div>
                {!isCollapsed && (
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
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
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">JD</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white text-sm truncate">
                    João Doe
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
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
