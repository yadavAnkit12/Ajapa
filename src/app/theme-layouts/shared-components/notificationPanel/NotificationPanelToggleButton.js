import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import { useDispatch, useSelector } from 'react-redux';
import withReducer from 'app/store/withReducer';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import reducer from './store';
import { selectNotifications, getNotifications } from './store/dataSlice';
import { toggleNotificationPanel, selectNotificationPanelState } from './store/stateSlice';
import { useEffect, useState } from 'react';

function NotificationPanelToggleButton(props) {
  
  const notifications = useSelector(selectNotifications);
  const [notificationLength, setNotificationLength] = useState(0)
  const dispatch = useDispatch();

  useEffect(()=>{
    if(props?.notificationList){
      setNotificationLength(props?.notificationList?.totalElement)
    }
  },[props?.notificationList])


  return (     
    <IconButton
      className="w-40 h-40"
      onClick={(ev) => dispatch(toggleNotificationPanel())}
      size="large"
    >
      <Badge color="secondary" badgeContent={notificationLength} showZero>
        {props.children}
      </Badge>
    </IconButton>
  );
}

NotificationPanelToggleButton.defaultProps = {
  children: <FuseSvgIcon>heroicons-outline:bell</FuseSvgIcon>,
};

export default withReducer('notificationPanel', reducer)(NotificationPanelToggleButton);
