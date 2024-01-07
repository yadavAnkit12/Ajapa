import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
const FusePageCarded = lazy(() => import('@fuse/core/FusePageCarded'));
import { lazy, useState, useEffect } from 'react';
import FuseLoading from '@fuse/core/FuseLoading';
const SymptomHeader = lazy(() => import('./SymptomHeader'));
const SymptomTable = lazy(() => import('./SymptomTable'));
import { useDispatch } from 'react-redux';
import { getSymptoms } from '../../../store/reduxSlice/symptomSlice';
import { getPermissions } from '../../../auth/services/utils/common';

function Symptom() {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  const dispatch = useDispatch();
  const [change, setChange] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(getSymptoms()).then(() => setLoading(false));
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
      header={<SymptomHeader setChange={setChange} change={change} permission={getPermissions()} />}
      content={<SymptomTable setChange={setChange} change={change} permission={getPermissions()} />}
      scroll={isMobile ? 'normal' : 'content'}
    />
  );
}

export default Symptom;
