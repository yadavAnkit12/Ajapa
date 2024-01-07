import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
const FusePageCarded = lazy(() => import('@fuse/core/FusePageCarded'));
import { lazy, useState } from 'react';
const AppointmentsHeader = lazy(() => import('./AppointmentsHeader'));
const AppointmentsTable = lazy(() => import('./AppointmentsTable'));
import { getPermissions } from '../../../../auth/services/utils/common';

function Apponitments() {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  const [filterValue, setFilterValue] = useState('');

  return (
    <FusePageCarded
      header={<AppointmentsHeader setFilterValue={setFilterValue} permission={getPermissions()} />}
      content={<AppointmentsTable filterValue={filterValue} permission={getPermissions()} />}
      scroll={isMobile ? 'normal' : 'content'}
    />
  );
}

export default Apponitments;
