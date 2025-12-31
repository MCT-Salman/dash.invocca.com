import Box from '@mui/material/Box';

const MuiBox = ({
  component = 'div',
  sx = {},
  className = '',
  children,
  ...props
}) => {
  return (
    <Box
      component={component}
      sx={sx}
      className={`${className}`}
      {...props}
    >
      {children}
    </Box>
  );
};

export default MuiBox;
