import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

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
    <Alert
      onClose={onClose}
      severity={severity}
      className="!rounded-2xl !shadow-2xl !border-2"
    >
      {message}
    </Alert>
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
