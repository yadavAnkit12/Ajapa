const key = process.env.REACT_APP_URL;
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { Modal } from '@mui/material';
import { useState } from 'react';
import UserView from './UserView';
import CloseIcon from '@mui/icons-material/Close';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: '20px',
  maxWidth: '1200px',
  maxHeight: '650px',
  overflow: 'auto',
  width: 'auto',
};
function NotificationCard(props) {

  const { item, className } = props;
  const variant = item?.variant || '';
  const [open, setOpen] = useState(false)

  const handleClose = (id) => {
    if (props.onClose) {
      props.onClose(id);
    }
  };

  const handleView = (item) => {
    setOpen(true)
  }
  const handleEditClose = () => {
    setOpen(false);
  }

  return (
    <Card
      className={clsx(
        'flex items-center relative w-full rounded-16 p-20 min-h-64 shadow space-x-8',
        variant === 'success' && 'bg-green-600 text-white',
        variant === 'info' && 'bg-blue-700 text-white',
        variant === 'error' && 'bg-red-600 text-white',
        variant === 'warning' && 'bg-orange-600 text-white',
        className
      )}
      onClick={() => handleView(item)}
      elevation={0}
      component={item.useRouter ? NavLinkAdapter : 'div'}
      to={item.link || ''}
      role={item.link && 'button'}
     
    >
      {item.image && !item.image && (
        <Box
          sx={{ backgroundColor: 'background.default' }}
          className="flex shrink-0 items-center justify-center w-32 h-32 mr-12 rounded-full"
        >
          <FuseSvgIcon className="opacity-75" color="inherit">
          {`${key}/images/${props.data.id}.jpg`}
          </FuseSvgIcon>
        </Box>
      )}

      {item && (
        <img
          className="shrink-0 w-32 h-32 mr-12 rounded-full overflow-hidden object-cover object-center"
          src= {`${key}/images/${item.id}.jpg`}
          alt="Notification"
        />
      )}

      <div className="flex flex-col flex-auto">
        {item.name && <Typography className="font-semibold line-clamp-1">{item.name}</Typography>}

        {item.mobileNumber && (
          <div className=" font-semibold line-clamp-2" dangerouslySetInnerHTML={{ __html: item.mobileNumber }} />
        )}

        {/* {item.country && (
          <Typography className="mt-8 text-sm leading-none " color="text.secondary">
            {formatDistanceToNow(new Date(item.time), { addSuffix: true })}
          </Typography>
        )} */}
      </div>
      <Typography className="font-semibold line-clamp-1">{item.country.split(':')[1]}</Typography>

      {/* <IconButton
        disableRipple
        className="top-0 right-0 absolute p-8"
        color="inherit"
        size="small"
        onClick={()=>handleClose(item.id)}
      >
        <FuseSvgIcon size={12} className="opacity-75" color="inherit">
          heroicons-solid:x
        </FuseSvgIcon>
      </IconButton> */}
      {/* {item.country.split(':')[1]} */}
      <Modal
       
        open={open}
        onClose={handleEditClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"

      >
      
        <Box sx={style}>
          <UserView data={item} handleEditClose={handleEditClose}/>
        </Box>
      </Modal>
    </Card>
  );
}

export default NotificationCard;
