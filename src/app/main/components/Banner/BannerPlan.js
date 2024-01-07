import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
const FusePageCarded = lazy(() => import('@fuse/core/FusePageCarded'));
import { lazy, useState, useEffect } from 'react';
import FuseLoading from '@fuse/core/FuseLoading';
import { useDispatch } from 'react-redux';
const BannerHeader = lazy(() => import('./BannerHeader'));
const BannerTable = lazy(() => import('./BannerTable'));
import { getBannerPlans } from '../../../store/reduxSlice/bannerSlice';
import { getPermissions } from '../../../auth/services/utils/common';

function BannerPlan() {
    const dispatch = useDispatch();
    const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
    const [change, setChange] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        dispatch(getBannerPlans()).then(() => setLoading(false));
    }, [change]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <FuseLoading />
            </div>
        );
    }

    return (
        <FusePageCarded
            header={<BannerHeader change={change} setChange={setChange} permission={getPermissions()} />}
            content={<BannerTable change={change} setChange={setChange} permission={getPermissions()} />}
            scroll={isMobile ? 'normal' : 'content'}
        />
    );
}

export default BannerPlan;