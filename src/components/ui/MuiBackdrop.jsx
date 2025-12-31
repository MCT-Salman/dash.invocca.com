import Backdrop from '@mui/material/Backdrop';

const MuiBackdrop = ({
  open = false,
  onClick,
  invisible = false,
  className = '',
  children,
  ...props
}) => {
  return (
    <Backdrop
      open={open}
      onClick={onClick}
      invisible={invisible}
      className={`!bg-overlay ${className}`}
      {...props}
    >
      {children}
    </Backdrop>
  );
};

export default MuiBackdrop;
