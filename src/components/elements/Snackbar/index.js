import Snackbar from '@mui/material/Snackbar';
import SnackbarContent from '@mui/material/SnackbarContent';
import Button from '@mui/material/Button';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import { MdCheck, MdClose, MdOutlineDangerous, MdOutlineInfo, MdWarningAmber } from "react-icons/md";
import { FaCheck } from "react-icons/fa";

export default function MultiSnackbar({ show, type, message, onClose }) {
  const colors = {
    success: '#2e7d32',
    error: '#d32f2f',
    warning: '#ed6c02',
    info: '#1976d2',
  };

  const classNamesIcon = "text-white w-5 h-5";

  const icons = {
    success: <MdCheck className={classNamesIcon} />,
    error: <MdOutlineDangerous className={classNamesIcon} />,
    warning: <MdClose className={classNamesIcon} />,
    info: <MdWarningAmber className={classNamesIcon} />,
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={show}
      autoHideDuration={10000}
      onClose={onClose}
    >
      <SnackbarContent
        style={{
          backgroundColor: colors[type] || '#333',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
        }}
        message={
          <span style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {icons[type]}
            {message}
          </span>
        }
        action={[
          <button
            key="close"
            color="inherit"
            size="small"
            onClick={onClose}
            className="mr-2.5 pointer-cursor"
          >
            <MdClose className={classNamesIcon}/>
          </button>,
        ]}
      />
    </Snackbar>
  );
}