import FuseScrollbars from '@fuse/core/FuseScrollbars';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Typography from '@mui/material/Typography';
import withReducer from 'app/store/withReducer';
import { useSnackbar } from 'notistack';
import { memo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Button from '@mui/material/Button';
import NotificationTemplate from 'app/theme-layouts/shared-components/notificationPanel/NotificationTemplate';
import NotificationModel from './model/NotificationModel';
import NotificationCard from './NotificationCard';
import axios from 'axios';
import { NotificationAPIConfig, userAPIConfig } from 'src/app/main/API/apiConfig';
import {
  addNotification,
  dismissAll,
  dismissItem,
  getNotifications,
  selectNotifications,
} from './store/dataSlice';
import reducer from './store';
import {
  closeNotificationPanel,
  selectNotificationPanelState,
  toggleNotificationPanel,
} from './store/stateSlice';

const StyledSwipeableDrawer = styled(SwipeableDrawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    backgroundColor: theme.palette.background.default,
    width: 320,
  },
}));

function NotificationPanel(props) {
  const location = useLocation();
  const dispatch = useDispatch();
  const state = useSelector(selectNotificationPanelState);
  // const notifications = useSelector(selectNotifications);
  const [notifications, setNotifications] = useState([])
  const [notifUpdate, setNotifUpdate] = useState('')

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  useEffect(()=>{
    if(props.notificationList){
      setNotifications(props.notificationList.data)
    }

  },[props.notificationList])

  //closingNotificationPanel
  useEffect(() => {
    if (state) {
      dispatch(closeNotificationPanel());
    }
    // eslint-disable-next-line
  }, [location, dispatch]);

  function handleClose() {
    dispatch(closeNotificationPanel());
  }

  function demoNotification() {
    const item = NotificationModel({ title: 'Great Job! this is awesome.' });

    enqueueSnackbar(item.title, {
      key: item.id,
      // autoHideDuration: 3000,
      content: () => (
        <NotificationTemplate
          item={item}
          onClose={() => {
            closeSnackbar(item.id);
          }}
        />
      ),
    });

    dispatch(addNotification(item));
  }


  return (
    <StyledSwipeableDrawer
      open={state}
      anchor="right"
      onOpen={(ev) => { }}
      onClose={(ev) => dispatch(toggleNotificationPanel())}
      disableSwipeToOpen
    >
      <IconButton className="m-4 absolute top-0 right-0 z-999" onClick={handleClose} size="large">
        <FuseSvgIcon color="action">heroicons-outline:x</FuseSvgIcon>
      </IconButton>
      {notifications && notifications.length > 0 ? (
        <FuseScrollbars className="p-16">
          <div className="flex flex-col">
            <div className="flex justify-between items-end pt-136 mb-36">
              <Typography className="text-28 font-semibold leading-none">Notifications</Typography>
              {/* <Typography
                className="text-12 underline cursor-pointer"
                color="secondary"
                onClick={handleDismissAll}
              >
                dismiss all
              </Typography> */}
            </div>
            {notifications.map((item) => (
              <NotificationCard
                key={item.id}
                className="mb-16"
                item={item}
                // onClose={handleDismiss}
                // setNotifUpdate={setNotifUpdate}
                change={props.change} setChange={props.setChange}
              />
            ))}
          </div>
        </FuseScrollbars>
      ) : (
        <div className="flex flex-1 items-center justify-center p-16">
          <Typography className="text-24 text-center" color="text.secondary">
            There are no notifications for now.
          </Typography>
        </div>
      )}
     
    </StyledSwipeableDrawer>
  );
}

export default withReducer('notificationPanel', reducer)(memo(NotificationPanel));
