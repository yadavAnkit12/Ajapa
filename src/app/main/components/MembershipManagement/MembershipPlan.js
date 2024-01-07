import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
const FusePageCarded = lazy(() => import('@fuse/core/FusePageCarded'));
import { lazy, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
const MembershipHeader = lazy(() => import('./MembershipHeader'));
const MembershipTable = lazy(() => import('./MembershipTable'));
import { getMembershipPlans } from '../../../store/reduxSlice/membershipSlice';
import FuseLoading from '@fuse/core/FuseLoading';
import { getPermissions } from '../../../auth/services/utils/common';

function Membership() {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  const [change, setChange] = useState(false);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const [filterValue, setFilterValue] = useState('');

  useEffect(() => {
    dispatch(getMembershipPlans()).then(() => setLoading(false));
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
      header={<MembershipHeader change={change} setChange={setChange} setFilterValue={setFilterValue} permission={getPermissions()} />}
      content={<MembershipTable change={change} setChange={setChange} filterValue={filterValue} permission={getPermissions()} />}
      scroll={isMobile ? 'normal' : 'content'}
    />
  );
}

export default Membership;
