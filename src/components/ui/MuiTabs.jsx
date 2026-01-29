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
  const handleChange = (event, newValue) => {
    onChange?.(event, newValue);
  };

  return (
    <Tabs
      value={value !== undefined && value !== null ? value : 0}
      onChange={handleChange}
      variant={variant}
      centered={centered}
      className={className}
      TabIndicatorProps={{
        sx: { backgroundColor: 'var(--color-primary-500)', height: '3px' }
      }}
      {...props}
    >
      {tabs.map((tab, index) => (
        <Tab
          key={index}
          label={tab.label}
          disabled={tab.disabled}
          icon={tab.icon}
          iconPosition={tab.iconPosition || 'start'}
          sx={{
            textTransform: 'none',
            fontSize: '0.95rem',
            fontWeight: 600,
            minWidth: 'auto',
            px: 2.5,
            py: 1.5,
            color: 'var(--color-text-secondary)',
            transition: 'all 0.2s ease',
            '&.Mui-selected': {
              color: 'var(--color-primary-500)',
            },
            '&:hover': {
              backgroundColor: 'var(--color-surface-hover)',
            }
          }}
        />
      ))}
    </Tabs>
  );
};

export default MuiTabs;
