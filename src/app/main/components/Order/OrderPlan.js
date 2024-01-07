import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import { lazy, useState } from 'react';
const FusePageCarded = lazy(() => import('@fuse/core/FusePageCarded'));
import { getPermissions } from '../../../auth/services/utils/common';

const OrderHeader = lazy(() => import('./OrderHeader'));
const OrderTable = lazy(() => import('./OrderTable'));

function OrderPlan() {
    const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
    const [filterValue, setFilterValue] = useState('');

    return (
        <FusePageCarded
            header={<OrderHeader setFilterValue={setFilterValue} permission={getPermissions()} />}
            content={<OrderTable filterValue={filterValue} permission={getPermissions()} />}
            scroll={isMobile ? 'normal' : 'content'}
        />
    );
}

export default OrderPlan;