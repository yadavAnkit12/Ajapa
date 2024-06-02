import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
const FusePageCarded = lazy(() => import('@fuse/core/FusePageCarded'));
import { lazy, useEffect, useState } from 'react';
import { getEventLevelPermissions, getUserRoles } from 'src/app/auth/services/utils/common';
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
  const [permissions, setPermissions] = useState('')
    const [usersList, setUsers] = useState([]);
  const [eventid, setEventid] = useState('')

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
      }).catch((error) => {
        dispatch(showMessage({ message: 'Something went wrong', variant: 'error' }))
    });
},[])

const handleUpdateUsersList = (updatedUsersList) => {
  setUsers(updatedUsersList);
};

useEffect(() => {
  if (filterValue.eventName && getUserRoles() === 'Admin') {
    const permissionList = getEventLevelPermissions()
    const validateAdmin= permissionList.find((permission) => permission.eventId === eventList.find((event) => event.eventName === filterValue.eventName).eventId)
    setPermissions(validateAdmin)
  }
}, [filterValue])

  return (
    <FusePageCarded
      header={<AttendanceHeader eventList={eventList} setChange={setChange} change={change} eventId={eventid} setEventId={setEventid}
      setUsers={handleUpdateUsersList} usersList={usersList} setFilterValue={setFilterValue} searchText={searchText} setSearchText={setSearchText} Role={getUserRoles()} eventPermission={permissions}/>}
      
      content={<AttendanceTable eventList={eventList} setChange={setChange} change={change} eventId={eventid} setEventId={setEventid}
      usersList={usersList} setUsers={handleUpdateUsersList} filterValue={filterValue} searchText={searchText} Role={getUserRoles()} eventPermission={permissions}/>}
      scroll={isMobile ? 'normal' : 'content'}
    />
  );
}

export default Attendance;