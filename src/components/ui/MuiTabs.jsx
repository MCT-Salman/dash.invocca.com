import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

const MuiTabs = ({
  value,
  onChange,
  tabs = [], // [{label, disabled, icon}]
  variant = 'standard',
  centered = false,
  className = '',
  ...props
}) => {
  return (
    <Tabs
      value={value}
      onChange={onChange}
      variant={variant}
      centered={centered}
      className={`!border-b-2 !border-beige-light ${className}`}
      TabIndicatorProps={{
        className: '!bg-secondary-500 !h-1'
      }}
      {...props}
    >
      {tabs.map((tab, index) => (
        <Tab
          key={index}
          label={tab.label}
          disabled={tab.disabled}
          icon={tab.icon}
          className="!text-primary-500 !font-semibold hover:!text-secondary-500 hover:!bg-beige-light !transition-all !duration-300 !rounded-t-xl"
        />
      ))}
    </Tabs>
  );
};

export default MuiTabs;
