import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

const MuiAlert = ({
  severity = 'info',
  title,
  children,
  variant = 'standard',
  onClose,
  className = '',
  ...props
}) => {
  return (
    <Alert
      severity={severity}
      variant={variant}
      onClose={onClose}
      className={`!rounded-2xl !shadow-md !border-2 !transition-all hover:!shadow-lg ${className}`}
      {...props}
    >
      {title && <AlertTitle className="!font-semibold">{title}</AlertTitle>}
      <div className="!text-sm">{children}</div>
    </Alert>
  );
};

export default MuiAlert;
