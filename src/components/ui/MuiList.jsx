import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';

const MuiList = ({
  items = [], // [{primary, secondary, icon}]
  dense = false,
  className = '',
  ...props
}) => {
  return (
    <List dense={dense} className={className} {...props}>
      {items.map((item, index) => (
        <ListItem
          key={index}
          sx={{
            borderRadius: '12px',
            my: 0.5,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: 'var(--color-surface-hover)',
              color: 'var(--color-primary-500)',
            }
          }}
          className={className}
        >
          {item.icon && (
            <ListItemIcon sx={{ color: 'var(--color-text-secondary)', minWidth: 40 }}>
              {item.icon}
            </ListItemIcon>
          )}
          <ListItemText
            primary={item.primary}
            secondary={item.secondary}
            primaryTypographyProps={{
              sx: { color: 'var(--color-text-primary)', fontWeight: 600 }
            }}
            secondaryTypographyProps={{
              sx: { color: 'var(--color-text-secondary)' }
            }}
          />
        </ListItem>
      ))}
    </List>
  );
};

export default MuiList;
