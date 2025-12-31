import Popper from '@mui/material/Popper';

const MuiPopper = ({
  open = false,
  anchorEl,
  placement = 'bottom',
  modifiers,
  className = '',
  children,
  ...props
}) => {
  return (
    <Popper
      open={open}
      anchorEl={anchorEl}
      placement={placement}
      modifiers={modifiers}
      className={className}
      {...props}
    >
      {children}
    </Popper>
  );
};

export default MuiPopper;
