import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import { lazy, useState, useEffect } from 'react';
const FusePageCarded = lazy(() => import('@fuse/core/FusePageCarded'));
// const ServiceHeader = lazy(() => import('./ServiceHeader'));
// const ServiceTable = lazy(() => import('./ServiceTable'));
import { getPermissions } from '../../../auth/services/utils/common';
// import { labPartnerAPIConfig } from '../../API/apiConfig'; import axios from "axios";
import { useDispatch } from "react-redux";
import { showMessage } from "app/store/fuse/messageSlice";
import FinalCaseHeader from './FinalCaseHeader';
import FinalCaseReportTable from './FinalCaseReportTable';

function FinalCaseReport() {
    const dispatch = useDispatch();
    const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
    const [filterValue, setFilterValue] = useState('');
    const [sampleList, setSampleList] = useState([]);
    const [change,setChange]=useState(false)

   

    return (
        <FusePageCarded
            header={<FinalCaseHeader setFilterValue={setFilterValue} permission={getPermissions()} setChange={setChange}/>}
            content={<FinalCaseReportTable filterValue={filterValue} sampleList={sampleList} permission={getPermissions()} />}
            scroll={isMobile ? 'normal' : 'content'}
        />
    );
}

export default FinalCaseReport;
