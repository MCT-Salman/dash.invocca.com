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
          className="hover:!bg-secondary-500 hover:!text-primary-500 !rounded-xl !transition-all !duration-300 cursor-pointer !my-1"
        >
          {item.icon && (
            <ListItemIcon className="!text-secondary-500">
              {item.icon}
            </ListItemIcon>
          )}
          <ListItemText
            primary={item.primary}
            secondary={item.secondary}
            primaryTypographyProps={{
              className: '!text-primary-500 !font-semibold'
            }}
            secondaryTypographyProps={{
              className: '!text-text-secondary'
            }}
          />
        </ListItem>
      ))}
    </List>
  );
};

export default MuiList;
