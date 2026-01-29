import ListItemButton from '@mui/material/ListItemButton';
import { styled } from '@mui/material/styles';

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
    borderRadius: '12px',
    padding: '12px 16px',
    margin: '4px 0',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
        backgroundColor: 'var(--color-surface-hover)',
        transform: 'translateX(-2px)',
    },
    '& .MuiListItemIcon-root': {
        minWidth: 40,
        marginLeft: '12px',
        marginRight: '0',
    },
    '& .MuiListItemText-primary': {
        margin: 0,
    },
}));

const MuiListItemButton = (props) => {
    return <StyledListItemButton {...props} />;
};

export default MuiListItemButton;
