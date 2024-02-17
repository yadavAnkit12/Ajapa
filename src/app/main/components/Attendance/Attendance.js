import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
const FusePageCarded = lazy(() => import('@fuse/core/FusePageCarded'));
import { lazy, useEffect, useState } from 'react';

import { getPermissions } from '../../../auth/services/utils/common';

import { eventAPIConfig } from '../../API/apiConfig';
import axios from 'axios';
import AttendanceHeader from './AttendanceHeader';
import AttendanceTable from './AttendanceTable';

function Attendance() {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  const [change, setChange] = useState(false);
  const [filterValue, setFilterValue] = useState('');
  const [searchText,setSearchText]=useState('')
  const [eventList,setEventList]=useState([])
  //register users for particular event
  const [usersList, setUsers] = useState([]);
  

useEffect(()=>{
    axios.get(eventAPIConfig.allEventList, {
        headers: {
          'Content-type': 'multipart/form-data',
          Authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
        },
      }).then((response) => {
        if (response.status === 200) {
            setEventList(response.data.data)    
        } else {
          dispatch(showMessage({ message: response.data.errorMessage, variant: 'error' }));
        }
      });
},[])

const handleUpdateUsersList = (updatedUsersList) => {
  setUsers(updatedUsersList);
};



  return (
    <FusePageCarded
      header={<AttendanceHeader eventList={eventList} setChange={setChange} change={change} setUsers={handleUpdateUsersList} usersList={usersList} setFilterValue={setFilterValue} searchText={searchText} setSearchText={setSearchText}/>}
      content={<AttendanceTable eventList={eventList} setChange={setChange} change={change} usersList={usersList} setUsers={handleUpdateUsersList} filterValue={filterValue} searchText={searchText}/>}
      scroll={isMobile ? 'normal' : 'content'}
    />
  );
}

export default Attendance;