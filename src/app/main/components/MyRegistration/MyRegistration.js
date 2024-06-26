import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
const FusePageCarded = lazy(() => import('@fuse/core/FusePageCarded'));
import { lazy, useState } from 'react';

import { getPermissions } from '../../../auth/services/utils/common';
// import UsersHeader from './UserHeader';
// import UserTable from './UserTable';
import MyRegistrationHeader from './MyRegistrationHeader';
import MyRegistrationTable from './MyRegistrationTable';


function MyRegistration() {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  const [change, setChange] = useState(false);
  const [filterValue, setFilterValue] = useState('');
  const [searchText,setSearchText]=useState('')
  return (
    <FusePageCarded 
      header={<MyRegistrationHeader setChange={setChange} change={change} setFilterValue={setFilterValue} searchText={searchText} setSearchText={setSearchText}/>}
      content={<MyRegistrationTable setChange={setChange} change={change} filterValue={filterValue} searchText={searchText}/>}
      scroll={isMobile ? 'normal' : 'content'}
    />
  );
}

export default MyRegistration;