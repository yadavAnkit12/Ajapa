import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import { lazy, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
const FusePageCarded = lazy(() => import('@fuse/core/FusePageCarded'));
const ProductHeader = lazy(() => import('./ProductHeader'));
const ProductTable = lazy(() => import('./ProductTable'));
import { getPermissions } from '../../../auth/services/utils/common';

function ProductPlan() {
    const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
    const [change, setChange] = useState(false);
    const [filterValue, setFilterValue] = useState('');
    return (
        <FusePageCarded
            header={<ProductHeader setChange={setChange} change={change} setFilterValue={setFilterValue} permission={getPermissions()} />}
            content={<ProductTable setChange={setChange} change={change} filterValue={filterValue} permission={getPermissions()} />}
            scroll={isMobile ? 'normal' : 'content'}
        />
    );
}

export default ProductPlan;