import Stack from '@mui/material/Stack';

const MuiStack = ({
  direction = 'column',
  spacing = 2,
  divider,
  justifyContent,
  alignItems,
  className = '',
  children,
  ...props
}) => {
  return (
    <Stack
      direction={direction}
      spacing={spacing}
      divider={divider}
      justifyContent={justifyContent}
      alignItems={alignItems}
      className={className}
      {...props}
    >
      {children}
    </Stack>
  );
};

export default MuiStack;
