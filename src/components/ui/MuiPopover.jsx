import Popover from '@mui/material/Popover';

const MuiPopover = ({
  open = false,
  anchorEl,
  onClose,
  anchorOrigin = { vertical: 'bottom', horizontal: 'center' },
  transformOrigin = { vertical: 'top', horizontal: 'center' },
  className = '',
  children,
  ...props
}) => {
  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={anchorOrigin}
      transformOrigin={transformOrigin}
      className={className}
      PaperProps={{
        className: '!bg-yellow-pale !border-2 !border-beige-light !rounded-2xl !shadow-2xl'
      }}
      {...props}
    >
      {children}
    </Popover>
  );
};

export default MuiPopover;
