

import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
const FusePageCarded = lazy(() => import('@fuse/core/FusePageCarded'));
import { lazy, useEffect, useState } from 'react';
import Report2Header from './Report2Header';
import Report2Table from './Report2Table';
import { eventAPIConfig } from 'src/app/main/API/apiConfig';
import axios from 'axios';
import { showMessage } from 'app/store/fuse/messageSlice';
import { useDispatch } from 'react-redux';


function Report2() {
    const dispatch=useDispatch()
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  const [change, setChange] = useState(false);
  const [filterValue, setFilterValue] = useState('');
  const [eventList,setEventList]=useState([])


  
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

  return (
    <FusePageCarded
      header={<Report2Header setFilterValue={setFilterValue} eventList={eventList}/>}
      content={<Report2Table filterValue={filterValue} eventList={eventList}/>}
      scroll={isMobile ? 'normal' : 'content'}
    />
  );
}

export default Report2;