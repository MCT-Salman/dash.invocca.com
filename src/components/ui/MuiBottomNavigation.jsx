import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';

const MuiBottomNavigation = ({
  value,
  onChange,
  actions = [], // [{label, value, icon}]
  showLabels = true,
  className = '',
  ...props
}) => {
  return (
    <BottomNavigation
      value={value}
      onChange={onChange}
      showLabels={showLabels}
      className={`!bg-yellow-pale !border-t-2 !border-beige-light !shadow-lg ${className}`}
      {...props}
    >
      {actions.map((action) => (
        <BottomNavigationAction
          key={action.value}
          label={action.label}
          value={action.value}
          icon={action.icon}
          className="!text-primary-700 data-[selected=true]:!text-secondary-500 data-[selected=true]:!font-bold transition-all"
        />
      ))}
    </BottomNavigation>
  );
};

export default MuiBottomNavigation;
