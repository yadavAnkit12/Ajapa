import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import { lazy, useState, useEffect } from 'react';
const FusePageCarded = lazy(() => import('@fuse/core/FusePageCarded'));
const ServiceHeader = lazy(() => import('./CaseHeader'));
const ServiceTable = lazy(() => import('./CaseTable'));
import { getPermissions } from '../../../auth/services/utils/common';
import { labPartnerAPIConfig } from '../../API/apiConfig'; import axios from "axios";
import { useDispatch } from "react-redux";
import { showMessage } from "app/store/fuse/messageSlice";

function Case() {
    const dispatch = useDispatch();
    const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
    const [filterValue, setFilterValue] = useState('');
    const [sampleList, setSampleList] = useState([]);
    const [change,setChange]=useState(false)

    // useEffect(() => {
    //     async function fetchSampleData() {
    //         await axios.get(labPartnerAPIConfig.fetchSample, {
    //             headers: {
    //                 'Content-Type': 'multipart/form-data',
    //                 authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
    //             },
    //         }).then((response) => {
    //             if (response.status == 200) {
    //                 setSampleList(response.data.data)
    //             }
    //             else {
    //                 dispatch(showMessage({ message: 'Server Error', variant: 'error' }));
    //             }
    //         })
    //     }
    //     fetchSampleData();
    // }, [])

    return (
        <FusePageCarded
            header={<ServiceHeader setFilterValue={setFilterValue} permission={getPermissions()} setChange={setChange}/>}
            content={<ServiceTable filterValue={filterValue} sampleList={sampleList} permission={getPermissions()} />}
            scroll={isMobile ? 'normal' : 'content'}
        />
    );
}

export default Case;
