import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
const FusePageCarded = lazy(() => import('@fuse/core/FusePageCarded'));
import { lazy, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getCouponPlans } from '../../../store/reduxSlice/couponSlice';
import FuseLoading from '@fuse/core/FuseLoading';
const CouponHeader = lazy(() => import('./CouponHeader'));
const CouponTable = lazy(() => import('./CouponTable'));
import { getPermissions } from '../../../auth/services/utils/common';

function CouponPlan() {
    const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
    const [change, setChange] = useState(false);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const [filterValue, setFilterValue] = useState('');

    useEffect(() => {
        dispatch(getCouponPlans()).then(() => setLoading(false));
    }, [change])

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <FuseLoading />
            </div>
        );
    }

    return (
        <FusePageCarded
            header={<CouponHeader setChange={setChange} change={change} setFilterValue={setFilterValue} permission={getPermissions()} />}
            content={<CouponTable setChange={setChange} change={change} filterValue={filterValue} permission={getPermissions()} />}
            scroll={isMobile ? 'normal' : 'content'}
        />
    );
}

export default CouponPlan;


