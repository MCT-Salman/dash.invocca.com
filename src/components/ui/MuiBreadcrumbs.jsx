import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';

const MuiBreadcrumbs = ({
  items = [], // [{label, href, onClick}]
  separator = '/',
  className = '',
  ...props
}) => {
  return (
    <Breadcrumbs
      separator={separator}
      sx={{
        '& .MuiBreadcrumbs-separator': { color: 'var(--color-text-muted)' },
        '& .MuiBreadcrumbs-ol': { alignItems: 'center' }
      }}
      className={className}
      {...props}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        if (isLast) {
          return (
            <MuiTypography
              key={index}
              variant="body2"
              sx={{ color: 'var(--color-primary-500)', fontWeight: 700 }}
            >
              {item.label}
            </MuiTypography>
          );
        }

        return (
          <Link
            key={index}
            href={item.href}
            onClick={item.onClick}
            sx={{
              color: 'var(--color-text-secondary)',
              fontWeight: 500,
              textDecoration: 'none',
              transition: 'all 0.2s ease',
              '&:hover': {
                color: 'var(--color-primary-500)',
                textDecoration: 'underline',
              }
            }}
          >
            {item.label}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
};

export default MuiBreadcrumbs;
