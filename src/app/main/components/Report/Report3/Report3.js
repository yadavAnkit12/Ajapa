

import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
const FusePageCarded = lazy(() => import('@fuse/core/FusePageCarded'));
import { lazy, useEffect, useState } from 'react';
import Report3Header from './Report3Header';
import Report3Table from './Report3Table';
import { eventAPIConfig } from 'src/app/main/API/apiConfig';
import axios from 'axios';
import { getEventLevelPermissions, getUserRoles } from 'src/app/auth/services/utils/common';
import { showMessage } from 'app/store/fuse/messageSlice';
import { useDispatch } from 'react-redux';


function Report3() {
    const dispatch=useDispatch()
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  const [change, setChange] = useState(false);
  const [filterValue, setFilterValue] = useState('');
  const [eventList,setEventList]=useState([])
  const [searchText, setSearchText] = useState('')
  const [permissions,setPermissions]=useState('')

  
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
          dispatch(showMessage({ message: 'something went wrong', variant: 'error' }));
      });
  },[])

  useEffect(() => {
    if (filterValue.eventName && getUserRoles() === 'Admin') {
      const permissionList = getEventLevelPermissions()
      const validateAdmin= permissionList.find((permission) => permission.eventId === eventList.find((event) => event.eventName === filterValue.eventName).eventId)
      setPermissions(validateAdmin)
    }
  }, [filterValue])

  return (
    <FusePageCarded
      header={<Report3Header setFilterValue={setFilterValue} eventList={eventList} searchText={searchText} setSearchText={setSearchText} Role={getUserRoles()} eventPermission={permissions}/>}
      content={<Report3Table filterValue={filterValue} eventList={eventList} searchText={searchText} Role={getUserRoles()} eventPermission={permissions}/>}
      scroll={isMobile ? 'normal' : 'content'}
    />
  );
}

export default Report3;