import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

import { Input, Paper, Typography, Slide, Button, Modal, Box, TextField, Autocomplete } from '@mui/material';

import { motion } from 'framer-motion';

import { useDispatch, useSelector } from 'react-redux';

import { Link } from 'react-router-dom';

import { forwardRef, useState } from 'react';

import { COUPONSTATUS, COUPONTYPE, DISCOUNTTYPE } from '../../Static/filterLists';
import { setCouponSearchText, selectCouponSearchText } from '../../../store/reduxSlice/couponSlice';

import CouponRegisterForm from './CouponRegisterForm';

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



const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function CouponHeader(props) {
    const dispatch = useDispatch();
    const searchText = useSelector(selectCouponSearchText);

    const [open, setOpen] = useState(false);
    const [filterData, setFilterData] = useState({
        fromDate: '',
        toDate: '',
        couponType: null,
        offType: null,
        status: null
    });

    const filterCouponData = () => {
        props.setFilterValue(filterData);
    }

    const clearFilters = () => {
        setFilterData({
            fromDate: '',
            toDate: '',
            couponType: null,
            offType: null,
            status: null
        });
        props.setFilterValue('');
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };



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
                    Coupon Plans
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
                            placeholder="Search Coupon"
                            className="flex flex-1"
                            disableUnderline
                            fullWidth
                            value={searchText}
                            inputProps={{
                                'aria-label': 'Search',
                            }}
                            onChange={(ev) => dispatch(setCouponSearchText(ev))}
                        />

                        {searchText && <FuseSvgIcon
                            color="disabled"
                            size={16}
                            style={{ cursor: "pointer" }}
                            onClick={() => dispatch(setCouponSearchText(null))
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
                            onClick={handleClickOpen}
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

                    <CouponRegisterForm setOpen={setOpen} open={open} setChange={props.setChange} change={props.change} />

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
                    <Autocomplete
                        disablePortal
                        value={filterData.couponType}
                        id="couponType"
                        options={COUPONTYPE}
                        getOptionLabel={option => option.name}
                        sx={{ my: 1, minWidth: 140, mx: 1 }}
                        onChange={(e, newValue) => setFilterData({ ...filterData, couponType: newValue })}
                        renderInput={(params) => <TextField {...params} label="Coupon Type" variant="standard" />}
                    />
                    <Autocomplete
                        disablePortal
                        value={filterData.offType}
                        id="offType"
                        options={DISCOUNTTYPE}
                        getOptionLabel={option => option.name}
                        sx={{ my: 1, minWidth: 140, mx: 1 }}
                        onChange={(e, newValue) => setFilterData({ ...filterData, offType: newValue })}
                        renderInput={(params) => <TextField {...params} label="Off Type" variant="standard" />}
                    />
                    {_.size(COUPONSTATUS) > 0 && <Autocomplete
                        disablePortal
                        value={filterData.status}
                        id="status"
                        options={COUPONSTATUS}
                        getOptionLabel={option => option.name}
                        sx={{ my: 1, minWidth: 140, mx: 1 }}
                        onChange={(e, newValue) => setFilterData({ ...filterData, status: newValue })}
                        renderInput={(params) => <TextField {...params} label="Status" variant="standard" />}
                    />}
                </div>
                <div className="flex flex-row justify-end">
                    <Button
                        component={Link}
                        onClick={filterCouponData}
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

export default CouponHeader;