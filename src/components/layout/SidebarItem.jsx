// SidebarItem.jsx
import React from 'react';

const SidebarItem = ({ item, isExpanded, isActive, onClick }) => {
  const Icon = item.icon;
  
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center relative
        p-3 rounded-xl transition-all duration-200
        ${isExpanded ? 'justify-start gap-3' : 'justify-center'}
        ${isActive 
          ? 'bg-gradient-to-r from-secondary-500 to-yellow text-white shadow-lg' 
          : 'hover:bg-secondary-100 dark:hover:bg-primary-700 text-primary-600 dark:text-secondary-300'
        }
        group
      `}
    >
      {/* Indicator for active item */}
      {isActive && (
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
      )}
      
      <div className="relative">
        <Icon 
          size={22} 
          className={`
            transition-transform duration-200
            ${isActive ? 'text-white' : 'text-secondary-600 dark:text-secondary-400'}
            group-hover:scale-110
          `} 
        />
        
        {/* Badge */}
        {item.badge && (
          <span className={`
            absolute -top-2 -right-2
            min-w-5 h-5 flex items-center justify-center
            text-xs font-bold rounded-full
            ${isActive 
              ? 'bg-white text-secondary-600' 
              : 'bg-error-500 text-white'
            }
            ${isExpanded ? '' : 'scale-75'}
          `}>
            {item.badge > 99 ? '99+' : item.badge}
          </span>
        )}
      </div>
      
      {/* Label */}
      {isExpanded && (
        <div className="flex-1 flex items-center justify-between min-w-0">
          <span className="font-medium text-sm truncate">
            {item.label}
          </span>
          
          {/* Tooltip for collapsed state */}
          {!isExpanded && (
            <div className="absolute left-full !ml-2 !px-2 !py-1 bg-primary-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
              {item.label}
              {item.badge && (
                <span className="!ml-1 !px-1.5 !py-0.5 bg-error-500 rounded-full text-xs">
                  {item.badge}
                </span>
              )}
            </div>
          )}
        </div>
      )}
      
      {/* Active indicator for collapsed state */}
      {!isExpanded && isActive && (
        <div className="absolute left-1/2 bottom-1 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
      )}
    </button>
  );
};

export default SidebarItem;