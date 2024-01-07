
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

import { Input, Paper, Typography, Button, Modal, Box, TextField, Autocomplete } from '@mui/material';

import { motion } from 'framer-motion';

import { useDispatch, useSelector } from 'react-redux';

import { Link } from 'react-router-dom';

import { useEffect, useState } from 'react';
import { PARTNERSERVICESTATUS } from '../../Static/filterLists';
import { selectLabPartnerPlanSearchText, setLabPartnerPlanSearchText } from '../../../store/reduxSlice/labPartnerSlice';

import ServiceRegisterForm from './ServiceRegisterForm';
import axios from 'axios';
import { specializationAPIConfig } from '../../API/apiConfig';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: '20px',
    maxWidth: '1200px',
    maxHeight: '650px',
    overflow: 'auto'
};
function CaseHeader(props) {
    const dispatch = useDispatch();
    const searchText = useSelector(selectLabPartnerPlanSearchText);
    const [caseTypeOptions, setCaseTypeOptions] = useState([]);
    const [selectedCaseType, setSelectedCaseType] = useState(null);

    const [open, setOpen] = useState(false);
    const [filterData, setFilterData] = useState({
        fromDate: '',
        toDate: '',
        status: null,
        caseType:''
    });

    const filterPartnerServiceData = () => {
        props.setFilterValue(filterData);
    }

    const clearFilters = () => {
        setFilterData({
            fromDate: '',
            toDate: '',
            status: null,
            caseType:''
        });
        props.setFilterValue('');
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        axios.get(`${specializationAPIConfig.fetch}`, {
            headers: {
                'Content-type': 'multipart/form-data',
                authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
            },
        }).then((response) => {
            if (response.status === 200) {
                const subSpecializations = response.data.data.map(item => item.subSpecialization);
                setCaseTypeOptions(subSpecializations);
                // here I recive the response.data.data which is an array of object in each object there is an filed subSpecialization , we have exxract those value and show in option of caseType 
                
            } else {
                dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
            }
        })
    }, [])

    return (
        <div className="w-full flex flex-col min-h-full">
            <div className="flex flex-col sm:flex-row space-y-16 sm:space-y-0 flex-1 w-full items-center justify-between py-32 px-10">
                <Typography
                    component={motion.span}
                    initial={{ x: -20 }}
                    animate={{ x: 0, transition: { delay: 0.2 } }}
                    delay={300}
                    className="text-24 md:text-32 font-extrabold tracking-tight"
                >
                    Cases
                </Typography>

                <div className="flex flex-col w-full sm:w-auto sm:flex-row space-y-16 sm:space-y-0 flex-1 items-center justify-end space-x-8">
                    <Paper
                        component={motion.div}
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
                        className="flex items-center w-full sm:max-w-256 space-x-8 px-16 rounded-full border-1 shadow-0"
                    >
                        <FuseSvgIcon color="disabled">heroicons-solid:search</FuseSvgIcon>

                        <Input
                            placeholder="Search Service"
                            className="flex flex-1"
                            disableUnderline
                            fullWidth
                            value={searchText}
                            inputProps={{
                                'aria-label': 'Search',
                            }}
                            onChange={(ev) => dispatch(setLabPartnerPlanSearchText(ev))}
                        />
                        {searchText && <FuseSvgIcon
                            color="disabled"
                            size={16}
                            style={{ cursor: "pointer" }}
                            onClick={() => dispatch(setLabPartnerPlanSearchText(null))
                            }>
                            heroicons-solid:x
                        </FuseSvgIcon>
                        }
                    </Paper>
                    {props?.permission?.create_data && <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
                    >
                        <Button
                            className=""
                            component={Link}
                            to="/app/manage/case/new"
                            variant="contained"
                            color="secondary"
                            startIcon={<FuseSvgIcon>heroicons-outline:plus</FuseSvgIcon>}
                        >
                            Add
                        </Button>
                    </motion.div>}
                </div>
            </div>


            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >

                <Box sx={style}>

                    {open && <ServiceRegisterForm setOpen={setOpen} open={open} setChange={props.setChange} change={props.change} sampleList={props.sampleList} />}
                </Box>
            </Modal>


            <div className='flex sm:flex-row flex-wrap flex-col justify-between mx-10  mb-10 shadow-1 rounded-16'>
                <div className="flex sm:flex-row flex-wrap flex-col justify-start">
                    <TextField
                        id="fromDate"
                        label="From Date"
                        variant="standard"
                        type='date'
                        value={filterData.fromDate}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        sx={{ my: 1, minWidth: 140, mx: 1 }}
                        onChange={e => setFilterData({ ...filterData, fromDate: e.target.value })}
                    />
                    <TextField
                        id="toDate"
                        label="To Date"
                        variant="standard"
                        type='date'
                        value={filterData.toDate}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        sx={{ my: 1, minWidth: 140, mx: 1 }}
                        onChange={e => setFilterData({ ...filterData, toDate: e.target.value })}
                    />
                    {_.size(PARTNERSERVICESTATUS) > 0 && <Autocomplete
                        disablePortal
                        value={filterData.status}
                        id="status"
                        options={PARTNERSERVICESTATUS}
                        getOptionLabel={option => option.name}
                        sx={{ my: 1, minWidth: 140, mx: 1 }}
                        onChange={(e, newValue) => setFilterData({ ...filterData, status: newValue })}
                        renderInput={(params) => <TextField {...params} label="Status" variant="standard" />}
                    />}
                      {_.size(caseTypeOptions) > 0 && <Autocomplete
                        disablePortal
                        value={filterData.caseType}
                        id="caseType"
                        options={caseTypeOptions}
                        // getOptionLabel={option => option.name}
                        sx={{ my: 1, minWidth: 140, mx: 1 }}
                        onChange={(e, newValue) => setFilterData({ ...filterData, caseType: newValue })}
                        renderInput={(params) => <TextField {...params} label="Case Type" variant="standard" />}
                    />}
                    {/* here I want craete an Autocomplete in which is come from API and set it to caseType */}
                </div>
                <div className="flex flex-row justify-end">
                    <Button
                        component={Link}
                        onClick={filterPartnerServiceData}
                        variant="contained"
                        color="secondary"
                        startIcon={<FuseSvgIcon>heroicons-outline:search</FuseSvgIcon>}
                        sx={{ my: 2, mx: 1 }}
                        fullWidth
                    >
                        Search
                    </Button>
                    <Button
                        component={Link}
                        onClick={clearFilters}
                        variant="outlined"
                        color="secondary"
                        startIcon={<FuseSvgIcon>heroicons-outline:refresh</FuseSvgIcon>}
                        sx={{ my: 2, mx: 1 }}
                        fullWidth
                    >
                        Reset
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default CaseHeader;

