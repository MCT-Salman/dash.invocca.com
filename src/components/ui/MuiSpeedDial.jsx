import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';

const MuiSpeedDial = ({
  direction = 'up',
  icon,
  actions = [], // [{icon, label, onClick}]
  open,
  onOpen,
  onClose,
  className = '',
  ...props
}) => {
  return (
    <SpeedDial
      ariaLabel="SpeedDial"
      icon={icon}
      direction={direction}
      open={open}
      onOpen={onOpen}
      onClose={onClose}
      className={className}
      FabProps={{
        className: '!bg-primary-600 hover:!bg-primary-700 !text-white'
      }}
      {...props}
    >
      {actions.map((action, index) => (
        <SpeedDialAction
          key={index}
          icon={action.icon}
          tooltipTitle={action.label}
          onClick={action.onClick}
          className="!bg-paper hover:!bg-surface-hover"
        />
      ))}
    </SpeedDial>
  );
};

export default MuiSpeedDial;
