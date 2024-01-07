import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
const FusePageCarded = lazy(() => import('@fuse/core/FusePageCarded'));
import { lazy } from 'react';
import { employeeAPIConfig } from '../../API/apiConfig';
import FuseLoading from '@fuse/core/FuseLoading';
import axios from 'axios';
const EmployeesHeader = lazy(() => import('./EmployeesHeader'));
const EmployeesTable = lazy(() => import('./EmployeesTable'));
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getEmployees } from '../../../store/reduxSlice/employeesSlice';
import { getPermissions } from '../../../auth/services/utils/common';

function Employee() {
  const dispatch = useDispatch();
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  const [change, setChange] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filterValue, setFilterValue] = useState('');
  const [roleList, setRoleList] = useState([]);

  useEffect(() => {
    axios.get(employeeAPIConfig.fetch, {
      headers: {
        'Content-type': 'multipart/form-data',
        authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
      },
    }).then((response) => {
      if (response.status === 200) {
        setRoleList(response.data.data);
      } else {
        dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
      }
    });
  }, []);

  useEffect(() => {
    dispatch(getEmployees(), setLoading(false));
  }, [change]);

  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center h-full">
  //       <FuseLoading />
  //     </div>
  //   );
  // }

  return (
    <FusePageCarded
      header={<EmployeesHeader
        setChange={setChange}
        change={change}
        setFilterValue={setFilterValue}
        roleList={roleList}
        permission={getPermissions()}
      />}
      content={<EmployeesTable
        setChange={setChange}
        change={change}
        filterValue={filterValue}
        roleList={roleList}
        permission={getPermissions()}
      />}
      scroll={isMobile ? 'normal' : 'content'}
    />
  );
}

export default Employee;


