import Grid from '@mui/material/Grid';

const MuiGrid = ({
  container = false,
  item = false, // Ignored in Grid v2
  spacing,
  xs,
  sm,
  md,
  lg,
  xl,
  className = '',
  children,
  sx,
  ...props
}) => {
  // Map legacy breakpoint props to the new 'size' prop
  const size = {};
  if (xs !== undefined) size.xs = xs;
  if (sm !== undefined) size.sm = sm;
  if (md !== undefined) size.md = md;
  if (lg !== undefined) size.lg = lg;
  if (xl !== undefined) size.xl = xl;

  const hasSize = Object.keys(size).length > 0;

  return (
    <Grid
      container={container}
      spacing={spacing}
      size={hasSize ? size : undefined}
      className={className}
      sx={{
        ...(container && {
          width: '100%',
          maxWidth: '100%',
          margin: 0,
        }),
        ...sx
      }}
      {...props}
    >
      {children}
    </Grid>
  );
};

export default MuiGrid;
