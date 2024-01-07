import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import { useState } from 'react';
import { lazy } from 'react';
const FusePageCarded = lazy(() => import('@fuse/core/FusePageCarded'));
const ClinicHeader = lazy(() => import('./ClinicHeader'));
const ClinicTable = lazy(() => import('./ClinicTable'));
import { getPermissions } from '../../../auth/services/utils/common';

function Clinic() {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  const [filterValue, setFilterValue] = useState('');

  return (
    <FusePageCarded
      header={<ClinicHeader
        setFilterValue={setFilterValue}
        permission={getPermissions()}
      />}

      content={<ClinicTable
        filterValue={filterValue}
        permission={getPermissions()}
      />}
      scroll={isMobile ? 'normal' : 'content'}
    />
  );
}

export default Clinic;
