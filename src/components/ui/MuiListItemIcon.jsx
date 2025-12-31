import ListItemIcon from '@mui/material/ListItemIcon';
import { styled } from '@mui/material/styles';

const StyledListItemIcon = styled(ListItemIcon)(({ theme }) => ({
    minWidth: 40,
    padding: '0 8px',
    margin: '0 4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '& svg': {
        fontSize: '1.25rem',
    },
}));

const MuiListItemIcon = (props) => {
    return <StyledListItemIcon {...props} />;
};

export default MuiListItemIcon;
