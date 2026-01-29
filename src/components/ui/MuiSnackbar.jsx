import Snackbar from '@mui/material/Snackbar';
import MuiAlert from './MuiAlert';

const MuiSnackbar = ({
  open = false,
  onClose,
  message,
  autoHideDuration = 6000,
  anchorOrigin = { vertical: 'bottom', horizontal: 'center' },
  severity,
  className = '',
  ...props
}) => {
  const content = severity ? (
    <MuiAlert
      onClose={onClose}
      severity={severity}
    >
      {message}
    </MuiAlert>
  ) : null;

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      message={severity ? undefined : message}
      anchorOrigin={anchorOrigin}
      className={className}
      {...props}
    >
      {content}
    </Snackbar>
  );
};

export default MuiSnackbar;
