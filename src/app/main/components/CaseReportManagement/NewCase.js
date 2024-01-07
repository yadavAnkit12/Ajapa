import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import { lazy, useState, useEffect } from 'react';
const FusePageCarded = lazy(() => import('@fuse/core/FusePageCarded'));
// const ServiceHeader = lazy(() => import('./ServiceHeader'));
// const ServiceTable = lazy(() => import('./ServiceTable'));
import { getPermissions } from '../../../auth/services/utils/common';
// import { labPartnerAPIConfig } from '../../API/apiConfig'; import axios from "axios";
import { useDispatch } from "react-redux";
import { showMessage } from "app/store/fuse/messageSlice";
import NewCaseHeader from './NewCaseHeader';
import NewCaseTable from './NewCaseTable';

function NewCase() {
    const dispatch = useDispatch();
    const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
    const [filterValue, setFilterValue] = useState('');
    const [sampleList, setSampleList] = useState([]);
    const [change,setChange]=useState(false)

   

    return (
        <FusePageCarded
            header={<NewCaseHeader setFilterValue={setFilterValue} permission={getPermissions()} setChange={setChange}/>}
            content={<NewCaseTable filterValue={filterValue} sampleList={sampleList} permission={getPermissions()} />}
            scroll={isMobile ? 'normal' : 'content'}
        />
    );
}

export default NewCase;
