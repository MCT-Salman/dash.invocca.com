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
          className: '!bg-primary-500 !text-yellow-pale !rounded-xl !shadow-lg !border !border-secondary-500'
        }
      }}
      {...props}
    >
      {children}
    </Tooltip>
  );
};

export default MuiTooltip;
