import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
const FusePageCarded = lazy(() => import('@fuse/core/FusePageCarded'));
import { lazy, useState } from 'react';
const PatientHeader = lazy(() => import('./PatientHeader'));
const PatientTable = lazy(() => import('./PatientTable'));
import { getPermissions } from '../../../auth/services/utils/common';

function Patient() {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  const [change, setChange] = useState(false);
  const [filterValue, setFilterValue] = useState('');
  return (
    <FusePageCarded
      header={<PatientHeader setChange={setChange} change={change} setFilterValue={setFilterValue} permission={getPermissions()} />}
      content={<PatientTable setChange={setChange} change={change} filterValue={filterValue} permission={getPermissions()} />}
      scroll={isMobile ? 'normal' : 'content'}
    />
  );
}

export default Patient;