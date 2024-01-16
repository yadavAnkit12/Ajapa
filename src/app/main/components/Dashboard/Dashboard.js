import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
const FusePageCarded = lazy(() => import('@fuse/core/FusePageCarded'));
import { lazy, useState } from 'react';

import { getPermissions } from '../../../auth/services/utils/common';
import DashboardHeader from './DashboardHeader';
import DashboardTable from './DashboardTable';

function Dashboard() {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  const [change, setChange] = useState(false);
  const [filterValue, setFilterValue] = useState('');
  const [searchText,setSearchText]=useState('')
  return (
    <FusePageCarded
      header={<DashboardHeader setChange={setChange} change={change} setFilterValue={setFilterValue}  searchText={searchText} setSearchText={setSearchText}/>}
      content={<DashboardTable setChange={setChange} change={change} filterValue={filterValue} searchText={searchText}/>}
      scroll={isMobile ? 'normal' : 'content'}
    />
  );
}

export default Dashboard;