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
      className={`!text-text-secondary ${className}`}
      {...props}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        if (isLast) {
          return (
            <span key={index} className="!text-primary-500 !font-semibold">
              {item.label}
            </span>
          );
        }

        return (
          <Link
            key={index}
            href={item.href}
            onClick={item.onClick}
            className="!text-secondary-500 hover:!text-secondary-600 !no-underline hover:!underline transition-colors !font-medium"
          >
            {item.label}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
};

export default MuiBreadcrumbs;
