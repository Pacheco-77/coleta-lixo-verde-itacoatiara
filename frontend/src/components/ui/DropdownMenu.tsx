import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LucideIcon, ChevronRight } from 'lucide-react';

export interface MenuItem {
  label: string;
  icon?: LucideIcon;
  path?: string;
  submenu?: MenuItem[];
  show?: boolean;
}

interface DropdownMenuProps {
  items: MenuItem[];
  onItemClick?: () => void;
  level?: number;
  colorScheme?: 'green' | 'blue' | 'orange';
}

const DropdownMenu = ({ items, onItemClick, level = 0, colorScheme = 'green' }: DropdownMenuProps) => {
  const location = useLocation();
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});

  const toggleSubmenu = (label: string) => {
    setOpenSubmenus(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  const isActive = (item: MenuItem): boolean => {
    if (item.path && location.pathname === item.path) return true;
    if (item.submenu) {
      return item.submenu.some(subItem => isActive(subItem));
    }
    return false;
  };

  // Classes de cor baseadas no esquema
  const colorClasses = {
    green: {
      active: 'bg-green-600 text-white font-medium',
      inactive: 'text-white hover:bg-green-600/50',
      submenuBg: 'bg-green-700 border-green-800',
    },
    blue: {
      active: 'bg-blue-600 text-white font-medium',
      inactive: 'text-white hover:bg-blue-600/50',
      submenuBg: 'bg-blue-700 border-blue-800',
    },
    orange: {
      active: 'bg-orange-500 text-white font-medium',
      inactive: 'text-white hover:bg-orange-500/50',
      submenuBg: 'bg-orange-600 border-orange-700',
    },
  };

  const colors = colorClasses[colorScheme];

  return (
    <div className={`${level > 0 ? 'pl-4' : ''}`}>
      {items.map((item) => {
        if (item.show === false) return null;

        const Icon = item.icon;
        const hasSubmenu = item.submenu && item.submenu.length > 0;
        const active = isActive(item);
        const isOpen = openSubmenus[item.label];

        return (
          <div key={item.label} className="relative group">
            {/* Item do Menu */}
            {hasSubmenu ? (
              // Item com submenu (não clicável, abre dropdown)
              <div
                onClick={() => toggleSubmenu(item.label)}
                className={`flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer transition-colors ${
                  active ? colors.active : colors.inactive
                }`}
              >
                <div className="flex items-center gap-3">
                  {Icon && <Icon className="w-5 h-5" />}
                  <span>{item.label}</span>
                </div>
                <ChevronRight
                  className={`w-4 h-4 transition-transform ${
                    isOpen ? 'rotate-90' : ''
                  }`}
                />
              </div>
            ) : (
              // Item sem submenu (link normal)
              <Link
                to={item.path || '#'}
                onClick={onItemClick}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  active ? colors.active : colors.inactive
                }`}
              >
                {Icon && <Icon className="w-5 h-5" />}
                <span>{item.label}</span>
              </Link>
            )}

            {/* Submenu (recursivo) - Mobile */}
            {hasSubmenu && isOpen && (
              <div className="mt-1 lg:hidden">
                <DropdownMenu
                  items={item.submenu!}
                  onItemClick={onItemClick}
                  level={level + 1}
                  colorScheme={colorScheme}
                />
              </div>
            )}

            {/* Submenu (recursivo) - Desktop hover */}
            {hasSubmenu && (
              <div className="hidden lg:block absolute left-full top-0 ml-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className={`${colors.submenuBg} border rounded-lg shadow-xl min-w-[200px] py-2`}>
                  <DropdownMenu
                    items={item.submenu!}
                    onItemClick={onItemClick}
                    level={level + 1}
                    colorScheme={colorScheme}
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default DropdownMenu;
