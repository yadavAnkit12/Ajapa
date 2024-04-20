import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
const FusePageCarded = lazy(() => import('@fuse/core/FusePageCarded'));
import { lazy, useState } from 'react';

// import { getPermissions } from '../../../auth/services/utils/common';
import RootLevelHeader from './RootLevelHeader';
import RootLevelTable from './RootLevelTable';

function RootLevel() {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  const [change, setChange] = useState(false);
  const [filterValue, setFilterValue] = useState('');
  const [searchText,setSearchText]=useState('')
  return (
    <FusePageCarded
      header={<RootLevelHeader setChange={setChange} change={change} setFilterValue={setFilterValue} searchText={searchText} setSearchText={setSearchText}/>}
      content={<RootLevelTable setChange={setChange} change={change} filterValue={filterValue} searchText={searchText}/>}
      scroll={isMobile ? 'normal' : 'content'}
    />
  );
}

export default RootLevel;