

import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
const FusePageCarded = lazy(() => import('@fuse/core/FusePageCarded'));
import { lazy, useEffect, useState } from 'react';
import Report3Header from './Report3Header';
import Report3Table from './Report3Table';
import { eventAPIConfig } from 'src/app/main/API/apiConfig';
import axios from 'axios';
import { showMessage } from 'app/store/fuse/messageSlice';
import { useDispatch } from 'react-redux';


function Report3() {
    const dispatch=useDispatch()
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  const [change, setChange] = useState(false);
  const [filterValue, setFilterValue] = useState('');
  const [eventList,setEventList]=useState([])
  const [searchText, setSearchText] = useState('')

  
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
      header={<Report3Header setFilterValue={setFilterValue} eventList={eventList} searchText={searchText} setSearchText={setSearchText}/>}
      content={<Report3Table filterValue={filterValue} eventList={eventList} searchText={searchText}/>}
      scroll={isMobile ? 'normal' : 'content'}
    />
  );
}

export default Report3;