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
            backgroundColor: 'var(--color-dark)',
            color: 'var(--color-light)',
            borderRadius: '12px',
            border: '1px solid var(--color-border)',
            boxShadow: 'none',
            fontWeight: 600,
            fontFamily: 'Alexandria, var(--font-family-base)',
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
