import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import { useState } from 'react';
import { lazy } from 'react';
const DoctorHeader = lazy(() => import('./DoctorHeader'));
const DoctorTable = lazy(() => import('./DoctorTable'));
const FusePageCarded = lazy(() => import('@fuse/core/FusePageCarded'));
import { getPermissions } from '../../../auth/services/utils/common';

function Doctor() {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  const [filterValue, setFilterValue] = useState('');

  return (
    <FusePageCarded
      header={<DoctorHeader setFilterValue={setFilterValue} permission={getPermissions()} />}
      content={<DoctorTable filterValue={filterValue} permission={getPermissions()} />}
      scroll={isMobile ? 'normal' : 'content'}
    />
  );
}

export default Doctor;