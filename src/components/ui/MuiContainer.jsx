import Container from '@mui/material/Container';

const MuiContainer = ({
  maxWidth = 'lg',
  fixed = false,
  disableGutters = false,
  className = '',
  children,
  ...props
}) => {
  return (
    <Container
      maxWidth={maxWidth}
      fixed={fixed}
      disableGutters={disableGutters}
      className={className}
      {...props}
    >
      {children}
    </Container>
  );
};

export default MuiContainer;
