import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
const FusePageCarded = lazy(() => import('@fuse/core/FusePageCarded'));
import { lazy, useState } from 'react';
import ManageFamilyHeader from './ManageFamilyHeader';
import ManageFamilyTable from './ManageFamilyTable';


function ManageFamily() {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  const [change, setChange] = useState(false);
  const [filterValue, setFilterValue] = useState('');
  const [searchText,setSearchText]=useState('')
  return (
    <FusePageCarded 
      header={<ManageFamilyHeader setChange={setChange} change={change} setFilterValue={setFilterValue} searchText={searchText} setSearchText={setSearchText}/>}
      content={<ManageFamilyTable setChange={setChange} change={change} filterValue={filterValue} searchText={searchText}/>}
      scroll={isMobile ? 'normal' : 'content'}
    />
  );
}

export default ManageFamily;