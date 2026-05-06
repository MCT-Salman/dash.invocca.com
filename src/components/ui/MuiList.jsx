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
              backgroundColor: 'color-mix(in srgb, var(--color-gold) 10%, transparent)',
              color: 'var(--color-icon)',
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
