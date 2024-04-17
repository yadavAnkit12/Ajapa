import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
const FusePageCarded = lazy(() => import('@fuse/core/FusePageCarded'));
import { lazy, useState } from 'react';

// import { getPermissions } from '../../../auth/services/utils/common';
import EventPermissionHeader from './EventPermissionHeader';
import EventPermissionTable from './EventPermissionTable';


function EventLevelPermission() {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  const [change, setChange] = useState(false);
  const [filterValue, setFilterValue] = useState('');
  const [searchText,setSearchText]=useState('')
  return (
    <FusePageCarded 
      header={<EventPermissionHeader setChange={setChange} change={change} setFilterValue={setFilterValue} searchText={searchText} setSearchText={setSearchText}/>}
      content={<EventPermissionTable setChange={setChange} change={change} filterValue={filterValue} searchText={searchText}/>}
      scroll={isMobile ? 'normal' : 'content'}
    />
  );
}

export default EventLevelPermission;