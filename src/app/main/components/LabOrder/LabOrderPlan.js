import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import { lazy, useState } from 'react';
const FusePageCarded = lazy(() => import('@fuse/core/FusePageCarded'));
import { getPermissions } from '../../../auth/services/utils/common';

const LabOrderHeader = lazy(() => import('./LabOrderHeader'));
const LabOrderTable = lazy(() => import('./LabOrderTable'));

function LabOrderPlan() {
    const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
    const [filterValue, setFilterValue] = useState('');

    return (
        <FusePageCarded
            header={<LabOrderHeader setFilterValue={setFilterValue} permission={getPermissions()} />}
            content={<LabOrderTable filterValue={filterValue} permission={getPermissions()} />}
            scroll={isMobile ? 'normal' : 'content'}
        />
    );
}

export default LabOrderPlan;