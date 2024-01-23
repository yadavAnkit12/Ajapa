

import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
const FusePageCarded = lazy(() => import('@fuse/core/FusePageCarded'));
import { lazy, useState } from 'react';
import UserEventHeader from './UserEventHeader';
import UserEventCard from './UserEventCard';


function UserEvent() {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  const [change, setChange] = useState(false);
  const [filterValue, setFilterValue] = useState('');
  const [searchText,setSearchText]=useState('')
  return (
    <FusePageCarded
      header={<UserEventHeader/>}
      content={<UserEventCard/>}
      scroll={isMobile ? 'normal' : 'content'}
    />
  );
}

export default UserEvent;