import Modal from '@mui/material/Modal';

const MuiModal = ({
  open = false,
  onClose,
  closeAfterTransition = false,
  className = '',
  children,
  ...props
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition={closeAfterTransition}
      className={className}
      {...props}
    >
      <div className="flex items-center justify-center min-h-screen p-4">
        {children}
      </div>
    </Modal>
  );
};

export default MuiModal;
