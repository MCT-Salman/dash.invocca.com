import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

const MuiAlert = ({
  severity = 'info',
  title,
  children,
  variant = 'standard',
  onClose,
  className = '',
  sx,
  ...props
}) => {
  return (
    <Alert
      severity={severity}
      variant={variant}
      onClose={onClose}
      sx={{
        borderRadius: '16px',
        border: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-paper)',
        color: 'var(--color-text-primary)',
        '& .MuiAlert-icon': {
          color: severity === 'info' ? 'var(--color-icon)' :
            severity === 'success' ? 'var(--color-icon)' :
              severity === 'warning' ? 'var(--color-icon)' :
                'var(--color-icon)'
        },
        ...sx,
      }}
      className={className}
      {...props}
    >
      {title && <AlertTitle className="!font-semibold">{title}</AlertTitle>}
      <div className="!text-sm">{children}</div>
    </Alert>
  );
};

export default MuiAlert;
