import Collapse from '@mui/material/Collapse';

const MuiCollapse = ({
  in: inProp,
  timeout = 'auto',
  unmountOnExit = false,
  className = '',
  children,
  ...props
}) => {
  return (
    <Collapse
      in={inProp}
      timeout={timeout}
      unmountOnExit={unmountOnExit}
      className={className}
      {...props}
    >
      {children}
    </Collapse>
  );
};

export default MuiCollapse;
