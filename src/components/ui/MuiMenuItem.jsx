import MenuItem from '@mui/material/MenuItem';

const MuiMenuItem = (props) => {
    return <MenuItem className="!text-primary-500 hover:!bg-secondary-500 hover:!text-primary-500 !transition-all !duration-300" {...props} />;
};

export default MuiMenuItem;
