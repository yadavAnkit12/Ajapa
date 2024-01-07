import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
const FusePageCarded = lazy(() => import('@fuse/core/FusePageCarded'));
import { lazy, useState, useEffect } from 'react';
const SubscriptionHeader = lazy(() => import('./SubscriptionHeader'));
const SubscriptionTable = lazy(() => import('./SubscriptionTable'));
import { getPermissions } from '../../../auth/services/utils/common';

function SubscriptionPlan() {
    const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
    const [filterValue, setFilterValue] = useState('');

    return (
        <FusePageCarded
            header={<SubscriptionHeader setFilterValue={setFilterValue} permission={getPermissions()} />}
            content={<SubscriptionTable filterValue={filterValue} permission={getPermissions()} />}
            scroll={isMobile ? 'normal' : 'content'}
        />
    );
}

export default SubscriptionPlan;