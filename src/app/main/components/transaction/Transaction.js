import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
const FusePageCarded = lazy(() => import('@fuse/core/FusePageCarded'));
import { useState, useEffect, lazy } from 'react';
import { useDispatch } from 'react-redux';
const TransactionHeader = lazy(() => import('./TransactionHeader'));
const TransactionTable = lazy(() => import('./TransactionTable'));
import { paymentModeAPIConfig } from '../../API/apiConfig';
import axios from 'axios';
import { getPermissions } from '../../../auth/services/utils/common';

function Transaction() {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  const [filterValue, setFilterValue] = useState('');
  const [paymentList, setPaymentList] = useState([]);
  const [name, setName] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    axios.get(paymentModeAPIConfig.list, {
      headers: {
        'Content-type': 'multipart/form-data',
        authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
      },
    }).then((response) => {
      if (response.status === 200) {
        setPaymentList(response.data.data);
      } else {
        dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));

      }
    })
  }, [])

  return (
    <FusePageCarded
      header={<TransactionHeader setFilterValue={setFilterValue} paymentList={paymentList} setName={setName} name={name} permission={getPermissions()} />}
      content={<TransactionTable filterValue={filterValue} name={name} permission={getPermissions()} />}
      scroll={isMobile ? 'normal' : 'content'}
    />
  );
}

export default Transaction;