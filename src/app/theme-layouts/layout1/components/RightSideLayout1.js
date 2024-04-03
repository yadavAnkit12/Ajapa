import { memo } from 'react';
import QuickPanel from '../../shared-components/quickPanel/QuickPanel';
import NotificationPanel from '../../shared-components/notificationPanel/NotificationPanel';

function RightSideLayout1(props) {
  return (
    <>
      <QuickPanel />

      <NotificationPanel notificationList={props.notificationList}/>
    </>
  );
}

export default memo(RightSideLayout1);
