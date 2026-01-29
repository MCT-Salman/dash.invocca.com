import Tooltip from '@mui/material/Tooltip';

const MuiTooltip = ({
  title,
  placement = 'top',
  arrow = true,
  children,
  className = '',
  ...props
}) => {
  return (
    <Tooltip
      title={title}
      placement={placement}
      arrow={arrow}
      className={className}
      componentsProps={{
        tooltip: {
          sx: {
            backgroundColor: 'var(--color-primary-500)',
            color: 'var(--color-text-on-primary)',
            borderRadius: '12px',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-lg)',
            fontWeight: 600
          }
        }
      }}
      {...props}
    >
      {children}
    </Tooltip>
  );
};

export default MuiTooltip;
